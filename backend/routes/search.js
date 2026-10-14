const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/search?q=ct  →  { suggestions: [{ label, type, href }] }
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ suggestions: [] });

    const like = `%${q}%`;

    const [categories] = await pool.query(
      `SELECT id, name, slug
       FROM categories
       WHERE name LIKE ?
       ORDER BY name
       LIMIT 5`,
      [like]
    );

    const [brands] = await pool.query(
      `SELECT id, name
       FROM brands
       WHERE name LIKE ?
       ORDER BY name
       LIMIT 4`,
      [like]
    );

    const [listings] = await pool.query(
      `SELECT id, title, slug, price, currency, image_url, gallery_json
       FROM listings
       WHERE status='active'
         AND (title LIKE ? OR model LIKE ?)
       ORDER BY is_featured DESC, created_at DESC
       LIMIT 6`,
      [like, like]
    );

    const suggestions = [
      ...categories.map((c) => ({
        label: `in ${c.name}`,
        raw: c.name,
        type: 'category',
        href: `/listings?category=${c.slug}`,
        prefix: q
      })),
      ...brands.map((b) => ({
        label: `by ${b.name}`,
        raw: b.name,
        type: 'brand',
        href: `/listings?brand=${encodeURIComponent(b.name)}`,
        prefix: q
      })),
      ...listings.map((l) => ({
        label: l.title,
        raw: l.title,
        type: 'listing',
        href: `/listings/${l.slug || l.id}`,
        price: `${l.currency} ${Number(l.price || 0).toLocaleString()}`,
        image: (() => {
          try {
            const g = typeof l.gallery_json === 'string'
              ? JSON.parse(l.gallery_json)
              : l.gallery_json;
            return g?.[0] || l.image_url;
          } catch { return l.image_url; }
        })()
      }))
    ];

    res.json({ suggestions });
  } catch (e) {
    console.error('GET /search error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/search/popular  →  popular search terms (used for chips)
router.get('/popular', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.name, c.slug
       FROM categories c
       WHERE (SELECT COUNT(*) FROM listings l
              WHERE l.category_id=c.id AND l.status='active') > 0
       ORDER BY RAND()
       LIMIT 8`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;