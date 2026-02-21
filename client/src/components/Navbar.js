import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 700,
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#c8e6c9',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  btn: {
    background: '#fff',
    color: '#2e7d32',
    border: 'none',
    padding: '0.4rem 1.2rem',
    borderRadius: '20px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🥗 NutriLife</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/nutrition" style={styles.link}>Nutrition</Link>
            <Link to="/recipes" style={styles.link}>Recipes</Link>
            <Link to="/mealplanner" style={styles.link}>Meal Planner</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={{ ...styles.link, ...styles.btn, color: '#2e7d32' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
