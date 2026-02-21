const router = require('express').Router();
const { getDb } = require('../config/firebase');

const USERS = 'users';

function toPublicUser(doc) {
  if (!doc) return null;
  const data = doc.data();
  const { passwordHash, ...rest } = data;
  const checkIns = (rest.checkIns || []).map((c) => ({
    ...c,
    date: c.date?.toDate?.()?.toISOString?.() || c.date,
  }));
  return {
    id: doc.id,
    ...rest,
    checkIns,
    joinedAt: rest.joinedAt?.toDate?.()?.toISOString?.() || rest.joinedAt,
  };
}

function toPublicUserSummary(doc) {
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || 'Member',
    email: data.email,
    role: data.role || 'user',
    avatar: data.avatar || null,
    joinedAt: data.joinedAt?.toDate?.()?.toISOString?.() || data.joinedAt,
  };
}

// GET /api/users — list users (query: exclude=userId to exclude current user)
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const exclude = req.query.exclude || '';
    let snapshot = await db.collection(USERS).get();
    let list = snapshot.docs.map((d) => toPublicUserSummary(d));
    if (exclude) list = list.filter((u) => u.id !== exclude);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(USERS).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(toPublicUser(doc));
  } catch (e) {
    next(e);
  }
});

// PATCH /api/users/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const ref = db.collection(USERS).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const allowed = ['name', 'avatar', 'preferences'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      const current = doc.data();
      const { passwordHash, ...rest } = current;
      return res.json({ id: doc.id, ...rest, joinedAt: rest.joinedAt?.toDate?.()?.toISOString?.() || rest.joinedAt, checkIns: rest.checkIns || [] });
    }

    await ref.update(updates);
    const updated = await ref.get();
    res.json(toPublicUser(updated));
  } catch (e) {
    next(e);
  }
});

// GET /api/users/:id/bookmarks
router.get('/:id/bookmarks', async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection(USERS).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const bookmarks = (doc.data().bookmarks || []).map((id) => (typeof id === 'number' ? id : parseInt(id, 10)));
    res.json(bookmarks);
  } catch (e) {
    next(e);
  }
});

// POST /api/users/:id/bookmarks — body: { shelterId }
router.post('/:id/bookmarks', async (req, res, next) => {
  try {
    const db = getDb();
    const ref = db.collection(USERS).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shelterId = req.body?.shelterId != null ? Number(req.body.shelterId) : null;
    if (shelterId == null || Number.isNaN(shelterId)) {
      return res.status(400).json({ error: 'shelterId is required' });
    }

    const bookmarks = doc.data().bookmarks || [];
    if (bookmarks.includes(shelterId)) {
      return res.json(bookmarks);
    }
    const nextBookmarks = [...bookmarks, shelterId];
    await ref.update({ bookmarks: nextBookmarks });
    res.json(nextBookmarks);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/users/:id/bookmarks/:shelterId
router.delete('/:id/bookmarks/:shelterId', async (req, res, next) => {
  try {
    const db = getDb();
    const ref = db.collection(USERS).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shelterId = Number(req.params.shelterId);
    if (Number.isNaN(shelterId)) {
      return res.status(400).json({ error: 'Invalid shelterId' });
    }

    const bookmarks = (doc.data().bookmarks || []).filter((id) => Number(id) !== shelterId);
    await ref.update({ bookmarks });
    res.json(bookmarks);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
