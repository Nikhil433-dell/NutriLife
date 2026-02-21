import React from 'react';
import { Avatar, Btn } from '../shared';

const NAV_ITEMS = [
  { key: 'home',      label: '🏠 Home' },
  { key: 'map',       label: '🗺️ Map' },
  { key: 'dashboard', label: '📊 Dashboard' },
  { key: 'community', label: '💬 Community' },
];

/**
 * Navbar – top navigation bar.
 *
 * @param {object}   props
 * @param {string}   props.currentView          - active view key
 * @param {Function} props.onNavigate           - called with view key
 * @param {object|null} props.user              - logged-in user (or null)
 * @param {Function} props.onAuthOpen           - opens AuthModal
 * @param {Function} props.onLogout
 */
function Navbar({ currentView, onNavigate, user, onAuthOpen, onLogout }) {
  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <span>🌱</span>
        <span>NutriLife</span>
      </div>

      {/* Navigation */}
      <nav className="navbar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            className={`navbar__nav-btn${currentView === key ? ' navbar__nav-btn--active' : ''}`}
            onClick={() => onNavigate(key)}
            aria-current={currentView === key ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* User area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <button
              onClick={() => onNavigate('profile')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              aria-label="Your profile"
            >
              <Avatar name={user.name} size={34} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                {user.name.split(' ')[0]}
              </span>
            </button>
            <Btn variant="ghost" size="sm" onClick={onLogout}>
              Sign Out
            </Btn>
          </>
        ) : (
          <Btn size="sm" onClick={onAuthOpen}>
            Sign In
          </Btn>
        )}
      </div>
    </header>
  );
}

export default Navbar;
