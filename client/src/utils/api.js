const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with JSON serialisation and error handling.
 *
 * @param {string} endpoint - relative API path (e.g. '/shelters')
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`API error ${response.status}: ${message}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ---------- Shelter endpoints ----------

export const shelterApi = {
  getAll: ()          => request('/shelters'),
  getById: (id)       => request(`/shelters/${id}`),
  search: (query)     => request(`/shelters/search?q=${encodeURIComponent(query)}`),
  checkIn: (id, data) => request(`/shelters/${id}/checkin`, { method: 'POST', body: JSON.stringify(data) }),
};

// ---------- User endpoints ----------

export const userApi = {
  login:          (credentials) => request('/auth/login',  { method: 'POST', body: JSON.stringify(credentials) }),
  register:       (data)        => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile:     (id)          => request(`/users/${id}`),
  updateProfile:  (id, data)    => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getBookmarks:   (id)          => request(`/users/${id}/bookmarks`),
  addBookmark:    (id, shId)    => request(`/users/${id}/bookmarks`, { method: 'POST', body: JSON.stringify({ shelterId: shId }) }),
  removeBookmark: (id, shId)    => request(`/users/${id}/bookmarks/${shId}`, { method: 'DELETE' }),
};

// ---------- Admin endpoints ----------

export const adminApi = {
  getInventory:       ()         => request('/admin/inventory'),
  updateInventory:    (id, data) => request(`/admin/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getDistributions:   ()         => request('/admin/distributions'),
  createDistribution: (data)     => request('/admin/distributions', { method: 'POST', body: JSON.stringify(data) }),
};
