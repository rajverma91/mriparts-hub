const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, (SELECT COUNT(*) FROM listings l
                    WHERE l.category_id = c.id AND l.status = 'active') AS count
       FROM categories c
       ORDER BY c.name`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/brands
router.get('/brands', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, (SELECT COUNT(*) FROM listings l
                    WHERE l.brand_id = b.id AND l.status = 'active') AS count
       FROM brands b
       ORDER BY b.name`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;