# Cedar Heights Music Academy — Design Brief
**Version 1.0 | Date: August 21, 2025**

## Executive Summary

This Design Brief establishes the comprehensive UI/UX foundation for Cedar Heights Music Academy's public marketing website. The goal is to create a **beautiful, useful, and clean** interface that increases enrollment by 20% in 6 months through a conversion-focused, nurturing user experience that guides parents seamlessly from discovery to enrollment.

## Design Vision Statement

**"A warm, nurturing digital community where parents feel confident their child will be cared for, encouraged, and inspired to grow musically."**

### Core Emotional Goal
**Warmth & Nurturing Community** - Parents should immediately feel this is a safe, supportive environment where their child will be cared for and encouraged, not just a business transaction.

### Emotional Consistency Strategy
Maintain the same warm, supportive tone throughout all pages (Home → About → Pricing → Enroll) for maximum emotional consistency and trust-building.

## Visual Design System

### Design Authority
- **Primary Source**: Figma Design System - https://www.figma.com/design/8iXCoxrnEkJaAEVERBY4wr/Music?node-id=0-1&p=f&t=mEFgAvR3fs6muKHj-0
- **Constraint**: Strict adherence required for brand trust and consistency
- **Reference Materials**: Design elements in `ai_docs/context/design_elements/` (Button.png, hero.png, image_cluster.png, navigation.png, scheduling.png, secondary_section.png)

### Color Palette
- **Primary**: Warm browns (#2c1810, #8b4513, #a0522d)
- **Accent**: Gold (#ffd700, #ffed4e)
- **Strategy**: Maintain exact Figma color relationships across all pages for maximum brand recognition
- **Application**: Colors convey warmth, quality, and approachability

### Typography
- **Current Foundation**: System fonts with clean hierarchy
- **Requirement**: Follow Figma typography specifications exactly
- **Accessibility**: Ensure WCAG 2.1 AA contrast ratios

## Unique Features & Innovations

### Seasonal Background System
- **Concept**: Hero background changes based on time of year
- **Assets**: 
  - Summer: `summer_bg_lrg.png`
  - Fall: `fall_bg_lrg.png` 
  - Winter: `winter_bg_lrg.png`
- **Benefits**: Creates returning visitor engagement and seasonal relevance
- **Implementation**: Date-based logic for automatic background selection

### Character Assets
- **Available**: `boy+guitar.png`, `girl+guitar.png`, `girl&guitar.png`
- **Usage**: Friendly, approachable imagery supporting the nurturing community feeling
- **Brand Elements**: `logo.JPG`, `Group 255.png`, `Mask group.png`

## Information Architecture

### Page Structure (Per PRD)
- **Home (/)**: Hero with primary CTA, value propositions
- **About (/about)**: Studio story, teacher bios with photos
- **Pricing (/pricing)**: Billing frequency selection, indicative pricing
- **Enroll (/enroll)**: 3-step configurator → handoff to protected app
- **Contact (/contact)**: Client-side form via Formspree
- **Privacy (/privacy)** & **Terms (/terms)**: Static policy pages

### Navigation Strategy
- **Global Navigation**: Home, About, Pricing, Enroll, Contact
- **Footer**: Privacy, Terms, contact links
- **Consistency**: Maintain warm, nurturing tone across all touchpoints

## User Experience Design

### Primary User Journey
**Discovery → Trust Building → Enrollment**
1. **Home**: Immediate warmth and community feeling
2. **About**: Deepen trust through teacher expertise and studio story
3. **Pricing**: Transparent, approachable pricing information
4. **Enroll**: Streamlined conversion experience
5. **Handoff**: Seamless transition to protected enrollment system

### Enrollment Configurator UX
- **Strategy**: Streamlined wizard experience
- **Goal**: Fast, simple steps with clear progress indicators to minimize drop-off
- **Flow**: 
  1. Instrument selection (mapped to instrument_id)
  2. Preferred timeslot selection (from live API data)
  3. Billing frequency (monthly | yearly | semester)
- **Completion**: Immediate redirect to protected app with context parameters

### Progress Indicators
- **Visual**: Clear step progression (1 of 3, 2 of 3, 3 of 3)
- **Accessibility**: Screen reader announcements for progress
- **Design**: Consistent with Figma design system

## Accessibility Standards

### Compliance Level
**WCAG 2.1 AA** - Full industry standard accessibility for maximum inclusivity

### Key Requirements
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Readers**: Proper semantic HTML, ARIA labels, and announcements
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Descriptive alt text for all images
- **Form Accessibility**: Proper labels, error messages, and validation feedback

### Implementation Strategy
- Semantic HTML5 structure
- ARIA landmarks and roles
- Skip navigation links
- Accessible form design with clear error handling
- Screen reader testing throughout development

## Performance Requirements

### Core Web Vitals Targets (75th percentile mobile)
- **LCP (Largest Contentful Paint)**: ≤ 2.5 seconds
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **FID (First Input Delay)**: ≤ 100ms

### Optimization Strategy
- **Images**: Optimize and lazy-load all assets
- **Seasonal Backgrounds**: Preload current season, lazy-load others
- **Bundle**: Tree shaking, code splitting, minimize bundle sizes
- **Caching**: Leverage browser caching and CDN for static assets
- **Critical Path**: Prioritize above-the-fold content loading

## Technical Implementation

### Technology Stack
- **Framework**: React + Vite
- **Language**: TypeScript (per architecture requirements)
- **Routing**: react-router-dom
- **State Management**: TanStack Query for API caching
- **Styling**: Tailwind CSS configured to match Figma tokens
- **Performance**: Lazy loading, code splitting, optimized images

### Data Integration
- **Week 1**: Mock data for development
- **Pre-launch**: Live API endpoints
  - GET /public/teachers
  - GET /public/timeslots?teacher_id=&weekday=&active=true
- **Caching**: 120-second TTL with stale-while-revalidate

### Handoff Integration
- **Target URL**: https://app.cedarheightsmusic.com/enroll/start
- **Parameters**: instrument_id, teacher_id, timeslot_id, billing_frequency, source=public_site
- **Behavior**: Immediate redirect on configurator completion

## Component Design Patterns

### Reusable Components (Based on Figma)
- **Buttons**: Primary CTA, secondary actions, form buttons
- **Cards**: Teacher profiles, pricing options, feature highlights
- **Forms**: Contact form, configurator steps
- **Navigation**: Header navigation, footer links
- **Progress**: Step indicators, loading states
- **Modals**: Error messages, confirmations (if needed)

### Responsive Design
- **Mobile-First**: Primary design approach
- **Breakpoints**: Follow Figma responsive specifications
- **Touch Targets**: Minimum 44px for accessibility
- **Content Priority**: Ensure key actions remain prominent on all devices

## Content Strategy

### Voice & Tone
- **Warm**: Approachable and friendly language
- **Supportive**: Encouraging and nurturing
- **Professional**: Competent without being intimidating
- **Local**: Cedar/Nanaimo community connection
- **Consistent**: Same tone across all pages

### Key Messaging
- **Home**: "Nurturing young musicians in a supportive environment"
- **About**: Teacher expertise and studio community
- **Pricing**: Transparent, value-focused pricing
- **Enroll**: Simple, confident enrollment process
- **Contact**: Open communication and support

## Error Handling & Edge Cases

### Graceful Degradation
- **API Failures**: Fallback to cached data or helpful error messages
- **Image Loading**: Placeholder images while loading
- **JavaScript Disabled**: Basic functionality still available
- **Slow Connections**: Progressive loading with clear feedback

### User Feedback
- **Loading States**: Clear indicators during API calls
- **Error Messages**: Helpful, actionable error text
- **Success States**: Confirmation of completed actions
- **Form Validation**: Real-time, accessible validation feedback

## Success Metrics

### Conversion Goals
- **Primary**: 15 completed enrollments per month via public site
- **Secondary**: Increased click-through to enrollment flow
- **Tertiary**: Improved time-on-site and page engagement

### User Experience Metrics
- **Performance**: Meet Core Web Vitals targets
- **Accessibility**: Pass WCAG 2.1 AA automated and manual testing
- **Usability**: Low bounce rate on enrollment configurator
- **Trust**: Increased completion rate of contact forms

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Implement page structure and navigation
- Build configurator with mock data
- Establish design system components
- Implement seasonal background logic

### Phase 2: Integration (Week 2)
- Connect to live API endpoints
- Add real teacher content and photos
- Performance optimization and testing
- Accessibility audit and fixes

### Phase 3: Launch Preparation
- Final Figma design adherence review
- Cross-browser testing
- Performance validation
- Accessibility compliance verification

## Risk Mitigation

### Design Risks
- **Figma Adherence**: Regular design reviews against Figma source
- **Performance Impact**: Optimize seasonal backgrounds and character assets
- **Accessibility Compliance**: Continuous testing throughout development
- **Mobile Experience**: Prioritize mobile-first responsive design

### Technical Risks
- **API Integration**: Mock-first development with swappable data layer
- **Performance Targets**: Early and continuous performance monitoring
- **Browser Compatibility**: Test across target browser matrix
- **Seasonal Logic**: Robust date-based background selection

## Conclusion

This Design Brief establishes Cedar Heights Music Academy's website as a warm, nurturing digital community that converts visitors into enrolled students through a beautiful, accessible, and performant user experience. The combination of seasonal backgrounds, streamlined enrollment flow, and consistent emotional tone creates a unique and memorable experience that builds trust and drives enrollment.

The strict adherence to Figma designs, WCAG 2.1 AA accessibility standards, and aggressive performance targets ensures the site will serve all users effectively while achieving the business goal of 20% enrollment increase within 6 months.