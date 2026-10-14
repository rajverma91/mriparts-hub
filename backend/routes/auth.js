const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');
const { sendResetEmail, sendVerificationEmail } = require('../utils/mailer');

const router = express.Router();

function sign(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, phone, country, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, password required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password min 6 chars' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const userRole = role === 'seller' ? 'seller' : 'buyer';

    // Generate verification token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [result] = await pool.query(
      `INSERT INTO users
       (name,email,password_hash,role,company,phone,country,
        email_verified, verify_token, verify_expires)
       VALUES (?,?,?,?,?,?,?, 0, ?, ?)`,
      [name, email, hash, userRole, company || null, phone || null, country || null,
       tokenHash, expires]
    );

    // Send verification email (non-blocking)
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;
    try {
      await sendVerificationEmail(email, name, verifyUrl);
    } catch (mailErr) {
      console.error('Verification email failed:', mailErr.message);
    }

    const user = { id: result.insertId, email, role: userRole, name };
    res.json({
      token: sign(user),
      user,
      message: 'Account created. Please check your email to verify your address.'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error', detail: e.sqlMessage });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    res.json({ token: sign(payload), user: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ME
router.get('/me', authRequired, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id,name,email,role,company,phone,country FROM users WHERE id=?',
    [req.user.id]
  );
  res.json(rows[0] || null);
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const generic = { message: 'If that email exists, a reset link was sent.' };

    const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (!rows.length) return res.json(generic);

    const raw = crypto.randomBytes(32).toString('hex');
    const token = crypto.createHash('sha256').update(raw).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token=?, reset_token_expires=? WHERE id=?',
      [token, expires, rows[0].id]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
    try {
      await sendResetEmail(email, resetUrl);
    } catch (mailErr) {
      console.error('Mail error:', mailErr.message);
    }
    res.json(generic);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
      return res.status(400).json({ error: 'Missing fields' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Password min 6 chars' });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const [rows] = await pool.query(
      `SELECT id FROM users WHERE email=? AND reset_token=? AND reset_token_expires > NOW()`,
      [email, hashed]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired token' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash=?, reset_token=NULL, reset_token_expires=NULL WHERE id=?',
      [hash, rows[0].id]
    );
    res.json({ message: 'Password updated. You can log in now.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});




// POST /api/auth/send-verification — (re)send verification email to logged-in user
router.post('/send-verification', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, email_verified FROM users WHERE id=?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET verify_token=?, verify_expires=? WHERE id=?',
      [tokenHash, expires, user.id]
    );

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    try {
      await sendVerificationEmail(user.email, user.name, verifyUrl);
    } catch (mailErr) {
      console.error('Verification email failed:', mailErr.message);
    }

    // In dev, log the link so you can test without SMTP
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔗 VERIFY LINK:', verifyUrl);
    }

    res.json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/verify-email?token=...&email=... — confirm email
// router.get('/verify-email', async (req, res) => {
//   try {
//     const { token, email } = req.query;
//     if (!token || !email)
//       return res.status(400).json({ error: 'Missing token or email' });

//     const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

//     const [rows] = await pool.query(
//       `SELECT id, email_verified FROM users
//        WHERE email=? AND verify_token=? AND verify_expires > NOW()`,
//       [email, tokenHash]
//     );

//     if (!rows.length) {
//       return res.status(400).json({ error: 'Invalid or expired verification link' });
//     }

//     if (rows[0].email_verified) {
//       return res.json({ message: 'Email already verified', already: true });
//     }

//     await pool.query(
//       `UPDATE users
//        SET email_verified=1, verify_token=NULL, verify_expires=NULL
//        WHERE id=?`,
//       [rows[0].id]
//     );

//     res.json({ message: 'Email verified successfully. You can now list equipment.' });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// GET /api/auth/verify-email?token=...&email=... — confirm email
router.get('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.query;

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('🔍 VERIFY EMAIL REQUEST');
    console.log('  email:', email);
    console.log('  token (first 12):', token ? token.slice(0, 12) + '…' : '(none)');
    console.log('═══════════════════════════════════════════');

    if (!token || !email) {
      console.log('❌ Missing token or email');
      return res.status(400).json({ error: 'Missing token or email' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    console.log('  hashed token (first 12):', tokenHash.slice(0, 12) + '…');

    // Step A: does the user exist?
    const [userRows] = await pool.query(
      `SELECT id, email_verified, verify_token, verify_expires, NOW() AS now_time
       FROM users WHERE email = ?`,
      [email]
    );

    if (!userRows.length) {
      console.log('❌ User not found with this email');
      return res.status(400).json({ error: 'Invalid or expired verification link' });
    }

    const user = userRows[0];

    // Step B: already verified?
    if (user.email_verified) {
      console.log('ℹ️  User is ALREADY verified — returning success');
      return res.json({ message: 'Email already verified', already: true });
    }

    // Step C: token field empty?
    if (!user.verify_token) {
      console.log('❌ DB has no verify_token — was it already used or never set?');
      return res.status(400).json({
        error: 'This link is no longer valid. Request a new one from your dashboard.'
      });
    }

    // Step D: token matches?
    if (user.verify_token !== tokenHash) {
      console.log('❌ TOKEN MISMATCH');
      console.log('   DB  has:', user.verify_token.slice(0, 12) + '…');
      console.log('   URL has:', tokenHash.slice(0, 12) + '…');
      console.log('   → You clicked an OLDER link. Use the most recent one.');
      return res.status(400).json({
        error: 'This link is outdated. Please use the newest email you received.'
      });
    }

    // Step E: expired?
    const expired = new Date(user.verify_expires) < new Date(user.now_time);
    if (expired) {
      console.log('❌ TOKEN EXPIRED at', user.verify_expires, '(now is', user.now_time + ')');
      return res.status(400).json({
        error: 'This link has expired (24-hour limit). Request a new one.'
      });
    }

    // ✅ All checks passed — verify
    await pool.query(
      `UPDATE users
       SET email_verified=1, verify_token=NULL, verify_expires=NULL
       WHERE id=?`,
      [user.id]
    );

    console.log('✅ EMAIL VERIFIED SUCCESSFULLY for', email);
    console.log('═══════════════════════════════════════════');
    console.log('');

    res.json({ message: 'Email verified successfully. You can now list equipment.' });
  } catch (e) {
    console.error('❌ /verify-email error:', e);
    res.status(500).json({ error: 'Server error', detail: e.sqlMessage });
  }
});

module.exports = router;