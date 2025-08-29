/**
 * Environment configuration helpers (Phase 1)
 * - Uses Vite's import.meta.env
 * - Guards undefined values to avoid runtime crashes
 */

/**
 * getApiBaseUrl()
 * Returns the configured API base URL or an empty string in dev if missing.
 * @returns {string}
 */
export function getApiBaseUrl() {
  const raw = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';
  if (typeof raw !== 'string' || raw.trim() === '') {
    if ((import.meta.env && import.meta.env.MODE) !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[config] VITE_API_BASE_URL is not set; live fetchers should be disabled.');
    }
    return '';
  }
  return raw;
}

/**
 * getDataSource()
 * Returns 'mock' | 'live' with a safe default of 'mock'.
 * @returns {'mock'|'live'}
 */
export function getDataSource() {
  const raw = (import.meta.env && import.meta.env.VITE_DATA_SOURCE) || 'mock';
  const val = String(raw).toLowerCase();
  return val === 'live' ? 'live' : 'mock';
}

/**
 * getUnderMaintenance()
 * Returns true if the application is in maintenance mode.
 * @returns {boolean}
 */
export function getUnderMaintenance() {
  const raw = (import.meta.env && import.meta.env.VITE_UNDER_MAINTENANCE) || 'false';
  const val = String(raw).toLowerCase();
  return val === 'true' || val === '1';
}

export const ENV = {
  API_BASE_URL: getApiBaseUrl(),
  DATA_SOURCE: getDataSource(),
  UNDER_MAINTENANCE: getUnderMaintenance(),
};