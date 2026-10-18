const express = require('express');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Price in cents and duration in days
const FEATURED_PRICE_CENTS = 4900;   // $49.00
const FEATURED_DAYS        = 30;

// AUTH: start a Stripe Checkout session for featuring a listing
router.post('/feature/:listingId', authRequired, async (req, res) => {
  try {
    const listingId = Number(req.params.listingId);
    if (!listingId) return res.status(400).json({ error: 'Invalid listing id' });

    // Confirm listing belongs to this user
    const [rows] = await pool.query(
      'SELECT id, user_id, title, slug, status FROM listings WHERE id=?',
      [listingId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Listing not found' });
    const listing = rows[0];

    if (listing.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your listing' });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Only active listings can be featured.' });
    }

    // Create the payment record first (status=pending)
    const [payment] = await pool.query(
      `INSERT INTO payments
       (user_id, listing_id, amount_cents, currency, status, kind, days)
       VALUES (?,?,?,?, 'pending', 'featured_listing', ?)`,
      [req.user.id, listingId, FEATURED_PRICE_CENTS, 'usd', FEATURED_DAYS]
    );

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [
    {
      price_data: {
        currency: 'usd',
        unit_amount: FEATURED_PRICE_CENTS,
        product_data: {
          name: `Featured listing — ${listing.title}`,
          description: `${FEATURED_DAYS} days on the MRI Parts Hub homepage.`
        }
      },
      quantity: 1
    }
  ],
  metadata: {
    payment_id: String(payment.insertId),
    listing_id: String(listingId),
    user_id:    String(req.user.id)
  },
  success_url: `${FRONTEND_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url:  `${FRONTEND_URL}/dashboard/billing/cancel`
});

    await pool.query(
      'UPDATE payments SET stripe_session_id=? WHERE id=?',
      [session.id, payment.insertId]
    );

    res.json({ url: session.url, session_id: session.id });
  } catch (e) {
    console.error('POST /payments/feature/:id error:', e);
    res.status(500).json({ error: 'Server error', detail: e.message });
  }
});

// AUTH: verify a session (used on the success page)
router.get('/verify/:sessionId', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE stripe_session_id=? AND user_id=?',
      [req.params.sessionId, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Payment not found' });
    const p = rows[0];

    // Fetch fresh from Stripe
    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      if (session.payment_status === 'paid' && p.status !== 'paid') {
        await markPaid(p.id, p.listing_id, p.days, session.payment_intent);
      }
    } catch {}

    const [after] = await pool.query('SELECT * FROM payments WHERE id=?', [p.id]);
    const [listing] = await pool.query(
      'SELECT id, title, is_featured, featured_until FROM listings WHERE id=?',
      [p.listing_id]
    );

    res.json({ payment: after[0], listing: listing[0] });
  } catch (e) {
    console.error('GET /payments/verify error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: my billing history
router.get('/mine', authRequired, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, l.title AS listing_title, l.slug AS listing_slug
     FROM payments p
     LEFT JOIN listings l ON l.id = p.listing_id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC
     LIMIT 100`,
    [req.user.id]
  );
  res.json(rows);
});

// PUBLIC (Stripe webhook): mark payment paid + feature the listing
// IMPORTANT: this route needs the raw body — we mount it specially in server.js
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const paymentId = Number(session.metadata?.payment_id);

      if (paymentId) {
        const [rows] = await pool.query('SELECT * FROM payments WHERE id=?', [paymentId]);
        if (rows.length) {
          const p = rows[0];
          await markPaid(p.id, p.listing_id, p.days, session.payment_intent);
        }
      }
    }
  } catch (e) {
    console.error('Webhook handling error:', e);
  }

  res.json({ received: true });
});

// Shared helper: mark payment paid + feature the listing for N days
async function markPaid(paymentId, listingId, days, paymentIntent) {
  await pool.query(
    `UPDATE payments
     SET status='paid', paid_at=NOW(), stripe_payment_intent=?
     WHERE id=?`,
    [paymentIntent || null, paymentId]
  );

  // Extend featured_until (if already featured, stack the extra days)
  await pool.query(
    `UPDATE listings
     SET is_featured = 1,
         featured_until = DATE_ADD(
           GREATEST(IFNULL(featured_until, NOW()), NOW()),
           INTERVAL ? DAY
         )
     WHERE id = ?`,
    [days || 30, listingId]
  );
}


// Mock upgrade (replace with real Stripe later)
router.post('/mock-upgrade', authRequired, async (req, res) => {
  try {
    // Give them the "pro" plan for 30 days
    await pool.query(
      `UPDATE users 
       SET subscription_plan = 'pro', 
           subscription_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
       WHERE id = ?`,
      [req.user.id]
    );
    res.json({ message: 'Upgraded to Pro successfully!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;