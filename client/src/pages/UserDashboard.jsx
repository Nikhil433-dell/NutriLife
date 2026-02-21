import React, { useState, useEffect } from 'react';
import { SHELTERS as FALLBACK_SHELTERS } from '../data/shelters';
import { shelterApi } from '../utils/api';
import { getMatchScore } from '../utils/helpers';
import { Avatar, Btn, OccupancyBar, MatchBadge, Tag } from '../components/shared';
import { ShelterProfileModal } from '../components/modals';

/**
 * UserDashboard – overview of a logged-in user's activity and bookmarks.
 *
 * @param {object}   props
 * @param {object}   props.user
 * @param {object}   props.prefs
 * @param {number[]} props.bookmarks
 * @param {Function} props.onBookmark
 * @param {Function} props.onNavigate
 */
function UserDashboard({ user, prefs = {}, bookmarks = [], onBookmark, onNavigate }) {
  const [shelters, setShelters] = useState(FALLBACK_SHELTERS);
  const [activeTab, setActiveTab]           = useState('overview');
  const [selectedShelter, setSelectedShelter] = useState(null);

  useEffect(() => {
    shelterApi.getAll().then(setShelters).catch(() => {});
  }, []);

  const savedShelters = shelters.filter((s) => bookmarks.includes(s.id));
  const topMatches    = [...shelters]
    .sort((a, b) => getMatchScore(b, prefs) - getMatchScore(a, prefs))
    .slice(0, 3);

  const TABS = ['overview', 'saved', 'history'];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          color: '#fff',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '28px 32px',
        }}
      >
        <Avatar name={user?.name || 'User'} size={64} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }} />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <p style={{ opacity: 0.85, fontSize: 14, marginTop: 4 }}>
            {savedShelters.length} saved shelter{savedShelters.length !== 1 ? 's' : ''} · Member since{' '}
            {user?.joinedAt ? new Date(user.joinedAt).getFullYear() : '2024'}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Btn
            onClick={() => onNavigate('profile')}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            Edit Profile
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              background: activeTab === tab ? 'var(--color-primary)' : 'var(--color-border)',
              color:      activeTab === tab ? '#fff' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>
            🎯 Top Matches for You
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {topMatches.map((shelter) => (
              <DashboardShelterCard
                key={shelter.id}
                shelter={shelter}
                prefs={prefs}
                isBookmarked={bookmarks.includes(shelter.id)}
                onSelect={() => setSelectedShelter(shelter)}
                onBookmark={() => onBookmark?.(shelter.id)}
              />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 28 }}>
            <StatCard icon="🔖" label="Saved Shelters" value={savedShelters.length} />
            <StatCard icon="📍" label="Check-ins" value={user?.checkIns?.length ?? 0} />
            <StatCard icon="🌟" label="Avg Match Score" value={`${Math.round(topMatches.reduce((s, sh) => s + getMatchScore(sh, prefs), 0) / (topMatches.length || 1))}%`} />
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>
            🔖 Saved Shelters ({savedShelters.length})
          </h3>
          {savedShelters.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔖</div>
              <p style={{ color: 'var(--color-text-muted)' }}>No saved shelters yet.</p>
              <Btn onClick={() => onNavigate('map')} style={{ marginTop: 16 }}>
                Explore the Map
              </Btn>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {savedShelters.map((shelter) => (
                <DashboardShelterCard
                  key={shelter.id}
                  shelter={shelter}
                  prefs={prefs}
                  isBookmarked
                  onSelect={() => setSelectedShelter(shelter)}
                  onBookmark={() => onBookmark?.(shelter.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Check-in history will appear here once you've visited shelters.
          </p>
        </div>
      )}

      <ShelterProfileModal
        shelter={selectedShelter}
        isOpen={!!selectedShelter}
        onClose={() => setSelectedShelter(null)}
        prefs={prefs}
        isBookmarked={selectedShelter ? bookmarks.includes(selectedShelter.id) : false}
        onBookmark={onBookmark}
      />
    </div>
  );
}

function DashboardShelterCard({ shelter, prefs, isBookmarked, onSelect, onBookmark }) {
  const score = getMatchScore(shelter, prefs);
  return (
    <div className="card" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>{shelter.name}</h4>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-light)' }}
        >
          {isBookmarked ? '🔖' : '🏷️'}
        </button>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>📍 {shelter.address}</p>
      <MatchBadge score={score} />
      <div style={{ marginTop: 12 }}>
        <OccupancyBar current={shelter.current} capacity={shelter.capacity} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default UserDashboard;
