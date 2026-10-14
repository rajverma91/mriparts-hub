const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
  cb(ok ? null : new Error('Only JPG/PNG/WEBP/GIF allowed'), ok);
}

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 12 } // 12 files max, 5 MB each
});

// POST /api/upload/multiple  →  field name "images"
router.post('/multiple', authRequired, (req, res) => {
  uploader.array('images', 12)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files || !req.files.length)
      return res.status(400).json({ error: 'No files uploaded' });

    const base = `${req.protocol}://${req.get('host')}/uploads`;
    const urls = req.files.map((f) => `${base}/${f.filename}`);

    res.json({ urls, count: urls.length });
  });
});

// POST /api/upload  →  single-file (kept for backward compatibility)
router.post('/', authRequired, (req, res) => {
  uploader.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename, size: req.file.size });
  });
});

module.exports = router;