/**
 * Environment configuration helpers (Phase 3)
 * - Uses Vite's import.meta.env
 * - Guards undefined values to avoid runtime crashes
 * - Includes API-specific configuration for rate limiting and caching
 * - Supports development/production switching
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

/**
 * getCacheTimeout()
 * Returns the cache timeout in milliseconds with a default of 2 minutes.
 * @returns {number}
 */
export function getCacheTimeout() {
  const raw = (import.meta.env && import.meta.env.VITE_CACHE_TIMEOUT) || '120000';
  const val = parseInt(raw, 10);
  return isNaN(val) || val < 0 ? 120000 : val; // Default 2 minutes
}

/**
 * getRateLimitDelay()
 * Returns the rate limit delay in milliseconds with a default of 2 seconds.
 * @returns {number}
 */
export function getRateLimitDelay() {
  const raw = (import.meta.env && import.meta.env.VITE_RATE_LIMIT_DELAY) || '2000';
  const val = parseInt(raw, 10);
  return isNaN(val) || val < 0 ? 2000 : val; // Default 2 seconds
}

/**
 * getEnvironmentMode()
 * Returns the current environment mode (development, production, test).
 * @returns {string}
 */
export function getEnvironmentMode() {
  return (import.meta.env && import.meta.env.MODE) || 'development';
}

/**
 * isDevelopment()
 * Returns true if running in development mode.
 * @returns {boolean}
 */
export function isDevelopment() {
  return getEnvironmentMode() === 'development';
}

/**
 * isProduction()
 * Returns true if running in production mode.
 * @returns {boolean}
 */
export function isProduction() {
  return getEnvironmentMode() === 'production';
}

/**
 * validateConfiguration()
 * Validates the current configuration and logs warnings for missing or invalid values.
 * @returns {Object} Validation results
 */
export function validateConfiguration() {
  const results = {
    valid: true,
    warnings: [],
    errors: []
  };

  // Check API base URL
  const apiUrl = getApiBaseUrl();
  if (!apiUrl && getDataSource() === 'live') {
    results.warnings.push('VITE_API_BASE_URL is not set but DATA_SOURCE is "live"');
    results.valid = false;
  }

  // Validate URL format if provided
  if (apiUrl) {
    try {
      new URL(apiUrl);
    } catch (error) {
      results.errors.push(`VITE_API_BASE_URL is not a valid URL: ${apiUrl}`);
      results.valid = false;
    }
  }

  // Check cache timeout
  const cacheTimeout = getCacheTimeout();
  if (cacheTimeout < 1000) {
    results.warnings.push(`Cache timeout is very low (${cacheTimeout}ms), consider increasing it`);
  }

  // Check rate limit delay
  const rateLimitDelay = getRateLimitDelay();
  if (rateLimitDelay < 100) {
    results.warnings.push(`Rate limit delay is very low (${rateLimitDelay}ms), may cause API issues`);
  }

  // Log results in development
  if (isDevelopment() && (results.warnings.length > 0 || results.errors.length > 0)) {
    console.group('[Config Validation]');
    
    if (results.errors.length > 0) {
      console.error('Configuration Errors:');
      results.errors.forEach(error => console.error(`  - ${error}`));
    }
    
    if (results.warnings.length > 0) {
      console.warn('Configuration Warnings:');
      results.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    console.groupEnd();
  }

  return results;
}

/**
 * getConfigSummary()
 * Returns a summary of the current configuration for debugging.
 * @returns {Object} Configuration summary
 */
export function getConfigSummary() {
  return {
    environment: getEnvironmentMode(),
    apiBaseUrl: getApiBaseUrl() || '(not set)',
    dataSource: getDataSource(),
    underMaintenance: getUnderMaintenance(),
    cacheTimeout: getCacheTimeout(),
    rateLimitDelay: getRateLimitDelay(),
    isDevelopment: isDevelopment(),
    isProduction: isProduction()
  };
}

// Main configuration object
export const ENV = {
  // Core settings
  API_BASE_URL: getApiBaseUrl(),
  DATA_SOURCE: getDataSource(),
  UNDER_MAINTENANCE: getUnderMaintenance(),
  
  // API configuration
  CACHE_TIMEOUT: getCacheTimeout(),
  RATE_LIMIT_DELAY: getRateLimitDelay(),
  
  // Environment info
  MODE: getEnvironmentMode(),
  IS_DEVELOPMENT: isDevelopment(),
  IS_PRODUCTION: isProduction(),
  
  // Validation
  CONFIG_VALID: validateConfiguration().valid
};

// Auto-validate configuration on import in development
if (isDevelopment()) {
  validateConfiguration();
}