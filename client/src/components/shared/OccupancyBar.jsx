import React from 'react';

/**
 * OccupancyBar – visualises how full a shelter is.
 *
 * @param {object} props
 * @param {number} props.current   - number of current occupants
 * @param {number} props.capacity  - total capacity
 * @param {boolean} [props.showLabel=true]
 * @param {string}  [props.className]
 */
function OccupancyBar({ current, capacity, showLabel = true, className = '' }) {
  const pct     = Math.min(100, Math.round((current / capacity) * 100));
  const variant = pct < 60 ? 'low' : pct < 85 ? 'medium' : 'high';

  return (
    <div className={`occupancy-bar ${className}`}>
      {showLabel && (
        <div className="occupancy-bar__label">
          <span>Occupancy</span>
          <span>
            {current} / {capacity} ({pct}%)
          </span>
        </div>
      )}
      <div className="occupancy-bar__track">
        <div
          className={`occupancy-bar__fill occupancy-bar__fill--${variant}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default OccupancyBar;
