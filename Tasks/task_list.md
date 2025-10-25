# Backend Integration Task List

## Overview

This task list provides a comprehensive roadmap for integrating the Cedar Heights Music Academy backend API into the frontend website. The integration follows the specifications in [`ai_docs/context/core_docs/backend_integration.md`](ai_docs/context/core_docs/backend_integration.md) and leverages existing infrastructure including TanStack React Query and environment configuration.

## Current State Analysis

### ✅ Already Implemented
- Email service with API integration ([`src/services/emailService.js`](src/services/emailService.js))
- Environment configuration system ([`src/config/env.js`](src/config/env.js))
- TanStack React Query dependency installed
- Mock/live data source switching mechanism
- Basic error handling patterns

### 🔄 Needs Integration
- Teachers data display
- Timeslots scheduling interface
- Pricing information
- Instruments catalog
- Comprehensive API client with caching and rate limiting

---

## Phase 1: Core API Infrastructure

### Task 1.1: Create Main API Client
**Priority:** High  
**Estimated Time:** 3-4 hours  
**Dependencies:** None

#### Implementation Steps:
1. **Create [`src/services/apiClient.js`](src/services/apiClient.js)**
   - Implement `MusicAcademyAPI` class based on backend integration guide
   - Add rate limiting (30 req/min with 2-second delays)
   - Include retry logic for 429 responses
   - Add request/response logging for debugging

2. **Add Client-Side Caching**
   - Extend base client with `CachedAPI` class
   - Implement 2-minute cache timeout matching API headers
   - Use Map-based in-memory cache with timestamp validation
   - Add cache invalidation methods

3. **Environment Integration**
   - Use existing [`src/config/env.js`](src/config/env.js) configuration
   - Support mock/live data source switching
   - Add production/development URL handling

#### Acceptance Criteria:
- [ ] API client handles all 4 public endpoints (teachers, timeslots, pricing, instruments)
- [ ] Rate limiting prevents 429 errors with automatic retry
- [ ] Caching reduces redundant API calls
- [ ] Environment switching works seamlessly
- [ ] Error responses follow consistent format

---

### Task 1.2: Mock Data Services
**Priority:** High  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 1.1

#### Implementation Steps:
1. **Create [`src/services/mockData.js`](src/services/mockData.js)**
   - Generate realistic teacher profiles with photos and bios
   - Create weekly timeslot schedules matching API format
   - Add pricing data with current semester information
   - Include instrument catalog with display names and sort order

2. **Mock API Response Format**
   - Match exact API response envelope structure
   - Include metadata fields (timestamp, request_id, execution_time_ms)
   - Add realistic delays to simulate network latency
   - Support query parameter filtering

3. **Data Consistency**
   - Ensure teacher IDs match across teachers and timeslots
   - Maintain referential integrity between related data
   - Use realistic Canadian pricing and scheduling

#### Acceptance Criteria:
- [ ] Mock data matches production API response format exactly
- [ ] All query parameters work correctly with mock data
- [ ] Realistic data supports UI development and testing
- [ ] Mock responses include proper metadata fields

---

### Task 1.3: React Query Integration
**Priority:** High  
**Estimated Time:** 2-3 hours  
**Dependencies:** Tasks 1.1, 1.2

#### Implementation Steps:
1. **Create [`src/hooks/usePublicAPI.js`](src/hooks/usePublicAPI.js)**
   - Implement custom hooks for each endpoint
   - Add loading, error, and success states
   - Include query invalidation and refetch methods
   - Support query parameter passing

2. **Query Client Configuration**
   - Update [`src/main.jsx`](src/main.jsx) with QueryClient setup
   - Configure 2-minute stale time matching API cache headers
   - Add error boundary integration
   - Set up development tools for debugging

3. **Hook Implementations**
   ```javascript
   // Example hook structure
   export const useTeachers = (filters = {}) => {
     return useQuery({
       queryKey: ['teachers', filters],
       queryFn: () => api.getTeachers(filters),
       staleTime: 120000, // 2 minutes
       cacheTime: 300000, // 5 minutes
     });
   };
   ```

#### Acceptance Criteria:
- [ ] All 4 public endpoints have corresponding React Query hooks
- [ ] Hooks support filtering and query parameters
- [ ] Loading and error states are properly managed
- [ ] Cache configuration matches API specifications
- [ ] Development tools work for debugging queries

---

## Phase 2: Data Integration

### Task 2.1: Teachers Data Integration
**Priority:** High  
**Estimated Time:** 3-4 hours  
**Dependencies:** Phase 1 complete

#### Implementation Steps:
1. **Update [`src/pages/HomePage.jsx`](src/pages/HomePage.jsx)**
   - Replace hardcoded teacher information with API data
   - Add loading states for teacher sections
   - Handle empty states gracefully
   - Maintain existing styling and layout

2. **Update [`src/pages/AboutPage.jsx`](src/pages/AboutPage.jsx)**
   - Integrate teacher profiles with photos and bios
   - Display instrument specializations
   - Add availability summary information
   - Preserve responsive design

3. **Error Handling**
   - Add fallback content when API fails
   - Display user-friendly error messages
   - Implement retry mechanisms
   - Log errors for debugging

#### Acceptance Criteria:
- [ ] Teacher information displays correctly on both pages
- [ ] Loading states provide good user experience
- [ ] Error states don't break page functionality
- [ ] Responsive design is maintained
- [ ] Fallback content is meaningful

---

### Task 2.2: Timeslots Integration
**Priority:** High  
**Estimated Time:** 4-5 hours  
**Dependencies:** Task 2.1

#### Implementation Steps:
1. **Update HomePage Scheduling Section**
   - Replace mock timeslots with API data
   - Add teacher filtering functionality
   - Implement weekday-based filtering
   - Show next available dates

2. **Enhanced TimeSlot Components**
   - Update [`TimeSlotChip`](src/pages/HomePage.jsx:115) component
   - Add teacher assignment display
   - Include duration information
   - Handle availability status

3. **Interactive Features**
   - Add click handlers for slot selection
   - Implement hover states with additional info
   - Support keyboard navigation
   - Add accessibility attributes

#### Acceptance Criteria:
- [ ] Timeslots load from API with proper filtering
- [ ] Teacher assignments display correctly
- [ ] Interactive features work smoothly
- [ ] Accessibility standards are met
- [ ] Performance is optimized for 50+ slots

---

### Task 2.3: Pricing Integration
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 2.1

#### Implementation Steps:
1. **Update [`src/pages/PricingPage.jsx`](src/pages/PricingPage.jsx)**
   - Replace hardcoded pricing with API data
   - Display current semester information
   - Add currency formatting (CAD)
   - Show pricing source metadata

2. **Dynamic Pricing Display**
   - Handle pricing updates gracefully
   - Add loading states for pricing section
   - Include semester date ranges
   - Support multiple pricing tiers if needed

3. **Fallback Handling**
   - Display cached pricing during API failures
   - Show last updated timestamp
   - Provide contact information for pricing questions

#### Acceptance Criteria:
- [ ] Pricing displays current API data
- [ ] Currency formatting is correct (CAD)
- [ ] Semester information is clear
- [ ] Fallback pricing works during outages
- [ ] Loading states are smooth

---

### Task 2.4: Instruments Integration
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 2.1

#### Implementation Steps:
1. **Update Instrument References**
   - Replace hardcoded instrument lists across components
   - Use API data for instrument selection
   - Maintain sort order from API
   - Update display names consistently

2. **Component Updates**
   - Update any instrument selection dropdowns
   - Modify teacher profile instrument displays
   - Ensure consistent naming throughout app
   - Add instrument-based filtering where applicable

3. **Data Consistency**
   - Validate instrument IDs match across endpoints
   - Handle missing or deprecated instruments
   - Add new instrument support automatically

#### Acceptance Criteria:
- [ ] All instrument references use API data
- [ ] Sort order matches API specifications
- [ ] Display names are consistent throughout app
- [ ] New instruments appear automatically
- [ ] Deprecated instruments are handled gracefully

---

## Phase 3: Enhanced Features

### Task 3.1: Contact Form API Integration
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Dependencies:** Phase 1 complete

#### Implementation Steps:
1. **Update [`src/pages/ContactPage.jsx`](src/pages/ContactPage.jsx)**
   - Integrate with new inquiry API endpoint
   - Maintain existing Brevo email as fallback
   - Add API key configuration
   - Update error handling for new endpoint

2. **Enhanced Form Handling**
   - Add field validation matching API schema
   - Implement character limits (name: 100, message: 2000, phone: 20)
   - Improve error messaging
   - Add success confirmation

3. **Fallback Strategy**
   - Use existing [`sendInquiryEmail`](src/services/emailService.js:304) function
   - Implement graceful degradation
   - Log API failures for monitoring
   - Maintain user experience during outages

#### Acceptance Criteria:
- [ ] New inquiry API endpoint is primary method
- [ ] Brevo email service works as fallback
- [ ] Form validation matches API requirements
- [ ] Error messages are user-friendly
- [ ] Success states provide clear feedback

---

### Task 3.2: Error Handling & Loading States
**Priority:** High  
**Estimated Time:** 3-4 hours  
**Dependencies:** Phase 2 complete

#### Implementation Steps:
1. **Create [`src/components/ErrorBoundary.jsx`](src/components/ErrorBoundary.jsx)**
   - Implement React error boundary
   - Add error reporting functionality
   - Provide user-friendly error displays
   - Include retry mechanisms

2. **Loading Components**
   - Create [`src/components/LoadingSpinner.jsx`](src/components/LoadingSpinner.jsx)
   - Add skeleton loading states
   - Implement progressive loading
   - Match existing design system

3. **Error States**
   - Create [`src/components/ErrorMessage.jsx`](src/components/ErrorMessage.jsx)
   - Add retry buttons and actions
   - Include contact information for support
   - Maintain accessibility standards

#### Acceptance Criteria:
- [ ] Error boundary catches and handles React errors
- [ ] Loading states provide smooth user experience
- [ ] Error messages are helpful and actionable
- [ ] Retry mechanisms work correctly
- [ ] Accessibility is maintained in all states

---

### Task 3.3: Environment Configuration
**Priority:** Medium  
**Estimated Time:** 1-2 hours  
**Dependencies:** Phase 1 complete

#### Implementation Steps:
1. **Update [`src/config/env.js`](src/config/env.js)**
   - Add API endpoint configuration
   - Include rate limiting settings
   - Add cache timeout configuration
   - Support development/production switching

2. **Environment Variables**
   - Document required environment variables
   - Add validation for missing configurations
   - Include default values for development
   - Support Vercel deployment configuration

3. **Configuration Validation**
   - Add startup configuration checks
   - Warn about missing API keys
   - Validate URL formats
   - Check data source settings

#### Acceptance Criteria:
- [ ] All API configuration is externalized
- [ ] Environment switching works seamlessly
- [ ] Missing configuration is handled gracefully
- [ ] Development defaults enable local development
- [ ] Production configuration is secure

---

## Phase 4: Testing & Documentation

### Task 4.1: API Integration Tests
**Priority:** High  
**Estimated Time:** 4-5 hours  
**Dependencies:** Phase 2 complete

#### Implementation Steps:
1. **Unit Tests**
   - Create [`tests/services/apiClient.test.js`](tests/services/apiClient.test.js)
   - Test rate limiting functionality
   - Validate caching behavior
   - Check error handling paths

2. **Integration Tests**
   - Create [`tests/hooks/usePublicAPI.test.js`](tests/hooks/usePublicAPI.test.js)
   - Test React Query integration
   - Validate data transformation
   - Check loading and error states

3. **Component Tests**
   - Update existing component tests
   - Add API integration scenarios
   - Test error boundary functionality
   - Validate loading state displays

#### Acceptance Criteria:
- [ ] Unit tests cover all API client functionality
- [ ] Integration tests validate React Query hooks
- [ ] Component tests include API integration scenarios
- [ ] Test coverage exceeds 80%
- [ ] All tests pass consistently

---

### Task 4.2: End-to-End Tests
**Priority:** Medium  
**Estimated Time:** 3-4 hours  
**Dependencies:** Task 4.1

#### Implementation Steps:
1. **Playwright Test Updates**
   - Update existing E2E tests for API integration
   - Add mock API server for testing
   - Test error scenarios and recovery
   - Validate performance under load

2. **API Smoke Tests**
   - Create tests for all public endpoints
   - Validate response formats
   - Check rate limiting behavior
   - Test cache functionality

3. **User Journey Tests**
   - Test complete user flows with API data
   - Validate form submissions
   - Check error recovery paths
   - Test offline/online transitions

#### Acceptance Criteria:
- [ ] E2E tests cover all major user journeys
- [ ] API smoke tests validate endpoint functionality
- [ ] Error scenarios are tested thoroughly
- [ ] Performance tests validate acceptable load times
- [ ] Tests run reliably in CI/CD pipeline

---

### Task 4.3: Documentation Updates
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Dependencies:** Phase 3 complete

#### Implementation Steps:
1. **Update [`README.md`](README.md)**
   - Add API integration documentation
   - Include environment variable setup
   - Document mock/live data switching
   - Add troubleshooting section

2. **Create API Usage Guide**
   - Document all custom hooks
   - Include code examples
   - Add error handling patterns
   - Provide performance tips

3. **Developer Documentation**
   - Document API client architecture
   - Include caching strategy explanation
   - Add rate limiting guidelines
   - Provide debugging instructions

#### Acceptance Criteria:
- [ ] README includes complete setup instructions
- [ ] API usage is clearly documented
- [ ] Code examples are accurate and helpful
- [ ] Troubleshooting guide covers common issues
- [ ] Documentation is up-to-date with implementation

---

## Phase 5: Performance & Monitoring

### Task 5.1: Performance Optimization
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Dependencies:** Phase 4 complete

#### Implementation Steps:
1. **Bundle Analysis**
   - Analyze bundle size impact of API integration
   - Optimize imports and dependencies
   - Implement code splitting if needed
   - Remove unused code

2. **Caching Optimization**
   - Fine-tune cache strategies
   - Implement background refresh
   - Add cache warming for critical data
   - Optimize memory usage

3. **Network Optimization**
   - Implement request batching where possible
   - Add request deduplication
   - Optimize payload sizes
   - Use compression where available

#### Acceptance Criteria:
- [ ] Bundle size increase is minimal (<50KB)
- [ ] Cache hit rates exceed 80%
- [ ] Network requests are optimized
- [ ] Memory usage is stable
- [ ] Performance metrics meet targets

---

### Task 5.2: Monitoring & Analytics
**Priority:** Low  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 5.1

#### Implementation Steps:
1. **Error Tracking**
   - Add error reporting for API failures
   - Track rate limiting incidents
   - Monitor cache performance
   - Log user experience issues

2. **Performance Monitoring**
   - Track API response times
   - Monitor cache hit/miss rates
   - Measure user interaction delays
   - Track error recovery success

3. **Usage Analytics**
   - Track API endpoint usage
   - Monitor feature adoption
   - Measure user engagement
   - Identify optimization opportunities

#### Acceptance Criteria:
- [ ] Error tracking captures API issues
- [ ] Performance metrics are collected
- [ ] Usage patterns are monitored
- [ ] Alerts are configured for critical issues
- [ ] Data drives optimization decisions

---

## Implementation Priority

### Phase 1 (Critical - Week 1)
- Core API Infrastructure (Tasks 1.1-1.3)
- Essential for all other functionality

### Phase 2 (High Priority - Week 2)
- Data Integration (Tasks 2.1-2.4)
- Replaces mock data with live API

### Phase 3 (Medium Priority - Week 3)
- Enhanced Features (Tasks 3.1-3.3)
- Improves user experience and reliability

### Phase 4 (High Priority - Week 4)
- Testing & Documentation (Tasks 4.1-4.3)
- Ensures quality and maintainability

### Phase 5 (Low Priority - Week 5)
- Performance & Monitoring (Tasks 5.1-5.2)
- Optimizes and monitors production usage

---

## Success Criteria

### Technical Requirements
- [ ] All 4 public API endpoints integrated successfully
- [ ] Rate limiting prevents API abuse (30 req/min)
- [ ] Caching reduces API calls by 70%+
- [ ] Error handling provides graceful degradation
- [ ] Loading states maintain good UX
- [ ] Test coverage exceeds 80%
- [ ] Performance impact is minimal

### User Experience Requirements
- [ ] Page load times remain under 3 seconds
- [ ] Error states don't break functionality
- [ ] Loading states are smooth and informative
- [ ] Data updates reflect in real-time
- [ ] Offline/error recovery works seamlessly

### Business Requirements
- [ ] Teacher information displays accurately
- [ ] Scheduling interface shows real availability
- [ ] Pricing reflects current rates
- [ ] Contact forms reach the business
- [ ] System scales to 50 students maximum

---

## Risk Mitigation

### API Availability
- **Risk:** Backend API downtime
- **Mitigation:** Implement robust caching and fallback to mock data
- **Monitoring:** Add health checks and alerting

### Rate Limiting
- **Risk:** Exceeding API rate limits
- **Mitigation:** Implement client-side rate limiting and request queuing
- **Monitoring:** Track request patterns and optimize

### Data Consistency
- **Risk:** Stale or inconsistent data
- **Mitigation:** Implement cache invalidation and background refresh
- **Monitoring:** Add data freshness checks

### Performance Impact
- **Risk:** API integration slows down the site
- **Mitigation:** Optimize caching, implement lazy loading
- **Monitoring:** Track performance metrics continuously

---

## Environment Variables Required

```bash
# API Configuration
VITE_API_BASE_URL=https://api.cedarheightsmusicacademy.com/api/v1
VITE_DATA_SOURCE=live  # or 'mock' for development

# Existing Email Configuration (maintained)
VITE_BREVO_API_KEY=your_brevo_key
VITE_BREVO_FROM=your_from_email
VITE_CLARITY_API_KEY=your_clarity_key

# Optional Configuration
VITE_UNDER_MAINTENANCE=false
VITE_CACHE_TIMEOUT=120000  # 2 minutes in milliseconds
VITE_RATE_LIMIT_DELAY=2000  # 2 seconds in milliseconds
```

---

## Completion Checklist

- [ ] All tasks completed and tested
- [ ] Documentation updated and accurate
- [ ] Performance benchmarks met
- [ ] Error handling tested thoroughly
- [ ] User acceptance testing passed
- [ ] Production deployment successful
- [ ] Monitoring and alerting configured
- [ ] Team training completed

---

**Last Updated:** 2025-10-25  
**Estimated Total Time:** 35-45 hours  
**Target Completion:** 5 weeks  
**Dependencies:** Backend API must be production-ready