# Backend Integration Guide for Frontend Developer

## Overview

This guide provides everything a frontend developer needs to integrate with the Cedar Heights Music Academy backend API. The system is optimized for a **single teacher with 50 students maximum**, keeping complexity minimal while maintaining production-ready functionality.

## Base Configuration

### API Base URL
- **Production**: `https://api.cedarheightsmusicacademy.com`
- **API Version**: `v1`
- **Base Path**: `/api/v1`

### Authentication
- **Public Endpoints**: No authentication required
- **Rate Limiting**: 30 requests per minute per IP address
- **CORS**: Configured for production domains

## Public API Endpoints

All public endpoints return data in a consistent `APIResponse` envelope format:

```json
{
  "success": true,
  "data": [...],
  "message": "Success",
  "errors": null,
  "metadata": {
    "timestamp": "2025-10-25T22:45:00Z",
    "request_id": "req_abc123",
    "execution_time_ms": 85,
    "last_updated": "2025-10-25T22:45:00Z",
    "total_count": 3
  }
}
```

### 1. Teachers Endpoint

**GET** `/api/v1/public/teachers`

Returns available teachers with their availability summary.

#### Query Parameters
- `instrument_id` (optional): Filter by instrument ID
- `active` (optional): Filter by active status (default: true)

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "bio": "Experienced piano instructor with 10+ years teaching",
      "instruments": ["Piano", "Guitar"],
      "availability_summary": {
        "total_slots": 20,
        "available_slots": 15,
        "next_available": "2025-10-26T10:00:00Z"
      }
    }
  ],
  "metadata": {
    "total_count": 1,
    "execution_time_ms": 45
  }
}
```

### 2. Timeslots Endpoint

**GET** `/api/v1/public/timeslots`

Returns available lesson time slots.

#### Query Parameters
- `teacher_id` (optional): Filter by teacher ID
- `weekday` (optional): Filter by weekday (0=Monday, 6=Sunday)
- `active` (optional): Filter by active status (default: true)
- `start_date` (optional): Filter slots from this date (YYYY-MM-DD)
- `limit` (optional): Limit results (max 100, default 50)

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "teacher_id": 1,
      "weekday": 1,
      "start_time": "10:00",
      "end_time": "10:30",
      "duration": 30,
      "next_available_date": "2025-10-28"
    }
  ],
  "metadata": {
    "total_count": 15,
    "execution_time_ms": 118
  }
}
```

### 3. Pricing Endpoint

**GET** `/api/v1/public/pricing`

Returns current pricing information.

#### Response Example
```json
{
  "success": true,
  "data": {
    "base_monthly_price": 125.0,
    "currency": "CAD",
    "current_semester": {
      "id": 1,
      "name": "Fall 2025",
      "start_date": "2025-09-01",
      "end_date": "2025-12-15"
    }
  },
  "metadata": {
    "execution_time_ms": 113,
    "pricing_source": "database_with_fallbacks"
  }
}
```

### 4. Instruments Endpoint

**GET** `/api/v1/public/instruments`

Returns available instruments.

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Piano",
      "display_name": "Piano",
      "sort_order": 1
    },
    {
      "id": 2,
      "name": "Guitar",
      "display_name": "Guitar", 
      "sort_order": 2
    }
  ],
  "metadata": {
    "total_count": 3,
    "execution_time_ms": 2
  }
}
```

## Frontend Integration Patterns

### 1. Basic API Client Setup

```javascript
class MusicAcademyAPI {
  constructor() {
    this.baseURL = 'https://api.cedarheightsmusicacademy.com/api/v1';
    this.rateLimitDelay = 2000; // 2 seconds between requests
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        await this.delay(this.rateLimitDelay);
        return this.request(endpoint, options);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public endpoint methods
  async getTeachers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/public/teachers?${params}`);
  }

  async getTimeslots(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/public/timeslots?${params}`);
  }

  async getPricing() {
    return this.request('/public/pricing');
  }

  async getInstruments() {
    return this.request('/public/instruments');
  }
}
```

### 2. React Hook Example

```javascript
import { useState, useEffect } from 'react';

export function usePublicAPI() {
  const [api] = useState(() => new MusicAcademyAPI());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api[endpoint](...args);
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { api, fetchData, loading, error };
}

// Usage in component
function TeachersList() {
  const { fetchData, loading, error } = usePublicAPI();
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchData('getTeachers').then(data => {
      if (data) setTeachers(data);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {teachers.map(teacher => (
        <div key={teacher.id}>
          <h3>{teacher.name}</h3>
          <p>{teacher.bio}</p>
          <p>Instruments: {teacher.instruments.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Caching Strategy

The API includes cache headers (`Cache-Control: max-age=120, stale-while-revalidate=120`). Implement client-side caching:

```javascript
class CachedAPI extends MusicAcademyAPI {
  constructor() {
    super();
    this.cache = new Map();
    this.cacheTimeout = 120000; // 2 minutes
  }

  async request(endpoint, options = {}) {
    const cacheKey = `${endpoint}${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await super.request(endpoint, options);
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }
}
```

## Error Handling

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid parameters)
- **422**: Validation Error (invalid data format)
- **429**: Rate Limited (too many requests)
- **500**: Server Error

### Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "limit",
      "message": "Limit must be between 1 and 100",
      "code": "VALIDATION_ERROR"
    }
  ]
}
```

### Rate Limiting Handling

When you receive a 429 response:

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "errors": [
    {
      "field": "",
      "message": "Rate limit exceeded. Try again in 60 seconds.",
      "code": "RATE_LIMIT_EXCEEDED"
    }
  ],
  "metadata": {
    "rate_limit": {
      "limit": 30,
      "remaining": 0,
      "reset_time": "2025-10-25T23:01:00Z",
      "window_minutes": 1
    }
  }
}
```

## Performance Considerations

### Response Times
- **Teachers**: ~45ms average
- **Timeslots**: ~118ms average  
- **Pricing**: ~113ms average
- **Instruments**: ~2ms average

### Best Practices

1. **Implement client-side caching** - API responses are cached for 2 minutes
2. **Respect rate limits** - Maximum 30 requests per minute
3. **Use appropriate filters** - Limit timeslot queries with `teacher_id` and `limit` parameters
4. **Handle loading states** - API responses are fast but implement proper loading UX
5. **Implement retry logic** - For rate limiting and temporary failures

## Testing

### Smoke Test Script

A smoke test script is available at the project root:

```bash
./smoke_test_public_api.sh
```

This tests all endpoints and handles rate limiting gracefully.

### Manual Testing Examples

```bash
# Test teachers endpoint
curl "https://api.cedarheightsmusicacademy.com/api/v1/public/teachers"

# Test timeslots with filters
curl "https://api.cedarheightsmusicacademy.com/api/v1/public/timeslots?limit=10&teacher_id=1"

# Test pricing
curl "https://api.cedarheightsmusicacademy.com/api/v1/public/pricing"

# Test instruments
curl "https://api.cedarheightsmusicacademy.com/api/v1/public/instruments"
```

## Single-Teacher Optimizations

This system is specifically optimized for a single teacher with 50 students maximum:

### Data Characteristics
- **Teachers**: Typically 1 active teacher
- **Students**: Maximum 50 students
- **Timeslots**: Limited weekly availability
- **Instruments**: 2-3 instruments typically

### Simplified Assumptions
- **No complex scheduling conflicts** - Single teacher simplifies availability
- **Minimal data volume** - Fast queries without complex optimization
- **Basic caching sufficient** - 2-minute cache handles typical parent browsing patterns
- **Simple rate limiting** - 30 req/min adequate for expected traffic

## Support and Troubleshooting

### Common Issues

1. **Rate Limiting**: Implement delays between requests (2+ seconds recommended)
2. **Empty Data Arrays**: Normal for new setups - teachers/instruments may be empty initially
3. **CORS Issues**: Ensure requests are from allowed domains
4. **Cache Staleness**: Data updates every 2 minutes maximum

### Debugging

- Check `metadata.execution_time_ms` for performance issues
- Use `metadata.request_id` for support requests
- Monitor `metadata.total_count` for data availability
- Check `success` field before processing `data`

### Contact

For backend API issues or questions, reference this integration guide and provide:
- Request URL and parameters
- Response data (including metadata)
- Error messages
- Expected vs actual behavior

---

**Last Updated**: 2025-10-25  
**API Version**: v1  
**Backend Status**: Production Ready ✅