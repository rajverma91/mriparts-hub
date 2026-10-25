const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// PUBLIC: Get all directory listings (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM directory ORDER BY name ASC';
    let params = [];

    if (category) {
      query = 'SELECT * FROM directory WHERE category = ? ORDER BY name ASC';
      params = [category];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: Get unique directory categories (for the dropdown menu)
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT category FROM directory WHERE category IS NOT NULL AND category != ''`
    );
    res.json(rows.map(r => r.category));
  } catch (e) {
    console.error(e);
    res.json([]); 
  }
});

module.exports = router;