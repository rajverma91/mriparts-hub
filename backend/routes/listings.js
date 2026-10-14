const express = require('express');
const pool = require('../config/db');
const { authRequired, verifiedRequired } = require('../middleware/auth');
const { sendPriceDropEmail } = require('../utils/mailer');

const router = express.Router();

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 250);
}

// Turn '' / undefined / null into null. Keeps numbers as numbers.
function nn(v) {
  if (v === undefined || v === null || v === '') return null;
  return v;
}

// Normalize gallery value coming from the frontend.
function normalizeGallery(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value.length ? value : null;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {}
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC: advert type counts (MUST be before /:id)
// ─────────────────────────────────────────────────────────────
router.get('/stats/advert-types', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT advert_type, COUNT(*) AS count
       FROM listings
       WHERE status = 'active'
       GROUP BY advert_type`
    );

    const counts = { sell: 0, buy: 0, auction: 0 };
    rows.forEach((r) => { counts[r.advert_type] = Number(r.count); });

    const [[total]] = await pool.query(
      "SELECT COUNT(*) AS c FROM listings WHERE status='active'"
    );
    counts.all = Number(total.c);

    res.json(counts);
  } catch (e) {
    console.error('GET /listings/stats/advert-types error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: list with filters
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      q, category, brand, condition, country,
      minPrice, maxPrice, sort = 'newest', page = 1, limit = 20,
      seller, advert_type
    } = req.query;

    const where = ["l.status = 'active'"];
    const params = [];

    if (q) {
      where.push('(l.title LIKE ? OR l.description LIKE ? OR l.model LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (category) { where.push('c.slug = ?'); params.push(category); }
    if (brand)    { where.push('b.name = ?'); params.push(brand); }
    if (condition){ where.push('l.condition_type = ?'); params.push(condition); }
    if (country)  { where.push('l.country = ?'); params.push(country); }
    if (minPrice) { where.push('l.price >= ?'); params.push(Number(minPrice)); }
    if (maxPrice) { where.push('l.price <= ?'); params.push(Number(maxPrice)); }
    if (seller)   { where.push('l.user_id = ?'); params.push(Number(seller)); }
    if (advert_type && advert_type !== 'all') {
      where.push('l.advert_type = ?');
      params.push(advert_type);
    }

    let orderBy = 'l.is_featured DESC, l.created_at DESC';
    if (sort === 'price_asc')  orderBy = 'l.is_featured DESC, l.price ASC';
    if (sort === 'price_desc') orderBy = 'l.is_featured DESC, l.price DESC';
    if (sort === 'oldest')     orderBy = 'l.is_featured DESC, l.created_at ASC';

    const pageN  = Math.max(1, parseInt(page));
    const limitN = Math.min(60, Math.max(1, parseInt(limit)));
    const offset = (pageN - 1) * limitN;

    const base = `
      FROM listings l
      LEFT JOIN categories c ON c.id = l.category_id
      LEFT JOIN brands b     ON b.id = l.brand_id
      LEFT JOIN users  u     ON u.id = l.user_id
      WHERE ${where.join(' AND ')}
    `;

    const [countRows] = await pool.query(`SELECT COUNT(*) AS total ${base}`, params);
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT l.id, l.title, l.slug, l.price, l.currency, l.condition_type,
              l.country, l.city, l.image_url, l.gallery_json, l.created_at, l.views,
              l.is_featured, l.featured_until, l.advert_type,
              c.name AS category, c.slug AS category_slug,
              b.name AS brand,
              u.name AS seller_name,
              u.company AS seller_company
       ${base}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limitN, offset]
    );

    res.json({ data: rows, total, page: pageN, pages: Math.ceil(total / limitN) });
  } catch (e) {
    console.error('GET /listings error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: related listings
// ─────────────────────────────────────────────────────────────
router.get('/:id/related', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.id, l.title, l.slug, l.price, l.currency, l.condition_type,
              l.country, l.image_url, l.gallery_json,
              c.name AS category, b.name AS brand
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN brands b     ON b.id = l.brand_id
       WHERE l.status='active'
         AND l.id != ?
         AND (l.category_id = (SELECT category_id FROM listings WHERE id=?)
              OR l.brand_id   = (SELECT brand_id    FROM listings WHERE id=?))
       ORDER BY RAND()
       LIMIT 6`,
      [req.params.id, req.params.id, req.params.id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /listings/:id/related error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// AUTH: my listings
// ─────────────────────────────────────────────────────────────
router.get('/user/mine', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, c.name AS category, b.name AS brand
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN brands b     ON b.id = l.brand_id
       WHERE l.user_id=? ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /listings/user/mine error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: single listing by slug
// ─────────────────────────────────────────────────────────────
router.get('/by-slug/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, c.name AS category, c.slug AS category_slug,
              b.name AS brand, u.name AS seller_name, u.email AS seller_email,
              u.company AS seller_company, u.phone AS seller_phone,
              u.country AS seller_country
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN brands b     ON b.id = l.brand_id
       LEFT JOIN users  u     ON u.id = l.user_id
       WHERE l.slug=? AND l.status='active'
       LIMIT 1`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE listings SET views=views+1 WHERE id=?', [rows[0].id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('GET /listings/by-slug/:slug error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: single listing by id  ← MUST be last of the GETs
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, c.name AS category, c.slug AS category_slug,
              b.name AS brand, u.name AS seller_name, u.email AS seller_email,
              u.company AS seller_company, u.phone AS seller_phone,
              u.country AS seller_country
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN brands b     ON b.id = l.brand_id
       LEFT JOIN users  u     ON u.id = l.user_id
       WHERE l.id=? AND l.status='active'`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    await pool.query('UPDATE listings SET views=views+1 WHERE id=?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('GET /listings/:id error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// AUTH: create listing
// ─────────────────────────────────────────────────────────────
router.post('/', authRequired, verifiedRequired, async (req, res) => {
  try {
    const b = req.body || {};

    if (!b.title || !String(b.title).trim()) {
      return res.status(400).json({ error: 'Title required' });
    }

    const title = String(b.title).trim().slice(0, 255);
    const slug  = `${slugify(title)}-${Date.now()}`;

    const gallery = Array.isArray(b.gallery_json) && b.gallery_json.length
      ? b.gallery_json
      : null;
    const primary = b.image_url || (gallery ? gallery[0] : null);
    const price   = Number.isFinite(Number(b.price)) ? Number(b.price) : 0;
    const advertType = ['sell','buy','auction'].includes(b.advert_type)
      ? b.advert_type
      : 'sell';

    const params = [
      req.user.id,
      title,
      slug,
      nn(b.description),
      price,
      nn(b.currency) || 'USD',
      nn(b.condition_type) || 'used',
      nn(b.category_id),
      nn(b.brand_id),
      nn(b.model),
      nn(b.year),
      nn(b.country),
      nn(b.city),
      nn(primary),
      gallery ? JSON.stringify(gallery) : null,
      advertType
    ];

    const [result] = await pool.query(
      `INSERT INTO listings
       (user_id, title, slug, description, price, currency, condition_type,
        category_id, brand_id, model, year, country, city,
        image_url, gallery_json, advert_type, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'pending')`,
      params
    );

    res.json({ id: result.insertId, slug, status: 'pending' });
  } catch (e) {
    console.error('POST /listings error:', e);
    res.status(500).json({
      error: 'Server error',
      detail: e.sqlMessage || e.message,
      code: e.code
    });
  }
});

// ─────────────────────────────────────────────────────────────
// AUTH: update own listing (with price-drop detection)
// ─────────────────────────────────────────────────────────────
router.put('/:id', authRequired, async (req, res) => {
  try {
    const [own] = await pool.query('SELECT * FROM listings WHERE id=?', [req.params.id]);
    if (!own.length) return res.status(404).json({ error: 'Not found' });
    const old = own[0];

    if (old.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your listing' });
    }

    const b = req.body || {};
    const gallery = normalizeGallery(b.gallery_json);
    const primary = b.image_url || (gallery ? gallery[0] : null);
    const newPrice = Number.isFinite(Number(b.price)) ? Number(b.price) : 0;
    const advertType = ['sell','buy','auction'].includes(b.advert_type)
      ? b.advert_type
      : (old.advert_type || 'sell');

    await pool.query(
      `UPDATE listings SET
         title=?, description=?, price=?, currency=?, condition_type=?,
         category_id=?, brand_id=?, model=?, year=?, country=?, city=?,
         image_url=?, gallery_json=?, advert_type=?
       WHERE id=?`,
      [
        String(b.title || '').trim().slice(0, 255),
        nn(b.description),
        newPrice,
        nn(b.currency) || 'USD',
        nn(b.condition_type) || 'used',
        nn(b.category_id),
        nn(b.brand_id),
        nn(b.model),
        nn(b.year),
        nn(b.country),
        nn(b.city),
        nn(primary),
        gallery ? JSON.stringify(gallery) : null,
        advertType,
        req.params.id
      ]
    );

    const oldPrice = Number(old.price || 0);
    const isPriceDrop = oldPrice > 0 && newPrice > 0 && newPrice < oldPrice;

    if (isPriceDrop) {
      notifySavers(old, newPrice).catch((e) =>
        console.error('price-drop notify failed:', e.message)
      );
    }

    res.json({ message: 'Updated', price_drop: isPriceDrop });
  } catch (e) {
    console.error('PUT /listings/:id error:', e);
    res.status(500).json({ error: 'Server error', detail: e.sqlMessage || e.message });
  }
});

// ─────────────────────────────────────────────────────────────
// Helper: send price-drop alerts
// ─────────────────────────────────────────────────────────────
async function notifySavers(oldListing, newPrice) {
  const listingId = oldListing.id;
  const oldPrice  = Number(oldListing.price || 0);
  const currency  = oldListing.currency || 'USD';

  const [savers] = await pool.query(
    `SELECT u.id AS user_id, u.name, u.email
     FROM favorites f
     JOIN users u ON u.id = f.user_id
     WHERE f.listing_id = ?
       AND u.email IS NOT NULL
       AND u.email <> ''`,
    [listingId]
  );

  if (!savers.length) {
    console.log(`💤 No savers to notify for listing ${listingId}`);
    return;
  }

  console.log(`📧 Sending price-drop alerts for listing ${listingId} to ${savers.length} user(s)`);

  let image = oldListing.image_url;
  try {
    const g = typeof oldListing.gallery_json === 'string'
      ? JSON.parse(oldListing.gallery_json)
      : oldListing.gallery_json;
    if (Array.isArray(g) && g[0]) image = g[0];
  } catch {}

  const listingUrl = `${process.env.FRONTEND_URL}/listings/${oldListing.slug || listingId}`;

  for (const s of savers) {
    try {
      const [dup] = await pool.query(
        `SELECT id FROM price_alerts
         WHERE user_id=? AND listing_id=? AND old_price=? AND new_price=?`,
        [s.user_id, listingId, oldPrice, newPrice]
      );
      if (dup.length) continue;

      await sendPriceDropEmail({
        to: s.email,
        name: s.name || 'there',
        listingTitle: oldListing.title,
        listingUrl,
        listingImage: image,
        oldPrice,
        newPrice,
        currency
      });

      await pool.query(
        `INSERT INTO price_alerts
         (user_id, listing_id, old_price, new_price)
         VALUES (?,?,?,?)`,
        [s.user_id, listingId, oldPrice, newPrice]
      );

      console.log(`  ✉️  sent to ${s.email}`);
    } catch (e) {
      if (e.code !== 'ER_DUP_ENTRY') {
        console.error(`  ❌ ${s.email}:`, e.message);
      }
    }
  }

  console.log(`✅ Price-drop alerts complete for listing ${listingId}`);
}

// ─────────────────────────────────────────────────────────────
// AUTH: delete own listing
// ─────────────────────────────────────────────────────────────
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id FROM listings WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not your listing' });

    await pool.query('DELETE FROM listings WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error('DELETE /listings/:id error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;