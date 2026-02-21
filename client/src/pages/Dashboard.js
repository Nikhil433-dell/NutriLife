import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  greeting: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#2e7d32',
  },
  sub: {
    color: '#555',
    marginTop: '0.3rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 16px rgba(46,125,50,0.1)',
    border: '1px solid #c8e6c9',
    textDecoration: 'none',
    display: 'block',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#2e7d32',
    marginBottom: '0.4rem',
  },
  cardText: {
    color: '#666',
    fontSize: '0.9rem',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginTop: '2rem',
  },
  stat: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    borderRadius: '12px',
    padding: '1.5rem',
    color: '#fff',
    textAlign: 'center',
  },
  statNum: {
    fontSize: '2rem',
    fontWeight: 800,
  },
  statLabel: {
    fontSize: '0.85rem',
    opacity: 0.85,
    marginTop: '0.2rem',
  },
};

const navItems = [
  { to: '/nutrition', icon: '🥗', title: 'Nutrition Tracker', text: "Log today's meals and track macros" },
  { to: '/recipes', icon: '📖', title: 'Recipes', text: 'Browse and add healthy recipes' },
  { to: '/mealplanner', icon: '📅', title: 'Meal Planner', text: 'Plan your meals for the week' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.greeting}>👋 Hello, {user?.name}!</h1>
        <p style={styles.sub}>{today} — Stay consistent, stay healthy.</p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statNum}>2,000</div>
          <div style={styles.statLabel}>Daily Calorie Goal</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNum}>150g</div>
          <div style={styles.statLabel}>Protein Goal</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNum}>250g</div>
          <div style={styles.statLabel}>Carbs Goal</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNum}>65g</div>
          <div style={styles.statLabel}>Fat Goal</div>
        </div>
      </div>

      <div style={styles.grid}>
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} style={styles.card}>
            <div style={styles.cardIcon}>{item.icon}</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardText}>{item.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
