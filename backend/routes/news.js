const express = require('express');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// PUBLIC: Get all news
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: Get single news post by slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE slug=?', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Create news
router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    const slug = `${slugify(title)}-${Date.now()}`;
    
    const [result] = await pool.query(
      'INSERT INTO news (title, slug, content, image_url) VALUES (?, ?, ?, ?)',
      [title, slug, content, image_url || null]
    );
    
    res.json({ id: result.insertId, slug, message: 'News created' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Delete news
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM news WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;