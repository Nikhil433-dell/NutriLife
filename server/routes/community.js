const router = require('express').Router();
const { getDb } = require('../config/firebase');

const COMMUNITY_MESSAGES = 'communityMessages';

function docToMessage(doc) {
  const d = doc.data();
  return {
    id: d.id ?? doc.id,
    ...d,
    timestamp: d.timestamp?.toDate?.()?.toISOString?.() ?? d.timestamp,
  };
}

// GET /api/community
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(COMMUNITY_MESSAGES).orderBy('timestamp', 'desc').limit(100).get();
    const list = snapshot.docs.map(docToMessage);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// POST /api/community — body: { userId, userName, avatar?, message, category? }
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { userId, userName, avatar, message, category } = req.body || {};
    if (!userId || !userName || !message || !message.trim()) {
      return res.status(400).json({ error: 'userId, userName, and message are required' });
    }

    const snapshot = await db.collection(COMMUNITY_MESSAGES).orderBy('id', 'desc').limit(1).get();
    const nextId = snapshot.empty ? 1 : (snapshot.docs[0].data().id || 0) + 1;

    const doc = {
      id: nextId,
      userId: String(userId),
      userName: String(userName).trim(),
      avatar: avatar ?? null,
      message: String(message).trim(),
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      category: category || 'announcement',
    };

    await db.collection(COMMUNITY_MESSAGES).add(doc);
    res.status(201).json({
      ...doc,
      id: nextId,
      timestamp: doc.timestamp.toISOString ? doc.timestamp.toISOString() : doc.timestamp,
    });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/community/:id/like — increment likes
router.patch('/:id/like', async (req, res, next) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const numId = parseInt(id, 10);
    const snapshot = await db.collection(COMMUNITY_MESSAGES).where('id', '==', numId).limit(1).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Message not found' });
    }
    const ref = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();
    const likes = (data.likes || 0) + 1;
    await ref.update({ likes });
    res.json({ id: numId, likes });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
