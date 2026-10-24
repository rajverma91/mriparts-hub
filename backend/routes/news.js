const express = require('express');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary (Make sure this is configured in server.js or here)
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

// PUBLIC: Get single news post
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE slug=?', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Create news (NOW ACCEPTS FILE UPLOAD)
// ADMIN: Create news
router.post('/', authRequired, adminRequired, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
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
    
    // ADDED category TO THE INSERT
    const [result] = await pool.query(
      'INSERT INTO news (title, slug, content, image_url, category) VALUES (?, ?, ?, ?, ?)',
      [title, slug, content, image_url, category || 'Industry News']
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