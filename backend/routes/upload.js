const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { authRequired } = require('../middleware/auth');

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Use memory storage instead of disk storage
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 12 }, // 12 files max, 5 MB each
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG/PNG/WEBP/GIF allowed'), ok);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/upload/multiple  →  field name "images"
// ─────────────────────────────────────────────────────────────
router.post('/multiple', authRequired, (req, res) => {
  uploader.array('images', 12)(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files || !req.files.length)
      return res.status(400).json({ error: 'No files uploaded' });

    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'mriparts_hub' }, // Saves into a folder in your Cloudinary account
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const urls = await Promise.all(uploadPromises);
      res.json({ urls, count: urls.length });
    } catch (e) {
      console.error('Cloudinary multiple upload error:', e);
      res.status(500).json({ error: 'Failed to upload images to Cloudinary' });
    }
  });
});

// ─────────────────────────────────────────────────────────────
// POST /api/upload  →  single-file (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────
router.post('/', authRequired, (req, res) => {
  uploader.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'mriparts_hub' },
          (error, res) => (error ? reject(error) : resolve(res))
        );
        uploadStream.end(req.file.buffer);
      });

      res.json({ url: result.secure_url, filename: result.public_id });
    } catch (e) {
      console.error('Cloudinary single upload error:', e);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });
});

module.exports = router;