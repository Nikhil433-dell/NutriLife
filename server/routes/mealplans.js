const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MealPlan = require('../models/MealPlan');

// GET /api/mealplans
router.get('/', auth, async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).sort({ week: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/mealplans/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/mealplans
router.post('/', auth, async (req, res) => {
  try {
    const { week, days } = req.body;
    const plan = await MealPlan.create({ user: req.user._id, week, days: days || [] });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/mealplans/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });

    const { week, days } = req.body;
    if (week !== undefined) plan.week = week;
    if (days !== undefined) plan.days = days;

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/mealplans/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });
    res.json({ message: 'Meal plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
