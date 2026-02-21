import React, { useState } from 'react';
import Btn from '../shared/Btn';

/**
 * AuthModal – login / register overlay.
 *
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onLogin    - called with { email, password }
 * @param {Function} props.onRegister - called with { name, email, password }
 */
function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [tab, setTab]           = useState('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (!isOpen) return null;

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (tab === 'login') {
      onLogin?.({ email, password });
    } else {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      onRegister?.({ name, email, password });
    }

    reset();
    onClose();
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ width: '100%', maxWidth: 420, padding: 32, position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏠</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            {tab === 'login'
              ? 'Sign in to access your saved shelters and preferences.'
              : 'Join NutriLife to save shelters and personalise your experience.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                background: tab === t ? 'var(--color-primary)' : 'var(--color-border)',
                color: tab === t ? '#fff' : 'var(--color-text-muted)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {tab === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 12 }}>
              {error}
            </p>
          )}

          <Btn type="submit" fullWidth>
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </Btn>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
