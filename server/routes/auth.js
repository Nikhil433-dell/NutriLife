const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/firebase');

const USERS = 'users';

// Strip password and sensitive fields from user object
function toPublicUser(doc) {
  if (!doc) return null;
  const data = doc.data();
  const { passwordHash, ...rest } = data;
  return { id: doc.id, ...rest, joinedAt: data.joinedAt?.toDate?.()?.toISOString?.() || data.joinedAt };
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const db = getDb();
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const snapshot = await db.collection(USERS).where('email', '==', email.trim().toLowerCase()).limit(1).get();
    if (!snapshot.empty) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const user = {
      name: (name || email.split('@')[0]).trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'user',
      avatar: null,
      joinedAt: now,
      preferences: {},
      bookmarks: [],
      checkIns: [],
    };

    const ref = await db.collection(USERS).add(user);
    const created = await ref.get();
    res.status(201).json(toPublicUser(created));
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const db = getDb();
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const snapshot = await db.collection(USERS).where('email', '==', email.trim().toLowerCase()).limit(1).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const match = await bcrypt.compare(password, data.passwordHash || '');
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json(toPublicUser(doc));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
