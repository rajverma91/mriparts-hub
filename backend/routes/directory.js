const express = require('express');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth'); // Added imports

const router = express.Router();

// PUBLIC: Get all directory listings
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

// PUBLIC: Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT category FROM directory WHERE category IS NOT NULL AND category != ''`
    );
    res.json(rows.map(r => r.category));
  } catch (e) {
    res.json([]); 
  }
});

// ADMIN: Create a new directory entry
router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    const { name, category, website, phone, location } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'Name and Category required' });

    await pool.query(
      'INSERT INTO directory (name, category, website, phone, location) VALUES (?, ?, ?, ?, ?)',
      [name, category, website || null, phone || null, location || null]
    );
    res.json({ message: 'Directory entry created!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Delete a directory entry
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM directory WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;