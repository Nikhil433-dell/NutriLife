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
const PORT = process.env.PORT || 500;

app.use(cors({ origin: true }));
app.use(express.json());

// Ensure Firebase is initialized
getDb();

// API routes
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

app.listen(PORT, () => {
  console.log(`NutriLife API running at http://localhost:${PORT}`);
});
