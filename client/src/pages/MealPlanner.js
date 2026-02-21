import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  title: { color: '#2e7d32', fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  dayCard: {
    background: '#fff', borderRadius: '16px', padding: '1.2rem',
    boxShadow: '0 4px 12px rgba(46,125,50,0.1)', border: '1px solid #c8e6c9',
  },
  dayTitle: { color: '#2e7d32', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', borderBottom: '2px solid #e8f5e9', paddingBottom: '0.4rem' },
  mealSection: { marginBottom: '0.75rem' },
  mealType: { color: '#555', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' },
  mealItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#f1f8e9', borderRadius: '6px', padding: '0.35rem 0.6rem', marginBottom: '0.25rem', fontSize: '0.85rem',
  },
  addMealRow: { display: 'flex', gap: '0.4rem', marginTop: '0.4rem' },
  input: {
    flex: 1, padding: '0.4rem 0.6rem', border: '1.5px solid #c8e6c9',
    borderRadius: '6px', fontSize: '0.85rem',
  },
  select: {
    padding: '0.4rem 0.6rem', border: '1.5px solid #c8e6c9',
    borderRadius: '6px', fontSize: '0.85rem', background: '#fff',
  },
  btnSmall: {
    padding: '0.35rem 0.8rem', background: '#2e7d32', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
  },
  btnDanger: {
    background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '0.85rem',
  },
  btn: {
    padding: '0.6rem 1.4rem', background: '#2e7d32', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
  },
  topRow: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' },
  weekInput: { padding: '0.6rem 1rem', border: '1.5px solid #c8e6c9', borderRadius: '8px', fontSize: '0.95rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
};

const getWeekDates = (weekStart) => {
  const start = new Date(weekStart);
  return DAYS.map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split('T')[0];
  });
};

const MealPlanner = () => {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  });

  const [days, setDays] = useState(() =>
    DAYS.map((name, i) => ({
      dayName: name,
      date: '',
      meals: [],
      _newMeal: { name: '', type: 'breakfast', calories: '' },
    }))
  );
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const loadWeekPlan = useCallback(async (week) => {
    try {
      const res = await api.get('/mealplans');
      const plan = res.data.find((p) => p.week && p.week.startsWith(week));
      const dates = getWeekDates(week);
      if (plan) {
        setExistingId(plan._id);
        setDays(
          DAYS.map((name, i) => {
            const dayData = plan.days.find((d) => d.date && d.date.startsWith(dates[i]));
            return {
              dayName: name,
              date: dates[i],
              meals: dayData ? dayData.meals : [],
              _newMeal: { name: '', type: 'breakfast', calories: '' },
            };
          })
        );
      } else {
        setExistingId(null);
        setDays(DAYS.map((name, i) => ({ dayName: name, date: dates[i], meals: [], _newMeal: { name: '', type: 'breakfast', calories: '' } })));
      }
    } catch {
      const dates = getWeekDates(week);
      setDays(DAYS.map((name, i) => ({ dayName: name, date: dates[i], meals: [], _newMeal: { name: '', type: 'breakfast', calories: '' } })));
    }
  }, []);

  useEffect(() => { loadWeekPlan(weekStart); }, [weekStart, loadWeekPlan]);

  const addMeal = (dayIdx) => {
    const day = days[dayIdx];
    if (!day._newMeal.name.trim()) return;
    const meal = { type: day._newMeal.type, name: day._newMeal.name, calories: Number(day._newMeal.calories) || 0 };
    const updated = [...days];
    updated[dayIdx] = { ...day, meals: [...day.meals, meal], _newMeal: { name: '', type: 'breakfast', calories: '' } };
    setDays(updated);
  };

  const removeMeal = (dayIdx, mealIdx) => {
    const updated = [...days];
    updated[dayIdx] = { ...updated[dayIdx], meals: updated[dayIdx].meals.filter((_, i) => i !== mealIdx) };
    setDays(updated);
  };

  const updateNewMeal = (dayIdx, field, value) => {
    const updated = [...days];
    updated[dayIdx] = { ...updated[dayIdx], _newMeal: { ...updated[dayIdx]._newMeal, [field]: value } };
    setDays(updated);
  };

  const savePlan = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        week: weekStart,
        days: days.map((d) => ({ date: d.date, meals: d.meals })),
      };
      if (existingId) {
        await api.put(`/mealplans/${existingId}`, payload);
      } else {
        const res = await api.post('/mealplans', payload);
        setExistingId(res.data._id);
      }
      setMessage({ type: 'success', text: 'Meal plan saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save meal plan' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Meal Planner</h1>

      <div style={styles.topRow}>
        <label style={{ color: '#2e7d32', fontWeight: 600 }}>
          Week starting:&nbsp;
          <input type="date" style={styles.weekInput} value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)} />
        </label>
        <button style={styles.btn} onClick={savePlan} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Plan'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
      )}

      <div style={styles.grid}>
        {days.map((day, dayIdx) => (
          <div key={day.dayName} style={styles.dayCard}>
            <div style={styles.dayTitle}>{day.dayName} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.8rem' }}>{day.date}</span></div>

            {MEAL_TYPES.map((type) => {
              const typeMeals = day.meals.filter((m) => m.type === type);
              return (
                <div key={type} style={styles.mealSection}>
                  <div style={styles.mealType}>{type}</div>
                  {typeMeals.map((meal, i) => {
                    const globalIdx = day.meals.indexOf(typeMeals[i]);
                    return (
                      <div key={i} style={styles.mealItem}>
                        <span>{meal.name}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ color: '#2e7d32', fontSize: '0.78rem' }}>{meal.calories} kcal</span>
                          <button style={styles.btnDanger} onClick={() => removeMeal(dayIdx, globalIdx)}>✕</button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <div style={styles.addMealRow}>
              <select style={styles.select} value={day._newMeal.type}
                onChange={(e) => updateNewMeal(dayIdx, 'type', e.target.value)}>
                {MEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input style={styles.input} placeholder="Meal name"
                value={day._newMeal.name} onChange={(e) => updateNewMeal(dayIdx, 'name', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMeal(dayIdx)} />
              <input style={{ ...styles.input, width: '60px', flex: 'none' }} placeholder="kcal" type="number"
                value={day._newMeal.calories} onChange={(e) => updateNewMeal(dayIdx, 'calories', e.target.value)} />
              <button style={styles.btnSmall} onClick={() => addMeal(dayIdx)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
