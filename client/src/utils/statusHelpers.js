/**
 * Returns a CSS variable name for the shelter's occupancy status colour.
 *
 * @param {number} current   - current occupants
 * @param {number} capacity  - total capacity
 * @returns {'--color-success' | '--color-warning' | '--color-danger'}
 */
export function getStatusColor(current, capacity) {
  const ratio = current / capacity;
  if (ratio < 0.6) return '--color-success';
  if (ratio < 0.85) return '--color-warning';
  return '--color-danger';
}

/**
 * Returns a human-readable availability label.
 *
 * @param {number} current
 * @param {number} capacity
 * @returns {string}
 */
export function getStatusLabel(current, capacity) {
  const available = capacity - current;
  const ratio     = current / capacity;

  if (ratio >= 1) return 'Full';
  if (ratio >= 0.85) return `Almost full (${available} left)`;
  if (ratio >= 0.6) return `Limited (${available} spots)`;
  return `Available (${available} spots)`;
}

/**
 * Returns a MatchBadge variant key based on a numeric score.
 *
 * @param {number} score - 0–100
 * @returns {'high' | 'medium' | 'low'}
 */
export function getMatchVariant(score) {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

/**
 * Returns a short label for a match score.
 *
 * @param {number} score
 * @returns {string}
 */
export function getMatchLabel(score) {
  return `${score}% Match`;
}
