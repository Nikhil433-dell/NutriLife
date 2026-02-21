import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  title: { color: '#2e7d32', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '1.5rem',
    boxShadow: '0 4px 16px rgba(46,125,50,0.1)', border: '1px solid #c8e6c9', marginBottom: '1.5rem',
  },
  sectionTitle: { color: '#2e7d32', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' },
  input: {
    flex: 1, minWidth: '100px', padding: '0.6rem 0.9rem',
    border: '1.5px solid #c8e6c9', borderRadius: '8px', fontSize: '0.95rem',
  },
  btn: {
    padding: '0.6rem 1.4rem', background: '#2e7d32', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
  },
  btnDanger: {
    padding: '0.4rem 0.9rem', background: '#e53935', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
  },
  totalsRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' },
  totalsChip: {
    background: '#e8f5e9', padding: '0.5rem 1rem', borderRadius: '20px',
    color: '#2e7d32', fontWeight: 600, fontSize: '0.9rem',
  },
  foodItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.6rem 0', borderBottom: '1px solid #f1f8e9',
  },
  error: { background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  logCard: {
    background: '#fff', borderRadius: '12px', padding: '1.2rem',
    boxShadow: '0 2px 8px rgba(46,125,50,0.08)', border: '1px solid #c8e6c9', marginBottom: '1rem',
  },
  logDate: { fontWeight: 700, color: '#2e7d32', marginBottom: '0.5rem' },
};

const emptyFood = { name: '', calories: '', protein: '', carbs: '', fat: '' };

const NutritionTracker = () => {
  const [logs, setLogs] = useState([]);
  const [foods, setFoods] = useState([{ ...emptyFood }]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await api.get('/nutrition');
      setLogs(res.data);
    } catch {
      // silently fail if no DB connection
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const updateFood = (index, field, value) => {
    const updated = [...foods];
    updated[index] = { ...updated[index], [field]: value };
    setFoods(updated);
  };

  const addFoodRow = () => setFoods([...foods, { ...emptyFood }]);
  const removeFoodRow = (i) => setFoods(foods.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const parsedFoods = foods.map((f) => ({
        name: f.name,
        calories: Number(f.calories) || 0,
        protein: Number(f.protein) || 0,
        carbs: Number(f.carbs) || 0,
        fat: Number(f.fat) || 0,
      }));
      await api.post('/nutrition', { date, foods: parsedFoods });
      setMessage({ type: 'success', text: 'Nutrition log saved!' });
      setFoods([{ ...emptyFood }]);
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save log' });
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id) => {
    try {
      await api.delete(`/nutrition/${id}`);
      fetchLogs();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete log' });
    }
  };

  const totals = foods.reduce(
    (acc, f) => ({
      calories: acc.calories + (Number(f.calories) || 0),
      protein: acc.protein + (Number(f.protein) || 0),
      carbs: acc.carbs + (Number(f.carbs) || 0),
      fat: acc.fat + (Number(f.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🥗 Nutrition Tracker</h1>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Log Today's Meals</h2>

        {message.text && (
          <div style={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              style={{ ...styles.input, flex: 'none', width: 'auto' }}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {foods.map((food, i) => (
            <div key={i} style={styles.row}>
              <input style={styles.input} placeholder="Food name" value={food.name}
                onChange={(e) => updateFood(i, 'name', e.target.value)} required />
              <input style={styles.input} placeholder="Calories" type="number" value={food.calories}
                onChange={(e) => updateFood(i, 'calories', e.target.value)} />
              <input style={styles.input} placeholder="Protein (g)" type="number" value={food.protein}
                onChange={(e) => updateFood(i, 'protein', e.target.value)} />
              <input style={styles.input} placeholder="Carbs (g)" type="number" value={food.carbs}
                onChange={(e) => updateFood(i, 'carbs', e.target.value)} />
              <input style={styles.input} placeholder="Fat (g)" type="number" value={food.fat}
                onChange={(e) => updateFood(i, 'fat', e.target.value)} />
              {foods.length > 1 && (
                <button type="button" style={styles.btnDanger} onClick={() => removeFoodRow(i)}>✕</button>
              )}
            </div>
          ))}

          <div style={styles.totalsRow}>
            <span style={styles.totalsChip}>🔥 {totals.calories} kcal</span>
            <span style={styles.totalsChip}>💪 {totals.protein}g protein</span>
            <span style={styles.totalsChip}>🍞 {totals.carbs}g carbs</span>
            <span style={styles.totalsChip}>🥑 {totals.fat}g fat</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" style={{ ...styles.btn, background: '#43a047' }} onClick={addFoodRow}>
              + Add Food
            </button>
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>

      <h2 style={{ ...styles.sectionTitle, fontSize: '1.3rem', marginBottom: '1rem' }}>Past Logs</h2>
      {logs.length === 0 ? (
        <p style={{ color: '#888' }}>No logs yet. Start tracking your nutrition above!</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} style={styles.logCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={styles.logDate}>{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <button style={styles.btnDanger} onClick={() => deleteLog(log._id)}>Delete</button>
            </div>
            {log.foods.map((f, i) => (
              <div key={i} style={styles.foodItem}>
                <span>{f.name}</span>
                <span style={{ color: '#555', fontSize: '0.85rem' }}>
                  {f.calories} kcal | {f.protein}g P | {f.carbs}g C | {f.fat}g F
                </span>
              </div>
            ))}
            <div style={styles.totalsRow}>
              <span style={styles.totalsChip}>🔥 {log.totals.calories} kcal</span>
              <span style={styles.totalsChip}>💪 {log.totals.protein}g protein</span>
              <span style={styles.totalsChip}>🍞 {log.totals.carbs}g carbs</span>
              <span style={styles.totalsChip}>🥑 {log.totals.fat}g fat</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NutritionTracker;
