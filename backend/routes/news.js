const express = require('express');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
router.post('/', authRequired, adminRequired, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category_name, seo_title, seo_description, tags } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    let image_url = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'mriparts_news' },
          (error, res) => (error ? reject(error) : resolve(res))
        );
        uploadStream.end(req.file.buffer);
      });
      image_url = result.secure_url;
    }

    const slug = `${slugify(title)}-${Date.now()}`;
    await pool.query(
      `INSERT INTO news (title, slug, content, image_url, category, seo_title, seo_description, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, image_url, category_name || 'Industry News', seo_title || null, seo_description || null, tags || null]
    );
    res.json({ message: 'News created' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Get a single news post by ID (for editing)
router.get('/admin/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Update news
router.put('/:id', authRequired, adminRequired, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category_name, seo_title, seo_description, tags } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    // Get existing record to keep old image if not replaced
    const [existing] = await pool.query('SELECT image_url, slug FROM news WHERE id=?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: 'Not found' });

    let image_url = existing[0].image_url;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'mriparts_news' },
          (error, res) => (error ? reject(error) : resolve(res))
        );
        uploadStream.end(req.file.buffer);
      });
      image_url = result.secure_url;
    }

    await pool.query(
      `UPDATE news SET title=?, content=?, image_url=?, category=?, seo_title=?, seo_description=?, tags=? WHERE id=?`,
      [title, content, image_url, category_name || 'Industry News', seo_title || null, seo_description || null, tags || null, req.params.id]
    );
    res.json({ message: 'News updated' });
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