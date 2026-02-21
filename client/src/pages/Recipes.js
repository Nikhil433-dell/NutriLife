import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  title: { color: '#2e7d32', fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '1.5rem',
    boxShadow: '0 4px 16px rgba(46,125,50,0.1)', border: '1px solid #c8e6c9',
  },
  cardTitle: { color: '#2e7d32', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' },
  cardMeta: { color: '#888', fontSize: '0.85rem', marginBottom: '0.75rem' },
  cardDesc: { color: '#555', fontSize: '0.9rem', marginBottom: '1rem' },
  chip: {
    background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.6rem',
    borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, marginRight: '0.4rem',
  },
  btn: {
    padding: '0.6rem 1.4rem', background: '#2e7d32', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
  },
  btnDanger: {
    padding: '0.4rem 0.9rem', background: '#e53935', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '0.5rem',
  },
  btnOutline: {
    padding: '0.5rem 1rem', background: 'transparent', color: '#2e7d32',
    border: '1.5px solid #2e7d32', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
  },
  formCard: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    boxShadow: '0 4px 16px rgba(46,125,50,0.1)', border: '1px solid #c8e6c9', marginBottom: '2rem',
  },
  formTitle: { color: '#2e7d32', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' },
  input: {
    width: '100%', padding: '0.65rem 1rem', border: '1.5px solid #c8e6c9',
    borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.75rem',
  },
  textarea: {
    width: '100%', padding: '0.65rem 1rem', border: '1.5px solid #c8e6c9',
    borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.75rem', minHeight: '80px', resize: 'vertical',
  },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  error: { background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  label: { display: 'block', color: '#2e7d32', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem' },
  ingredientRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' },
};

const emptyRecipe = {
  title: '', description: '', instructions: '',
  ingredients: [{ name: '', amount: '' }],
  nutritionInfo: { calories: '', protein: '', carbs: '', fat: '' },
  isPublic: false,
};

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({ ...emptyRecipe });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      const res = await api.get('/recipes');
      setRecipes(res.data);
    } catch {
      // silently fail if no DB
    }
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const updateIngredient = (i, field, value) => {
    const updated = [...form.ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, ingredients: updated });
  };

  const addIngredient = () => setForm({ ...form, ingredients: [...form.ingredients, { name: '', amount: '' }] });
  const removeIngredient = (i) => setForm({ ...form, ingredients: form.ingredients.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        ...form,
        nutritionInfo: {
          calories: Number(form.nutritionInfo.calories) || 0,
          protein: Number(form.nutritionInfo.protein) || 0,
          carbs: Number(form.nutritionInfo.carbs) || 0,
          fat: Number(form.nutritionInfo.fat) || 0,
        },
      };
      await api.post('/recipes', payload);
      setMessage({ type: 'success', text: 'Recipe saved!' });
      setForm({ ...emptyRecipe });
      setShowForm(false);
      fetchRecipes();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save recipe' });
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      fetchRecipes();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete recipe' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={styles.title}>📖 Recipes</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Recipe'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
      )}

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Add New Recipe</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Title *</label>
            <input style={styles.input} placeholder="Recipe title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />

            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} placeholder="Brief description..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label style={styles.label}>Ingredients</label>
            {form.ingredients.map((ing, i) => (
              <div key={i} style={styles.ingredientRow}>
                <input style={{ ...styles.input, marginBottom: 0, flex: 2 }} placeholder="Ingredient name"
                  value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} />
                <input style={{ ...styles.input, marginBottom: 0, flex: 1 }} placeholder="Amount"
                  value={ing.amount} onChange={(e) => updateIngredient(i, 'amount', e.target.value)} />
                {form.ingredients.length > 1 && (
                  <button type="button" style={{ ...styles.btnDanger, marginLeft: 0 }} onClick={() => removeIngredient(i)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" style={{ ...styles.btnOutline, marginBottom: '1rem', marginTop: '0.4rem' }} onClick={addIngredient}>
              + Add Ingredient
            </button>

            <label style={styles.label}>Instructions</label>
            <textarea style={{ ...styles.textarea, minHeight: '120px' }} placeholder="Step by step instructions..."
              value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />

            <label style={styles.label}>Nutrition Info (per serving)</label>
            <div style={styles.row}>
              {['calories', 'protein', 'carbs', 'fat'].map((n) => (
                <input key={n} style={{ ...styles.input, flex: 1, minWidth: '80px' }}
                  placeholder={n.charAt(0).toUpperCase() + n.slice(1)}
                  type="number" value={form.nutritionInfo[n]}
                  onChange={(e) => setForm({ ...form, nutritionInfo: { ...form.nutritionInfo, [n]: e.target.value } })} />
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', fontWeight: 600, marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.isPublic}
                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} />
              Make recipe public
            </label>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Recipe'}
            </button>
          </form>
        </div>
      )}

      {recipes.length === 0 ? (
        <p style={{ color: '#888' }}>No recipes yet. Add your first recipe above!</p>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{recipe.title}</h3>
              <p style={styles.cardMeta}>By {recipe.user?.name || 'You'} {recipe.isPublic ? '• 🌍 Public' : ''}</p>
              {recipe.description && <p style={styles.cardDesc}>{recipe.description}</p>}
              {recipe.nutritionInfo && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={styles.chip}>🔥 {recipe.nutritionInfo.calories} kcal</span>
                  <span style={styles.chip}>💪 {recipe.nutritionInfo.protein}g</span>
                  <span style={styles.chip}>🍞 {recipe.nutritionInfo.carbs}g</span>
                </div>
              )}
              <button style={styles.btnDanger} onClick={() => deleteRecipe(recipe._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
