const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const listingRoutes  = require('./routes/listings');
const categoryRoutes = require('./routes/categories');
const adminRoutes    = require('./routes/admin');
const inquiryRoutes  = require('./routes/inquiries');
const uploadRoutes   = require('./routes/upload');
const reviewRoutes   = require('./routes/reviews');
const sellerRoutes   = require('./routes/sellers');
const favoriteRoutes = require('./routes/favorites');
const paymentRoutes  = require('./routes/payments');
const searchRoutes   = require('./routes/search');
const newsRoutes = require('./routes/news');
const directoryRoutes = require('./routes/directory');
const app = express();

// ── CORS CONFIGURATION ──
// Allow both your Vercel default URL and your custom domain
const allowedOrigins = [
  'https://mripartshub.com',
  'https://www.mripartshub.com',
  'https://mriparts-hub.vercel.app',
  'http://localhost:3000' // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ⚠️ Stripe webhook must be mounted BEFORE express.json() — it needs the raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Now the normal JSON parser for everything else
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/listings',  listingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload',    uploadRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/sellers',   sellerRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api',           categoryRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/directory', directoryRoutes);

app.get('/', (_, res) => res.json({ ok: true, service: 'MRI Parts Hub API' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ MRI Parts Hub API on http://localhost:${PORT}`));