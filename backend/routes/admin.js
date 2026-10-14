const express = require('express');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');
const router = express.Router();

router.use(authRequired, adminRequired);

// All listings (any status)
router.get('/listings', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT l.*, u.email AS seller_email, c.name AS category, b.name AS brand
     FROM listings l
     LEFT JOIN users u ON u.id=l.user_id
     LEFT JOIN categories c ON c.id=l.category_id
     LEFT JOIN brands b ON b.id=l.brand_id
     ORDER BY l.created_at DESC`
  );
  res.json(rows);
});

// Change status
router.patch('/listings/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending','active','rejected','sold'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  await pool.query('UPDATE listings SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ message: 'Status updated' });
});

// Users list
router.get('/users', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id,name,email,role,company,country,is_verified,created_at FROM users ORDER BY created_at DESC'
  );
  res.json(rows);
});

// Stats
router.get('/stats', async (req, res) => {
  const [[users]] = await pool.query('SELECT COUNT(*) c FROM users');
  const [[listings]] = await pool.query('SELECT COUNT(*) c FROM listings');
  const [[pending]] = await pool.query("SELECT COUNT(*) c FROM listings WHERE status='pending'");
  const [[active]] = await pool.query("SELECT COUNT(*) c FROM listings WHERE status='active'");
  res.json({ users: users.c, listings: listings.c, pending: pending.c, active: active.c });
});

module.exports = router;