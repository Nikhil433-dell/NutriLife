/**
 * Compute a match score (0–100) between a shelter and the user's preferences.
 *
 * @param {object} shelter
 * @param {object} prefs
 * @returns {number}
 */
export function getMatchScore(shelter, prefs = {}) {
  let score = 50;

  if (prefs.needsMeals && shelter.services?.includes('meals'))       score += 15;
  if (prefs.needsShelter && shelter.services?.includes('beds'))       score += 15;
  if (prefs.needsMedical && shelter.services?.includes('medical'))    score += 10;
  if (prefs.needsCounseling && shelter.services?.includes('counseling')) score += 10;
  if (prefs.needsChildcare && shelter.services?.includes('childcare')) score += 10;
  if (prefs.needsEmployment && shelter.services?.includes('job-placement')) score += 10;

  if (prefs.requiresWheelchair && shelter.tags?.includes('accessible'))      score += 5;
  if (prefs.requiresPetFriendly && shelter.tags?.includes('pet-friendly'))   score += 5;
  if (prefs.requiresFamily && shelter.tags?.includes('family-friendly'))     score += 5;
  if (prefs.requiresVeteran && shelter.tags?.includes('veterans-only'))      score += 10;

  const occupancy = shelter.current / shelter.capacity;
  if (occupancy < 0.5) score += 10;
  else if (occupancy > 0.9) score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Format an ISO date string as a human-readable relative label.
 *
 * @param {string} isoString
 * @returns {string}
 */
export function daysUntil(isoString) {
  const now  = new Date();
  const date = new Date(isoString);
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a distance in miles.
 */
export function formatDistance(miles) {
  if (miles < 0.1) return 'Nearby';
  return `${miles.toFixed(1)} mi`;
}

/**
 * Truncate a string to maxLength characters, appending '…' if needed.
 */
export function truncate(str = '', maxLength = 100) {
  return str.length > maxLength ? str.slice(0, maxLength - 1) + '…' : str;
}
