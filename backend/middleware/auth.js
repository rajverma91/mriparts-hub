const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}


function verifiedRequired(req, res, next) {
  // Assumes authRequired has already run and populated req.user.
  // We check the DB because the JWT doesn't carry verification status.
  const pool = require('../config/db');
  pool.query('SELECT email_verified FROM users WHERE id=?', [req.user.id])
    .then(([rows]) => {
      if (!rows.length) return res.status(401).json({ error: 'User not found' });
      if (!rows[0].email_verified) {
        return res.status(403).json({
          error: 'Please verify your email address before creating listings.',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }
      next();
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    });
}



function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admin only' });
  next();
}

module.exports = { authRequired, adminRequired, verifiedRequired };