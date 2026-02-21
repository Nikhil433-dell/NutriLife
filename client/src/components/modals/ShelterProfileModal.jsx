import React from 'react';
import { OccupancyBar, MatchBadge, Tag, Btn } from '../shared';
import { getMatchScore } from '../../utils/helpers';
import { getStatusLabel } from '../../utils/statusHelpers';

const SERVICE_ICONS = {
  meals:         { icon: '🍽️', label: 'Meals' },
  beds:          { icon: '🛏️', label: 'Beds' },
  showers:       { icon: '🚿', label: 'Showers' },
  medical:       { icon: '🏥', label: 'Medical' },
  counseling:    { icon: '💬', label: 'Counseling' },
  childcare:     { icon: '👶', label: 'Childcare' },
  laundry:       { icon: '👕', label: 'Laundry' },
  'mental-health': { icon: '🧠', label: 'Mental Health' },
  'job-placement': { icon: '💼', label: 'Job Placement' },
  groceries:     { icon: '🛒', label: 'Groceries' },
  warming:       { icon: '🔥', label: 'Warming' },
  clothing:      { icon: '🧥', label: 'Clothing' },
};

/**
 * ShelterProfileModal – detailed view for a single shelter.
 *
 * @param {object}   props
 * @param {object}   props.shelter     - shelter data object
 * @param {boolean}  props.isOpen
 * @param {Function} props.onClose
 * @param {object}   [props.prefs={}]  - user preferences for match score
 * @param {boolean}  [props.isBookmarked=false]
 * @param {Function} [props.onBookmark]
 * @param {Function} [props.onCheckIn]
 */
function ShelterProfileModal({
  shelter,
  isOpen,
  onClose,
  prefs = {},
  isBookmarked = false,
  onBookmark,
  onCheckIn,
}) {
  if (!isOpen || !shelter) return null;

  const matchScore    = getMatchScore(shelter, prefs);
  const statusLabel   = getStatusLabel(shelter.current, shelter.capacity);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ width: '100%', maxWidth: 560, position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: '#fff',
            padding: '28px 28px 24px',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{shelter.name}</h2>
              <p style={{ opacity: 0.85, fontSize: 14 }}>📍 {shelter.address}</p>
            </div>
            <MatchBadge score={matchScore} />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          {/* Occupancy */}
          <div style={{ marginBottom: 20 }}>
            <OccupancyBar current={shelter.current} capacity={shelter.capacity} />
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
              {statusLabel}
            </p>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
            {shelter.description}
          </p>

          {/* Services */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Services Offered
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {shelter.services?.map((svc) => {
                const info = SERVICE_ICONS[svc] || { icon: '✅', label: svc };
                return (
                  <Tag key={svc} icon={info.icon}>
                    {info.label}
                  </Tag>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {shelter.tags?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Features
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {shelter.tags.map((tag) => (
                  <Tag key={tag}>{tag.replace(/-/g, ' ')}</Tag>
                ))}
              </div>
            </div>
          )}

          {/* Info Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              marginBottom: 24,
            }}
          >
            <InfoItem icon="⏰" label="Hours" value={shelter.hours} />
            <InfoItem icon="📞" label="Phone" value={shelter.phone} />
            <InfoItem icon="⭐" label="Rating" value={`${shelter.rating} / 5`} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn
              variant={isBookmarked ? 'secondary' : 'ghost'}
              onClick={() => onBookmark?.(shelter.id)}
              style={{ flex: 1 }}
            >
              {isBookmarked ? '🔖 Saved' : '🔖 Save'}
            </Btn>
            <Btn onClick={() => onCheckIn?.(shelter.id)} style={{ flex: 1 }}>
              📍 Check In
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}

export default ShelterProfileModal;
