import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
    color: '#fff',
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 800,
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  heroSub: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
  },
  ctaContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: '#fff',
    color: '#2e7d32',
    padding: '0.9rem 2.2rem',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'inline-block',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#fff',
    padding: '0.9rem 2.2rem',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    border: '2px solid #fff',
    display: 'inline-block',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
    padding: '4rem 2rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(46,125,50,0.1)',
    border: '1px solid #c8e6c9',
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#2e7d32',
    marginBottom: '0.5rem',
  },
  cardText: {
    color: '#555',
    fontSize: '0.95rem',
  },
};

const features = [
  { icon: '🥗', title: 'Nutrition Tracking', text: 'Log your meals and monitor calories, protein, carbs, and fat daily.' },
  { icon: '📖', title: 'Recipe Library', text: 'Save and share your favourite healthy recipes with the community.' },
  { icon: '📅', title: 'Meal Planning', text: 'Plan your meals for the week to stay on track with your health goals.' },
  { icon: '📊', title: 'Progress Dashboard', text: 'Get a clear overview of your nutrition journey at a glance.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🥗 Welcome to NutriLife</h1>
        <p style={styles.heroSub}>
          Your personal nutrition companion. Track meals, discover recipes, and plan your week — all in one place.
        </p>
        <div style={styles.ctaContainer}>
          {user ? (
            <Link to="/dashboard" style={styles.btnPrimary}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" style={styles.btnPrimary}>Get Started Free</Link>
              <Link to="/login" style={styles.btnSecondary}>Login</Link>
            </>
          )}
        </div>
      </div>

      <div style={styles.features}>
        {features.map((f) => (
          <div key={f.title} style={styles.card}>
            <div style={styles.cardIcon}>{f.icon}</div>
            <h3 style={styles.cardTitle}>{f.title}</h3>
            <p style={styles.cardText}>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
