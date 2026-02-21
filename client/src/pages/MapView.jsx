import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SHELTERS as FALLBACK_SHELTERS } from '../data/shelters';
import { shelterApi } from '../utils/api';
import { getMatchScore } from '../utils/helpers';
import { getStatusLabel } from '../utils/statusHelpers';
import { OccupancyBar, MatchBadge, Tag } from '../components/shared';
import { ShelterProfileModal } from '../components/modals';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Fit map bounds to show all markers (only on initial load)
function FitBounds({ shelters, skip }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (skip || hasFitted.current || shelters.length === 0) return;
    const bounds = L.latLngBounds(
      shelters.map((s) => [s.lat, s.lng])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
    hasFitted.current = true;
  }, [map, shelters, skip]);

  return null;
}

// Fly map to selected shelter when user clicks a card, marker, or "View details"
function MapFlyTo({ selectedShelter }) {
  const map = useMap();
  useEffect(() => {
    if (selectedShelter && selectedShelter.lat != null && selectedShelter.lng != null) {
      map.flyTo([selectedShelter.lat, selectedShelter.lng], 15, { duration: 0.5 });
    }
  }, [map, selectedShelter]);
  return null;
}

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
  const [shelters, setShelters] = useState(FALLBACK_SHELTERS);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [hasSelectedOnce, setHasSelectedOnce] = useState(false);

  useEffect(() => {
    shelterApi.getAll().then(setShelters).catch(() => {});
  }, []);

  const ALL_SERVICES = ['all', 'meals', 'beds', 'showers', 'medical', 'counseling', 'childcare'];

  const filteredShelters = useMemo(() => {
    return shelters.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterService === 'all' || s.services.includes(filterService);
      return matchesSearch && matchesFilter;
    }).sort((a, b) => getMatchScore(b, prefs) - getMatchScore(a, prefs));
  }, [shelters, searchQuery, filterService, prefs]);

  const handleSelectShelter = (shelter) => {
    setSelectedShelter(shelter);
    setHasSelectedOnce(true);
  };

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
                onSelect={() => handleSelectShelter(shelter)}
                onBookmark={() => onBookmark?.(shelter.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Map Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[44.9778, -93.2650]} // Minneapolis, MN coordinates
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds shelters={filteredShelters} skip={hasSelectedOnce} />
          <MapFlyTo selectedShelter={selectedShelter} />
          {filteredShelters.map((shelter) => (
            <Marker
              key={shelter.id}
              position={[shelter.lat, shelter.lng]}
              eventHandlers={{
                click: () => handleSelectShelter(shelter),
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    {shelter.name}
                  </h4>
                  <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    {shelter.address}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MatchBadge score={getMatchScore(shelter, prefs)} />
                    <span style={{ fontSize: 11, color: '#999' }}>
                      {shelter.distance} mi away
                    </span>
                  </div>
                  <OccupancyBar 
                    current={shelter.current} 
                    capacity={shelter.capacity} 
                    showLabel={true} 
                  />
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {shelter.services.slice(0, 3).map((svc) => (
                      <Tag key={svc} style={{ fontSize: 10, padding: '2px 6px' }}>{svc}</Tag>
                    ))}
                    {shelter.services.length > 3 && (
                      <Tag style={{ fontSize: 10, padding: '2px 6px' }}>+{shelter.services.length - 3}</Tag>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectShelter(shelter)}
                    style={{
                      marginTop: 8,
                      width: '100%',
                      padding: '6px 12px',
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View Details
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      marginTop: 6,
                      fontSize: 12,
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    🧭 Get directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      {/* Shelter Profile Modal */}
      <ShelterProfileModal
        shelter={selectedShelter}
        isOpen={!!selectedShelter}
        onClose={() => setSelectedShelter(null)}
        prefs={prefs}
        isBookmarked={selectedShelter ? bookmarks.includes(selectedShelter.id) : false}
        onBookmark={onBookmark}
        onGetDirections={(s) => {
          const dest = `${s.lat},${s.lng}`;
          const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
                window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}`, '_blank', 'noopener,noreferrer');
              },
              () => window.open(url, '_blank', 'noopener,noreferrer')
            );
          } else {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }}
      />
    </div>
  );
}

function ShelterCard({ shelter, prefs, isBookmarked, onSelect, onBookmark }) {
  const score = getMatchScore(shelter, prefs);

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
