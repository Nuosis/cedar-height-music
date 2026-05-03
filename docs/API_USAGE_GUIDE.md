# API Usage Guide

This guide provides comprehensive documentation for using the Cedar Heights Music Academy API integration in the frontend application.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Client](#api-client)
- [React Query Hooks](#react-query-hooks)
- [Error Handling](#error-handling)
- [Caching Strategy](#caching-strategy)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

The Cedar Heights Music Academy frontend integrates with a backend API to provide real-time data for teachers, timeslots, pricing, and instruments. The integration uses:

- **API Client**: [`src/services/apiClient.js`](../src/services/apiClient.js) - Core API communication
- **React Query**: [`@tanstack/react-query`](https://tanstack.com/query) - Data fetching and caching
- **Custom Hooks**: [`src/hooks/usePublicAPI.js`](../src/hooks/usePublicAPI.js) - React Query integration
- **Environment Configuration**: [`src/config/env.js`](../src/config/env.js) - Environment management

## Getting Started

### Environment Setup

Configure your environment variables in `.env`:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.cedarheightsmusicacademy.com/api/v1
VITE_DATA_SOURCE=live  # or 'mock' for development

# Optional Configuration
VITE_CACHE_TIMEOUT=120000  # 2 minutes in milliseconds
VITE_RATE_LIMIT_DELAY=2000  # 2 seconds in milliseconds
```

### Basic Usage

```jsx
import React from 'react'
import { useTeachers, usePricing } from '../hooks/usePublicAPI'

function MyComponent() {
  const { data: teachers, isLoading, error } = useTeachers()
  const { data: pricing } = usePricing()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Teachers ({teachers?.length})</h2>
      {teachers?.map(teacher => (
        <div key={teacher.id}>{teacher.name}</div>
      ))}
      
      <h2>Pricing</h2>
      <p>Monthly: ${pricing?.base_monthly_price} {pricing?.currency}</p>
    </div>
  )
}
```

## API Client

### Direct API Client Usage

```javascript
import { api } from '../services/apiClient'

// Get all teachers
const teachers = await api.getTeachers()

// Get teachers with filters
const pianoTeachers = await api.getTeachers({ 
  instrument_id: 1,
  active: true 
})

// Get timeslots for a specific teacher
const timeslots = await api.getTimeslots({ 
  teacher_id: 1,
  weekday: 1, // Monday
  limit: 20 
})

// Get pricing information
const pricing = await api.getPricing({ 
  billing_frequency: 'monthly' 
})

// Get all instruments
const instruments = await api.getInstruments({ active: true })
```

### API Response Format

All API responses follow this structure:

```javascript
{
  success: true,
  data: [...], // or {} for single objects
  metadata: {
    execution_time_ms: 45,
    timestamp: "2025-10-25T10:30:00Z",
    request_id: "req_123456"
  },
  _requestMetadata: {
    url: "https://api.example.com/teachers",
    status: 200,
    cached: false
  }
}
```

### Error Handling

```javascript
try {
  const teachers = await api.getTeachers()
  console.log('Teachers:', teachers.data)
} catch (error) {
  if (error.status === 429) {
    console.log('Rate limited, retrying automatically...')
  } else if (error.status >= 500) {
    console.log('Server error:', error.message)
  } else {
    console.log('Client error:', error.message)
  }
}
```

## React Query Hooks

### Available Hooks

#### `useTeachers(filters?, options?)`

Fetch teachers data with optional filtering.

```jsx
import { useTeachers } from '../hooks/usePublicAPI'

function TeachersList() {
  // Basic usage
  const { data: teachers, isLoading, error } = useTeachers()

  // With filters
  const { data: pianoTeachers } = useTeachers({ 
    instrument_id: 1,
    active: true 
  })

  // With custom options
  const { data: featuredTeachers } = useTeachers(
    { featured: true },
    { 
      enabled: true,
      refetchOnWindowFocus: false,
      staleTime: 300000 // 5 minutes
    }
  )

  return (
    <div>
      {teachers?.map(teacher => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  )
}
```

#### `useTimeslots(filters?, options?)`

Fetch timeslots with filtering and validation.

```jsx
import { useTimeslots } from '../hooks/usePublicAPI'

function ScheduleView() {
  const { data: timeslots, isLoading } = useTimeslots({
    teacher_id: 1,
    weekday: 1, // Monday (0-6)
    limit: 50
  })

  return (
    <div>
      {timeslots?.map(slot => (
        <TimeSlot 
          key={slot.id} 
          slot={slot}
          available={slot.next_available_date}
        />
      ))}
    </div>
  )
}
```

#### `usePricing(filters?, options?)`

Fetch pricing information.

```jsx
import { usePricing } from '../hooks/usePublicAPI'

function PricingDisplay() {
  const { data: pricing, isLoading } = usePricing({
    billing_frequency: 'monthly'
  })

  if (isLoading) return <div>Loading pricing...</div>

  return (
    <div>
      <h3>Monthly Pricing</h3>
      <p>${pricing?.base_monthly_price} {pricing?.currency}</p>
      
      {pricing?.current_semester && (
        <div>
          <h4>Current Semester</h4>
          <p>{pricing.current_semester.name}</p>
          <p>{pricing.current_semester.start_date} - {pricing.current_semester.end_date}</p>
        </div>
      )}
    </div>
  )
}
```

#### `useInstruments(filters?, options?)`

Fetch instruments catalog.

```jsx
import { useInstruments } from '../hooks/usePublicAPI'

function InstrumentSelector() {
  const { data: instruments } = useInstruments({ active: true })

  return (
    <select>
      {instruments?.map(instrument => (
        <option key={instrument.id} value={instrument.id}>
          {instrument.display_name}
        </option>
      ))}
    </select>
  )
}
```

### Specialized Hooks

#### `useTeacherTimeslots(teacherId, additionalFilters?)`

Get timeslots for a specific teacher.

```jsx
import { useTeacherTimeslots } from '../hooks/usePublicAPI'

function TeacherSchedule({ teacherId }) {
  const { data: timeslots, isLoading } = useTeacherTimeslots(
    teacherId,
    { weekday: 1 } // Additional filters
  )

  if (!teacherId) return null

  return (
    <div>
      <h3>Available Times</h3>
      {timeslots?.map(slot => (
        <div key={slot.id}>
          {slot.start_time} - {slot.end_time}
        </div>
      ))}
    </div>
  )
}
```

#### `useNextAvailableSlots(limit?)`

Get next available timeslots sorted by date.

```jsx
import { useNextAvailableSlots } from '../hooks/usePublicAPI'

function NextAvailable() {
  const { data: nextSlots } = useNextAvailableSlots(5)

  return (
    <div>
      <h3>Next Available Lessons</h3>
      {nextSlots?.map(slot => (
        <div key={slot.id}>
          Next available: {slot.next_available_date}
        </div>
      ))}
    </div>
  )
}
```

### Query Management Hooks

#### `useInvalidateQueries()`

Manually invalidate cached queries.

```jsx
import { useInvalidateQueries } from '../hooks/usePublicAPI'

function AdminPanel() {
  const {
    invalidateTeachers,
    invalidateTimeslots,
    invalidatePricing,
    invalidateInstruments,
    invalidateAll
  } = useInvalidateQueries()

  return (
    <div>
      <button onClick={invalidateTeachers}>
        Refresh Teachers
      </button>
      <button onClick={invalidateAll}>
        Refresh All Data
      </button>
    </div>
  )
}
```

#### `usePrefetchQueries()`

Prefetch data for better performance.

```jsx
import { usePrefetchQueries } from '../hooks/usePublicAPI'
import { useEffect } from 'react'

function HomePage() {
  const { prefetchTeachers, prefetchTimeslots } = usePrefetchQueries()

  useEffect(() => {
    // Prefetch data on page load
    prefetchTeachers({ active: true })
    prefetchTimeslots({ limit: 20 })
  }, [prefetchTeachers, prefetchTimeslots])

  return <div>Home Page Content</div>
}
```

#### `useAPIStats()`

Monitor API performance and cache statistics.

```jsx
import { useAPIStats } from '../hooks/usePublicAPI'

function DebugPanel() {
  const { getStats, getCacheStats, resetStats } = useAPIStats()

  const stats = getStats()
  const cacheStats = getCacheStats()

  return (
    <div>
      <h3>API Statistics</h3>
      <p>Requests: {stats.requestCount}</p>
      <p>Errors: {stats.errorCount}</p>
      <p>Error Rate: {(stats.errorRate * 100).toFixed(1)}%</p>
      
      {cacheStats && (
        <div>
          <h3>Cache Statistics</h3>
          <p>Cache Size: {cacheStats.cacheSize}</p>
          <p>Hit Rate: {(cacheStats.cacheHitRate * 100).toFixed(1)}%</p>
        </div>
      )}
      
      <button onClick={resetStats}>Reset Stats</button>
    </div>
  )
}
```

## Error Handling

### Component-Level Error Handling

```jsx
import { useTeachers } from '../hooks/usePublicAPI'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

function TeachersPage() {
  const { data: teachers, isLoading, error, refetch } = useTeachers()

  if (isLoading) return <LoadingSpinner />
  
  if (error) {
    return (
      <ErrorMessage 
        error={error}
        onRetry={refetch}
        fallbackMessage="Unable to load teachers. Please try again."
      />
    )
  }

  return (
    <div>
      {teachers?.map(teacher => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  )
}
```

### Global Error Boundary

```jsx
import { ErrorBoundary } from '../components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teachers" element={<TeachersPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
```

### Custom Error Handling

```jsx
import { useTeachers } from '../hooks/usePublicAPI'

function TeachersWithCustomError() {
  const { data: teachers, error, isError } = useTeachers()

  if (isError) {
    // Handle specific error types
    if (error.status === 429) {
      return <div>Too many requests. Please wait a moment.</div>
    }
    
    if (error.status >= 500) {
      return <div>Server error. Our team has been notified.</div>
    }
    
    return <div>Something went wrong: {error.message}</div>
  }

  return (
    <div>
      {teachers?.map(teacher => (
        <div key={teacher.id}>{teacher.name}</div>
      ))}
    </div>
  )
}
```

## Caching Strategy

### Default Cache Configuration

```javascript
// Automatic caching with 2-minute stale time
const { data: teachers } = useTeachers() // Cached for 2 minutes

// Custom cache configuration
const { data: pricing } = usePricing({}, {
  staleTime: 300000, // 5 minutes
  cacheTime: 600000, // 10 minutes
  refetchOnWindowFocus: false
})
```

### Cache Invalidation Patterns

```jsx
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../hooks/usePublicAPI'

function TeacherForm() {
  const queryClient = useQueryClient()

  const handleTeacherUpdate = async (teacherData) => {
    await updateTeacher(teacherData)
    
    // Invalidate specific queries
    queryClient.invalidateQueries({ queryKey: queryKeys.teachers() })
    queryClient.invalidateQueries({ queryKey: queryKeys.timeslots() })
  }

  return <form onSubmit={handleTeacherUpdate}>...</form>
}
```

### Background Refresh

```jsx
import { useTeachers } from '../hooks/usePublicAPI'

function TeachersWithBackgroundRefresh() {
  const { data: teachers } = useTeachers({}, {
    refetchInterval: 300000, // Refresh every 5 minutes
    refetchIntervalInBackground: true
  })

  return <div>Teachers: {teachers?.length}</div>
}
```

## Performance Optimization

### Selective Data Loading

```jsx
// Load only active teachers
const { data: activeTeachers } = useTeachers({ active: true })

// Load limited timeslots
const { data: recentSlots } = useTimeslots({ limit: 10 })

// Conditional loading
const { data: teacherSlots } = useTeacherTimeslots(
  selectedTeacherId,
  {},
  { enabled: !!selectedTeacherId }
)
```

### Pagination Support

```jsx
import { useState } from 'react'
import { useTimeslots } from '../hooks/usePublicAPI'

function PaginatedTimeslots() {
  const [page, setPage] = useState(1)
  const limit = 20
  
  const { data: timeslots, isLoading } = useTimeslots({
    limit,
    offset: (page - 1) * limit
  })

  return (
    <div>
      {timeslots?.map(slot => (
        <TimeSlot key={slot.id} slot={slot} />
      ))}
      
      <button 
        onClick={() => setPage(p => p - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      
      <button 
        onClick={() => setPage(p => p + 1)}
        disabled={timeslots?.length < limit}
      >
        Next
      </button>
    </div>
  )
}
```

### Optimistic Updates

```jsx
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../hooks/usePublicAPI'

function useOptimisticTeacherUpdate() {
  const queryClient = useQueryClient()

  return async (teacherId, updates) => {
    // Optimistically update the cache
    queryClient.setQueryData(
      queryKeys.teachers(),
      (oldTeachers) => 
        oldTeachers?.map(teacher => 
          teacher.id === teacherId 
            ? { ...teacher, ...updates }
            : teacher
        )
    )

    try {
      await updateTeacher(teacherId, updates)
    } catch (error) {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers() })
      throw error
    }
  }
}
```

## Testing

### Testing Components with API Hooks

```jsx
// tests/components/TeachersList.test.jsx
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import TeachersList from '../TeachersList'

// Mock the API hooks
vi.mock('../hooks/usePublicAPI', () => ({
  useTeachers: vi.fn()
}))

import { useTeachers } from '../hooks/usePublicAPI'

describe('TeachersList', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
  })

  it('displays teachers when loaded', () => {
    useTeachers.mockReturnValue({
      data: [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Jane Doe' }
      ],
      isLoading: false,
      error: null
    })

    render(
      <QueryClientProvider client={queryClient}>
        <TeachersList />
      </QueryClientProvider>
    )

    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    useTeachers.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    })

    render(
      <QueryClientProvider client={queryClient}>
        <TeachersList />
      </QueryClientProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
```

### Testing API Client

```javascript
// tests/services/apiClient.test.js
import { describe, it, expect, vi } from 'vitest'
import { api } from '../../src/services/apiClient'

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('fetches teachers successfully', async () => {
    const mockResponse = {
      success: true,
      data: [{ id: 1, name: 'Test Teacher' }],
      metadata: { execution_time_ms: 50 }
    }

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await api.getTeachers()
    
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Test Teacher')
  })
})
```

## Troubleshooting

### Common Issues

#### 1. Rate Limiting Errors

**Problem**: Getting 429 errors frequently.

**Solution**: The API client automatically handles rate limiting with retries. If you're still seeing issues:

```javascript
// Check your rate limit configuration
console.log('Rate limit delay:', api.rateLimitDelay)

// Monitor request patterns
const stats = api.getStats()
console.log('Request count:', stats.requestCount)
```

#### 2. Stale Data

**Problem**: Data not updating when expected.

**Solution**: Manually invalidate queries or adjust stale time:

```jsx
const { invalidateTeachers } = useInvalidateQueries()

// Force refresh
invalidateTeachers()

// Or adjust stale time
const { data } = useTeachers({}, { staleTime: 0 })
```

#### 3. Memory Leaks

**Problem**: Memory usage growing over time.

**Solution**: Ensure proper cleanup:

```jsx
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

function MyComponent() {
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      // Clear unused queries on unmount
      queryClient.removeQueries({ 
        queryKey: ['teachers'], 
        exact: false 
      })
    }
  }, [queryClient])
}
```

#### 4. Network Errors

**Problem**: Intermittent network failures.

**Solution**: Configure retry behavior:

```jsx
const { data } = useTeachers({}, {
  retry: (failureCount, error) => {
    if (error.status === 404) return false
    return failureCount < 3
  },
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
})
```

### Debug Mode

Enable debug logging:

```javascript
// In development
if (import.meta.env.DEV) {
  // Enable React Query devtools
  import('@tanstack/react-query-devtools').then(({ ReactQueryDevtools }) => {
    // Add devtools to your app
  })
  
  // Enable API client debugging
  api.debug = true
}
```

### Performance Monitoring

```jsx
import { useAPIStats } from '../hooks/usePublicAPI'

function PerformanceMonitor() {
  const { getStats, getCacheStats } = useAPIStats()
  
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = getStats()
      const cacheStats = getCacheStats()
      
      console.log('API Performance:', {
        requests: stats.requestCount,
        errors: stats.errorCount,
        errorRate: stats.errorRate,
        cacheHitRate: cacheStats?.cacheHitRate
      })
    }, 30000) // Log every 30 seconds
    
    return () => clearInterval(interval)
  }, [getStats, getCacheStats])
  
  return null
}
```

## Best Practices

1. **Always handle loading and error states** in your components
2. **Use appropriate stale times** based on data freshness requirements
3. **Implement proper error boundaries** for graceful degradation
4. **Monitor API performance** in production
5. **Test with both mock and live data** during development
6. **Use prefetching** for predictable user flows
7. **Implement optimistic updates** for better UX
8. **Clean up queries** when components unmount
9. **Use query keys consistently** for cache management
10. **Document custom hooks** and their expected behavior

For more detailed information, see the [Backend Integration Guide](../ai_docs/context/core_docs/backend_integration.md).