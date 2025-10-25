/**
 * React Query hooks for Cedar Heights Music Academy Public API
 * 
 * Provides custom hooks for all public API endpoints with proper caching,
 * error handling, and loading states. Uses the existing API client with
 * rate limiting and caching capabilities.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/apiClient.js'

/**
 * Query key factory for consistent cache key generation
 */
export const queryKeys = {
  teachers: (filters = {}) => ['teachers', filters],
  timeslots: (filters = {}) => ['timeslots', filters],
  pricing: (filters = {}) => ['pricing', filters],
  instruments: (filters = {}) => ['instruments', filters],
}

/**
 * Hook to fetch teachers data with optional filtering
 * @param {Object} filters - Query parameters for filtering
 * @param {number} filters.instrument_id - Filter by instrument ID
 * @param {boolean} filters.active - Filter by active status (default: true)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with data, loading, error states
 */
export const useTeachers = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.teachers(filters),
    queryFn: async () => {
      const response = await api.getTeachers(filters)
      return response.data
    },
    staleTime: 120000, // 2 minutes - matches API cache headers
    cacheTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  })
}

/**
 * Hook to fetch timeslots data with optional filtering
 * @param {Object} filters - Query parameters for filtering
 * @param {number} filters.teacher_id - Filter by teacher ID
 * @param {number} filters.weekday - Filter by weekday (0=Monday, 6=Sunday)
 * @param {boolean} filters.active - Filter by active status (default: true)
 * @param {string} filters.start_date - Filter slots from this date (YYYY-MM-DD)
 * @param {number} filters.limit - Limit results (max 100, default 50)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with data, loading, error states
 */
export const useTimeslots = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.timeslots(filters),
    queryFn: async () => {
      const response = await api.getTimeslots(filters)
      return response.data
    },
    staleTime: 120000, // 2 minutes - matches API cache headers
    cacheTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  })
}

/**
 * Hook to fetch pricing information
 * @param {Object} filters - Query parameters for filtering
 * @param {string} filters.billing_frequency - Filter by billing frequency (monthly|yearly|semester)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with data, loading, error states
 */
export const usePricing = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.pricing(filters),
    queryFn: async () => {
      const response = await api.getPricing(filters)
      return response.data
    },
    staleTime: 120000, // 2 minutes - matches API cache headers
    cacheTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  })
}

/**
 * Hook to fetch instruments data
 * @param {Object} filters - Query parameters for filtering
 * @param {boolean} filters.active - Include only active instruments (default: true)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with data, loading, error states
 */
export const useInstruments = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.instruments(filters),
    queryFn: async () => {
      const response = await api.getInstruments(filters)
      return response.data
    },
    staleTime: 120000, // 2 minutes - matches API cache headers
    cacheTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  })
}

/**
 * Hook to get available timeslots for a specific teacher
 * Convenience hook that filters timeslots by teacher_id
 * @param {number} teacherId - Teacher ID to filter by
 * @param {Object} additionalFilters - Additional filters to apply
 * @param {Object} options - React Query options
 * @returns {Object} Query result with teacher's timeslots
 */
export const useTeacherTimeslots = (teacherId, additionalFilters = {}, options = {}) => {
  const filters = {
    teacher_id: teacherId,
    ...additionalFilters
  }
  
  return useTimeslots(filters, {
    enabled: !!teacherId, // Only run query if teacherId is provided
    ...options
  })
}

/**
 * Hook to get next available timeslots across all teachers
 * Fetches timeslots with a limit and sorts by next available date
 * @param {number} limit - Number of slots to fetch (default: 10)
 * @param {Object} options - React Query options
 * @returns {Object} Query result with next available timeslots
 */
export const useNextAvailableSlots = (limit = 10, options = {}) => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  
  return useTimeslots(
    {
      start_date: today,
      limit,
      active: true
    },
    {
      select: (data) => {
        // Sort by next_available_date if available
        return data?.sort((a, b) => {
          if (a.next_available_date && b.next_available_date) {
            return new Date(a.next_available_date) - new Date(b.next_available_date)
          }
          return 0
        }) || []
      },
      ...options
    }
  )
}

/**
 * Hook to invalidate and refetch API data
 * Useful for refreshing data after mutations or on user action
 * @returns {Object} Functions to invalidate specific query types
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient()
  
  return {
    invalidateTeachers: (filters) => {
      return queryClient.invalidateQueries({
        queryKey: filters ? queryKeys.teachers(filters) : ['teachers']
      })
    },
    invalidateTimeslots: (filters) => {
      return queryClient.invalidateQueries({
        queryKey: filters ? queryKeys.timeslots(filters) : ['timeslots']
      })
    },
    invalidatePricing: (filters) => {
      return queryClient.invalidateQueries({
        queryKey: filters ? queryKeys.pricing(filters) : ['pricing']
      })
    },
    invalidateInstruments: (filters) => {
      return queryClient.invalidateQueries({
        queryKey: filters ? queryKeys.instruments(filters) : ['instruments']
      })
    },
    invalidateAll: () => {
      return queryClient.invalidateQueries()
    }
  }
}

/**
 * Hook to prefetch data for better user experience
 * Useful for preloading data that users are likely to need
 * @returns {Object} Functions to prefetch specific query types
 */
export const usePrefetchQueries = () => {
  const queryClient = useQueryClient()
  
  return {
    prefetchTeachers: (filters = {}) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.teachers(filters),
        queryFn: async () => {
          const response = await api.getTeachers(filters)
          return response.data
        },
        staleTime: 120000
      })
    },
    prefetchTimeslots: (filters = {}) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.timeslots(filters),
        queryFn: async () => {
          const response = await api.getTimeslots(filters)
          return response.data
        },
        staleTime: 120000
      })
    },
    prefetchPricing: (filters = {}) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.pricing(filters),
        queryFn: async () => {
          const response = await api.getPricing(filters)
          return response.data
        },
        staleTime: 120000
      })
    },
    prefetchInstruments: (filters = {}) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.instruments(filters),
        queryFn: async () => {
          const response = await api.getInstruments(filters)
          return response.data
        },
        staleTime: 120000
      })
    }
  }
}

/**
 * Hook to get API client statistics for monitoring
 * @returns {Object} API client statistics
 */
export const useAPIStats = () => {
  return {
    getStats: () => api.getStats(),
    getCacheStats: () => api.getCacheStats?.() || null,
    resetStats: () => api.resetStats()
  }
}

// Export all hooks as default for convenience
export default {
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
}