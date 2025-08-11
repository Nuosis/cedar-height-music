# Project Charter Scratchpad — Cedar Heights Music (Public Website)

Purpose: Compact notes to persist key decisions/questions during charter consultation. Keep bullets terse.

Sources:
- Figma design (public site, migrate from single page to multi-page): https://www.figma.com/design/8iXCoxrnEkJaAEVERBY4wr/Music?node-id=0-1&p=f&t=mEFgAvR3fs6muKHj-0
- Backend docs (align for consistency; public site only, protected routes out-of-scope): 
  - /Users/marcusswift/python/cedar_heights_music-py/ai_docs/context/core_docs/
  - /Users/marcusswift/python/cedar_heights_music-py/ai_docs/context/guides/FRONTEND_INTEGRATION_GUIDE.md

Constraints/Context:
- Public marketing website; auth-protected features live elsewhere (redirect).
- Adhere strictly to Figma visual design while refactoring to multi-page IA.
- Leverage backend docs to ensure terminology/flows consistent.

Open Questions (collect one-by-one):
- Primary outcome KPI for v1? (lead gen, ticket sales, email growth, enrollment showcasing?) Enrolement.

Assumptions (to validate):
- SEO + performance matter (marketing site).
- Contact/lead capture required in v1.
- Programs/teachers pages likely core IA.

Conversation Log (terse bullets):
- 2025-08-11: Initialized scratchpad; awaiting vision/KPI focus.

Next actions:
- Get confirmation of single most important outcome for v1.


- 2025-08-11: KPI: increase enrollment by 20% in 6 months; primary conversion = "Enroll Now" start on public site with handoff to protected system.

- 2025-08-11: v1 IA pages confirmed: Home, Teachers, Pricing/Options, Enroll Now, Contact (optimize CTAs for enrollment start handoff).

- 2025-08-11: Enrollment handoff approach: redirect button/link to protected enrollment URL with prefilled query params (program, teacher, source).

- 2025-08-11: Pricing UX decision: simple configurator — choose instrument → 30-min lesson (fixed) → preferred available timeslot → billing frequency; compute price; “Enroll Now” passes selections via query params.

- 2025-08-11: Handoff URL confirmed: https://app.cedarheightsmusic.com/enroll/start?instrument_id=&amp;teacher_id=&amp;timeslot_id=&amp;billing_frequency=&amp;source=public_site

- 2025-08-11: Success target/constraints: 15 completed enrollments per month; v1 timeline 2 weeks; minimal budget; prioritize Figma adherence and enrollment flow.

- 2025-08-11: Data plan: phase integration — Week 1 use mocked data to power configurator; switch to live endpoints (GET /public/teachers, GET /public/timeslots) before launch.

- 2025-08-11: Audience/positioning: parents of K–12 students in Cedar/Nanaimo BC; differentiators: teacher skill/persona, availability/location, convenient weekly 30-minute lessons.

- 2025-08-11: Compliance/tracking: include Privacy Policy and Terms links in footer for v1; defer analytics (GA/Meta) to post-launch iteration.

- 2025-08-11: Content/assets: partial ready — placeholder copy allowed; teacher bios/photos arriving Week 1; proceed with stubs and replace before launch.
