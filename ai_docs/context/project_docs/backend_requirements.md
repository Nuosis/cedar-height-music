# Cedar Heights Music Academy - Backend Requirements

`Technology-agnostic backend needs analysis based on frontend requirements`

## Executive Summary

- **Purpose**: Support a public marketing website for Cedar Heights Music Academy that converts visitors into enrolled students through a streamlined enrollment flow
- **Scope**: Public-only endpoints for teacher discovery, timeslot availability, and enrollment handoff to protected system
- **Integration Context**: Handoff to protected enrollment system at https://app.cedarheightsmusic.com/enroll/start
- **Performance Targets**: 120-second cache TTL, sub-2.5s response times, 20% enrollment increase goal

## Service Architecture Requirements

### Public Discovery Service
- **Purpose**: Provide read-only access to teacher and availability information for public website visitors
- **Responsibilities**: 
  - Serve teacher profiles and basic information for public display
  - Provide real-time availability data for timeslot selection
  - Support filtering and querying of available lesson slots
  - Handle high-volume public traffic with appropriate caching
- **Dependencies**: Core data management service, caching layer
- **Performance Requirements**: 
  - Response time: ≤500ms for teacher data, ≤1s for timeslot queries
  - Throughput: Support 1000+ concurrent public users
  - Availability: 99.9% uptime during business hours

### Data Management Service
- **Purpose**: Centralized management of core business entities and relationships
- **Responsibilities**:
  - Maintain teacher profiles, instruments, and lesson scheduling data
  - Enforce business rules for lesson duration (30-minute standard)
  - Manage semester-based commitment periods aligned to school calendar
  - Handle data validation and consistency across all operations
- **Dependencies**: Database layer, audit service
- **Performance Requirements**:
  - Response time: ≤200ms for CRUD operations
  - Consistency: Strong consistency for scheduling data
  - Scalability: Support growth to 100+ students

### Pricing Service
- **Purpose**: Manage and serve pricing information with business rule enforcement
- **Responsibilities**:
  - Maintain current monthly pricing ($125 baseline, configurable)
  - Calculate pricing based on billing frequency (monthly/yearly/semester)
  - Provide semester commitment period information
  - Support pricing updates without system downtime
- **Dependencies**: Configuration service, audit service
- **Performance Requirements**:
  - Response time: ≤100ms for pricing queries
  - Consistency: Immediate consistency for pricing updates
  - Caching: 120-second TTL with background refresh

### Configuration Service
- **Purpose**: Manage system-wide configuration and business parameters
- **Responsibilities**:
  - Store and serve current semester information and dates
  - Manage instrument catalog and availability
  - Handle feature flags for mock/live data switching
  - Provide environment-specific configuration
- **Dependencies**: None (foundational service)
- **Performance Requirements**:
  - Response time: ≤50ms for configuration queries
  - Availability: 99.99% uptime (critical dependency)
  - Caching: Long-term caching with manual invalidation

## API Requirements

### Public Teacher Discovery - GET /public/teachers

#### Purpose
Provide teacher information for public website display including profiles, instruments taught, and basic availability indicators

#### Input Requirements
- **Query Parameters**:
  - `instrument_id` (optional): Filter teachers by instrument capability
  - `active` (optional, default: true): Include only active teachers
- **Headers**: Standard HTTP headers, no authentication required
- **Validation Rules**: 
  - instrument_id must be valid UUID if provided
  - active must be boolean value

#### Output Requirements
- **Response Data Structure**:
  ```json
  {
    "teachers": [
      {
        "id": "uuid",
        "name": "string",
        "bio": "string (max 500 chars)",
        "photo_url": "string (optional)",
        "instruments": ["uuid array"],
        "availability_summary": "string (e.g., 'Typically evenings')",
        "active": "boolean"
      }
    ],
    "total_count": "integer",
    "last_updated": "ISO 8601 timestamp"
  }
  ```
- **Success Response**: HTTP 200 with teacher array
- **Error Responses**: 
  - HTTP 400 for invalid query parameters
  - HTTP 500 for server errors
- **Performance Expectations**: ≤500ms response time, 120s cache TTL

#### Business Logic
- **Key Processing Requirements**:
  - Filter teachers by active status and instrument capability
  - Include only public-safe information (no PII beyond name/bio)
  - Provide availability summary without exposing specific slots
- **Data Transformations**: 
  - Convert internal teacher records to public-safe format
  - Generate availability summaries from current schedule data
- **Integration Points**: Data management service for teacher records

### Public Timeslot Discovery - GET /public/timeslots

#### Purpose
Provide available lesson timeslots for enrollment configurator with real-time availability

#### Input Requirements
- **Query Parameters**:
  - `teacher_id` (optional): Filter by specific teacher
  - `weekday` (optional): Filter by day of week (0-6, Sunday=0)
  - `active` (optional, default: true): Include only active/available slots
  - `start_date` (optional): Filter slots from specific date forward
  - `limit` (optional, default: 50): Maximum results to return
- **Headers**: Standard HTTP headers, no authentication required
- **Validation Rules**:
  - teacher_id must be valid UUID if provided
  - weekday must be integer 0-6 if provided
  - start_date must be valid ISO 8601 date if provided
  - limit must be positive integer ≤100

#### Output Requirements
- **Response Data Structure**:
  ```json
  {
    "timeslots": [
      {
        "id": "uuid",
        "teacher_id": "uuid",
        "teacher_name": "string",
        "weekday": "integer (0-6)",
        "start_time": "HH:MM format",
        "end_time": "HH:MM format",
        "duration_minutes": "integer (30)",
        "available": "boolean",
        "next_available_date": "ISO 8601 date"
      }
    ],
    "total_count": "integer",
    "filters_applied": "object",
    "last_updated": "ISO 8601 timestamp"
  }
  ```
- **Success Response**: HTTP 200 with timeslot array
- **Error Responses**:
  - HTTP 400 for invalid query parameters
  - HTTP 404 if teacher_id not found
  - HTTP 500 for server errors
- **Performance Expectations**: ≤1s response time, 120s cache TTL

#### Business Logic
- **Key Processing Requirements**:
  - Calculate real-time availability based on current bookings
  - Apply semester-based scheduling constraints
  - Include teacher information for context
  - Respect 30-minute lesson duration standard
- **Data Transformations**:
  - Convert internal scheduling data to public format
  - Calculate next available dates for recurring slots
  - Filter out past dates and unavailable periods
- **Integration Points**: 
  - Data management service for schedule data
  - Teacher service for teacher information

### Public Pricing Information - GET /public/pricing

#### Purpose
Provide current pricing information for display on pricing page and enrollment flow

#### Input Requirements
- **Query Parameters**:
  - `billing_frequency` (optional): monthly|yearly|semester
- **Headers**: Standard HTTP headers, no authentication required
- **Validation Rules**:
  - billing_frequency must be one of allowed values if provided

#### Output Requirements
- **Response Data Structure**:
  ```json
  {
    "base_monthly_price": "decimal",
    "pricing_options": [
      {
        "frequency": "monthly|yearly|semester",
        "price_per_period": "decimal",
        "total_periods": "integer",
        "discount_percentage": "decimal (optional)",
        "description": "string"
      }
    ],
    "current_semester": {
      "id": "uuid",
      "name": "string",
      "start_date": "ISO 8601 date",
      "end_date": "ISO 8601 date"
    },
    "currency": "string (CAD)",
    "last_updated": "ISO 8601 timestamp"
  }
  ```
- **Success Response**: HTTP 200 with pricing data
- **Error Responses**: HTTP 500 for server errors
- **Performance Expectations**: ≤100ms response time, 120s cache TTL

#### Business Logic
- **Key Processing Requirements**:
  - Calculate pricing for different billing frequencies
  - Apply semester-based commitment rules
  - Include current semester information for commitment display
- **Data Transformations**:
  - Convert internal pricing rules to public display format
  - Calculate effective pricing with any applicable discounts
- **Integration Points**: 
  - Pricing service for current rates
  - Configuration service for semester information

### Public Instrument Catalog - GET /public/instruments

#### Purpose
Provide available instruments for enrollment configurator selection

#### Input Requirements
- **Query Parameters**:
  - `active` (optional, default: true): Include only active instruments
- **Headers**: Standard HTTP headers, no authentication required
- **Validation Rules**: active must be boolean if provided

#### Output Requirements
- **Response Data Structure**:
  ```json
  {
    "instruments": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string (optional)",
        "icon_url": "string (optional)",
        "sort_order": "integer",
        "active": "boolean"
      }
    ],
    "total_count": "integer",
    "last_updated": "ISO 8601 timestamp"
  }
  ```
- **Success Response**: HTTP 200 with instrument array
- **Error Responses**: HTTP 500 for server errors
- **Performance Expectations**: ≤100ms response time, 300s cache TTL

#### Business Logic
- **Key Processing Requirements**:
  - Return active instruments in display order
  - Include display information for frontend rendering
- **Data Transformations**: Convert internal instrument data to public format
- **Integration Points**: Configuration service for instrument catalog

## Data Model Requirements

### Teacher Entity
- **Purpose**: Represent music instructors and their capabilities
- **Attributes**:
  - `id`: UUID primary identifier
  - `name`: String, full display name (required)
  - `bio`: Text, public biography (max 500 characters)
  - `photo_url`: String, profile photo URL (optional)
  - `email`: String, contact email (private, not exposed publicly)
  - `phone`: String, contact phone (private, not exposed publicly)
  - `active`: Boolean, whether teacher is currently accepting students
  - `created_at`: Timestamp, record creation
  - `updated_at`: Timestamp, last modification
- **Relationships**:
  - Many-to-many with Instrument (teachers can teach multiple instruments)
  - One-to-many with Timeslot (teachers have multiple available time slots)
  - One-to-many with Lesson (teachers conduct lessons)
- **Business Rules**:
  - Name must be unique within active teachers
  - Bio is required for public display
  - At least one instrument relationship required for active teachers
- **Audit Requirements**:
  - Track all changes to teacher profiles
  - Log public data access for analytics

### Instrument Entity
- **Purpose**: Represent musical instruments available for lessons
- **Attributes**:
  - `id`: UUID primary identifier
  - `name`: String, instrument name (required, unique)
  - `description`: Text, instrument description for public display
  - `icon_url`: String, icon/image URL for UI display
  - `sort_order`: Integer, display ordering
  - `active`: Boolean, whether instrument is currently offered
  - `created_at`: Timestamp, record creation
  - `updated_at`: Timestamp, last modification
- **Relationships**:
  - Many-to-many with Teacher (instruments can be taught by multiple teachers)
  - One-to-many with Lesson (lessons are for specific instruments)
- **Business Rules**:
  - Name must be unique across all instruments
  - Sort order determines display sequence in UI
  - Cannot deactivate instrument with active lessons
- **Audit Requirements**:
  - Track changes to instrument catalog
  - Log selection frequency for optimization

### Timeslot Entity
- **Purpose**: Represent recurring weekly lesson time availability
- **Attributes**:
  - `id`: UUID primary identifier
  - `teacher_id`: UUID, foreign key to Teacher (required)
  - `weekday`: Integer, day of week (0=Sunday, 6=Saturday)
  - `start_time`: Time, lesson start time
  - `end_time`: Time, lesson end time
  - `duration_minutes`: Integer, lesson duration (default 30)
  - `active`: Boolean, whether slot is available for booking
  - `max_students`: Integer, maximum concurrent students (default 1)
  - `created_at`: Timestamp, record creation
  - `updated_at`: Timestamp, last modification
- **Relationships**:
  - Many-to-one with Teacher (timeslots belong to specific teacher)
  - One-to-many with Lesson (timeslots can have multiple lessons over time)
- **Business Rules**:
  - Duration must be 30 minutes for standard lessons
  - Start and end times must align with duration
  - No overlapping timeslots for same teacher
  - Weekday must be 0-6 (Sunday-Saturday)
- **Audit Requirements**:
  - Track availability changes
  - Log booking attempts and success rates

### Semester Entity
- **Purpose**: Represent academic commitment periods for lesson scheduling
- **Attributes**:
  - `id`: UUID primary identifier
  - `name`: String, semester name (e.g., "Fall 2025")
  - `start_date`: Date, semester start date
  - `end_date`: Date, semester end date
  - `active`: Boolean, whether this is the current semester
  - `registration_open`: Boolean, whether enrollment is open
  - `created_at`: Timestamp, record creation
  - `updated_at`: Timestamp, last modification
- **Relationships**:
  - One-to-many with Lesson (lessons are scheduled within semesters)
  - Referenced by pricing calculations
- **Business Rules**:
  - Only one semester can be active at a time
  - Start date must be before end date
  - No overlapping semester date ranges
  - Name must be unique
- **Audit Requirements**:
  - Track semester transitions
  - Log enrollment periods and statistics

### Pricing Configuration Entity
- **Purpose**: Store current pricing rules and billing options
- **Attributes**:
  - `id`: UUID primary identifier
  - `base_monthly_price`: Decimal, standard monthly lesson price
  - `billing_frequency`: Enum, monthly|yearly|semester
  - `price_multiplier`: Decimal, adjustment factor for frequency
  - `discount_percentage`: Decimal, optional discount (0-100)
  - `effective_date`: Date, when pricing becomes active
  - `active`: Boolean, whether pricing rule is current
  - `created_at`: Timestamp, record creation
  - `updated_at`: Timestamp, last modification
- **Relationships**:
  - Referenced by enrollment and billing processes
- **Business Rules**:
  - Only one pricing configuration per billing frequency can be active
  - Base monthly price must be positive
  - Effective date cannot be in the past when created
  - Discount percentage must be 0-100
- **Audit Requirements**:
  - Track all pricing changes with approval workflow
  - Maintain pricing history for billing consistency

## Integration Requirements

### Protected Enrollment System
- **Purpose**: Handoff enrollment data to protected application for completion
- **Data Exchange**: 
  - Outbound: enrollment context via URL parameters
  - Parameters: instrument_id, teacher_id (optional), timeslot_id (optional), source=public_site
- **Frequency**: Real-time on enrollment completion
- **Error Handling**: 
  - Graceful degradation if handoff URL unavailable
  - Retry mechanism for temporary failures
  - User notification of handoff status
- **Security**: 
  - Use UUIDs only (no PII in URLs)
  - Validate all parameters before handoff
  - Log handoff attempts for tracking

### Email Service Integration
- **Purpose**: Support contact form submissions from public website
- **Data Exchange**: 
  - Inbound: contact form data via third-party service (Formspree)
  - Outbound: email notifications to academy staff
- **Frequency**: Real-time on form submission
- **Error Handling**: 
  - Client-side validation before submission
  - Graceful error messages for users
  - Fallback contact information display
- **Security**: 
  - Honeypot spam protection
  - Rate limiting on submissions
  - No server-side PII storage

### Caching Layer Integration
- **Purpose**: Improve performance and reduce database load for public endpoints
- **Data Exchange**: 
  - Cache public API responses with appropriate TTL
  - Background refresh for stale-while-revalidate pattern
- **Frequency**: 120-second TTL with background revalidation
- **Error Handling**: 
  - Serve stale data if backend unavailable
  - Circuit breaker pattern for backend failures
  - Cache invalidation on data updates
- **Security**: 
  - No caching of error responses
  - Separate cache keys for different query parameters

## Security Requirements

### Authentication & Authorization
- **User Management**: No user authentication required for public endpoints
- **Session Management**: Stateless API design, no session management needed
- **Access Control**: 
  - Public endpoints accessible without authentication
  - Rate limiting to prevent abuse
  - IP-based throttling for excessive requests
- **Token Management**: Not applicable for public-only endpoints

### Data Protection
- **Encryption**: 
  - HTTPS required for all API communications
  - Encrypt sensitive data at rest (teacher contact information)
  - No PII in cache or logs
- **Privacy**: 
  - Minimal data exposure in public endpoints
  - No student or parent information in public APIs
  - Compliance with Canadian privacy regulations (PIPEDA)
- **Audit Logging**: 
  - Log all API access with IP addresses
  - Track data access patterns for security monitoring
  - No logging of PII in audit trails
- **Compliance**: 
  - PIPEDA compliance for Canadian privacy law
  - Secure data handling practices
  - Regular security assessments

## Performance & Scalability Requirements

### Performance Targets
- **Response Times**: 
  - Teacher data: ≤500ms (95th percentile)
  - Timeslot queries: ≤1s (95th percentile)
  - Pricing data: ≤100ms (95th percentile)
  - Configuration data: ≤50ms (95th percentile)
- **Throughput**: 
  - Support 1000+ concurrent public users
  - Handle 10,000+ API requests per hour
  - Peak load during enrollment periods
- **Availability**: 
  - 99.9% uptime during business hours (8 AM - 8 PM PT)
  - 99.5% uptime overall
  - Graceful degradation during maintenance

### Scalability Needs
- **Growth Projections**: 
  - Support growth from 10 to 100+ students over 2 years
  - Handle 5x traffic spikes during enrollment periods
  - Scale to multiple teachers and locations
- **Peak Load Handling**: 
  - Auto-scaling for traffic bursts
  - Queue management for high-volume periods
  - Load balancing across multiple instances
- **Resource Optimization**: 
  - Efficient database queries with proper indexing
  - Connection pooling for database access
  - CDN integration for static assets

## Operational Requirements

### Monitoring & Observability
- **Health Checks**: 
  - Endpoint health monitoring (/health, /ready)
  - Database connectivity checks
  - External service dependency monitoring
- **Metrics Collection**: 
  - API response times and error rates
  - Database query performance
  - Cache hit/miss ratios
  - Business metrics (enrollment conversion rates)
- **Error Tracking**: 
  - Structured error logging with correlation IDs
  - Alert thresholds for error rates
  - Integration with monitoring platforms
- **Logging**: 
  - Structured JSON logging
  - Request/response correlation
  - Performance timing data
  - No PII in log messages

### Deployment & Maintenance
- **Environment Management**: 
  - Separate development, staging, and production environments
  - Environment-specific configuration management
  - Blue-green deployment capability
- **Configuration Management**: 
  - Externalized configuration via environment variables
  - Secure secrets management
  - Feature flags for gradual rollouts
- **Backup & Recovery**: 
  - Daily automated database backups
  - Point-in-time recovery capability
  - Disaster recovery procedures
  - Data retention policies (7 years for business records)
- **Update Procedures**: 
  - Zero-downtime deployment process
  - Database migration strategies
  - Rollback procedures for failed deployments
  - Canary releases for major changes

## Success Criteria

### Functional Requirements
- [ ] Public teacher discovery API returns accurate, up-to-date teacher information
- [ ] Timeslot availability API provides real-time scheduling data
- [ ] Pricing API delivers current rates with semester commitment information
- [ ] Enrollment handoff successfully transfers context to protected system
- [ ] Contact form integration processes inquiries without server-side PII storage

### Non-Functional Requirements
- [ ] All public APIs respond within performance targets (95th percentile)
- [ ] System maintains 99.9% uptime during business hours
- [ ] Cache layer achieves 120-second TTL with background refresh
- [ ] Security audit passes with no critical vulnerabilities
- [ ] Load testing validates 1000+ concurrent user capacity

### Integration Requirements
- [ ] Enrollment handoff URL construction includes all required parameters
- [ ] Protected system integration handles missing parameters gracefully
- [ ] Email service integration processes contact forms successfully
- [ ] Caching layer improves response times by 50%+ over direct database access
- [ ] Mock-to-live data switching works seamlessly without downtime

### Business Requirements
- [ ] Support 20% enrollment increase goal through improved conversion
- [ ] Enable semester-based commitment model with clear pricing
- [ ] Provide real-time availability to reduce enrollment friction
- [ ] Maintain single-teacher studio model with growth capability
- [ ] Support Canadian privacy compliance (PIPEDA)