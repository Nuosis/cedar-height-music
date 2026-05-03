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
  pricing: (filters = {}) => ['pricing', filters],
  instruments: (filters = {}) => ['instruments', filters],
  siteConfig: () => ['site-config'],
  products: () => ['products'],
  availability: (filters = {}) => ['availability', filters],
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

export const useSiteConfig = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.siteConfig(),
    queryFn: async () => {
      const response = await api.getSiteConfig()
      return response.data
    },
    staleTime: 300000,
    retry: 2,
    ...options
  })
}

export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.products(),
    queryFn: async () => {
      const response = await api.getProducts()
      return response.data
    },
    staleTime: 120000,
    retry: 2,
    ...options
  })
}

export const useAvailability = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.availability(filters),
    queryFn: async () => {
      const response = await api.getAvailability(filters)
      return response.data
    },
    staleTime: 60000,
    retry: 1,
    ...options
  })
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
  usePricing,
  useInstruments,
  useSiteConfig,
  useProducts,
  useAvailability,
  useInvalidateQueries,
  usePrefetchQueries,
  useAPIStats,
  queryKeys
}
