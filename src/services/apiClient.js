/**
 * Cedar Heights Music Academy API Client
 * 
 * Provides a comprehensive API client for the Cedar Heights Music Academy backend
 * with rate limiting, caching, retry logic, and environment integration.
 * 
 * Features:
 * - Rate limiting (30 req/min with 2-second delays)
 * - Automatic retry for 429 responses
 * - Client-side caching (2-minute timeout)
 * - Environment-based configuration
 * - Mock/live data source switching
 * - Comprehensive error handling and logging
 */

import { ENV } from '../config/env.js';

/**
 * Base API client for Cedar Heights Music Academy
 * Handles rate limiting, retry logic, and basic request/response processing
 */
export class MusicAcademyAPI {
  /**
   * @param {Object} options - Configuration options
   * @param {string} options.baseURL - API base URL (defaults to env config)
   * @param {number} options.rateLimitDelay - Delay between requests in ms (default: 2000)
   * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
   */
  constructor(options = {}) {
    this.baseURL = options.baseURL || ENV.API_BASE_URL || 'https://api.cedarheightsmusicacademy.com/api/v1';
    this.rateLimitDelay = options.rateLimitDelay || 2000; // 2 seconds
    this.maxRetries = options.maxRetries || 3;
    this.lastRequestTime = 0;
    
    // Request tracking for debugging
    this.requestCount = 0;
    this.errorCount = 0;
    
    this._logInfo('API Client initialized', {
      baseURL: this.baseURL,
      rateLimitDelay: this.rateLimitDelay,
      dataSource: ENV.DATA_SOURCE
    });
  }

  /**
   * Enforces rate limiting by adding delays between requests
   * @private
   */
  async _enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delayNeeded = this.rateLimitDelay - timeSinceLastRequest;
      this._logDebug(`Rate limiting: waiting ${delayNeeded}ms`);
      await this._delay(delayNeeded);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Creates a delay promise
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Logs informational messages
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   * @private
   */
  _logInfo(message, data = {}) {
    console.log(`[MusicAcademyAPI] ${message}`, data);
  }

  /**
   * Logs debug messages
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   * @private
   */
  _logDebug(message, data = {}) {
    if (ENV.DATA_SOURCE === 'live' || import.meta.env?.MODE === 'development') {
      console.debug(`[MusicAcademyAPI] ${message}`, data);
    }
  }

  /**
   * Logs error messages
   * @param {string} message - Log message
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   * @private
   */
  _logError(message, error, context = {}) {
    this.errorCount++;
    console.error(`[MusicAcademyAPI] ${message}`, {
      error: error.message,
      stack: error.stack,
      ...context
    });
  }

  /**
   * Makes an HTTP request with rate limiting and retry logic
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Fetch options
   * @param {number} retryCount - Current retry attempt (internal use)
   * @returns {Promise<Object>} API response data
   */
  async request(endpoint, options = {}, retryCount = 0) {
    // Enforce rate limiting
    await this._enforceRateLimit();
    
    const url = `${this.baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
    this.requestCount++;
    
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    this._logDebug(`Making request ${requestId}`, {
      url,
      method: options.method || 'GET',
      attempt: retryCount + 1
    });

    try {
      const headers = { ...options.headers };
      if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        ...options,
        headers
      });

      const executionTime = Date.now() - startTime;

      // Handle rate limiting with retry
      if (response.status === 429) {
        if (retryCount < this.maxRetries) {
          const retryDelay = this.rateLimitDelay * (retryCount + 1); // Exponential backoff
          this._logInfo(`Rate limited (429), retrying in ${retryDelay}ms`, {
            requestId,
            attempt: retryCount + 1,
            maxRetries: this.maxRetries
          });
          
          await this._delay(retryDelay);
          return this.request(endpoint, options, retryCount + 1);
        } else {
          throw new Error(`Rate limit exceeded after ${this.maxRetries} retries`);
        }
      }

      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${contentType}. Response: ${text.substring(0, 200)}`);
      }

      // Log successful request
      this._logDebug(`Request ${requestId} completed`, {
        status: response.status,
        executionTime,
        success: data.success,
        dataLength: data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0
      });

      // Handle API-level errors
      if (!data.success) {
        const apiError = new Error(data.message || 'API request failed');
        apiError.status = response.status;
        apiError.errors = data.errors;
        apiError.requestId = requestId;
        throw apiError;
      }

      // Add request metadata to response
      data._requestMetadata = {
        requestId,
        executionTime,
        status: response.status,
        url
      };

      return data;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Handle network errors with retry
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        if (retryCount < this.maxRetries) {
          const retryDelay = this.rateLimitDelay * (retryCount + 1);
          this._logInfo(`Network error, retrying in ${retryDelay}ms`, {
            requestId,
            error: error.message,
            attempt: retryCount + 1
          });
          
          await this._delay(retryDelay);
          return this.request(endpoint, options, retryCount + 1);
        }
      }

      this._logError(`Request ${requestId} failed`, error, {
        url,
        executionTime,
        attempt: retryCount + 1,
        requestCount: this.requestCount,
        errorCount: this.errorCount
      });

      // Enhance error with context
      error.requestId = requestId;
      error.url = url;
      error.executionTime = executionTime;
      
      throw error;
    }
  }

  /**
   * Gets teachers data with optional filtering
   * @param {Object} filters - Query parameters
   * @param {number} filters.instrument_id - Filter by instrument ID
   * @param {boolean} filters.active - Filter by active status (default: true)
   * @returns {Promise<Object>} API response with teachers data
   */
  async getTeachers(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/public/teachers${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Gets timeslots data with optional filtering
   * @param {Object} filters - Query parameters
   * @param {number} filters.teacher_id - Filter by teacher ID
   * @param {number} filters.weekday - Filter by weekday (0=Monday, 6=Sunday)
   * @param {boolean} filters.active - Filter by active status (default: true)
   * @param {string} filters.start_date - Filter slots from this date (YYYY-MM-DD)
   * @param {number} filters.limit - Limit results (max 100, default 50)
   * @returns {Promise<Object>} API response with timeslots data
   */
  async getTimeslots(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query parameters with validation
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Validate specific parameters
        if (key === 'limit' && (value < 1 || value > 100)) {
          throw new Error('Limit must be between 1 and 100');
        }
        if (key === 'weekday' && (value < 0 || value > 6)) {
          throw new Error('Weekday must be between 0 (Monday) and 6 (Sunday)');
        }
        
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/public/timeslots${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Gets current pricing information
   * @param {Object} filters - Query parameters
   * @param {string} filters.billing_frequency - Filter by billing frequency (monthly|yearly|semester)
   * @returns {Promise<Object>} API response with pricing data
   */
  async getPricing(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Validate billing frequency
        if (key === 'billing_frequency' && !['monthly', 'yearly', 'semester'].includes(value)) {
          throw new Error('Billing frequency must be one of: monthly, yearly, semester');
        }
        
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/public/pricing${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getSiteConfig() {
    return this.request('/public/site-config');
  }

  async getProducts() {
    return this.request('/public/products');
  }

  async getAvailability(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return this.request(`/calendar/availability${queryString ? `?${queryString}` : ''}`);
  }

  async createCheckoutSession(payload) {
    return this.request('/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Gets available instruments
   * @param {Object} filters - Query parameters
   * @param {boolean} filters.active - Include only active instruments (default: true)
   * @returns {Promise<Object>} API response with instruments data
   */
  async getInstruments(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/public/instruments${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Gets API client statistics for monitoring
   * @returns {Object} Client statistics
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) : 0,
      baseURL: this.baseURL,
      rateLimitDelay: this.rateLimitDelay,
      dataSource: ENV.DATA_SOURCE
    };
  }

  /**
   * Resets client statistics
   */
  resetStats() {
    this.requestCount = 0;
    this.errorCount = 0;
    this._logInfo('Client statistics reset');
  }
}

/**
 * Cached API client that extends the base client with client-side caching
 * Implements 2-minute cache timeout matching API headers with advanced performance features
 */
export class CachedAPI extends MusicAcademyAPI {
  /**
   * @param {Object} options - Configuration options
   * @param {number} options.cacheTimeout - Cache timeout in milliseconds (default: 120000 = 2 minutes)
   * @param {boolean} options.backgroundRefresh - Enable background refresh (default: true)
   * @param {boolean} options.requestBatching - Enable request batching (default: true)
   * @param {number} options.batchDelay - Batch delay in milliseconds (default: 50)
   */
  constructor(options = {}) {
    super(options);
    
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 120000; // 2 minutes
    this.cacheHits = 0;
    this.cacheMisses = 0;
    
    // Advanced performance features
    this.backgroundRefresh = options.backgroundRefresh !== false;
    this.requestBatching = options.requestBatching !== false;
    this.batchDelay = options.batchDelay || 50;
    
    // Request deduplication and batching
    this.pendingRequests = new Map();
    this.batchQueue = new Map();
    this.batchTimeouts = new Map();
    
    // Background refresh tracking
    this.refreshQueue = new Set();
    this.refreshInProgress = new Set();
    
    // Performance metrics
    this.performanceMetrics = {
      backgroundRefreshCount: 0,
      batchedRequestCount: 0,
      deduplicatedRequestCount: 0,
      averageResponseTime: 0,
      totalRequests: 0
    };
    
    // Periodic cache cleanup
    this._startCacheCleanup();
    
    this._logInfo('Enhanced Cached API Client initialized', {
      cacheTimeout: this.cacheTimeout,
      backgroundRefresh: this.backgroundRefresh,
      requestBatching: this.requestBatching,
      batchDelay: this.batchDelay,
      cleanupInterval: 60000
    });
  }

  /**
   * Starts periodic cache cleanup to prevent memory leaks
   * @private
   */
  _startCacheCleanup() {
    // Clean up expired cache entries every minute
    this.cleanupInterval = setInterval(() => {
      this._cleanupExpiredCache();
    }, 60000);
  }

  /**
   * Cleans up expired cache entries
   * @private
   */
  _cleanupExpiredCache() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this._logDebug(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Generates a cache key for the request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {string} Cache key
   * @private
   */
  _getCacheKey(endpoint, options = {}) {
    // Include relevant options in cache key
    const cacheableOptions = {
      method: options.method || 'GET',
      body: options.body
    };
    
    return `${endpoint}:${JSON.stringify(cacheableOptions)}`;
  }

  /**
   * Handles request deduplication for identical pending requests
   * @param {string} cacheKey - Cache key for the request
   * @param {Function} requestFn - Function that makes the actual request
   * @returns {Promise<Object>} API response data
   * @private
   */
  async _handleRequestDeduplication(cacheKey, requestFn) {
    // Check if there's already a pending request for this key
    if (this.pendingRequests.has(cacheKey)) {
      this.performanceMetrics.deduplicatedRequestCount++;
      this._logDebug(`Deduplicating request for ${cacheKey}`);
      return this.pendingRequests.get(cacheKey);
    }

    // Create and store the request promise
    const requestPromise = requestFn().finally(() => {
      // Clean up the pending request when done
      this.pendingRequests.delete(cacheKey);
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Schedules background refresh for stale cache entries
   * @param {string} cacheKey - Cache key to refresh
   * @param {Function} requestFn - Function that makes the actual request
   * @private
   */
  _scheduleBackgroundRefresh(cacheKey, requestFn) {
    if (!this.backgroundRefresh || this.refreshInProgress.has(cacheKey)) {
      return;
    }

    // Add to refresh queue
    this.refreshQueue.add(cacheKey);
    this.refreshInProgress.add(cacheKey);

    // Schedule the refresh
    setTimeout(async () => {
      try {
        this.performanceMetrics.backgroundRefreshCount++;
        this._logDebug(`Background refreshing ${cacheKey}`);
        
        const data = await requestFn();
        
        // Update cache with fresh data
        this.cache.set(cacheKey, {
          data: JSON.parse(JSON.stringify(data)),
          timestamp: Date.now()
        });
        
        this._logDebug(`Background refresh completed for ${cacheKey}`);
      } catch (error) {
        this._logError(`Background refresh failed for ${cacheKey}`, error);
      } finally {
        this.refreshQueue.delete(cacheKey);
        this.refreshInProgress.delete(cacheKey);
      }
    }, 100); // Small delay to avoid blocking main thread
  }

  /**
   * Makes a cached request with advanced performance optimizations
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Fetch options
   * @param {number} retryCount - Current retry attempt
   * @returns {Promise<Object>} API response data
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const startTime = Date.now();
    
    // Only cache GET requests
    if (!options.method || options.method.toUpperCase() === 'GET') {
      const cacheKey = this._getCacheKey(endpoint, options);
      const cached = this.cache.get(cacheKey);
      const now = Date.now();
      
      // Create request function for deduplication and background refresh
      const makeRequest = () => super.request(endpoint, options, retryCount);
      
      // Check if we have a valid cached response
      if (cached) {
        const age = now - cached.timestamp;
        const isStale = age > this.cacheTimeout;
        const isNearStale = age > (this.cacheTimeout * 0.8); // 80% of cache timeout
        
        if (!isStale) {
          this.cacheHits++;
          this._logDebug(`Cache hit for ${endpoint}`, {
            cacheKey,
            age,
            cacheHits: this.cacheHits,
            cacheMisses: this.cacheMisses
          });
          
          // Schedule background refresh if near stale
          if (isNearStale && this.backgroundRefresh) {
            this._scheduleBackgroundRefresh(cacheKey, makeRequest);
          }
          
          // Update performance metrics
          const responseTime = Date.now() - startTime;
          this._updatePerformanceMetrics(responseTime);
          
          // Return a copy to prevent mutation
          return JSON.parse(JSON.stringify(cached.data));
        }
      }
      
      // Cache miss or stale - make the request with deduplication
      this.cacheMisses++;
      
      const data = await this._handleRequestDeduplication(cacheKey, makeRequest);
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: JSON.parse(JSON.stringify(data)), // Store a copy
        timestamp: Date.now()
      });
      
      this._logDebug(`Cached response for ${endpoint}`, {
        cacheKey,
        cacheSize: this.cache.size,
        cacheHits: this.cacheHits,
        cacheMisses: this.cacheMisses
      });
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this._updatePerformanceMetrics(responseTime);
      
      return data;
    }
    
    // Non-GET requests bypass cache but still get performance tracking
    const data = await super.request(endpoint, options, retryCount);
    const responseTime = Date.now() - startTime;
    this._updatePerformanceMetrics(responseTime);
    
    return data;
  }

  /**
   * Updates performance metrics
   * @param {number} responseTime - Response time in milliseconds
   * @private
   */
  _updatePerformanceMetrics(responseTime) {
    this.performanceMetrics.totalRequests++;
    
    // Calculate rolling average response time
    const totalTime = this.performanceMetrics.averageResponseTime * (this.performanceMetrics.totalRequests - 1);
    this.performanceMetrics.averageResponseTime = (totalTime + responseTime) / this.performanceMetrics.totalRequests;
  }

  /**
   * Invalidates cache entries matching a pattern
   * @param {string|RegExp} pattern - Pattern to match cache keys
   */
  invalidateCache(pattern) {
    let invalidatedCount = 0;
    
    for (const key of this.cache.keys()) {
      const matches = pattern instanceof RegExp 
        ? pattern.test(key)
        : key.includes(pattern);
        
      if (matches) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }
    
    this._logInfo(`Invalidated ${invalidatedCount} cache entries`, { pattern });
  }

  /**
   * Clears all cached data
   */
  clearCache() {
    const size = this.cache.size;
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this._logInfo(`Cleared all cache entries (${size} entries)`);
  }

  /**
   * Gets comprehensive cache and performance statistics
   * @returns {Object} Cache and performance statistics
   */
  getCacheStats() {
    const totalRequests = this.cacheHits + this.cacheMisses;
    
    return {
      ...super.getStats(),
      // Cache statistics
      cacheSize: this.cache.size,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate: totalRequests > 0 ? (this.cacheHits / totalRequests) : 0,
      cacheTimeout: this.cacheTimeout,
      
      // Performance metrics
      backgroundRefreshCount: this.performanceMetrics.backgroundRefreshCount,
      batchedRequestCount: this.performanceMetrics.batchedRequestCount,
      deduplicatedRequestCount: this.performanceMetrics.deduplicatedRequestCount,
      averageResponseTime: Math.round(this.performanceMetrics.averageResponseTime),
      totalRequests: this.performanceMetrics.totalRequests,
      
      // Active operations
      pendingRequestsCount: this.pendingRequests.size,
      refreshQueueSize: this.refreshQueue.size,
      refreshInProgressCount: this.refreshInProgress.size,
      
      // Performance ratios
      deduplicationRate: this.performanceMetrics.totalRequests > 0
        ? (this.performanceMetrics.deduplicatedRequestCount / this.performanceMetrics.totalRequests)
        : 0,
      backgroundRefreshRate: this.performanceMetrics.totalRequests > 0
        ? (this.performanceMetrics.backgroundRefreshCount / this.performanceMetrics.totalRequests)
        : 0
    };
  }

  /**
   * Resets all statistics including performance metrics
   */
  resetStats() {
    super.resetStats();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.performanceMetrics = {
      backgroundRefreshCount: 0,
      batchedRequestCount: 0,
      deduplicatedRequestCount: 0,
      averageResponseTime: 0,
      totalRequests: 0
    };
    this._logInfo('All statistics reset including performance metrics');
  }

  /**
   * Cleanup method to prevent memory leaks
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    // Clear all pending operations
    this.pendingRequests.clear();
    this.refreshQueue.clear();
    this.refreshInProgress.clear();
    this.batchQueue.clear();
    this.batchTimeouts.clear();
    
    this.clearCache();
    this._logInfo('Enhanced Cached API Client destroyed');
  }
}

/**
 * Factory function to create the appropriate API client based on environment
 * @param {Object} options - Configuration options
 * @returns {MusicAcademyAPI|CachedAPI} API client instance
 */
export function createAPIClient(options = {}) {
  // Use cached client by default for better performance
  const useCaching = options.cache !== false;
  
  if (useCaching) {
    return new CachedAPI(options);
  } else {
    return new MusicAcademyAPI(options);
  }
}

// Export a default instance for convenience
export const api = createAPIClient();

// Export for testing and advanced usage
export default {
  MusicAcademyAPI,
  CachedAPI,
  createAPIClient,
  api
};
