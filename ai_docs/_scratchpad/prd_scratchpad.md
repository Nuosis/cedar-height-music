PRD Scratchpad — Cedar Heights Music Academy (compact notes)

Design
- Figma: https://www.figma.com/design/8iXCoxrnEkJaAEVERBY4wr/Music?node-id=0-1&amp;p=f&amp;t=mEFgAvR3fs6muKHj-0
- Migrate single long page → multi-page SPA; adhere strictly to design

Backend Context Reviewed
- FRONTEND_INTEGRATION_GUIDE.md (Auth: Supabase→backend JWT exchange; APIs: public teachers/timeslots, parent self-upsert payee, students, bookings + status, makeups; admin APIs; webhooks)
- core_docs/prd.md (features, flows, NFRs, data entities)
- core_docs/add.md (architecture: FastAPI, Celery, Postgres, Redis, Stripe, Mailjet; locking; webhooks; roles)
- core_docs/wbs.md (epics, acceptance criteria, sequencing)

Key Flows (Parent)
- Auth: Supabase login → POST /auth/exchange → backend_jwt (2h); refresh on 401
- Discovery: GET /public/teachers; GET /public/timeslots?filters
- Payee ensure: POST /parent/payees/self (idempotent)
- Student create/list: POST/GET /parent/students
- Booking: POST /parent/bookings → 202 provisional + tracking_id; poll GET /parent/bookings/{id}/status
- Makeups: GET /parent/makeups/slots; POST /parent/makeups/book

Booking Rules
- Fixed weekly 30-min slots; one active weekly slot per student
- Provisional expires in 14d; email notifications; status polling with backoff
- Stripe authoritative: customer/PM/subscription/invoice on Student/Enrollment

UI/UX Guidance
- Provisional and failure_reason messaging; timers; conflict handling (409)
- Accessibility: English-only MVP; local timezone display

NFRs (from docs)
- Uptime 95% MVP; p95 ≤ 500ms excluding Stripe; transactional emails ≤ 2 min
- Security: PIPEDA/BC PIPA posture; TLS; PCI via Stripe only
- Observability: log booking attempts, Stripe outcomes, email sends

Data Model (frontend-relevant)
- Teacher, Instrument, Timeslot, Payee, Student, Enrollment, Attendance, MakeUpRecord, Semester
- Stripe IDs on Student/Enrollment; no card data in frontend

Open Items to Clarify for PRD
- IA and page map for multi-page SPA adhering to Figma: exact pages/routes, navigation patterns
- Content and copy alignment with email templates (wording and states)
- Booking start-date rules and display (semester cutoffs, first lesson date)
- Payment frequency options in UI (monthly/yearly/semester) and defaults
- Make-up eligibility UI rules and constraints (window, same weekday/time window)
- Admin UI scope for next sprint (read-only dashboard vs minimal CRUD priorities)
- Role-based UI gating (hide admin surfaces entirely in parent SPA MVP?)
- Error state designs (validation, 401/403/404/409, 5xx retries) matching Figma
- Analytics/telemetry requirements (events for booking funnel, failures)
- Figma components to reuse: forms, lists, modals, status banners, timers
- SEO and public content (teachers/timeslots public pages indexing?)

Assumptions (initial)
- 0=Sunday weekday convention (confirm)
- Store backend_jwt in memory (avoid localStorage); rely on Supabase session persistence
- Polling cadence 2–5s exponential backoff with cap

Next Steps
- Capture product overview, personas, journeys
- Enumerate functional reqs per page/feature; map to APIs
- Define interface and data contracts per UI state
- Confirm constraints, acceptance criteria, and priorities
Update: Public site routes confirmed
- Routes (v1): /, /about, /pricing, /enroll, /contact, /privacy, /terms
- Scope: purely marketing/public; auth flows are on separate protected app
- Next: define page-specific goals, CTAs, data needs (mock→live), acceptance criteria per page
Decision: Home CTA behavior
- Primary CTA “Enroll Now” → link to /enroll (public site)
- Selections configured on /enroll; then handoff to protected app with query params
- Handoff URL pattern: https://app.cedarheightsmusic.com/enroll/start?instrument_id=&teacher_id=&timeslot_id=&billing_frequency=&source=public_site
Decision: /enroll configurator
- Flow: 3-step → Instrument → Preferred timeslot → Billing frequency (omit explicit 30-min length; implied fixed)
- Data: Week 1 mock JSON; pre-launch switch to GET /public/teachers and /public/timeslots
- Handoff: Build URL with instrument_id, teacher_id (if implied by timeslot), timeslot_id, billing_frequency, source=public_site
Decision: Handoff URL and params
- Target: https://app.cedarheightsmusic.com/enroll/start
- Params: instrument_id, teacher_id (optional if implied by timeslot), timeslot_id, billing_frequency, source=public_site
- Trigger: Built on /enroll after 3-step configurator completion
Decision: Home page content per Figma
- Hero with single primary CTA to /enroll
- Top navigation includes links to /about, /pricing, /enroll, /contact (plus footer /privacy, /terms)
- Follow Figma for layout/sections; keep Home minimal beyond hero/value props
Decision: /pricing indicative pricing
- Show indicative pricing based on billing_frequency only (instrument does not affect price)
- Label clearly as “indicative” for v1 until live backend integration
- Pair with CTA to /enroll to complete selections and handoff
Decision: Data sources and integration phasing
- Week 1: Local mock JSON for instruments/teachers/timeslots to unblock UI per Figma
- Pre-launch: Switch to live backend public endpoints:
  - GET /public/teachers
  - GET /public/timeslots?teacher_id=&weekday=&active=true
- Adapter approach: simple data service with togglable source (mock vs live)
Decision: Handoff behavior on /enroll completion
- Action: Redirect immediately to protected app on completion (no modal/summary)
- Target: https://app.cedarheightsmusic.com/enroll/start
- Params: instrument_id, teacher_id (from selected timeslot), timeslot_id, billing_frequency, source=public_site
Decision: /about content scope
- Include teacher bios with photos on /about
- Also include brief studio story and values section
- Align layout/typography strictly to Figma components
Decision: /contact implementation
- Client-side form using Formspree (or similar) to send inquiries
- Include consent text (privacy notice) and basic spam protection (honeypot + rate-limit hint)
- Avoid server-side PII collection on public site v1