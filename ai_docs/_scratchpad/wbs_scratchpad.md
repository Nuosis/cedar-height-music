# WBS Scratchpad — Cedar Heights Music Public Website

## MAJOR UPDATE: Wireframes Completed (Phase 04)

**Status:** Wireframes completed with high-fidelity styling and validation framework
**Date:** 2025-08-28
**Phase 04 Achievements:**
- ✅ High-fidelity wireframes with Page Blueprints compliance
- ✅ Design system tokens extracted and documented
- ✅ Seasonal background system implemented
- ✅ Typography lockup table completed
- ✅ Screenshot validation framework established
- ✅ Component boundaries defined with data attributes
- ✅ Responsive breakpoint behaviors validated

## Key Changes from Original WBS

### New Foundation: Wireframe-Based Development
- Wireframes now serve as authoritative visual reference
- Design tokens extracted and ready for React implementation
- Component structure defined with measurement points
- Validation framework established for visual compliance

### Updated Design System Tokens (Ready for Implementation)
```css
/* High Priority Tokens */
--color-primary-green: #99E39E;
--color-dark-text: #000510;
--color-warm-yellow: #ffd700;
--color-warm-gold: #F3DA94;
--color-warm-off-white: #FCF4E2;

--font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-size-hero: 3.5rem; /* 56px */
--font-size-heading: 2.5rem; /* 40px */
--font-size-body: 1rem; /* 16px */

--content-width: 1300px;
--content-padding-desktop: 80px;
--content-padding-tablet: 48px;
--content-padding-mobile: 24px;
--section-spacing-desktop: 120px;
```

### New Implementation Approach
1. **Wireframe-to-React Migration**: Convert HTML wireframes to React components
2. **Design System First**: Implement tokens before components
3. **Component Library**: Extract reusable components from wireframes
4. **Validation-Driven**: Use screenshot comparison for visual regression testing

## Updated WBS Structure

### Phase 05: React Implementation (NEW)
- Convert wireframe HTML to React components
- Implement design system tokens
- Create component library
- Establish visual regression testing

### Updated Dependencies
- React implementation depends on wireframe completion ✅
- Design tokens available for immediate use ✅
- Component boundaries defined ✅
- Responsive behaviors validated ✅

## Original Context (Still Valid)
- Context loaded: project_charter.md, prd.md (v0.1 outline), add.md (architecture draft)
- MVP scope: Public website only; no auth; mock→live switch pre-launch
- Key endpoints (public): GET /public/teachers, GET /public/timeslots
- Handoff URL: https://app.cedarheightsmusic.com/enroll/start with params instrument_id, teacher_id (optional), timeslot_id, billing_frequency, source=public_site
- Pages: /, /about, /pricing, /enroll, /contact, /privacy, /terms
- Priority: Build IA + Enroll configurator; strict visual adherence; performance targets

## Open Questions (Updated)
- ✅ Design tokens extracted from wireframes
- ✅ Component structure defined
- ✅ Responsive behaviors validated
- ❓ Canonical instruments + IDs (OQ-1 PRD) - Still needed
- ❓ Final copy for pages (OQ-2 PRD) - Still needed
- ❓ Indicative pricing values by frequency (OQ-3 PRD) - Still needed
- ❓ Production API domain and CORS (add.md Q2) - Still needed

## Updated Implementation Areas

### 1) Design System Implementation (NEW - HIGH PRIORITY)
- Extract CSS custom properties from wireframe-styles.css
- Create React design system with tokens
- Implement component library (Button, Card, Navigation, etc.)
- Establish theme provider and context

### 2) Wireframe-to-React Migration (NEW)
- Convert wireframe HTML to React components
- Maintain 100% visual fidelity to wireframes
- Implement component composition patterns
- Add React-specific interactivity

### 3) Project Setup (UPDATED)
- Vite React app with TypeScript
- Install dependencies: react-router-dom, @tanstack/react-query
- Configure Tailwind with extracted design tokens
- Set up component library structure

### 4) Component Library (NEW)
- Navigation component with mobile menu
- Footer component with social links
- Modal component for enrollment
- Form components with validation
- Card components for content sections

### 5) Data Layer (UNCHANGED)
- Mock data JSONs (instruments, teachers, timeslots)
- Data service with source toggle (mock|live)
- TanStack Query setup with staleTime=120_000ms
- Error/loading handling patterns

### 6) Page Implementation (UPDATED APPROACH)
- Convert wireframe pages to React
- Implement seasonal background system
- Add interactive behaviors (accordion, modal, form)
- Maintain responsive breakpoint behaviors

### 7) Enrollment Flow (ENHANCED)
- 3-step modal stepper from wireframes
- State management for form data
- URL builder for handoff redirect
- Loading states and error handling

### 8) Performance & SEO (ENHANCED)
- Image optimization for seasonal backgrounds
- Lazy loading for non-critical assets
- Core Web Vitals monitoring
- Meta tags and favicon

### 9) Testing Strategy (UPDATED)
- Visual regression testing with Playwright screenshots
- Component unit tests
- Integration tests for enrollment flow
- Cross-browser compatibility testing

### 10) Deployment (ENHANCED)
- Vercel deployment with wireframe assets
- Environment configuration for API endpoints
- Preview deployments for validation
- Production deployment checklist

## Updated Sprint Planning

### Week 1: Design System + Core Components
- Extract and implement design tokens
- Create component library foundation
- Convert navigation and footer components
- Set up React project structure

### Week 2: Page Implementation
- Convert wireframe pages to React
- Implement enrollment modal flow
- Add data layer and API integration
- Performance optimization and testing

## Risks & Mitigations (Updated)
- ✅ Visual design uncertainty - RESOLVED with wireframes
- ✅ Component structure unknown - RESOLVED with wireframe components
- ❓ CORS/endpoint readiness - Mock-first approach maintained
- ❓ Content timing - Placeholders in wireframes ready
- ❓ Performance regressions - Validation framework established

## Next Steps
1. Update WBS document with wireframe-based approach
2. Create detailed React implementation plan
3. Define component migration strategy
4. Establish visual regression testing workflow
5. Update sprint timeline based on wireframe foundation

---
**Status:** Ready to update main WBS document with wireframe-informed implementation plan