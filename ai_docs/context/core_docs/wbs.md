# Work Breakdown Structure (WBS) — Cedar Heights Music Public Website (v1)

Status: Updated version incorporating completed wireframes (Phase 04) and design system foundation. Includes wireframe-to-React migration strategy, extracted design tokens, and visual regression testing approach. Testing scope: unit tests, visual regression, manual QA; Vercel previews; no CI.

References:
- Project Charter: ai_docs/context/core_docs/project_charter.md
- PRD: ai_docs/context/core_docs/prd.md
- Architecture Draft: ai_docs/context/core_docs/add.md
- Page Blueprints: ai_docs/context/core_docs/page_blueprints.md
- Wireframes: wireframes/ (Phase 04 completed)
- Phase 04 Summary: wireframes/phase04_completion_summary.md
- Frontend Integration Guide: ai_docs/guides/FRONTEND_INTEGRATION_GUIDE.md

Assumptions and Constraints:
- Solo developer
- 2-week timeline
- Public website only; no auth; mock→live endpoint switch pre-launch
- Public endpoints: GET /public/teachers, GET /public/timeslots?teacher_id=&weekday=&active=true
- Handoff URL: https://app.cedarheightsmusic.com/enroll/start
- Minimal automated testing (unit tests, visual regression); manual QA; Vercel previews; no CI for v1
- Edge caching SWR TTL = 120s; TanStack Query staleTime aligned to 120_000ms

MAJOR UPDATE - Phase 04 Wireframes Completed (2025-08-28):
✅ High-fidelity wireframes with Page Blueprints compliance
✅ Design system tokens extracted and documented
✅ Seasonal background system implemented
✅ Typography lockup table completed (Hero: 56px, Heading: 40px, Body: 16px)
✅ Screenshot validation framework established with Playwright
✅ Component boundaries defined with data attributes
✅ Responsive breakpoint behaviors validated (Desktop: ≥1200px, Tablet: 768-1199px, Mobile: <768px)

MAJOR UPDATE - Phase 01 Foundation Setup Completed (2025-08-29):
✅ Design tokens published to src/styles/tokens.css and imported in src/index.css
✅ React Router and TanStack Query providers configured (staleTime=120_000ms)
✅ TypeScript initialized with strict config (tsconfig.json)
✅ ESLint + Prettier baseline configured; scripts added to package.json
✅ Environment helpers and .env.example scaffold added; undefined guards implemented
✅ Project builds with Vite; base folders scaffolded (src/pages, src/styles, src/services)

MAJOR UPDATE - Phase 02 Core Components Completed (2025-08-29):
✅ React core components implemented per wireframes:
   - Header/Navigation (sticky, active states, mobile overlay, ARIA, focus styles)
   - Footer (brand, quick links, legal, connect/social)
   - Buttons (Primary/Secondary, aliases: .primary-cta/.secondary-cta) aligned to tokens
   - Card primitive
   - Enrollment Modal shell with 3-step progress (Instrument → Time → Review), keyboard nav, focus trap, Escape to close
✅ Integrated into app shell:
   - Imported core components in [src/App.jsx](src/App.jsx:1)
   - Added main landmark and wired onEnrollClick to open modal
   - Tokens and responsive breakpoints applied from [src/styles/tokens.css](src/styles/tokens.css:1)
Deliverable: Core components render with visual fidelity across desktop/tablet/mobile; accessibility behaviors in place
Dependencies: Completed (builds on Phase 01 tokens/providers)

Design System Tokens Available:
- Colors: Primary green #99E39E, Dark text #000510, Warm yellow #ffd700, Warm gold #F3DA94, Off-white #FCF4E2
- Typography: System font stack, Hero 3.5rem, Heading 2.5rem, Body 1rem
- Layout: Content width 1300px, Desktop padding 80px, Tablet 48px, Mobile 24px
- Spacing: Section spacing Desktop 120px, Tablet 80px, Mobile 56px

Open Questions (Updated):
✅ Design tokens extraction - RESOLVED from wireframes
✅ Component structure - RESOLVED with wireframe components
✅ Responsive behaviors - RESOLVED and validated
- OQ-1: Canonical instruments + IDs for mapping (still needed)
- OQ-2: Final copy for value props, teacher bios, privacy, terms (still needed)
- OQ-3: Backend pricing source and school calendar integration (pending)
- Temporary: One monthly price shown ($125 placeholder), commitment = current semester (policy text from user; DB-backed when available)
- Confirm production API domain/CORS readiness (noted as https://api.cedarheightsmusic.com in add.md)

--------------------------------------------------------------------------------
1) Feature-Area WBS (Wireframe-Informed Breakdown with Dependencies)
--------------------------------------------------------------------------------

0. Design System Implementation (NEW - HIGH PRIORITY)
- Extract CSS custom properties from wireframe-styles.css
- Create React design system with tokens from wireframes:
  - Colors: Primary green #99E39E, Dark text #000510, Warm yellow #ffd700, etc.
  - Typography: System font stack, Hero 3.5rem, Heading 2.5rem, Body 1rem
  - Layout: Content width 1300px, responsive padding (80px/48px/24px)
  - Spacing: Section spacing (120px/80px/56px), border radius scale
- Implement ThemeProvider and design token context
- Create base component library: Button, Card, Typography, Layout containers
- Establish component composition patterns from wireframes
Deliverable: React design system with wireframe-extracted tokens
Dependencies: None (wireframes completed)

1. Project Setup (UPDATED)
- Initialize TypeScript configuration; ensure React + Vite + TS integrated
- Install dependencies: react-router-dom, @tanstack/react-query, clsx, tailwindcss (optional)
- Configure Tailwind with extracted design tokens (if using) or CSS custom properties
- Environment handling:
  - .env.* files (dev/stage/prod) for API_BASE_URL
  - Guard undefined values in code paths
- Vercel project onboarding:
  - Link repo with wireframe assets
  - Configure env vars for preview/prod
  - vercel.json adjustments if needed
- Linting/formatting baseline: ESLint + Prettier
Deliverable: Running app shell with design system configured
Dependencies: Design System Implementation

2. Wireframe-to-React Migration (NEW)
- Convert wireframe HTML components to React:
  - Navigation component with mobile menu behavior
  - Footer component with social links and legal pages
  - Modal component for enrollment flow
- Maintain 100% visual fidelity to wireframes
- Implement React-specific interactivity (state management, event handlers)
- Add component composition patterns and prop interfaces
- Preserve responsive breakpoint behaviors from wireframes
Deliverable: React components matching wireframe visual specifications
Dependencies: Design System Implementation, Project Setup

3. Data Layer (UNCHANGED)
- Define TypeScript types: Instrument, Teacher, Timeslot
- Create local mock JSON: instruments.json, teachers.json, timeslots.json
- Data service with source toggle (mock|live) via configuration flag
- Live fetchers:
  - getTeachers(): GET /public/teachers
  - getTimeslots(params): GET /public/timeslots?teacher_id=&weekday=&active=true
- TanStack Query setup:
  - QueryClientProvider
  - defaultOptions: staleTime=120_000 (align with SWR)
- Error/loading handling pattern:
  - Retry strategy (conservative)
  - Component-level fallbacks and user-facing copy
Deliverable: Swappable mock/live data service; query layer wired
Dependencies: Project Setup

4. Home Page (/) - WIREFRAME-INFORMED
- Implement hero section with seasonal background system (JavaScript date logic)
- Character illustration positioning (boy+guitar.png) with overflow handling
- Value propositions three-column grid with icons
- About teaser section with two-column layout and girl+guitar.png
- Availability snippet with slot chips (200x100px, interactive)
- Micro-FAQ accordion component
- Responsive behavior: Desktop ≥1200px, Tablet 768-1199px, Mobile <768px
Deliverable: Home page matching wireframe visual specifications exactly
Dependencies: Wireframe-to-React Migration, Design System

5. About Page (/about) - WIREFRAME-INFORMED
- Hero section with "Teaching music with heart and patience" headline
- Character illustration (girl+guitar.png) with background composition
- Studio story two-column layout with image cluster (4-photo grid)
- Single teacher card (120x120 rounded photo, bio, availability chips)
- Compact CTA band with dark background
- Responsive image cluster behavior (hide on mobile)
Deliverable: About page with exact wireframe layout and interactions
Dependencies: Wireframe-to-React Migration, Design System

6. Pricing Page (/pricing) - WIREFRAME-INFORMED
- Hero section with transparent pricing messaging
- Single monthly price display ($125 placeholder; future: read from backend DB value)
- Commitment notice: "Commitment: current semester (aligned to school calendar)"
- Pricing breakdown with included features list
- Disclaimer: "Price shown is per month; final price confirmed during enrollment."
- Dark CTA section with primary/secondary button pair
Deliverable: Pricing section reflecting simplified pricing and semester commitment
Dependencies: Wireframe-to-React Migration, Design System

7. Enroll Modal (Modal Component) - WIREFRAME-INFORMED
- 3-step modal with progress indicator and navigation
- Step 1: Instrument selection grid (Piano, Guitar, Violin, Bass)
- Step 2: Timeslot selection with teacher information
- Step 3: Review & confirm — enrollment summary + semester commitment acknowledgment
- Modal overlay, close button, keyboard navigation
- Mobile-responsive full-screen behavior
- Integration with all pages via "Enroll Now" buttons
Deliverable: Fully functional enrollment modal matching wireframe UX
Dependencies: Wireframe-to-React Migration, Data Layer, Design System

8. Contact Page (/contact) - WIREFRAME-INFORMED
- Hero section with "We're here to help" messaging
- Two-column layout: contact form + direct contact info
- Form fields: Name, Email, Phone (optional), Message, consent checkbox
- Honeypot spam protection and client-side validation
- Success/failure states with clear messaging
- Direct contact methods with icons and formatting
Deliverable: Working contact form with wireframe layout and validation
Dependencies: Wireframe-to-React Migration, Design System

9. Privacy and Terms Pages (/privacy, /terms) - WIREFRAME-INFORMED
- Legal page layout with centered content (800px max-width)
- Typography hierarchy: Legal title, section headings, body text
- Table of contents generation for long pages
- Contact information blocks with styling
- Back to home navigation
- Print-friendly styles
Deliverable: Legal pages with proper typography and navigation
Dependencies: Wireframe-to-React Migration, Design System

10. Enrollment Handoff Utility
- URL builder utility:
  - Input: instrument_id (required), teacher_id (optional, implied by timeslot), timeslot_id (optional), source=fixed public_site
  - Output: https://app.cedarheightsmusic.com/enroll/start?instrument_id=&teacher_id=&timeslot_id=&source=public_site
- Omit undefined params; perform safe encoding
- Wire into Enroll completion handler
- Unit tests for URL builder
Deliverable: Reliable redirect builder with tests; integrated into flow
Dependencies: Enroll page partial, minimal test harness

11. Styling & Theming
- Tailwind token mapping aligned to Figma (colors, typography, spacing)
- Component tokens: buttons, inputs, cards, headings
- Breakpoints per Figma
Deliverable: Consistent styling across pages; near-pixel parity
Dependencies: Project Setup and initial pages

12. Performance & SEO
- Image optimization pass (sizes, formats, lazy loading)
- Basic metadata per page; favicon
- Optional bundle checks and route-based code splitting if needed
Deliverable: Meets LCP <= 2.5s and CLS <= 0.1 targets on 75th percentile mobile
Dependencies: Pages implemented

13. Testing & QA (Enhanced with Visual Regression)
- Unit tests:
  - URL builder with comprehensive parameter combinations
  - Data adapter toggle logic (mock vs live)
  - Seasonal background system date logic
  - Design system token validation
- Visual regression tests:
  - Playwright screenshot comparison against wireframe baselines
  - Component-level visual testing (buttons, cards, modals)
  - Responsive breakpoint validation (desktop/tablet/mobile)
  - Cross-browser visual consistency
- Manual QA checklist:
  - Cross-browser smoke testing (Chrome/Safari/Firefox latest)
  - Mobile device testing on actual devices
  - Navigation links and active states
  - Form submission and validation flows
  - Enrollment modal complete flow testing
  - Performance validation (Core Web Vitals)
Deliverable: Passing unit tests, visual regression suite, comprehensive manual QA
Dependencies: Wireframe-to-React Migration, Data/Handoff utilities

14. Deployment & Config (Updated)
- Vercel preview deployments with wireframe assets
- Production deploy checklist:
  - Content swap (teacher bios/photos from wireframe placeholders)
  - Switch to live endpoints for teachers/timeslots
  - Confirm CORS allowed origins for production domain
  - Verify API_BASE_URL environment values
  - Asset optimization and CDN configuration
  - Performance monitoring setup
- Final launch to production with monitoring
Deliverable: Production deployment with live data and performance monitoring
Dependencies: All functional areas, visual regression tests passing, CORS readiness

15. Observability & Monitoring (Enhanced)
- Performance monitoring:
  - Core Web Vitals tracking (LCP, CLS, FID)
  - Bundle size monitoring and alerts
  - API response time tracking
- Error monitoring:
  - Console error tracking in production
  - React error boundary implementation
  - Failed API request monitoring
- User experience monitoring:
  - Enrollment flow completion rates
  - Form submission success rates
  - Page load performance by device type
Deliverable: Comprehensive monitoring dashboard and alerting
Dependencies: Production deployment, performance optimization

Key Dependencies Summary (Updated)
- Design System Implementation is foundational for all React components
- Wireframe-to-React Migration depends on Design System completion
- All page implementations depend on Wireframe-to-React Migration
- Visual regression testing depends on wireframe baseline screenshots
- Performance optimization depends on React component implementation
- Deployment depends on visual regression tests passing and CORS readiness

--------------------------------------------------------------------------------
2) Development Phases (Ordered & Logical)
--------------------------------------------------------------------------------

PHASE 1: Foundation Setup (Days 1–2)
Goal: Establish development environment and design system foundation
Status: Completed 2025-08-29

- Project infrastructure
  - Initialize React + Vite + TypeScript configuration
  - Install core dependencies: react-router-dom, @tanstack/react-query, clsx
  - Configure ESLint + Prettier for code quality
  - Create base folders: src/components, src/pages, src/services, src/styles
  - Vercel project linked; env vars scaffolded (.env.development, .env.production)

- Design system extraction (from wireframes/wireframe-styles.css)
  - Colors: --color-primary-green (#99E39E), --color-dark-text (#000510), --color-warm-yellow (#ffd700), etc.
  - Typography: Hero 3.5rem, Heading 2.5rem, Body 1rem; system font stack
  - Spacing: Section spacing (120px/80px/56px); content padding (80px/48px/24px)
  - Radius/transition: 8/12/15px; 250ms ease-in-out
  - Output tokens to src/styles/tokens.css
  - Breakpoints: Desktop ≥1200px, Tablet 768–1199px, Mobile <768px
Exit Criteria:
- Dev server runs (hot reload ok)
- CSS custom properties published in tokens.css and used in base styles
- Lint/format configured; project skeleton in place

Phase 1 Outcome (2025-08-29):
- Tokens implemented in src/styles/tokens.css; imported in src/index.css
- Providers wired in src/main.jsx (BrowserRouter + React Query, staleTime=120_000ms)
- TypeScript config created in tsconfig.json; ESLint + Prettier configured with scripts in package.json
- Environment helpers added in src/config/env.js; scaffold provided in .env.example
- Build verified via npm run build (Vite)

PHASE 2: Core Components (Days 3–4)
Goal: Reusable components that match wireframes 1:1
Status: Completed 2025-08-29

- Layout
  - Header/Navigation (wireframes/components/navigation.html)
    - Sticky header, active link states, mobile hamburger/overlay
  - Footer (wireframes/components/footer.html)
    - Brand, quick links, legal, contact; mobile stacking behaviors

- UI
  - Buttons: Primary/Secondary (.primary-cta/.secondary-cta), focus/hover, a11y
  - Card primitives for value props and teacher card
  - Modal shell for enrollment with progress indicator

Exit Criteria:
- Components render with 100% visual fidelity (desktop/tablet/mobile)
- Keyboard/focus/ARIA implemented for nav and modal

Phase 2 Outcome (2025-08-29):
- Implemented React components: Header/Navigation, Footer, Buttons (Primary/Secondary), Card, Enrollment Modal shell
- Accessibility: nav ARIA roles/aria-expanded/aria-controls, visible focus rings; modal role="dialog" aria-modal, focus trap, Escape to close
- Responsive: mobile drawer for nav; modal full-screen on mobile; tokens-driven spacing/typography per wireframes
- Integrated into shell: Header/Footer rendered; Enroll actions open modal; main landmark added in [src/App.jsx](src/App.jsx:1)
- Source: [src/components/core.jsx](src/components/core.jsx:1) exports:
  - [JavaScript.Button()](src/components/core.jsx:533), [JavaScript.Card()](src/components/core.jsx:547), [JavaScript.Header()](src/components/core.jsx:556), [JavaScript.Footer()](src/components/core.jsx:680), [JavaScript.EnrollmentModalShell()](src/components/core.jsx:756)

PHASE 3: Pages (Days 5–7)
Goal: React pages exactly matching wireframes

- Static-heavy
  - Home (/): hero with seasonal background system, character positioning,
    value props grid, about teaser, availability slot chips (200×100), micro-FAQ accordion
  - About (/about): hero with girl+guitar illustration, studio story 2-col with 4-photo image cluster,
    single teacher card, compact CTA band

- Interactive
  - Pricing (/pricing): single monthly price display ($125 placeholder, later from backend),
    commitment notice (current semester), disclaimer block; dark CTA band
  - Contact (/contact): form (Name/Email/Phone/Message/Consent), honeypot, success/failure UX,
    direct contact info panel
  - Privacy/Terms (/privacy, /terms): legal template (800px max), headings hierarchy, optional TOC, print styles

Exit Criteria:
- Pixel parity to wireframes; interactions working (accordion, form)
- Mobile behaviors exactly match breakpoints and stacking rules

PHASE 4: Data Integration (Days 8–9)
Goal: Mock→live data pathway and enrollment handoff

- Data layer
  - Mock JSON: instruments.json, teachers.json, timeslots.json
  - Source toggle via env flag DATA_SOURCE=mock|live
  - TanStack Query wired (staleTime=120_000ms); error/loading states with copy
  - Live fetchers:
    - getTeachers(): GET /public/teachers
    - getTimeslots(params): GET /public/timeslots?teacher_id=&weekday=&active=true

- Enrollment flow
  - 3-step modal state: instrument → timeslot → review & confirm (semester commitment acknowledgment)
  - Handoff URL builder utility (tested)
    - https://app.cedarheightsmusic.com/enroll/start?instrument_id=&teacher_id=&timeslot_id=&source=public_site
  - Retry logic and friendly errors; skeletons/empties for timeslots

Exit Criteria:
- End-to-end flow works on mocks
- Switch to live ready (flag only); handoff URL correct for permutations

PHASE 5: Testing & QA (Days 10–11)
Goal: Guard visual fidelity and core logic

- Visual regression
  - Playwright baseline from wireframes/screenshots/*
  - Component shots: Nav (desktop/mobile), Footer, Modal steps, Buttons, Cards
  - Page shots: Home, About, Pricing, Contact (desktop/mobile)
  - Cross-browser: Chrome, Safari, Firefox

- Functional
  - Unit: urlBuilder (encoding/omission), dataAdapter (mock|live), seasonal background (date logic)
  - Integration: enrollment flow (mock), contact form submit, navigation
  - Manual QA: device checks, mobile menu, performance smoke

Exit Criteria:
- Visual diffs green; unit/integration pass
- CLS ≤ 0.1, LCP ≤ 2.5s on 75th percentile mobile (lab)

PHASE 6: Launch (Days 12–14)
Goal: Production with live data and monitoring

- Pre-launch
  - Swap real bios/photos; set DATA_SOURCE=live
  - Verify CORS for production domain; API_BASE_URL set
  - Image optimization and route meta; bundle sanity

- Deploy & verify
  - Vercel production deploy
  - Smoke: navigation, enrollment handoff with live data, contact form
  - Monitoring: Core Web Vitals, basic error logging

Exit Criteria:
- Production live with live endpoints
- Handoff URLs correct; performance and visual checks clean
- Monitoring active; rollback plan noted

--------------------------------------------------------------------------------
3) User Stories with Acceptance Criteria
--------------------------------------------------------------------------------

Global Navigation
- Story GN-1:
  - As a visitor, I want a clear top navigation to key pages so that I can find information quickly.
  - Acceptance:
    - Top nav includes routes /, /about, /pricing, /enroll, /contact; footer includes /privacy, /terms
    - Active link styles indicate current route; mobile menu available where applicable
    - Layout and spacing match Figma at desktop and mobile breakpoints

Home (/)
- Story HO-1:
  - As a visitor, I want a clear hero section with a primary call-to-action to Enroll so I can start quickly.
  - Acceptance:
    - Hero renders above the fold with primary CTA to /enroll
    - Responsive layout matches Figma; images optimized or lazy-loaded as needed

About (/about)
- Story AB-1:
  - As a visitor, I want to read about the studio and see teacher bios to assess fit and quality.
  - Acceptance:
    - Page renders studio story/values and teacher cards (static v1)
    - Layout matches Figma components and typography

Pricing (/pricing)
- Story PR-1:
  - As a visitor, I want to see the monthly price and the commitment policy so I can estimate cost.
  - Acceptance:
    - Single monthly price displayed (from backend when available; placeholder $125)
    - Commitment notice displayed: "Commitment: current semester (school calendar)"
    - CTA to /enroll functional

Enroll (/enroll)
- Story EN-1:
  - As a prospective parent, I want to select an instrument and a preferred timeslot, then review and confirm so that I can proceed to the protected enrollment with context.
  - Acceptance:
    - Stepper with 3 steps: instrument → preferred timeslot → review & confirm (with semester commitment acknowledgment)
    - Validation ensures required selections for completion
    - Loading/empty/error states present for timeslot list
    - On completion, redirect to https://app.cedarheightsmusic.com/enroll/start with params:
      - instrument_id, timeslot_id, teacher_id if implied by timeslot, source=public_site
    - Week 1 uses mock data; pre-launch uses live endpoints

Contact (/contact)
- Story CT-1:
  - As a visitor, I want to submit an inquiry via a simple form without creating an account.
  - Acceptance:
    - Formspree (or similar) client-side submission
    - Required fields and consent text (privacy notice)
    - Basic spam prevention (honeypot)
    - Success/failure messages displayed; no server-side PII storage

Privacy/Terms (/privacy, /terms)
- Story PL-1:
  - As a visitor, I want to access Privacy and Terms pages to understand policies.
  - Acceptance:
    - Static pages accessible from footer and direct routes
    - Content structured and readable on mobile and desktop

Data Layer and Caching
- Story DL-1:
  - As a developer, I want a data service that can switch between mock and live sources to develop quickly and launch reliably.
  - Acceptance:
    - Configuration flag toggles mock|live
    - getTeachers() and getTimeslots() implemented
    - TanStack Query with staleTime=120_000ms aligns with edge SWR TTL
    - Errors are surfaced for components to render fallback copy

Enrollment Handoff Utility
- Story HF-1:
  - As a developer, I want a robust URL builder so that the handoff redirect is always correct and safe.
  - Acceptance:
    - Utility composes https://app.cedarheightsmusic.com/enroll/start with params: instrument_id (required), teacher_id (optional), timeslot_id (optional), source=public_site
    - Omits undefined params; URL encoding correct; no billing_frequency param (policy is implicit)
    - Unit tests cover permutations and encoding

Performance and SEO
- Story PF-1:
  - As a site owner, I want the site to meet Core Web Vitals targets so users have a fast experience.
  - Acceptance:
    - LCP ≤ 2.5s and CLS ≤ 0.1 on 75th percentile mobile for key routes
    - Images optimized; non-critical images lazy-loaded
    - Basic meta tags present; favicon configured

Testing & QA (Minimal)
- Story QA-1:
  - As a solo developer, I want minimal but effective tests to protect the critical handoff and data paths.
  - Acceptance:
    - Unit tests for URL builder and data adapter toggle pass
    - Manual QA checklists executed across Chrome/Safari/Firefox latest and mobile
    - Handoff URL correctness validated with realistic selections

Deployment & Config
- Story DP-1:
  - As a developer, I want frictionless previews and reliable production deployment with correct envs and CORS.
  - Acceptance:
    - Vercel previews auto-build
    - Production env configured with API_BASE_URL
    - CORS allowed origins confirmed for production domain
    - Live endpoints switched on prior to launch

--------------------------------------------------------------------------------
4) Dependencies and Sequencing
--------------------------------------------------------------------------------

Primary sequence (high-level):
1) Project Setup → 2) Global Layout & Navigation → 3) Data Layer (mocks) → 4–9) Pages (Home, About, Pricing, Enroll with mocks, Contact, Privacy, Terms) → 10) Handoff Utility + unit tests → 11) Styling & Theming refinement → 12) Performance & SEO pass → 13) Testing & QA → 14) Deployment & Config → 15) Observability baseline.

Key blockers/risks:
- CORS readiness for production domain (coordinate early)
- Final content delivery timing (bios/photos, copy)
- Backend monthly pricing source and school calendar details (confirm mapping)
- Instruments + IDs (source of truth during mock phase)

--------------------------------------------------------------------------------
5) MVP Definition (Wireframe-Informed Exit Criteria)
--------------------------------------------------------------------------------

**Visual Fidelity Requirements:**
- All React components match wireframe specifications exactly (100% visual compliance)
- Design system tokens properly extracted and applied from wireframe-styles.css
- Responsive behavior matches wireframe breakpoints: Desktop ≥1200px, Tablet 768-1199px, Mobile <768px
- Character illustrations positioned correctly with overflow handling
- Seasonal background system functional with JavaScript date logic

**Functional Requirements:**
- All public routes implemented: /, /about, /pricing, /contact, /privacy, /terms
- Enrollment modal (3-step configurator) functional across all pages
- Modal redirect to protected handoff URL: https://app.cedarheightsmusic.com/enroll/start with params
- Week 1: mock data functional; pre-launch: live endpoints enabled for teachers/timeslots
- Contact form with Formspree integration, validation, and success/error states
- Navigation with mobile menu behavior and active states

**Quality Assurance:**
- Visual regression tests pass (Playwright screenshot comparison)
- Unit tests pass for URL builder, data adapter, and seasonal background logic
- Performance targets met: LCP ≤ 2.5s, CLS ≤ 0.1 on 75th percentile mobile
- Cross-browser compatibility verified (Chrome, Safari, Firefox)
- Manual QA completed across all user flows

**Deployment:**
- Production deployed via Vercel with wireframe assets
- Environment variables configured correctly
- CORS verified for API endpoints
- Content placeholders replaced with final teacher bios/photos
- Performance monitoring and error tracking active

--------------------------------------------------------------------------------
6) Test Plan (Enhanced with Visual Regression)
--------------------------------------------------------------------------------

**Unit Tests:**
- urlBuilder.test.ts
  - Verifies param composition, omission of undefined, encoding, fixed source=public_site
  - Tests all parameter combinations and edge cases
- dataAdapter.test.ts
  - Verifies mock vs live path selection; ensures live calls only when flag enabled
  - Tests error handling and retry logic
- seasonalBackground.test.ts
  - Tests JavaScript date logic for seasonal background selection
  - Verifies correct image paths for each season
- designSystem.test.ts
  - Validates design token extraction and application
  - Tests responsive breakpoint logic

**Visual Regression Tests (Playwright):**
- Component-level screenshots:
  - Navigation component (desktop/mobile states)
  - Footer component with all links
  - Enrollment modal (all 3 steps)
  - Button components (primary/secondary states)
  - Card components and typography
- Page-level screenshots:
  - Home page (desktop 1300x800, mobile 375x667)
  - About page with image cluster and teacher card
  - Pricing page with monthly price and commitment notice
  - Contact page with form layout
  - Privacy/Terms pages
- Cross-browser visual testing:
  - Chrome, Safari, Firefox latest versions
  - Mobile viewport testing

**Integration Tests:**
- Enrollment flow end-to-end (mock data)
- Contact form submission with validation
- Navigation and routing behavior
- Modal open/close interactions
- Responsive layout transitions

**Manual QA Checklist:**
- **Visual Compliance:**
  - All components match wireframe specifications exactly
  - Character illustrations positioned correctly
  - Seasonal backgrounds load properly
  - Typography hierarchy matches wireframe lockup table
- **Functional Testing:**
  - Navigation across all routes with active states
  - Enrollment modal complete flow (3 steps)
  - Contact form validation and submission
  - Mobile menu behavior and interactions
- **Responsive Testing:**
  - Desktop ≥1200px: 12-column grid, 80px padding
  - Tablet 768-1199px: 8-column grid, 48px padding
  - Mobile <768px: 4-column grid, 24px padding, stacked sections
- **Cross-browser Testing:**
  - Chrome/Safari/Firefox latest versions
  - Mobile device testing on actual devices
- **Performance Testing:**
  - Core Web Vitals validation (LCP ≤ 2.5s, CLS ≤ 0.1)
  - Image optimization and lazy loading verification
  - Bundle size analysis

--------------------------------------------------------------------------------
7) Quality Assurance Measures
--------------------------------------------------------------------------------

- Figma adherence review pass (structure, tokens, spacing)
- Accessibility baseline checks (keyboard nav, color contrast where feasible)
- Performance checks (image sizes, lazy loading)
- Code health: light linting/formatting baseline

--------------------------------------------------------------------------------
8) CI/CD and Deployment Approach
--------------------------------------------------------------------------------

- CI: None for v1 per constraints (manual verification in previews)
- CD: Vercel previews on PRs/branches; single-click production promotion
- Environment variables:
  - API_BASE_URL per environment
  - DATA_SOURCE=mock|live flag
- Pre-launch checklist includes switching to live data and confirming CORS

--------------------------------------------------------------------------------
9) Risk Assessment and Mitigations (Updated)
--------------------------------------------------------------------------------

- R-1: Visual regression from wireframes during React migration
  - Mitigation: Playwright screenshot comparison; component-by-component validation; design system tokens
- R-2: CORS or endpoint readiness delays
  - Mitigation: mock-first build; early coordination; feature flag for fallback
- R-3: Content delay (bios/photos, copy)
  - Mitigation: wireframe placeholders; late swap before launch; content pipeline established
- R-4: Design system token extraction complexity
  - Mitigation: wireframe-styles.css already provides complete token reference; systematic extraction
- R-5: Performance regressions with React components
  - Mitigation: image optimization, lazy loading, bundle analysis, Core Web Vitals monitoring
- R-6: Cross-browser compatibility issues
  - Mitigation: visual regression testing across browsers; progressive enhancement approach
- R-7: Mobile responsiveness deviations from wireframes
  - Mitigation: breakpoint testing at exact wireframe specifications; device testing
- R-8: No CI pipeline
  - Mitigation: comprehensive manual QA gates; visual regression suite; unit tests on critical utilities

--------------------------------------------------------------------------------
10) Progress Tracking (Updated)
--------------------------------------------------------------------------------

- Use this WBS as the authoritative plan for wireframe-informed development
- Track progress against:
  - Design System Implementation completion
  - Wireframe-to-React Migration fidelity
  - Visual regression test suite establishment
  - Week 1 and Week 2 exit criteria
- Key milestones:
  - Week 1 Day 3: Design system tokens extracted and React components match wireframes
  - Week 1 Day 5: All pages implemented with 100% visual fidelity
  - Week 2 Day 3: Live data integration complete with visual regression tests passing
  - Week 2 Day 5: Production deployment with performance targets met
- Update ai_docs/_scratchpad/wbs_scratchpad.md after each iteration to capture decisions and deltas
- Visual compliance tracking via Playwright screenshot comparison
- Performance monitoring via Core Web Vitals dashboard

--------------------------------------------------------------------------------
Change History
--------------------------------------------------------------------------------

### 2025-08-29 Update (Phase 2 Core Components)
Evidence Source: implementation (phase2_core_components); repo changes: [src/components/core.jsx](src/components/core.jsx:1), [src/App.jsx](src/App.jsx:1)
Key Changes:
- Added core UI library with wireframe-aligned styles and tokens:
  - Components: [JavaScript.Header()](src/components/core.jsx:556), [JavaScript.Footer()](src/components/core.jsx:680), [JavaScript.Button()](src/components/core.jsx:533), [JavaScript.Card()](src/components/core.jsx:547), [JavaScript.EnrollmentModalShell()](src/components/core.jsx:756)
  - Mapped wireframe classnames: .primary-cta and .secondary-cta
  - Mobile nav drawer with aria-expanded and overlay; sticky header with active link states
  - Modal: 3-step indicator, keyboard navigation, focus trap, Escape close, mobile full-screen
- Integrated components into the application shell:
  - Imported and rendered in [src/App.jsx](src/App.jsx:1) with main landmark and onEnrollClick wiring
Decisions Made:
- Keep Enrollment Modal as a shell in Phase 2; wire data (mock→live) and handoff URL builder in Phase 4
- Use existing tokens from [src/styles/tokens.css](src/styles/tokens.css:1) for visual fidelity and responsiveness

### 2025-08-29 Update
Evidence Source: implementation (phase1_foundation); repo changes (tokens, TS, ESLint/Prettier, Router/Query, env, build)
Key Changes:
- Phase 1 foundation setup completed:
  - Published design tokens and imported to base styles
  - Wired BrowserRouter and QueryClient (staleTime=120_000ms)
  - Initialized TypeScript (strict) and configured ESLint + Prettier + scripts
  - Added environment helpers with guard logic and .env.example scaffold
  - Verified build (Vite) and ensured base folders exist
Decisions Made:
- Maintain mock-first approach for data; default VITE_DATA_SOURCE=mock in scaffold
- Do not modify real .env.* files in repo; use .env.example for parity

### 2025-08-28 Update
Evidence Source: Stakeholder directive (update_wbs); git log last 2 days: 1a9c33a 'low fi wireframes' (wireframes/*, ai_docs/context/core_docs/page_blueprints.md)
Key Changes:
- Simplified pricing: single monthly price (placeholder $125), commitment through current semester
- Removed billing frequency selection from Pricing page and Enrollment modal
- Updated Enrollment Handoff Utility: removed billing_frequency param
- Updated User Stories and acceptance criteria to reflect simplified pricing and policy

Decisions Made:
- Price to be read from backend DB when available; until then show $125 placeholder on public site
- Semester commitment policy text is provided by user and stored in backend; public site displays policy and does not collect frequency
- No ai_docs/specs/ directory present; no spec deltas in this update

--------------------------------------------------------------------------------
WIREFRAME-INFORMED WBS SUMMARY
--------------------------------------------------------------------------------

This updated WBS reflects the major advancement achieved through Phase 04 wireframe completion. The development approach has shifted from Figma-based design interpretation to wireframe-based React implementation with:

**Key Changes:**
1. **Design System Foundation**: Wireframe-extracted tokens provide concrete implementation targets
2. **Visual Regression Testing**: Playwright-based screenshot comparison ensures wireframe fidelity
3. **Component-First Approach**: React components built to match wireframe specifications exactly
4. **Enhanced Testing Strategy**: Visual, unit, and integration testing with wireframe baselines
5. **Performance Validation**: Core Web Vitals monitoring with wireframe-optimized assets

**Critical Success Factors:**
- 100% visual fidelity to wireframe specifications
- Design system tokens properly extracted from wireframe-styles.css
- Responsive behavior matching wireframe breakpoints exactly
- Visual regression tests passing throughout development
- Performance targets achieved with wireframe-optimized implementation

**Ready for Implementation**: This WBS provides a clear, executable roadmap for converting the completed wireframes into a production-ready React application with comprehensive testing and monitoring.