const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// ─────────────────────────────────────────────────────────────
// GET /api/categories
// ─────────────────────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, (SELECT COUNT(*) FROM listings l
                    WHERE l.category_id = c.id AND l.status = 'active') AS count
       FROM categories c
       HAVING count > 0
       ORDER BY c.name`
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /categories error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/brands
// ─────────────────────────────────────────────────────────────
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
    console.error('GET /brands error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/directory/categories  ← NEW
// Returns unique categories from the directory table
// ─────────────────────────────────────────────────────────────
router.get('/directory/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT category FROM directory 
       WHERE category IS NOT NULL AND category != ''`
    );
    // Return a flat array of strings instead of objects
    res.json(rows.map(r => r.category));
  } catch (e) {
    // If the table doesn't exist yet, return an empty array instead of crashing
    console.error('GET /directory/categories error:', e.message);
    res.json([]); 
  }
});

module.exports = router;