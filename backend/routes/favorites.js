const express = require('express');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// AUTH: toggle favorite (add if not saved, remove if already saved)
router.post('/:listingId', authRequired, async (req, res) => {
  try {
    const listingId = Number(req.params.listingId);
    const userId = req.user.id;

    if (!listingId) return res.status(400).json({ error: 'Invalid listing id' });

    // Confirm the listing exists
    const [listing] = await pool.query('SELECT id FROM listings WHERE id=?', [listingId]);
    if (!listing.length) return res.status(404).json({ error: 'Listing not found' });

    const [existing] = await pool.query(
      'SELECT id FROM favorites WHERE user_id=? AND listing_id=?',
      [userId, listingId]
    );

    if (existing.length) {
      await pool.query('DELETE FROM favorites WHERE id=?', [existing[0].id]);
      return res.json({ saved: false, message: 'Removed from saved' });
    }

    await pool.query(
      'INSERT INTO favorites (user_id, listing_id) VALUES (?,?)',
      [userId, listingId]
    );
    res.json({ saved: true, message: 'Saved to your list' });
  } catch (e) {
    console.error('POST /favorites/:id error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: check if a listing is saved by current user
router.get('/check/:listingId', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM favorites WHERE user_id=? AND listing_id=?',
      [req.user.id, req.params.listingId]
    );
    res.json({ saved: rows.length > 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: list current user's saved listings
router.get('/mine', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         f.id          AS favorite_id,
         f.created_at  AS saved_at,
         l.id, l.title, l.slug, l.price, l.currency, l.condition_type,
         l.country, l.city, l.image_url, l.gallery_json, l.status AS listing_status,
         c.name AS category, b.name AS brand
       FROM favorites f
       JOIN listings l ON l.id = f.listing_id
       LEFT JOIN categories c ON c.id = l.category_id
       LEFT JOIN brands b     ON b.id = l.brand_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: get saved count for current user (for header badge)
router.get('/count', authRequired, async (req, res) => {
  try {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) AS c FROM favorites WHERE user_id=?',
      [req.user.id]
    );
    res.json({ count: Number(row.c || 0) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: how many users saved a listing (for the "X people saved this" badge)
router.get('/listing/:listingId/count', async (req, res) => {
  try {
    const [[row]] = await pool.query(
      'SELECT COUNT(*) AS c FROM favorites WHERE listing_id=?',
      [req.params.listingId]
    );
    res.json({ count: Number(row.c || 0) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;