/**
 * Unit tests for API Client
 * Tests the MusicAcademyAPI and CachedAPI classes with comprehensive coverage
 * of rate limiting, caching, retry logic, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MusicAcademyAPI, CachedAPI, createAPIClient } from '../../src/services/apiClient.js'

// Mock the ENV module
vi.mock('../../src/config/env.js', () => ({
  ENV: {
    API_BASE_URL: 'http://localhost:3001/api/v1',
    DATA_SOURCE: 'mock',
    UNDER_MAINTENANCE: false
  }
}))

describe('MusicAcademyAPI', () => {
  let api
  let mockFetch

  beforeEach(() => {
    // Reset fetch mock
    mockFetch = vi.fn()
    globalThis.fetch = mockFetch
    
    // Create fresh API instance
    api = new MusicAcademyAPI({
      baseURL: 'http://test-api.com/api/v1',
      rateLimitDelay: 100, // Shorter delay for tests
      maxRetries: 2
    })
    
    // Mock Date.now for consistent timing tests
    vi.spyOn(Date, 'now').mockReturnValue(1000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (api && typeof api.destroy === 'function') {
      api.destroy()
    }
  })

  describe('Constructor', () => {
    it('should initialize with default values', () => {
      const defaultApi = new MusicAcademyAPI()
      expect(defaultApi.baseURL).toBe('http://localhost:3001/api/v1')
      expect(defaultApi.rateLimitDelay).toBe(2000)
      expect(defaultApi.maxRetries).toBe(3)
    })

    it('should initialize with custom options', () => {
      const customApi = new MusicAcademyAPI({
        baseURL: 'https://custom.api.com',
        rateLimitDelay: 1000,
        maxRetries: 5
      })
      
      expect(customApi.baseURL).toBe('https://custom.api.com')
      expect(customApi.rateLimitDelay).toBe(1000)
      expect(customApi.maxRetries).toBe(5)
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limiting between requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          success: true,
          data: [],
          metadata: { execution_time_ms: 50 }
        })
      }
      
      mockFetch.mockResolvedValue(mockResponse)
      
      const startTime = Date.now()
      
      // First request
      await api.request('/test')
      
      // Advance time by 50ms (less than rate limit delay)
      vi.spyOn(Date, 'now').mockReturnValue(startTime + 50)
      
      // Second request should be delayed
      const promise = api.request('/test2')
      
      // Advance time to complete the delay
      vi.advanceTimersByTime(100)
      await promise
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should not delay if enough time has passed', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          success: true,
          data: [],
          metadata: { execution_time_ms: 50 }
        })
      }
      
      mockFetch.mockResolvedValue(mockResponse)
      
      // First request
      await api.request('/test')
      
      // Advance time beyond rate limit delay
      vi.advanceTimersByTime(200)
      
      // Second request should not be delayed
      await api.request('/test2')
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Request Method', () => {
    it('should make successful API request', async () => {
      const mockData = {
        success: true,
        data: [{ id: 1, name: 'Test Teacher' }],
        metadata: { execution_time_ms: 45 }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockData)
      })
      
      const result = await api.request('/public/teachers')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/v1/public/teachers',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'User-Agent': 'Cedar Heights Music Academy Frontend/1.0'
          })
        })
      )
      
      expect(result).toEqual(expect.objectContaining({
        success: true,
        data: [{ id: 1, name: 'Test Teacher' }],
        _requestMetadata: expect.objectContaining({
          status: 200,
          url: 'http://test-api.com/api/v1/public/teachers'
        })
      }))
    })

    it('should handle API-level errors', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'limit', message: 'Invalid limit' }]
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 400,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockErrorResponse)
      })
      
      await expect(api.request('/public/teachers')).rejects.toThrow('Validation failed')
    })

    it('should handle non-JSON responses', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/html']]),
        text: () => Promise.resolve('<html>Error page</html>')
      })
      
      await expect(api.request('/public/teachers')).rejects.toThrow('Unexpected response format')
    })
  })

  describe('Retry Logic', () => {
    it('should retry on 429 rate limit errors', async () => {
      // First call returns 429, second succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          headers: new Map([['content-type', 'application/json']]),
          json: () => Promise.resolve({ success: false, message: 'Rate limited' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: () => Promise.resolve({
            success: true,
            data: [],
            metadata: { execution_time_ms: 50 }
          })
        })
      
      const result = await api.request('/public/teachers')
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result.success).toBe(true)
    })

    it('should retry on network errors', async () => {
      // First call throws network error, second succeeds
      mockFetch
        .mockRejectedValueOnce(new TypeError('fetch failed'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: () => Promise.resolve({
            success: true,
            data: [],
            metadata: { execution_time_ms: 50 }
          })
        })
      
      const result = await api.request('/public/teachers')
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result.success).toBe(true)
    })

    it('should fail after max retries', async () => {
      // All calls return 429
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ success: false, message: 'Rate limited' })
      })
      
      await expect(api.request('/public/teachers')).rejects.toThrow('Rate limit exceeded after 2 retries')
      expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('Endpoint Methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          success: true,
          data: [],
          metadata: { execution_time_ms: 50 }
        })
      })
    })

    describe('getTeachers', () => {
      it('should call teachers endpoint without filters', async () => {
        await api.getTeachers()
        
        expect(mockFetch).toHaveBeenCalledWith(
          'http://test-api.com/api/v1/public/teachers',
          expect.any(Object)
        )
      })

      it('should call teachers endpoint with filters', async () => {
        await api.getTeachers({ instrument_id: 1, active: true })
        
        expect(mockFetch).toHaveBeenCalledWith(
          'http://test-api.com/api/v1/public/teachers?instrument_id=1&active=true',
          expect.any(Object)
        )
      })

      it('should ignore undefined filter values', async () => {
        await api.getTeachers({ instrument_id: 1, active: undefined, name: null })
        
        expect(mockFetch).toHaveBeenCalledWith(
          'http://test-api.com/api/v1/public/teachers?instrument_id=1',
          expect.any(Object)
        )
      })
    })

    describe('getTimeslots', () => {
      it('should call timeslots endpoint with filters', async () => {
        await api.getTimeslots({ teacher_id: 1, weekday: 1, limit: 20 })
        
        expect(mockFetch).toHaveBeenCalledWith(
          'http://test-api.com/api/v1/public/timeslots?teacher_id=1&weekday=1&limit=20',
          expect.any(Object)
        )
      })

      it('should validate limit parameter', async () => {
        await expect(api.getTimeslots({ limit: 101 })).rejects.toThrow('Limit must be between 1 and 100')
        await expect(api.getTimeslots({ limit: 0 })).rejects.toThrow('Limit must be between 1 and 100')
      })

      it('should validate weekday parameter', async () => {
        await expect(api.getTimeslots({ weekday: -1 })).rejects.toThrow('Weekday must be between 0 (Monday) and 6 (Sunday)')
        await expect(api.getTimeslots({ weekday: 7 })).rejects.toThrow('Weekday must be between 0 (Monday) and 6 (Sunday)')
      })
    })

    describe('getPricing', () => {
      it('should call pricing endpoint with filters', async () => {
        await api.getPricing({ billing_frequency: 'monthly' })
        
        expect(mockFetch).toHaveBeenCalledWith(
          'http://test-api.com/api/v1/public/pricing?billing_frequency=monthly',
          expect.any(Object)
        )
      })

      it('should validate billing_frequency parameter', async () => {
        await expect(api.getPricing({ billing_frequency: 'invalid' })).rejects.toThrow('Billing frequency must be one of: monthly, yearly, semester')
      })
    })

    describe('getInstruments', () => {
      it('should call instruments endpoint', async () => {
        await api.getInstruments({ active: true })
        
        expect(mockFetch).toHaveBeenCalledWith(
          'http://test-api.com/api/v1/public/instruments?active=true',
          expect.any(Object)
        )
      })
    })
  })

  describe('Statistics', () => {
    it('should track request and error counts', async () => {
      // Successful request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          success: true,
          data: [],
          metadata: { execution_time_ms: 50 }
        })
      })
      
      await api.request('/test')
      
      // Failed request
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      try {
        await api.request('/test2')
      } catch {
        // Expected to fail
      }
      
      const stats = api.getStats()
      expect(stats.requestCount).toBe(2)
      expect(stats.errorCount).toBe(1)
      expect(stats.errorRate).toBe(0.5)
    })

    it('should reset statistics', () => {
      api.requestCount = 5
      api.errorCount = 2
      
      api.resetStats()
      
      const stats = api.getStats()
      expect(stats.requestCount).toBe(0)
      expect(stats.errorCount).toBe(0)
      expect(stats.errorRate).toBe(0)
    })
  })
})

describe('CachedAPI', () => {
  let cachedApi
  let mockFetch

  beforeEach(() => {
    mockFetch = vi.fn()
    globalThis.fetch = mockFetch
    
    cachedApi = new CachedAPI({
      baseURL: 'http://test-api.com/api/v1',
      rateLimitDelay: 100,
      cacheTimeout: 1000 // 1 second for tests
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (cachedApi) {
      cachedApi.destroy()
    }
  })

  describe('Caching', () => {
    it('should cache GET requests', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: 'Test' }],
        metadata: { execution_time_ms: 50 }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })
      
      // First request
      const result1 = await cachedApi.request('/public/teachers')
      
      // Second request should use cache
      const result2 = await cachedApi.request('/public/teachers')
      
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result1).toEqual(result2)
      
      const stats = cachedApi.getCacheStats()
      expect(stats.cacheHits).toBe(1)
      expect(stats.cacheMisses).toBe(1)
    })

    it('should not cache non-GET requests', async () => {
      const mockResponse = {
        success: true,
        data: { message: 'Created' },
        metadata: { execution_time_ms: 50 }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })
      
      // POST request should not be cached
      await cachedApi.request('/api/data', { method: 'POST' })
      await cachedApi.request('/api/data', { method: 'POST' })
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
      
      const stats = cachedApi.getCacheStats()
      expect(stats.cacheHits).toBe(0)
      expect(stats.cacheMisses).toBe(0)
    })

    it('should expire cached entries', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: 'Test' }],
        metadata: { execution_time_ms: 50 }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })
      
      // First request
      await cachedApi.request('/public/teachers')
      
      // Advance time beyond cache timeout
      vi.advanceTimersByTime(1500)
      
      // Second request should not use expired cache
      await cachedApi.request('/public/teachers')
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Cache Management', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          success: true,
          data: [],
          metadata: { execution_time_ms: 50 }
        })
      })
      
      // Populate cache
      await cachedApi.request('/public/teachers')
      await cachedApi.request('/public/timeslots')
    })

    it('should invalidate cache by pattern', () => {
      cachedApi.invalidateCache('teachers')
      
      const stats = cachedApi.getCacheStats()
      expect(stats.cacheSize).toBe(1) // Only timeslots should remain
    })

    it('should invalidate cache by regex', () => {
      cachedApi.invalidateCache(/public/)
      
      const stats = cachedApi.getCacheStats()
      expect(stats.cacheSize).toBe(0)
    })

    it('should clear all cache', () => {
      cachedApi.clearCache()
      
      const stats = cachedApi.getCacheStats()
      expect(stats.cacheSize).toBe(0)
      expect(stats.cacheHits).toBe(0)
      expect(stats.cacheMisses).toBe(0)
    })
  })

  describe('Cache Cleanup', () => {
    it('should clean up expired entries automatically', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          success: true,
          data: [],
          metadata: { execution_time_ms: 50 }
        })
      })
      
      // Add entries to cache
      await cachedApi.request('/public/teachers')
      await cachedApi.request('/public/timeslots')
      
      expect(cachedApi.getCacheStats().cacheSize).toBe(2)
      
      // Advance time to expire entries
      vi.advanceTimersByTime(1500)
      
      // Trigger cleanup (normally runs every minute)
      vi.advanceTimersByTime(60000)
      
      expect(cachedApi.getCacheStats().cacheSize).toBe(0)
    })
  })
})

describe('createAPIClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create CachedAPI by default', () => {
    const client = createAPIClient()
    expect(client).toBeInstanceOf(CachedAPI)
    client.destroy()
  })

  it('should create MusicAcademyAPI when cache is disabled', () => {
    const client = createAPIClient({ cache: false })
    expect(client).toBeInstanceOf(MusicAcademyAPI)
    expect(client).not.toBeInstanceOf(CachedAPI)
  })

  it('should pass options to the client', () => {
    const client = createAPIClient({
      baseURL: 'https://custom.api.com',
      rateLimitDelay: 500
    })
    
    expect(client.baseURL).toBe('https://custom.api.com')
    expect(client.rateLimitDelay).toBe(500)
    client.destroy()
  })
})