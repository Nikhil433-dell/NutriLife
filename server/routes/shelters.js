const router = require('express').Router();
const { getDb } = require('../config/firebase');

const SHELTERS = 'shelters';
const USERS = 'users';

function docToShelter(doc) {
  const d = doc.data();
  return { id: d.id ?? doc.id, ...d };
}

// GET /api/shelters
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(SHELTERS).orderBy('id').get();
    const list = snapshot.docs.map(docToShelter);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// GET /api/shelters/search?q=
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    const db = getDb();
    const snapshot = await db.collection(SHELTERS).orderBy('id').get();
    let list = snapshot.docs.map(docToShelter);
    if (q) {
      list = list.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// GET /api/shelters/:id
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const numId = parseInt(id, 10);
    const byId = !Number.isNaN(numId);
    let doc;
    if (byId) {
      const snapshot = await db.collection(SHELTERS).where('id', '==', numId).limit(1).get();
      doc = snapshot.empty ? null : snapshot.docs[0];
    } else {
      doc = await db.collection(SHELTERS).doc(id).get();
      if (!doc.exists) doc = null;
    }
    if (!doc) {
      return res.status(404).json({ error: 'Shelter not found' });
    }
    res.json(docToShelter(doc));
  } catch (e) {
    next(e);
  }
});

// POST /api/shelters/:id/checkin — body: { userId } or similar
router.post('/:id/checkin', async (req, res, next) => {
  try {
    const db = getDb();
    const shelterId = parseInt(req.params.id, 10);
    if (Number.isNaN(shelterId)) {
      return res.status(400).json({ error: 'Invalid shelter id' });
    }

    const snapshot = await db.collection(SHELTERS).where('id', '==', shelterId).limit(1).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Shelter not found' });
    }

    const shelterRef = snapshot.docs[0].ref;
    const shelterData = snapshot.docs[0].data();
    const current = (shelterData.current || 0) + 1;
    const capacity = shelterData.capacity || 0;
    if (current > capacity) {
      return res.status(400).json({ error: 'Shelter is at capacity' });
    }
    await shelterRef.update({ current });

    const userId = req.body?.userId;
    if (userId) {
      const userRef = db.collection(USERS).doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const checkIns = userDoc.data().checkIns || [];
        checkIns.push({ shelterId, date: new Date() });
        await userRef.update({ checkIns });
      }
    }

    res.json({ shelterId, current });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
