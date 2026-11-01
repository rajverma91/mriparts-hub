const express = require('express');
const pool = require('../config/db');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { authRequired, adminRequired } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// ADMIN: Create directory entry (Accepts Logo)
router.post('/', authRequired, adminRequired, upload.single('logo'), async (req, res) => {
  try {
    const { name, category, website, phone, phone2, location } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'Name and Category required' });

    let logo_url = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'mriparts_directory' },
          (error, res) => (error ? reject(error) : resolve(res))
        );
        uploadStream.end(req.file.buffer);
      });
      logo_url = result.secure_url;
    }

    await pool.query(
      `INSERT INTO directory (name, category, website, phone, phone2, location, logo_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, website || null, phone || null, phone2 || null, location || null, logo_url]
    );
    res.json({ message: 'Directory entry created!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: Delete directory entry
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM directory WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;