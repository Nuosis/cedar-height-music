# WBS Scratchpad — Cedar Heights Music Public Website

- Context loaded: project_charter.md, prd.md (v0.1 outline), add.md (architecture draft)
- MVP scope: Public website only; no auth; mock→live switch pre-launch
- Key endpoints (public): GET /public/teachers, GET /public/timeslots
- Handoff URL: https://app.cedarheightsmusic.com/enroll/start with params instrument_id, teacher_id (optional), timeslot_id, billing_frequency, source=public_site
- Pages: /, /about, /pricing, /enroll, /contact, /privacy, /terms
- Priority: Build IA + Enroll configurator; strict Figma adherence; performance targets

Open Questions to resolve during WBS:
- Canonical instruments + IDs (OQ-1 PRD)
- Final copy for pages (OQ-2 PRD)
- Indicative pricing values by frequency (OQ-3 PRD)
- Confirm final route names from Figma (add.md Q1)
- Verify production API domain and CORS (add.md Q2)
- Freshness policy triggers beyond SWR TTL (add.md Q3)

Initial WBS Areas (to iterate):
1) Project Setup
- Vite React app, routing, Tailwind config, asset pipeline, env config for API domain

2) Global Layout & Navigation
- Header/Nav per Figma, Footer with Privacy/Terms, responsive breakpoints

3) Pages
- Home, About (bios/photos), Pricing (frequency + indicative pricing), Enroll (3-step), Contact (Formspree), Privacy, Terms

4) Data Layer
- Mock data JSONs (instruments, teachers, timeslots)
- Data service with source toggle (mock|live)
- Live fetch integration for /public/teachers and /public/timeslots

5) Enrollment Handoff
- URL builder with query params, redirect behavior, validation and fallbacks

6) Styling & Theming
- Tailwind tokens aligned to Figma, components per design

7) Performance & SEO
- Core Web Vitals targets, image optimization, basic meta tags

8) Testing & QA
- Unit tests for data adapters and URL builder
- Integration tests for Enroll flow
- Cross-browser, mobile QA

9) Deployment & Config
- Vercel setup, environment variables, preview vs production

10) Observability
- Minimal logging, optional error tracking stub (later)

Risks & Mitigations (tracking):
- CORS/endpoint readiness: Mock-first + swap adapter; early coordination
- Content timing: placeholders; late swap
- Pricing mismatch: label “indicative”; confirm in protected flow
- Performance regressions: image optimization; lazy-load

Next step: Draft detailed WBS tree with tasks, dependencies, and MVP sequencing; confirm any deltas from Figma route structure.
--- 
Update 1 — Core docs reviewed; drafting detailed WBS next.

Proposed organization: provide BOTH views
- Feature-area WBS (authoritative breakdown + dependencies)
- Sprint-mapped view (Week 1 mock-first, Week 2 live integration + polish)

If no objection, I’ll proceed with both views.
---
Update 2 — Drafting WBS (feature areas + sprint-mapped) with constraints:
- Solo dev; minimal testing (unit only), manual QA; Vercel previews; no CI

Feature-Area WBS (authoritative)
1) Project Setup
- Initialize TypeScript in React+Vite project; ensure TS config aligns with Tailwind (paths, JSX)
- Install deps: react-router-dom, tailwindcss, postcss, autoprefixer, @tanstack/react-query
- Configure Tailwind (init, content globs, base styles); map initial tokens per Figma (colors/typography/spacing)
- .env handling for API base URL; example .env files (dev/stage/prod); guard undefined
- Vercel project setup (link repo, env vars for preview/prod); configure vercel.json if needed
- Linting/formatting: ESLint + Prettier base (optional-but-recommended)
Dependencies: none
Deliverable: running app shell with layout styles ready

2) Global Layout & Navigation
- App shell: header/nav per Figma (responsive), footer with Privacy/Terms links
- Route scaffolding: /, /about, /pricing, /enroll, /contact, /privacy, /terms
- Active link styles + mobile menu behavior (hamburger if applicable)
- Global typography/spacing scale per Figma
Dependencies: Project Setup
Deliverable: routes render with placeholder content

3) Data Layer
- Define TypeScript types: Instrument, Teacher, Timeslot
- Create local mock JSON: instruments.json, teachers.json, timeslots.json
- Data service with source toggle (mock|live); config flag
- Live fetch functions:
  - getTeachers(): GET /public/teachers
  - getTimeslots(params): GET /public/timeslots?teacher_id=&weekday=&active=true
- TanStack Query setup + QueryClientProvider; default options (staleTime=120_000)
- Error handling strategy for fetch (retry, user-facing fallback copy via calling components)
Dependencies: Project Setup
Deliverable: swappable data service, mocks in place

4) Pages — Home (/)
- Hero section per Figma; primary CTA to /enroll
- Value props section; responsive layout; images optimized/lazy where needed
Dependencies: Global Layout
Deliverable: pixel-aligned Home

5) Pages — About (/about)
- Studio story/values
- Teacher bios/cards layout (static v1 with placeholders; later content swap)
Dependencies: Global Layout
Deliverable: About page with teacher grid/cards

6) Pages — Pricing (/pricing)
- Billing frequency selector (monthly|yearly|semester)
- Indicative pricing display (static mapping by frequency)
- CTA to /enroll; ensure copy clarifies “indicative”
Dependencies: Global Layout
Deliverable: Pricing page with functioning selector

7) Pages — Enroll (/enroll)
- Stepper UX (3 steps) + state management
  1) Instrument selection (instrument_id)
  2) Preferred timeslot selection
     - Week 1: from mock timeslots
     - Pre-launch: switch to live /public/timeslots (filtering by teacher/weekday/active)
  3) Billing frequency selection
- Inline validation; disable “Next/Complete” until valid
- Redirect builder (handoff URL + params)
- Empty/error states for timeslot list; loading skeletons
Dependencies: Data Layer (mocks first), Global Layout
Deliverable: Full stepper flow with redirect

8) Pages — Contact (/contact)
- Client-side form (Formspree or similar)
- Required fields + consent text; simple honeypot
- Success/failure UX
Dependencies: Global Layout
Deliverable: Working client-side contact submission

9) Pages — Privacy (/privacy) and Terms (/terms)
- Static content pages
Dependencies: Global Layout
Deliverable: Rendered static policy content

10) Enrollment Handoff
- URL builder utility with types + unit tests:
  - Input: instrument_id, teacher_id (optional), timeslot_id, billing_frequency
  - Output: https://app.cedarheightsmusic.com/enroll/start?...&source=public_site
- Ensure stable param encoding, omit undefined
- Use from /enroll on completion
Dependencies: Enroll page partial; Testing infra
Deliverable: Reliable redirect utility and integration

11) Styling & Theming
- Tailwind token mapping pass to align with Figma (colors, typography scale, spacing)
- Component tokens: buttons, inputs, cards, headings
- Responsive breakpoints per Figma
Dependencies: Project Setup, initial pages
Deliverable: Consistent styling across pages

12) Performance & SEO
- Image optimization pass (sizes, formats); lazy loading
- Basic meta tags per route; favicon
- Bundle check: remove unused assets; ensure code-split if needed (optional)
Dependencies: Pages implemented
Deliverable: Meets LCP/CLS targets (baseline)

13) Testing & QA (Minimal)
- Unit tests:
  - URL builder (handoff)
  - Data adapter toggle logic (mock vs live)
- Manual QA plan:
  - Cross-browser smoke (Chrome/Safari/Firefox latest), mobile
  - Navigation, responsive, form submission, enroll redirect
Dependencies: Data/Handoff utilities ready
Deliverable: Passing unit tests; manual QA checklist executed

14) Deployment & Config
- Vercel preview deployments
- Production deploy gating checklist (content swapped, live endpoints verified, CORS allowed origins)
- Env vars: API_BASE_URL per env; feature flag for data source
Dependencies: All functional pieces
Deliverable: Live site + pre-launch verification

15) Observability (Minimal)
- Console-error monitoring in dev
- Optional: stub for future error tracker init
Dependencies: Project Setup
Deliverable: Baseline logging ready

Key Dependencies
- Enroll depends on Data Layer, Handoff utility
- Pricing depends on tokenized styles, basic components
- Performance/SEO pass depends on pages completed
- Deployment depends on envs and CORS readiness

Sprint-Mapped View
Week 1 — Mock-first Build (Goal: end-to-end UX with mocks)
- Project Setup
- Global Layout & Navigation
- Data Layer (mocks + adapter; scaffold live fetch fns but not wired)
- Home, About (placeholders ok), Pricing (indicative), Contact (Formspree), Privacy, Terms
- Enroll stepper functioning with mock data
- Handoff URL builder + unit tests
- Initial styling pass (Tailwind tokens v0)
Exit Criteria:
- All routes navigable; Enroll redirects with params; responsive baseline OK; unit tests for URL builder pass

Week 2 — Live Integration + Polish (Goal: switch to live, QA, performance)
- Wire live GET /public/teachers and /public/timeslots; verify staleTime alignment (120s)
- Error/loading/empty states polish for Enroll timeslots
- Content swap for teacher bios/photos
- Styling refinement to match Figma closely
- Performance pass (image optimization, lazy loading) + basic meta
- Manual QA checklist; cross-browser/mobile; verify handoff URL correctness
- Vercel production deployment; environment verification; CORS and API domain sanity checks
Exit Criteria:
- Live endpoints used on Enroll; performance targets met; launch-ready

Minimal Unit Tests (as agreed)
- tests/urlBuilder.test.ts: covers all param combinations; encoding; source fixed
- tests/dataAdapter.test.ts: toggles mock/live path; ensures live calls only when flag enabled

Risks to Track (active)
- CORS ready for deployed domain; action: confirm allowed origins pre-switch
- Content timing; action: placeholders; swap late Week 2
- Price perception; action: “indicative” label; confirm in protected flow
- Endpoint stability; action: mock fallback toggle if outages occur

Requests/Confirmations Needed
- Final list of instruments + IDs (PRD OQ-1)
- Final copy for value props, teacher bios, privacy, terms (PRD OQ-2)
- Indicative pricing values per frequency (PRD OQ-3)
- Figma token extraction (colors, typography scale) for Tailwind