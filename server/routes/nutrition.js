const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const NutritionLog = require('../models/NutritionLog');

// GET /api/nutrition - get all logs for user
router.get('/', auth, async (req, res) => {
  try {
    const logs = await NutritionLog.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/nutrition/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const log = await NutritionLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/nutrition - create new log
router.post('/', auth, async (req, res) => {
  try {
    const { date, foods } = req.body;
    const log = await NutritionLog.create({ user: req.user._id, date: date || Date.now(), foods: foods || [] });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/nutrition/:id - update log
router.put('/:id', auth, async (req, res) => {
  try {
    const log = await NutritionLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const { date, foods } = req.body;
    if (date !== undefined) log.date = date;
    if (foods !== undefined) log.foods = foods;

    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/nutrition/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const log = await NutritionLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
