import React, { useState } from 'react';
import { Avatar, Btn, Tag } from '../components/shared';

const NEED_OPTIONS = [
  { key: 'needsMeals',      label: '🍽️ Meals & Nutrition' },
  { key: 'needsShelter',    label: '🛏️ Overnight Shelter' },
  { key: 'needsMedical',    label: '🏥 Medical Assistance' },
  { key: 'needsCounseling', label: '💬 Counseling' },
  { key: 'needsChildcare',  label: '👶 Childcare' },
  { key: 'needsEmployment', label: '💼 Employment' },
];

const ACCESS_OPTIONS = [
  { key: 'requiresWheelchair',  label: '♿ Wheelchair Accessible' },
  { key: 'requiresPetFriendly', label: '🐾 Pet-Friendly' },
  { key: 'requiresFamily',      label: '👨‍👩‍👧 Family-Friendly' },
  { key: 'requiresVeteran',     label: '🎖️ Veterans Services' },
];

/**
 * UserProfilePage – lets the user view and edit their personal preferences.
 *
 * @param {object}   props
 * @param {object}   props.user
 * @param {object}   props.prefs
 * @param {Function} props.onPrefsChange - called with updated prefs object
 * @param {Function} props.onLogout
 */
function UserProfilePage({ user, prefs, onPrefsChange, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(prefs);

  const toggle = (key) => setDraft((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    onPrefsChange?.(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(prefs);
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: '32px 24px' }}>
        <Avatar name={user?.name || 'User'} size={80} style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{user?.name}</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 8 }}>{user?.email}</p>
        <Tag>{user?.role === 'admin' ? '⚙️ Admin' : '👤 Member'}</Tag>
      </div>

      {/* Preferences Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)' }}>My Preferences</h3>
          {!editing ? (
            <Btn size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit</Btn>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn size="sm" variant="ghost" onClick={handleCancel}>Cancel</Btn>
              <Btn size="sm" onClick={handleSave}>Save</Btn>
            </div>
          )}
        </div>

        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Resources I Need
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {NEED_OPTIONS.map(({ key, label }) => (
            <CheckRow
              key={key}
              label={label}
              checked={editing ? draft[key] : prefs[key]}
              disabled={!editing}
              onChange={() => toggle(key)}
            />
          ))}
        </div>

        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Accessibility
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACCESS_OPTIONS.map(({ key, label }) => (
            <CheckRow
              key={key}
              label={label}
              checked={editing ? draft[key] : prefs[key]}
              disabled={!editing}
              onChange={() => toggle(key)}
            />
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card">
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 16 }}>Account</h3>
        <Btn variant="ghost" onClick={onLogout} fullWidth>
          Sign Out
        </Btn>
      </div>
    </div>
  );
}

function CheckRow({ label, checked, disabled, onChange }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled && !checked ? 0.5 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={!!checked}
        disabled={disabled}
        onChange={onChange}
        style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: disabled ? 'default' : 'pointer' }}
      />
      <span style={{ fontSize: 14, color: 'var(--color-text)' }}>{label}</span>
    </label>
  );
}

export default UserProfilePage;
