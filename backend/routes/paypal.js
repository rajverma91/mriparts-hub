const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// ---------------------------------------------------------------------------
// Server-side pricing — NEVER trust amounts from the client
// ---------------------------------------------------------------------------
const PRICES = {
  pro: { amount: '19.00', currency: 'USD', description: 'MRI Parts Hub Pro Subscription (30 days)' },
  feature: { amount: '49.00', currency: 'USD', description: 'Feature Listing (30 days)' },
};

// Setup PayPal Environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new paypal.core.PayPalHttpClient(environment());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function amountToCents(value) {
  // "19.00" -> 1900 (avoids float rounding issues)
  const [whole, frac = ''] = String(value).split('.');
  return parseInt(whole, 10) * 100 + parseInt((frac + '00').slice(0, 2), 10);
}

/**
 * Build the custom_id payload stored on the PayPal order. This is how we
 * remember *what* the user paid for, server-side, so the capture endpoint
 * cannot be tricked into performing a different action than what was paid.
 */
function buildCustomId(payload) {
  // PayPal limits custom_id to 127 chars — keep it compact.
  return JSON.stringify(payload);
}

function parseCustomId(raw) {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Create an Order for Pro Subscription
// ---------------------------------------------------------------------------
router.post('/create-order', authRequired, async (req, res) => {
  try {
    const price = PRICES.pro;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: buildCustomId({
            type: 'pro',
            userId: req.user.id,
          }),
          amount: {
            currency_code: price.currency,
            value: price.amount,
          },
          description: price.description,
        },
      ],
    });

    const order = await client.execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    console.error('PayPal Create Order Error:', err);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// ---------------------------------------------------------------------------
// Create an Order for Featuring a Listing
// ---------------------------------------------------------------------------
router.post('/create-feature-order', authRequired, async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ error: 'listingId required' });

    // Verify the listing belongs to the user BEFORE creating the order.
    const [listings] = await pool.query(
      'SELECT id, title FROM listings WHERE id = ? AND user_id = ?',
      [listingId, req.user.id]
    );
    if (!listings.length) {
      return res.status(404).json({ error: 'Listing not found or not yours' });
    }

    const price = PRICES.feature;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: buildCustomId({
            type: 'feature',
            userId: req.user.id,
            listingId: Number(listingId),
          }),
          amount: {
            currency_code: price.currency,
            value: price.amount,
          },
          description: `${price.description}: ${listings[0].title}`,
        },
      ],
    });

    const order = await client.execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    console.error('PayPal Create Feature Order Error:', err);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// ---------------------------------------------------------------------------
// Capture an Order and Update Database
//
// The action taken (pro vs feature) is derived ENTIRELY from custom_id
// embedded at order-creation time — never from request body — so a user
// cannot pay for one thing and receive another.
// ---------------------------------------------------------------------------
router.post('/capture-order/:orderID', authRequired, async (req, res) => {
  const { orderID } = req.params;

  try {
    // --- 0. Idempotency: bail out if we've already processed this order ---
    const [[alreadyProcessed]] = await pool.query(
      'SELECT id, status FROM payments WHERE paypal_order_id = ?',
      [orderID]
    );
    if (alreadyProcessed) {
      return res.json({
        status: alreadyProcessed.status,
        alreadyProcessed: true,
      });
    }

    // --- 1. Capture with PayPal ---
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client.execute(request);

    const unit = capture.result?.purchase_units?.[0];
    const captures = unit?.payments?.captures || [];
    const completedCapture = captures.find((c) => c.status === 'COMPLETED');

    if (capture.result.status !== 'COMPLETED' || !completedCapture) {
      return res.status(400).json({
        error: 'Payment not completed',
        status: capture.result.status,
      });
    }

    // --- 2. Extract & validate what was paid for ---
    const meta = parseCustomId(unit.custom_id);

    if (!meta.type || meta.userId !== req.user.id) {
      // The order doesn't belong to this user (or has no intent) — do not
      // mutate anything. Ideally refund here, but for now: reject.
      return res.status(403).json({ error: 'Order does not belong to this user' });
    }

    const expected = PRICES[meta.type];
    if (!expected) {
      return res.status(400).json({ error: 'Unknown order type' });
    }

    const paidValue = completedCapture.amount?.value;
    const paidCurrency = completedCapture.amount?.currency_code;
    if (
      paidValue !== expected.amount ||
      paidCurrency !== expected.currency
    ) {
      // Amount/currency mismatch — refuse to grant the benefit.
      return res.status(400).json({ error: 'Captured amount does not match order intent' });
    }

    const amountCents = amountToCents(paidValue);

    // --- 3. Apply the effect transactionally ---
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      if (meta.type === 'feature') {
        const [result] = await conn.query(
          `UPDATE listings
             SET is_featured = 1,
                 featured_until = DATE_ADD(
                   GREATEST(COALESCE(featured_until, NOW()), NOW()),
                   INTERVAL 30 DAY
                 )
           WHERE id = ? AND user_id = ?`,
          [meta.listingId, req.user.id]
        );

        if (result.affectedRows === 0) {
          // Listing no longer exists / no longer owned — roll back and refund.
          throw Object.assign(new Error('Listing not found or not owned'), {
            code: 'LISTING_UNAVAILABLE',
          });
        }
      } else if (meta.type === 'pro') {
        await conn.query(
          `UPDATE users
             SET subscription_plan = 'pro',
                 subscription_expires_at = DATE_ADD(
                   GREATEST(COALESCE(subscription_expires_at, NOW()), NOW()),
                   INTERVAL 30 DAY
                 )
           WHERE id = ?`,
          [req.user.id]
        );
      }

      // Record the payment (unique index on paypal_order_id guards against races)
      await conn.query(
        `INSERT INTO payments
           (paypal_order_id, user_id, type, listing_id, amount_cents, currency, status)
         VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
        [
          orderID,
          req.user.id,
          meta.type,
          meta.type === 'feature' ? meta.listingId : null,
          amountCents,
          paidCurrency,
        ]
      );

      await conn.commit();
    } catch (txErr) {
      await conn.rollback();

      if (txErr.code === 'ER_DUP_ENTRY') {
        // Lost a race with a concurrent capture — return the recorded state.
        const [[row]] = await pool.query(
          'SELECT status FROM payments WHERE paypal_order_id = ?',
          [orderID]
        );
        return res.json({ status: row?.status || 'COMPLETED', alreadyProcessed: true });
      }

      if (txErr.code === 'LISTING_UNAVAILABLE') {
        // Payment succeeded but the benefit can't be delivered.
        // TODO: trigger a refund via PayPal Refunds API.
        console.error(`Refund required for order ${orderID}: ${txErr.message}`);
        return res.status(409).json({
          error: 'Listing is no longer available; a refund will be issued.',
        });
      }

      throw txErr;
    } finally {
      conn.release();
    }

    console.log(
      `✅ PayPal order ${orderID} (${meta.type}) applied for user ${req.user.id}`
    );

    return res.json({
      status: 'COMPLETED',
      type: meta.type,
      amount: paidValue,
      currency: paidCurrency,
    });
  } catch (err) {
    console.error('PayPal Capture Order Error:', err);
    return res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

module.exports = router;