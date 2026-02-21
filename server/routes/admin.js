const router = require('express').Router();
const { getDb } = require('../config/firebase');

const INVENTORY = 'inventory';
const DISTRIBUTIONS = 'distributions';

// GET /api/admin/inventory
router.get('/inventory', async (req, res, next) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(INVENTORY).orderBy('id').get();
    const list = snapshot.docs.map((doc) => ({ id: doc.data().id ?? doc.id, ...doc.data() }));
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/inventory/:id
router.patch('/inventory/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const numId = parseInt(id, 10);
    const allowed = ['quantity', 'threshold', 'lastRestocked'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No allowed fields to update' });
    }

    const snapshot = await db.collection(INVENTORY).where('id', '==', numId).limit(1).get();
    if (snapshot.empty) {
      const docRef = await db.collection(INVENTORY).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Inventory item not found' });
      await docRef.update(updates);
      const updated = await docRef.get();
      return res.json({ id: updated.data().id ?? doc.id, ...updated.data() });
    }
    const ref = snapshot.docs[0].ref;
    await ref.update(updates);
    const updated = await ref.get();
    res.json({ id: updated.data().id ?? ref.id, ...updated.data() });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/distributions
router.get('/distributions', async (req, res, next) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(DISTRIBUTIONS).orderBy('date', 'desc').limit(100).get();
    const list = snapshot.docs.map((doc) => {
      const d = doc.data();
      return { id: d.id ?? doc.id, ...d, date: d.date };
    });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/distributions
router.post('/distributions', async (req, res, next) => {
  try {
    const db = getDb();
    const { date, shelterId, shelterName, items, distributedBy, notes } = req.body || {};
    if (!shelterId || !Array.isArray(items)) {
      return res.status(400).json({ error: 'shelterId and items array are required' });
    }

    const snapshot = await db.collection(DISTRIBUTIONS).orderBy('id', 'desc').limit(1).get();
    const nextId = snapshot.empty ? 1 : (snapshot.docs[0].data().id || 0) + 1;

    const doc = {
      id: nextId,
      date: date || new Date().toISOString().slice(0, 10),
      shelterId: Number(shelterId),
      shelterName: shelterName || '',
      items: items.map((i) => ({
        inventoryId: i.inventoryId,
        item: i.item,
        quantity: i.quantity,
      })),
      distributedBy: distributedBy || 'Admin',
      notes: notes || '',
    };

    const ref = await db.collection(DISTRIBUTIONS).add(doc);
    res.status(201).json({ id: nextId, ...doc });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
