const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// PUBLIC: seller profile + stats
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const [rows] = await pool.query(
      `SELECT id, name, email, company, phone, country, role, is_verified, created_at
       FROM users
       WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Seller not found' });
    const seller = rows[0];

    const [[stats]] = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM listings WHERE user_id = ? AND status = 'active')  AS active_listings,
        (SELECT COUNT(*) FROM listings WHERE user_id = ? AND status = 'sold')    AS sold_listings,
        (SELECT IFNULL(SUM(views),0) FROM listings WHERE user_id = ?)            AS total_views`,
      [id, id, id]
    );

    const [[rep]] = await pool.query(
      `SELECT COUNT(*) AS count, IFNULL(AVG(rating), 0) AS average
       FROM reviews
       WHERE seller_id = ? AND status = 'approved'`,
      [id]
    );

    res.json({
      ...seller,
      stats: {
        active_listings: Number(stats.active_listings || 0),
        sold_listings:   Number(stats.sold_listings || 0),
        total_views:     Number(stats.total_views || 0),
        reviews_count:   Number(rep.count || 0),
        rating_average:  Number(rep.average || 0)
      }
    });
  } catch (e) {
    console.error('GET /sellers/:id error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: paginated listings for a seller
router.get('/:id/listings', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const page  = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '12')));
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS total FROM listings WHERE user_id = ? AND status = 'active'",
      [id]
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT l.id, l.title, l.slug, l.price, l.currency, l.condition_type,
              l.country, l.city, l.image_url, l.gallery_json, l.created_at, l.views,
              c.name AS category, b.name AS brand
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN brands b     ON b.id = l.brand_id
       WHERE l.user_id = ? AND l.status = 'active'
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    res.json({ data: rows, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error('GET /sellers/:id/listings error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: all approved reviews for this seller (across all listings)
router.get('/:id/reviews', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const [rows] = await pool.query(
      `SELECT r.id, r.listing_id, r.reviewer_name, r.rating, r.title, r.comment,
              r.rating_recommend, r.rating_value, r.rating_quality, r.created_at,
              l.title AS listing_title,
              l.slug  AS listing_slug
       FROM reviews r
       LEFT JOIN listings l ON l.id = r.listing_id
       WHERE r.seller_id = ? AND r.status = 'approved'
       ORDER BY r.created_at DESC
       LIMIT 100`,
      [id]
    );

    const [[agg]] = await pool.query(
      `SELECT COUNT(*) AS count, IFNULL(AVG(rating),0) AS average
       FROM reviews WHERE seller_id = ? AND status = 'approved'`,
      [id]
    );

    res.json({
      reviews: rows,
      stats: { count: Number(agg.count || 0), average: Number(agg.average || 0) }
    });
  } catch (e) {
    console.error('GET /sellers/:id/reviews error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;