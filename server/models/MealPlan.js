const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  name: { type: String, required: true },
  calories: { type: Number, default: 0 },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
});

const DaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  meals: [MealSchema],
});

const MealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  week: {
    type: Date,
    required: true,
  },
  days: [DaySchema],
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', MealPlanSchema);
