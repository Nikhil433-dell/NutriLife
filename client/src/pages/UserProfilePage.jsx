import React, { useState, useEffect } from 'react';
import { Avatar, Btn, Tag } from '../components/shared';
import { ConnectionRequestModal } from '../components/modals';
import { userApi, connectionApi } from '../utils/api';

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

const TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'connect', label: 'Connect', icon: '🤝' },
];

/**
 * UserProfilePage – profile preferences and Connect tab to discover and connect with other users.
 */
function UserProfilePage({ user, prefs, onPrefsChange, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(prefs);

  // Connect tab state
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectLoading, setConnectLoading] = useState(false);
  const [requestModalUser, setRequestModalUser] = useState(null);

  useEffect(() => {
    if (activeTab === 'connect' && user?.id) {
      setConnectLoading(true);
      Promise.all([
        userApi.list(user.id).catch(() => []),
        connectionApi.list(user.id).catch(() => []),
      ])
        .then(([userList, connList]) => {
          setUsers(Array.isArray(userList) ? userList : []);
          setConnections(Array.isArray(connList) ? connList : []);
        })
        .finally(() => setConnectLoading(false));
    }
  }, [activeTab, user?.id]);

  const toggle = (key) => setDraft((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    onPrefsChange?.(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(prefs);
    setEditing(false);
  };

  const getConnectionStatus = (otherUserId) => {
    const sent = connections.find((c) => c.direction === 'sent' && c.toUserId === otherUserId);
    const received = connections.find((c) => c.direction === 'received' && c.fromUserId === otherUserId);
    if (sent) return { type: 'sent', status: sent.status };
    if (received) return { type: 'received', status: received.status };
    return null;
  };

  const handleSendRequest = async (message) => {
    await connectionApi.send({
      fromUserId: user.id,
      toUserId: requestModalUser.id,
      message,
    });
    const list = await connectionApi.list(user.id);
    setConnections(Array.isArray(list) ? list : []);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          padding: 4,
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--color-surface)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <>
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

          {/* Account */}
          <div className="card">
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 16 }}>Account</h3>
            <Btn variant="ghost" onClick={onLogout} fullWidth>
              Sign Out
            </Btn>
          </div>
        </>
      )}

      {activeTab === 'connect' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              🤝 Connect with the community
            </h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
              Find other NutriLife members, send a connection request with a message, and grow your support network.
            </p>
          </div>

          {connectLoading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              <p style={{ color: 'var(--color-text-muted)' }}>Loading members…</p>
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
              <p style={{ color: 'var(--color-text-muted)' }}>No other members to show yet. Invite friends to join NutriLife!</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Discover members
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {users.map((u) => {
                  const conn = getConnectionStatus(u.id);
                  return (
                    <div
                      key={u.id}
                      style={{
                        padding: 20,
                        background: 'var(--color-bg)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <Avatar name={u.name} size={52} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)', marginBottom: 2 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{u.email}</div>
                        {u.joinedAt && (
                          <div style={{ fontSize: 11, color: 'var(--color-text-light)' }}>
                            Member since {new Date(u.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {conn?.type === 'sent' && (
                          <Tag style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 600 }}>
                            {conn.status === 'pending' ? 'Request sent' : conn.status === 'accepted' ? 'Connected' : ''}
                          </Tag>
                        )}
                        {conn?.type === 'received' && conn.status === 'pending' && (
                          <Tag style={{ background: '#fff5e6', color: '#b45309', fontWeight: 600 }}>Wants to connect</Tag>
                        )}
                        {conn?.type === 'received' && conn.status === 'accepted' && (
                          <Tag style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 600 }}>Connected</Tag>
                        )}
                        {!conn && (
                          <Btn
                            size="sm"
                            onClick={() => setRequestModalUser(u)}
                          >
                            Connect
                          </Btn>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pending requests (received) */}
              {connections.filter((c) => c.direction === 'received' && c.status === 'pending').length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Requests for you
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {connections
                      .filter((c) => c.direction === 'received' && c.status === 'pending')
                      .map((c) => {
                        const fromUser = users.find((u) => u.id === c.fromUserId) || { name: 'Someone', email: '' };
                        return (
                          <div
                            key={c.id}
                            style={{
                              padding: 16,
                              background: 'var(--color-surface)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                              <Avatar name={fromUser.name} size={40} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{fromUser.name}</div>
                                {c.message && (
                                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.5 }}>"{c.message}"</p>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <Btn
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  await connectionApi.respond(c.id, 'rejected');
                                  const list = await connectionApi.list(user.id);
                                  setConnections(Array.isArray(list) ? list : []);
                                }}
                              >
                                Decline
                              </Btn>
                              <Btn
                                size="sm"
                                onClick={async () => {
                                  await connectionApi.respond(c.id, 'accepted');
                                  const list = await connectionApi.list(user.id);
                                  setConnections(Array.isArray(list) ? list : []);
                                }}
                              >
                                Accept
                              </Btn>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <ConnectionRequestModal
        isOpen={!!requestModalUser}
        targetUser={requestModalUser || {}}
        currentUserId={user?.id}
        onClose={() => setRequestModalUser(null)}
        onSend={handleSendRequest}
      />
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
