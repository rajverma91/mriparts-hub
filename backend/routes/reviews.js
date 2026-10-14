const express = require('express');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// PUBLIC: list approved reviews for a listing + aggregate stats
router.get('/listing/:id', async (req, res) => {
  try {
    const listingId = req.params.id;

    const [reviews] = await pool.query(
      `SELECT id, reviewer_name, rating, title, comment,
              rating_recommend, rating_value, rating_quality,
              created_at
       FROM reviews
       WHERE listing_id = ? AND status = 'approved'
       ORDER BY created_at DESC
       LIMIT 50`,
      [listingId]
    );

    const [agg] = await pool.query(
      `SELECT
         COUNT(*)                      AS count,
         IFNULL(AVG(rating), 0)        AS average,
         IFNULL(AVG(rating_recommend),0) AS avg_recommend,
         IFNULL(AVG(rating_value),0)     AS avg_value,
         IFNULL(AVG(rating_quality),0)   AS avg_quality
       FROM reviews
       WHERE listing_id = ? AND status = 'approved'`,
      [listingId]
    );

    // star distribution 5..1
    const [dist] = await pool.query(
      `SELECT rating, COUNT(*) AS c
       FROM reviews
       WHERE listing_id = ? AND status = 'approved'
       GROUP BY rating`,
      [listingId]
    );

    const distribution = { 1:0, 2:0, 3:0, 4:0, 5:0 };
    dist.forEach((row) => { distribution[row.rating] = row.c; });

    const a = agg[0] || {};

    res.json({
      reviews,
      stats: {
        count:           Number(a.count || 0),
        average:         Number(a.average || 0),
        avg_recommend:   Number(a.avg_recommend || 0),
        avg_value:       Number(a.avg_value || 0),
        avg_quality:     Number(a.avg_quality || 0),
        distribution
      }
    });
  } catch (e) {
    console.error('GET /reviews/listing/:id error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: submit a review
router.post('/', async (req, res) => {
  try {
    console.log('🔵 POST /reviews body:', req.body); 
    const {
      listing_id, reviewer_name, reviewer_email,
      rating, title, comment,
      rating_recommend, rating_value, rating_quality
    } = req.body;

    if (!listing_id || !reviewer_name || !reviewer_email || !rating || !comment) {
      return res.status(400).json({ error: 'listing_id, name, email, rating, comment are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewer_email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: 'rating must be 1–5' });
    }

    // Verify listing exists + grab seller_id
    const [listing] = await pool.query(
      'SELECT id, user_id FROM listings WHERE id=? AND status=?',
      [listing_id, 'active']
    );
    if (!listing.length) return res.status(404).json({ error: 'Listing not found' });

    // Prevent duplicate reviews from same email on same listing
    const [dup] = await pool.query(
      'SELECT id FROM reviews WHERE listing_id=? AND reviewer_email=?',
      [listing_id, reviewer_email]
    );
    if (dup.length) {
      return res.status(409).json({ error: 'You already reviewed this listing' });
    }

    const [result] = await pool.query(
      `INSERT INTO reviews
       (listing_id, seller_id, reviewer_name, reviewer_email,
        rating, title, comment,
        rating_recommend, rating_value, rating_quality,
        status)
       VALUES (?,?,?,?,?,?,?,?,?,?, 'pending')`,
      [
        listing_id,
        listing[0].user_id,
        String(reviewer_name).trim().slice(0, 120),
        String(reviewer_email).trim().toLowerCase().slice(0, 180),
        r,
        title ? String(title).trim().slice(0, 180) : null,
        String(comment).trim().slice(0, 4000),
        rating_recommend ? Number(rating_recommend) : null,
        rating_value     ? Number(rating_value)     : null,
        rating_quality   ? Number(rating_quality)   : null
      ]
    );

    res.json({
      id: result.insertId,
      message: 'Thank you! Your review will appear after moderation.'
    });
  } catch (e) {
    console.error('POST /reviews error:', e);
    res.status(500).json({ error: 'Server error', detail: e.sqlMessage });
  }
});

// AUTH: seller sees reviews for their listings
router.get('/seller/mine', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, l.title AS listing_title
       FROM reviews r
       JOIN listings l ON l.id = r.listing_id
       WHERE r.seller_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------- ADMIN --------

// All reviews (any status)
router.get('/admin/all', authRequired, adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, l.title AS listing_title, u.email AS seller_email
       FROM reviews r
       JOIN listings l ON l.id = r.listing_id
       JOIN users u    ON u.id = r.seller_id
       ORDER BY
         CASE r.status
           WHEN 'pending'  THEN 0
           WHEN 'approved' THEN 1
           WHEN 'rejected' THEN 2
         END,
         r.created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/approve', authRequired, adminRequired, async (req, res) => {
  await pool.query(
    "UPDATE reviews SET status='approved', approved_at=NOW() WHERE id=?",
    [req.params.id]
  );
  res.json({ message: 'Approved' });
});

router.patch('/:id/reject', authRequired, adminRequired, async (req, res) => {
  await pool.query("UPDATE reviews SET status='rejected' WHERE id=?", [req.params.id]);
  res.json({ message: 'Rejected' });
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

// Admin stats for review counts
router.get('/admin/stats', authRequired, adminRequired, async (req, res) => {
  const [[pending]]  = await pool.query("SELECT COUNT(*) c FROM reviews WHERE status='pending'");
  const [[approved]] = await pool.query("SELECT COUNT(*) c FROM reviews WHERE status='approved'");
  const [[rejected]] = await pool.query("SELECT COUNT(*) c FROM reviews WHERE status='rejected'");
  const [[avg]]      = await pool.query("SELECT IFNULL(AVG(rating),0) a FROM reviews WHERE status='approved'");
  res.json({
    pending:  pending.c,
    approved: approved.c,
    rejected: rejected.c,
    average:  Number(avg.a)
  });
});

module.exports = router;