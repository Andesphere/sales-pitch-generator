// API client for Convex HTTP endpoints
const API_BASE = 'https://flippant-dodo-971.convex.site';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response data
 */
async function apiFetch(endpoint, options = {}) {
  const url = new URL(endpoint, API_BASE);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

/**
 * Fetch pipeline statistics
 */
export async function fetchStats() {
  return apiFetch('/api/stats');
}

/**
 * Fetch prospects with optional filters
 * @param {Object} filters - { status?, isLocal?, limit? }
 */
export async function fetchProspects(filters = {}) {
  return apiFetch('/api/prospects', { params: filters });
}

/**
 * Fetch pitches with optional filters
 * @param {Object} filters - { industry?, isLocal?, website?, limit? }
 */
export async function fetchPitches(filters = {}) {
  return apiFetch('/api/pitches', { params: filters });
}

/**
 * Fetch searches with optional filters
 * @param {Object} filters - { limit? }
 */
export async function fetchSearches(filters = {}) {
  return apiFetch('/api/searches', { params: filters });
}
