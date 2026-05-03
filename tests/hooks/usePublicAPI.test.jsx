/**
 * Integration tests for React Query hooks
 * Tests the usePublicAPI hooks with React Query integration,
 * data transformation, loading states, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import {
  useTeachers,
  useTimeslots,
  usePricing,
  useInstruments,
  useTeacherTimeslots,
  useNextAvailableSlots,
  useInvalidateQueries,
  usePrefetchQueries,
  useAPIStats,
  queryKeys
} from '../../src/hooks/usePublicAPI.js'

// Mock the API client
vi.mock('../../src/services/apiClient.js', () => {
  const mockApi = {
    getTeachers: vi.fn(),
    getTimeslots: vi.fn(),
    getPricing: vi.fn(),
    getInstruments: vi.fn(),
    getStats: vi.fn(),
    getCacheStats: vi.fn(),
    resetStats: vi.fn()
  }
  
  return {
    api: mockApi
  }
})

import { api } from '../../src/services/apiClient.js'

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('usePublicAPI Hooks', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useTeachers', () => {
    it('should fetch teachers data successfully', async () => {
      const mockTeachersData = [
        {
          id: 1,
          name: 'John Smith',
          bio: 'Experienced piano instructor',
          instruments: ['Piano', 'Guitar'],
          availability_summary: {
            total_slots: 20,
            available_slots: 15,
            next_available: '2025-10-26T10:00:00Z'
          }
        }
      ]

      api.getTeachers.mockResolvedValue({
        success: true,
        data: mockTeachersData,
        metadata: { execution_time_ms: 45 }
      })

      const { result } = renderHook(() => useTeachers(), { wrapper })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTeachersData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(api.getTeachers).toHaveBeenCalledWith({})
    })

    it('should fetch teachers with filters', async () => {
      const filters = { instrument_id: 1, active: true }
      
      api.getTeachers.mockResolvedValue({
        success: true,
        data: [],
        metadata: { execution_time_ms: 45 }
      })

      const { result } = renderHook(() => useTeachers(filters), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getTeachers).toHaveBeenCalledWith(filters)
    })

    it('should handle teachers fetch error', async () => {
      const error = new Error('API Error')
      api.getTeachers.mockRejectedValue(error)

      const { result } = renderHook(() => useTeachers(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(error)
      expect(result.current.data).toBeUndefined()
    })

    it('should use correct query key', () => {
      const filters = { instrument_id: 1 }
      const key = queryKeys.teachers(filters)
      
      expect(key).toEqual(['teachers', filters])
    })
  })

  describe('useTimeslots', () => {
    it('should fetch timeslots data successfully', async () => {
      const mockTimeslotsData = [
        {
          id: 1,
          teacher_id: 1,
          weekday: 1,
          start_time: '10:00',
          end_time: '10:30',
          duration: 30,
          next_available_date: '2025-10-28'
        }
      ]

      api.getTimeslots.mockResolvedValue({
        success: true,
        data: mockTimeslotsData,
        metadata: { execution_time_ms: 118 }
      })

      const { result } = renderHook(() => useTimeslots(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTimeslotsData)
      expect(api.getTimeslots).toHaveBeenCalledWith({})
    })

    it('should fetch timeslots with filters', async () => {
      const filters = { teacher_id: 1, weekday: 1, limit: 20 }
      
      api.getTimeslots.mockResolvedValue({
        success: true,
        data: [],
        metadata: { execution_time_ms: 118 }
      })

      const { result } = renderHook(() => useTimeslots(filters), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getTimeslots).toHaveBeenCalledWith(filters)
    })
  })

  describe('usePricing', () => {
    it('should fetch pricing data successfully', async () => {
      const mockPricingData = {
        base_monthly_price: 125.0,
        currency: 'CAD',
        current_semester: {
          id: 1,
          name: 'Fall 2025',
          start_date: '2025-09-01',
          end_date: '2025-12-15'
        }
      }

      api.getPricing.mockResolvedValue({
        success: true,
        data: mockPricingData,
        metadata: { execution_time_ms: 113 }
      })

      const { result } = renderHook(() => usePricing(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockPricingData)
      expect(api.getPricing).toHaveBeenCalledWith({})
    })

    it('should fetch pricing with billing frequency filter', async () => {
      const filters = { billing_frequency: 'monthly' }
      
      api.getPricing.mockResolvedValue({
        success: true,
        data: {},
        metadata: { execution_time_ms: 113 }
      })

      const { result } = renderHook(() => usePricing(filters), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getPricing).toHaveBeenCalledWith(filters)
    })
  })

  describe('useInstruments', () => {
    it('should fetch instruments data successfully', async () => {
      const mockInstrumentsData = [
        {
          id: 1,
          name: 'Piano',
          display_name: 'Piano',
          sort_order: 1
        },
        {
          id: 2,
          name: 'Guitar',
          display_name: 'Guitar',
          sort_order: 2
        }
      ]

      api.getInstruments.mockResolvedValue({
        success: true,
        data: mockInstrumentsData,
        metadata: { execution_time_ms: 2 }
      })

      const { result } = renderHook(() => useInstruments(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockInstrumentsData)
      expect(api.getInstruments).toHaveBeenCalledWith({})
    })
  })

  describe('useTeacherTimeslots', () => {
    it('should fetch timeslots for specific teacher', async () => {
      const teacherId = 1
      const additionalFilters = { weekday: 1 }
      
      api.getTimeslots.mockResolvedValue({
        success: true,
        data: [],
        metadata: { execution_time_ms: 118 }
      })

      const { result } = renderHook(
        () => useTeacherTimeslots(teacherId, additionalFilters),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(api.getTimeslots).toHaveBeenCalledWith({
        teacher_id: teacherId,
        ...additionalFilters
      })
    })

    it('should not fetch when teacherId is not provided', () => {
      const { result } = renderHook(
        () => useTeacherTimeslots(null),
        { wrapper }
      )

      expect(result.current.fetchStatus).toBe('idle')
      expect(api.getTimeslots).not.toHaveBeenCalled()
    })
  })

  describe('useNextAvailableSlots', () => {
    it('should fetch and sort next available slots', async () => {
      const mockTimeslots = [
        {
          id: 2,
          next_available_date: '2025-10-30'
        },
        {
          id: 1,
          next_available_date: '2025-10-28'
        },
        {
          id: 3,
          next_available_date: '2025-10-29'
        }
      ]

      api.getTimeslots.mockResolvedValue({
        success: true,
        data: mockTimeslots,
        metadata: { execution_time_ms: 118 }
      })

      const { result } = renderHook(() => useNextAvailableSlots(10), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Should be sorted by next_available_date
      expect(result.current.data).toEqual([
        { id: 1, next_available_date: '2025-10-28' },
        { id: 3, next_available_date: '2025-10-29' },
        { id: 2, next_available_date: '2025-10-30' }
      ])

      expect(api.getTimeslots).toHaveBeenCalledWith({
        start_date: expect.any(String), // Today's date
        limit: 10,
        active: true
      })
    })

    it('should handle slots without next_available_date', async () => {
      const mockTimeslots = [
        { id: 1, next_available_date: '2025-10-28' },
        { id: 2 }, // No next_available_date
        { id: 3, next_available_date: null }
      ]

      api.getTimeslots.mockResolvedValue({
        success: true,
        data: mockTimeslots,
        metadata: { execution_time_ms: 118 }
      })

      const { result } = renderHook(() => useNextAvailableSlots(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Should handle missing dates gracefully
      expect(result.current.data).toHaveLength(3)
    })
  })

  describe('useInvalidateQueries', () => {
    it('should provide invalidation functions', () => {
      const { result } = renderHook(() => useInvalidateQueries(), { wrapper })

      expect(typeof result.current.invalidateTeachers).toBe('function')
      expect(typeof result.current.invalidateTimeslots).toBe('function')
      expect(typeof result.current.invalidatePricing).toBe('function')
      expect(typeof result.current.invalidateInstruments).toBe('function')
      expect(typeof result.current.invalidateAll).toBe('function')
    })
  })

  describe('usePrefetchQueries', () => {
    it('should provide prefetch functions', () => {
      const { result } = renderHook(() => usePrefetchQueries(), { wrapper })

      expect(typeof result.current.prefetchTeachers).toBe('function')
      expect(typeof result.current.prefetchTimeslots).toBe('function')
      expect(typeof result.current.prefetchPricing).toBe('function')
      expect(typeof result.current.prefetchInstruments).toBe('function')
    })

    it('should prefetch teachers data', async () => {
      api.getTeachers.mockResolvedValue({
        success: true,
        data: [],
        metadata: { execution_time_ms: 45 }
      })

      const { result } = renderHook(() => usePrefetchQueries(), { wrapper })

      await result.current.prefetchTeachers({ active: true })

      expect(api.getTeachers).toHaveBeenCalledWith({ active: true })
    })
  })

  describe('useAPIStats', () => {
    it('should provide API statistics functions', () => {
      const mockStats = {
        requestCount: 5,
        errorCount: 1,
        errorRate: 0.2
      }

      const mockCacheStats = {
        cacheSize: 3,
        cacheHits: 10,
        cacheMisses: 5,
        cacheHitRate: 0.67
      }

      api.getStats.mockReturnValue(mockStats)
      api.getCacheStats.mockReturnValue(mockCacheStats)

      const { result } = renderHook(() => useAPIStats(), { wrapper })

      expect(result.current.getStats()).toEqual(mockStats)
      expect(result.current.getCacheStats()).toEqual(mockCacheStats)
      expect(typeof result.current.resetStats).toBe('function')
    })

    it('should handle missing cache stats', () => {
      api.getStats.mockReturnValue({ requestCount: 0 })
      api.getCacheStats = undefined // Simulate missing method

      const { result } = renderHook(() => useAPIStats(), { wrapper })

      expect(result.current.getCacheStats()).toBeNull()
    })
  })

  describe('Query Configuration', () => {
    it('should use correct stale time and cache time', async () => {
      api.getTeachers.mockResolvedValue({
        success: true,
        data: [],
        metadata: { execution_time_ms: 45 }
      })

      const { result } = renderHook(() => useTeachers(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // The hook should be configured with 2-minute stale time
      // This is tested indirectly through the hook behavior
      expect(result.current.isStale).toBe(false)
    })

    it('should handle custom options', async () => {
      api.getTeachers.mockResolvedValue({
        success: true,
        data: [],
        metadata: { execution_time_ms: 45 }
      })

      const customOptions = {
        enabled: false
      }

      const { result } = renderHook(
        () => useTeachers({}, customOptions),
        { wrapper }
      )

      // Should not fetch when enabled is false
      expect(result.current.fetchStatus).toBe('idle')
      expect(api.getTeachers).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error')
      api.getTeachers.mockRejectedValue(networkError)

      const { result } = renderHook(() => useTeachers(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(networkError)
      expect(result.current.data).toBeUndefined()
    })

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('Validation failed')
      apiError.status = 400
      api.getTimeslots.mockRejectedValue(apiError)

      const { result } = renderHook(() => useTimeslots(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(apiError)
    })
  })

  describe('Query Keys', () => {
    it('should generate correct query keys', () => {
      expect(queryKeys.teachers()).toEqual(['teachers', {}])
      expect(queryKeys.teachers({ active: true })).toEqual(['teachers', { active: true }])
      
      expect(queryKeys.timeslots()).toEqual(['timeslots', {}])
      expect(queryKeys.timeslots({ teacher_id: 1 })).toEqual(['timeslots', { teacher_id: 1 }])
      
      expect(queryKeys.pricing()).toEqual(['pricing', {}])
      expect(queryKeys.pricing({ billing_frequency: 'monthly' })).toEqual(['pricing', { billing_frequency: 'monthly' }])
      
      expect(queryKeys.instruments()).toEqual(['instruments', {}])
      expect(queryKeys.instruments({ active: true })).toEqual(['instruments', { active: true }])
    })
  })
})