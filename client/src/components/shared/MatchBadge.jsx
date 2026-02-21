import React from 'react';
import { getMatchVariant } from '../../utils/statusHelpers';

/**
 * MatchBadge – displays a colour-coded match percentage for a shelter.
 *
 * @param {object} props
 * @param {number} props.score   - 0–100
 * @param {string} [props.className]
 */
function MatchBadge({ score, className = '' }) {
  const variant = getMatchVariant(score);

  return (
    <span className={`match-badge match-badge-${variant} ${className}`}>
      ⭐ {score}% Match
    </span>
  );
}

export default MatchBadge;
