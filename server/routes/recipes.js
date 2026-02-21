const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// GET /api/recipes - get user's recipes + public recipes
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      $or: [{ user: req.user._id }, { isPublic: true }],
    }).populate('user', 'name');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (!recipe.isPublic && recipe.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/recipes
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, ingredients, instructions, nutritionInfo, isPublic } = req.body;
    const recipe = await Recipe.create({
      user: req.user._id,
      title,
      description,
      ingredients: ingredients || [],
      instructions,
      nutritionInfo: nutritionInfo || {},
      isPublic: isPublic || false,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/recipes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const fields = ['title', 'description', 'ingredients', 'instructions', 'nutritionInfo', 'isPublic'];
    fields.forEach((f) => { if (req.body[f] !== undefined) recipe[f] = req.body[f]; });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
