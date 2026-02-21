const router = require('express').Router();
const { getDb } = require('../config/firebase');

const CONNECTIONS = 'connections';

function toConnection(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    fromUserId: d.fromUserId,
    toUserId: d.toUserId,
    message: d.message || '',
    status: d.status || 'pending',
    createdAt: d.createdAt?.toDate?.()?.toISOString?.() || d.createdAt,
  };
}

// GET /api/connections?userId=xxx — all connection requests involving this user (sent + received)
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId query is required' });

    const sent = await db.collection(CONNECTIONS).where('fromUserId', '==', userId).get();
    const received = await db.collection(CONNECTIONS).where('toUserId', '==', userId).get();
    const list = [
      ...sent.docs.map(toConnection).map((c) => ({ ...c, direction: 'sent' })),
      ...received.docs.map(toConnection).map((c) => ({ ...c, direction: 'received' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(list);
  } catch (e) {
    next(e);
  }
});

// POST /api/connections — body: { fromUserId, toUserId, message }
router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    const { fromUserId, toUserId, message } = req.body || {};
    if (!fromUserId || !toUserId) return res.status(400).json({ error: 'fromUserId and toUserId are required' });
    if (fromUserId === toUserId) return res.status(400).json({ error: 'Cannot send request to yourself' });

    const fromExists = await db.collection('users').doc(fromUserId).get();
    const toExists = await db.collection('users').doc(toUserId).get();
    if (!fromExists.exists || !toExists.exists) return res.status(404).json({ error: 'User not found' });

    const existing = await db
      .collection(CONNECTIONS)
      .where('fromUserId', '==', fromUserId)
      .where('toUserId', '==', toUserId)
      .limit(1)
      .get();
    if (!existing.empty) {
      const status = existing.docs[0].data().status;
      if (status === 'pending') return res.status(409).json({ error: 'Connection request already sent' });
      if (status === 'accepted') return res.status(409).json({ error: 'Already connected' });
    }

    const doc = {
      fromUserId,
      toUserId,
      message: (message || '').trim().slice(0, 500),
      status: 'pending',
      createdAt: new Date(),
    };
    const ref = await db.collection(CONNECTIONS).add(doc);
    res.status(201).json({
      id: ref.id,
      fromUserId: doc.fromUserId,
      toUserId: doc.toUserId,
      message: doc.message,
      status: doc.status,
      createdAt: doc.createdAt.toISOString(),
    });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/connections/:id — body: { status: 'accepted' | 'rejected' } (for receiver)
router.patch('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const { status } = req.body || {};
    if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ error: 'status must be accepted or rejected' });

    const ref = db.collection(CONNECTIONS).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Connection request not found' });
    const data = doc.data();
    if (data.status !== 'pending') return res.status(400).json({ error: 'Request already handled' });

    await ref.update({ status, respondedAt: new Date() });
    const updated = await ref.get();
    res.json(toConnection(updated));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
