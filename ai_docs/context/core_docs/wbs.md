# Work Breakdown Structure (WBS) — Cedar Heights Music Public Website (v1)

Status: Initial version based on Project Charter, PRD v0.1, and Architecture Draft (add.md). Includes feature-area breakdown, sprint mapping, and initial user stories with acceptance criteria. Testing scope: unit tests only; manual QA; Vercel previews; no CI.

References:
- Project Charter: ai_docs/context/core_docs/project_charter.md
- PRD: ai_docs/context/core_docs/prd.md
- Architecture Draft: ai_docs/context/core_docs/add.md
- Frontend Integration Guide: ai_docs/guides/FRONTEND_INTEGRATION_GUIDE.md

Assumptions and Constraints:
- Solo developer
- 2-week timeline
- Public website only; no auth; mock→live endpoint switch pre-launch
- Public endpoints: GET /public/teachers, GET /public/timeslots?teacher_id=&weekday=&active=true
- Handoff URL: https://app.cedarheightsmusic.com/enroll/start
- Minimal automated testing (unit tests); manual QA; Vercel previews; no CI for v1
- Edge caching SWR TTL = 120s; TanStack Query staleTime aligned to 120_000ms

Open Questions carried into planning:
- OQ-1: Canonical instruments + IDs for mapping
- OQ-2: Final copy for value props, teacher bios, privacy, terms
- OQ-3: Indicative pricing values per billing frequency
- Figma tokens extraction (colors, typography, spacing)
- Confirm production API domain/CORS readiness (noted as https://api.cedarheightsmusic.com in add.md)

--------------------------------------------------------------------------------
1) Feature-Area WBS (Authoritative Breakdown with Dependencies)
--------------------------------------------------------------------------------

1. Project Setup
- Initialize TypeScript configuration; ensure React + Vite + TS integrated
- Install dependencies: react-router-dom, tailwindcss, postcss, autoprefixer, @tanstack/react-query
- Tailwind init: content globs, base styles, initial tokens aligned with Figma (colors/typography/spacing)
- Environment handling:
  - .env.* files (dev/stage/prod) for API_BASE_URL
  - Guard undefined values in code paths
- Vercel project onboarding:
  - Link repo
  - Configure env vars for preview/prod
  - vercel.json adjustments if needed
- Linting/formatting baseline: ESLint + Prettier (optional but recommended)
Deliverable: Running app shell with Tailwind configured and env scaffolding
Dependencies: None

2. Global Layout & Navigation
- App shell:
  - Header/nav per Figma (responsive, active link styles, mobile menu behavior if applicable)
  - Footer with Privacy/Terms links and contact links
- Route scaffolding:
  - /, /about, /pricing, /enroll, /contact, /privacy, /terms
- Global typography scale and spacing per Figma
Deliverable: All routes render with placeholders; layout responsive
Dependencies: Project Setup

3. Data Layer
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

4. Home Page (/)
- Implement hero section per Figma
- Value propositions section
- Primary CTA linking to /enroll
- Responsive behavior and image optimization
Deliverable: Pixel-aligned Home with CTA
Dependencies: Global Layout

5. About Page (/about)
- Studio story/values content
- Teacher bios/cards grid (static v1 with placeholders; later swap with real content)
Deliverable: About page with teacher grid and correct typography/components
Dependencies: Global Layout

6. Pricing Page (/pricing)
- Billing frequency selector: monthly | yearly | semester
- Indicative price display (static mapping for v1; labeled “indicative”)
- CTA to /enroll
Deliverable: Functional pricing selector and indicative display with proper copy
Dependencies: Global Layout

7. Enroll Page (/enroll)
- Stepper UX with 3 steps:
  1) Instrument selection (instrument_id)
  2) Preferred timeslot selection:
     - Week 1: mock data
     - Pre-launch: switch to live /public/timeslots
  3) Billing frequency selection
- Inline validation; progressive enabling of Next/Complete
- Loading skeletons; empty and error states for timeslots
Deliverable: Full stepper with mock data first; ready to switch to live
Dependencies: Data Layer (mocks), Global Layout

8. Contact Page (/contact)
- Client-side form using Formspree (or similar)
- Required fields + consent text (privacy notice), simple honeypot
- Success and failure UX
Deliverable: Working client-only submission without server-side PII
Dependencies: Global Layout

9. Privacy and Terms Pages (/privacy, /terms)
- Static content pages
- Link from footer; direct access via URL
Deliverable: Policy pages rendered and styled
Dependencies: Global Layout

10. Enrollment Handoff Utility
- URL builder utility:
  - Input: instrument_id (required), teacher_id (optional, implied by timeslot), timeslot_id (optional), billing_frequency (required), source=fixed public_site
  - Output: https://app.cedarheightsmusic.com/enroll/start?instrument_id=&teacher_id=&timeslot_id=&billing_frequency=&source=public_site
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

13. Testing & QA (Minimal)
- Unit tests:
  - URL builder
  - Data adapter toggle logic (mock vs live)
- Manual QA checklist:
  - Cross-browser smoke (Chrome/Safari/Firefox latest)
  - Mobile responsiveness checks
  - Navigation links, form submission, enroll redirect
Deliverable: Passing unit tests; manual QA completed
Dependencies: Data/Handoff utilities ready

14. Deployment & Config
- Vercel preview deployments enabled
- Production deploy checklist:
  - Content swap (bios/photos)
  - Switch to live endpoints for teachers/timeslots
  - Confirm CORS allowed origins for prod domain
  - Verify API_BASE_URL env values
- Final launch to production
Deliverable: Production deployment with live data
Dependencies: All functional areas, envs, and CORS readiness

15. Observability (Minimal)
- Dev-only console error monitoring and structured logs consideration
- Optional stub for future error tracker (e.g., Sentry)
Deliverable: Baseline observability hooks for future
Dependencies: Project Setup

Key Dependencies Summary
- Enroll depends on Data Layer and Handoff Utility
- Performance/SEO pass depends on pages implemented
- Deployment depends on CORS readiness and env configuration

--------------------------------------------------------------------------------
2) Sprint-Mapped Plan (Time-Boxed)
--------------------------------------------------------------------------------

Week 1 — Mock-First Build (Goal: end-to-end UX functional using mocks)
- Project Setup
- Global Layout & Navigation
- Data Layer (mocks + adapter; live fetchers scaffolded but not switched on)
- Pages:
  - Home, About (placeholders acceptable), Pricing (indicative pricing), Contact (Formspree), Privacy, Terms
  - Enroll stepper fully functional using mock data
- Handoff URL builder implemented and unit-tested
- Initial Tailwind token mapping; responsive baseline
Exit Criteria:
- All routes navigable; Enroll completes and redirects with params
- Unit test(s) for URL builder pass
- Responsive baseline acceptable on mobile and desktop

Week 2 — Live Integration & Polish (Goal: switch to live, QA, and launch)
- Wire live GET /public/teachers and /public/timeslots with TanStack Query
  - staleTime=120_000ms to align with edge SWR TTL=120s
- Polish loading/empty/error states for timeslots
- Content swap for teacher bios/photos
- Styling refinement to match Figma more closely
- Performance pass (image optimization, lazy loading); basic meta tags per route
- Manual QA: cross-browser smoke, mobile checks, handoff URL correctness
- Vercel production deployment; verify envs and CORS; launch
Exit Criteria:
- Enroll uses live endpoints
- Performance targets achieved (LCP, CLS) on 75th percentile mobile
- Handoff URL correctness verified in manual QA
- Production site launched

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
  - As a visitor, I want to choose billing frequency and see the indicative price so I can estimate cost.
  - Acceptance:
    - Selector supports monthly | yearly | semester
    - Indicative pricing displayed; labeled “indicative”
    - CTA to /enroll functional

Enroll (/enroll)
- Story EN-1:
  - As a prospective parent, I want to select an instrument, a preferred timeslot, and billing frequency so that I can proceed to the protected enrollment with context.
  - Acceptance:
    - Stepper with 3 steps: instrument → preferred timeslot → billing frequency
    - Validation ensures required selections for completion
    - Loading/empty/error states present for timeslot list
    - On completion, redirect to https://app.cedarheightsmusic.com/enroll/start with params:
      - instrument_id, timeslot_id, billing_frequency, teacher_id if implied by timeslot, source=public_site
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
    - Utility composes https://app.cedarheightsmusic.com/enroll/start with required/optional params
    - Omits undefined params; URL encoding correct
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
- Indicative pricing values by frequency (confirm mapping)
- Instruments + IDs (source of truth during mock phase)

--------------------------------------------------------------------------------
5) MVP Definition (Exit Criteria)
--------------------------------------------------------------------------------

- All public routes implemented per Figma: /, /about, /pricing, /enroll, /contact, /privacy, /terms
- Enroll 3-step configurator functional; redirect to protected handoff URL with params
- Week 1: mock data functional; pre-launch: live endpoints enabled for teachers/timeslots
- Performance targets met on key pages (LCP and CLS thresholds)
- Content placeholders replaced with provided bios/photos pre-launch
- Unit tests pass for URL builder and data adapter; manual QA completed
- Production deployed via Vercel; envs and CORS verified

--------------------------------------------------------------------------------
6) Test Plan (Minimal Scope)
--------------------------------------------------------------------------------

Unit Tests:
- urlBuilder.test.ts
  - Verifies param composition, omission of undefined, encoding, fixed source=public_site
- dataAdapter.test.ts
  - Verifies mock vs live path selection; ensures live calls only when flag enabled

Manual QA Checklist:
- Navigation across all routes
- Responsive behaviors at mobile/desktop breakpoints
- Enroll flow using mocks → then using live endpoints
- Contact form submission success/failure UX
- Handoff URL correctness with varied selections
- Cross-browser sanity: Chrome/Safari/Firefox latest; mobile device tests

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
9) Risk Assessment and Mitigations
--------------------------------------------------------------------------------

- R-1: CORS or endpoint readiness delays
  - Mitigation: mock-first build; early coordination; feature flag for fallback
- R-2: Content delay (bios/photos, copy)
  - Mitigation: placeholders; late swap before launch
- R-3: Pricing mismatch with backend expectations
  - Mitigation: label as “indicative”; confirm in protected flow
- R-4: Performance regressions
  - Mitigation: image optimization, lazy loading, audit bundle
- R-5: No CI
  - Mitigation: strict manual QA gates; unit tests on critical utilities

--------------------------------------------------------------------------------
10) Progress Tracking
--------------------------------------------------------------------------------

- Use this WBS as the authoritative plan
- Track progress against:
  - Completion of feature-area tasks
  - Week 1 and Week 2 exit criteria
- Update ai_docs/_scratchpad/wbs_scratchpad.md after each iteration to capture decisions and deltas