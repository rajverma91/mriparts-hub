const express = require('express');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');
const { sendInquiryEmail } = require('../utils/mailer');

const router = express.Router();

// Set your admin email here
const ADMIN_EMAIL = 'ramiscool1@gmail.com';

// PUBLIC: buyer sends an inquiry
router.post('/', async (req, res) => {
  try {
    const { listing_id, buyer_name, buyer_email, buyer_phone, message } = req.body;

    if (!listing_id || !buyer_name || !buyer_email || !message)
      return res.status(400).json({ error: 'listing_id, name, email, message required' });

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer_email))
      return res.status(400).json({ error: 'Invalid email' });

    // Fetch listing + seller
    const [rows] = await pool.query(
      `SELECT l.id, l.title, l.user_id, l.slug, u.email AS seller_email, u.name AS seller_name
       FROM listings l
       JOIN users u ON u.id = l.user_id
       WHERE l.id=? AND l.status='active'`,
      [listing_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Listing not found' });
    const listing = rows[0];

    // Save message
    const [result] = await pool.query(
      `INSERT INTO messages
       (listing_id, seller_id, buyer_name, buyer_email, buyer_phone, message)
       VALUES (?,?,?,?,?,?)`,
      [listing.id, listing.user_id, buyer_name, buyer_email, buyer_phone || null, message]
    );

    // Email seller (and BCC the admin)
    const listingUrl = `${process.env.FRONTEND_URL}/listings/${listing.slug || listing.id}`;
    try {
      await sendInquiryEmail({
        to: listing.seller_email,
        bcc: ADMIN_EMAIL, // ← Sends a hidden copy to you
        listingTitle: listing.title,
        listingUrl,
        buyer: { name: buyer_name, email: buyer_email, phone: buyer_phone, message }
      });
    } catch (mailErr) {
      console.error('Inquiry mail error:', mailErr.message);
    }

    res.json({ id: result.insertId, message: 'Inquiry sent. The seller will contact you shortly.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: seller views own inbox
router.get('/mine', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, l.title AS listing_title, l.slug AS listing_slug
       FROM messages m
       JOIN listings l ON l.id = m.listing_id
       WHERE m.seller_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: seller marks a message as read
router.patch('/:id/read', authRequired, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT seller_id FROM messages WHERE id=?',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  if (rows[0].seller_id !== req.user.id)
    return res.status(403).json({ error: 'Not your message' });

  await pool.query('UPDATE messages SET is_read=1 WHERE id=?', [req.params.id]);
  res.json({ message: 'Marked read' });
});

// AUTH: seller deletes a message
router.delete('/:id', authRequired, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT seller_id FROM messages WHERE id=?',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  if (rows[0].seller_id !== req.user.id)
    return res.status(403).json({ error: 'Not your message' });

  await pool.query('DELETE FROM messages WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;