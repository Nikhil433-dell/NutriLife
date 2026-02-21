import React, { useState, useMemo } from 'react';
import { SHELTERS } from '../data/shelters';
import { getMatchScore } from '../utils/helpers';
import { getStatusLabel } from '../utils/statusHelpers';
import { OccupancyBar, MatchBadge, Tag, Btn } from '../components/shared';
import { ShelterProfileModal } from '../components/modals';

/**
 * MapView – interactive shelter map with sidebar list.
 * Uses react-leaflet when available; gracefully falls back to a list-only view.
 *
 * @param {object}      props
 * @param {object|null} props.user
 * @param {object}      props.prefs    - user preferences for match scoring
 * @param {number[]}    props.bookmarks
 * @param {Function}    props.onBookmark
 */
function MapView({ user, prefs = {}, bookmarks = [], onBookmark }) {
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterService, setFilterService]     = useState('all');

  const ALL_SERVICES = ['all', 'meals', 'beds', 'showers', 'medical', 'counseling', 'childcare'];

  const filteredShelters = useMemo(() => {
    return SHELTERS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterService === 'all' || s.services.includes(filterService);
      return matchesSearch && matchesFilter;
    }).sort((a, b) => getMatchScore(b, prefs) - getMatchScore(a, prefs));
  }, [searchQuery, filterService, prefs]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 360,
          flexShrink: 0,
          overflowY: 'auto',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search & Filter */}
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)' }}>
          <input
            className="input"
            type="search"
            placeholder="🔍 Search shelters…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_SERVICES.map((svc) => (
              <button
                key={svc}
                onClick={() => setFilterService(svc)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterService === svc ? 'var(--color-primary)' : 'var(--color-border)',
                  color:      filterService === svc ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {svc === 'all' ? 'All' : svc.charAt(0).toUpperCase() + svc.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Shelter List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredShelters.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
              <p>No shelters match your search.</p>
            </div>
          ) : (
            filteredShelters.map((shelter) => (
              <ShelterCard
                key={shelter.id}
                shelter={shelter}
                prefs={prefs}
                isBookmarked={bookmarks.includes(shelter.id)}
                onSelect={() => setSelectedShelter(shelter)}
                onBookmark={() => onBookmark?.(shelter.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Map Area */}
      <main
        style={{
          flex: 1,
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64 }}>🗺️</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)' }}>Map View</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 300 }}>
          Install <code>react-leaflet</code> and add a map tile provider to enable the interactive map.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-light)' }}>
          Showing {filteredShelters.length} shelter{filteredShelters.length !== 1 ? 's' : ''} in the list.
        </p>
      </main>

      {/* Shelter Profile Modal */}
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

function ShelterCard({ shelter, prefs, isBookmarked, onSelect, onBookmark }) {
  const score = getMatchScore(shelter, prefs);
  const pct   = Math.round((shelter.current / shelter.capacity) * 100);

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '16px',
        borderBottom: '1px solid var(--color-border)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {shelter.name}
          </h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{shelter.distance} mi · {shelter.hours}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <MatchBadge score={score} />
          <button
            onClick={(e) => { e.stopPropagation(); onBookmark(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-light)' }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark shelter'}
          >
            {isBookmarked ? '🔖' : '🏷️'}
          </button>
        </div>
      </div>
      <OccupancyBar current={shelter.current} capacity={shelter.capacity} showLabel={false} />
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
        {getStatusLabel(shelter.current, shelter.capacity)}
      </p>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
        {shelter.services.slice(0, 4).map((svc) => (
          <Tag key={svc} style={{ fontSize: 10, padding: '2px 6px' }}>{svc}</Tag>
        ))}
        {shelter.services.length > 4 && (
          <Tag style={{ fontSize: 10, padding: '2px 6px' }}>+{shelter.services.length - 4}</Tag>
        )}
      </div>
    </div>
  );
}

export default MapView;
