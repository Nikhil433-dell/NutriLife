/**
 * Express app – used by server.js (local) and by Vercel serverless (api/index.js).
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getDb } = require('./config/firebase');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const shelterRoutes = require('./routes/shelters');
const adminRoutes = require('./routes/admin');
const communityRoutes = require('./routes/community');
const connectionRoutes = require('./routes/connections');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Initialize Firebase when first request hits (lazy for serverless)
let dbInitialized = false;
app.use((req, res, next) => {
  if (!dbInitialized) {
    getDb();
    dbInitialized = true;
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/connections', connectionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'NutriLife API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
