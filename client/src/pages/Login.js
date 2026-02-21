import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(46,125,50,0.12)',
    border: '1px solid #c8e6c9',
  },
  title: {
    color: '#2e7d32',
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#777',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '0.95rem',
  },
  formGroup: {
    marginBottom: '1.2rem',
  },
  label: {
    display: 'block',
    color: '#2e7d32',
    fontWeight: 600,
    marginBottom: '0.4rem',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid #c8e6c9',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 700,
    marginTop: '0.5rem',
    cursor: 'pointer',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#777',
    fontSize: '0.9rem',
  },
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🥗 Welcome Back</h2>
        <p style={styles.subtitle}>Login to your NutriLife account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
