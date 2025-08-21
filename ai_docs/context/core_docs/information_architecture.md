# Information Architecture Document
## Cedar Heights Music Academy — Public Website

**Version:** 1.0  
**Date:** August 21, 2025  
**Status:** Final  

---

## Executive Summary

This Information Architecture defines the structural organization of Cedar Heights Music Academy's public marketing website, designed to achieve a **20% enrollment increase in 6 months** through a conversion-optimized user experience. The IA supports the core business goal of **15 completed enrollments per month** by guiding parents through a trust-building journey from discovery to enrollment handoff.

**Key Design Principles:**
- **Conversion-Focused:** Every structural decision optimizes for enrollment completion
- **Trust-Building Journey:** Sequential confidence-building before commitment
- **Performance-First:** Minimal content depth for fast load times
- **YAGNI Approach:** Current needs only, future expansion handled when needed

---

## Content Inventory and Feature List

### Core Content Categories

**1. Marketing Content**
- Hero messaging and value propositions
- Studio story and community positioning
- Teacher profiles (minimal: photo, name, instruments, brief bio)
- Pricing transparency (indicative billing frequency options)

**2. Interactive Features**
- 3-step enrollment configurator
- Contact inquiry form (client-side via Formspree)
- Seasonal background system (automatic date-based switching)

**3. Operational Content**
- Privacy policy and terms of service
- Contact information and studio details

**4. Data Integration**
- Teacher profiles (static v1, live API pre-launch)
- Available timeslots (mock → live API integration)
- Instrument options (static configuration)

---

## User Journeys and Critical Flows

### Primary User Journey: Discovery → Trust Building → Enrollment
**Target User:** Parents of K-12 students in Cedar/Nanaimo BC

**Journey A: Direct Conversion (High Intent)**
1. **Home (/)** → Immediate warmth, primary CTA to Enroll
2. **Enroll (/enroll)** → 3-step configurator completion
3. **Handoff** → Redirect to protected app with context parameters

**Journey B: Research-Driven (Medium Intent)**
1. **Home (/)** → Value propositions, learn more about studio
2. **About (/about)** → Teacher expertise, studio community
3. **Pricing (/pricing)** → Transparent cost expectations
4. **Enroll (/enroll)** → Configurator completion
5. **Handoff** → Protected app redirect

**Journey C: Price-Conscious (Low-Medium Intent)**
1. **Home (/)** → Initial interest
2. **Pricing (/pricing)** → Billing frequency exploration
3. **About (/about)** → Value validation
4. **Enroll (/enroll)** → Conversion completion

### Critical Path Analysis
- **Shortest Path to Conversion:** Home → Enroll (2 clicks)
- **Trust-Building Path:** Home → About → Pricing → Enroll (4 clicks)
- **Drop-off Risk Points:** Pricing page, configurator step 2 (timeslot selection)

---

## Hierarchical Structure of Information

### Site Map and Page Hierarchy

```
Cedar Heights Music Academy (/)
├── Home (/)
│   ├── Hero Section
│   │   ├── Seasonal Background (dynamic)
│   │   ├── Primary Value Proposition
│   │   └── Primary CTA: "Start Enrollment"
│   ├── Value Propositions Section
│   │   ├── Nurturing Community
│   │   ├── Expert Teachers
│   │   └── Convenient Scheduling
│   └── Secondary CTAs to About/Pricing
│
├── About (/about)
│   ├── Studio Story & Values
│   ├── Teacher Profiles Grid
│   │   ├── Photo (optimized, lazy-loaded)
│   │   ├── Name & Primary Instruments
│   │   └── Brief Bio (2-3 sentences max)
│   └── CTA to Enroll
│
├── Pricing (/pricing)
│   ├── Billing Frequency Selector
│   │   ├── Monthly Option
│   │   ├── Semester Option
│   │   └── Yearly Option
│   ├── Indicative Pricing Display
│   │   └── "Final pricing confirmed in enrollment"
│   └── CTA to Enroll
│
├── Enroll (/enroll)
│   ├── Progress Indicator (1 of 3, 2 of 3, 3 of 3)
│   ├── Step 1: Instrument Selection
│   │   └── Maps to instrument_id parameter
│   ├── Step 2: Preferred Timeslot Selection
│   │   ├── Week 1: Mock data
│   │   ├── Pre-launch: Live API (/public/timeslots)
│   │   └── Maps to timeslot_id + teacher_id parameters
│   ├── Step 3: Billing Frequency Selection
│   │   └── Maps to billing_frequency parameter
│   └── Completion: Immediate redirect to protected app
│
├── Contact (/contact)
│   ├── Contact Form (Formspree integration)
│   │   ├── Required fields + validation
│   │   ├── Privacy consent text
│   │   └── Honeypot spam protection
│   ├── Studio Contact Information
│   └── Location/Hours Details
│
├── Privacy (/privacy)
│   └── Static policy content
│
└── Terms (/terms)
    └── Static terms content
```

### Information Priority Hierarchy

**Priority 1 (Critical for Conversion):**
- Enrollment configurator functionality
- Primary CTA visibility and clarity
- Trust signals (teacher photos, studio story)

**Priority 2 (Supporting Conversion):**
- Pricing transparency
- Contact accessibility
- Performance optimization

**Priority 3 (Compliance/Operational):**
- Privacy and terms pages
- Detailed contact information

---

## Navigation System Design

### Global Navigation Schema

**Primary Navigation (Header)**
```
[Logo] Home | About | Pricing | Enroll | Contact
```

**Navigation Behavior:**
- **Active State Indicators:** Clear visual indication of current page
- **Mobile Responsive:** Hamburger menu for mobile breakpoints
- **Consistent Placement:** Fixed header across all pages
- **CTA Prominence:** "Enroll" button styled as primary action

**Footer Navigation**
```
Privacy | Terms | Contact Information
```

### Local Navigation Patterns

**Enrollment Configurator Navigation:**
- **Progress Indicators:** Visual step progression (1→2→3)
- **Back/Next Controls:** Clear navigation between steps
- **Validation Gates:** Cannot proceed without required selections
- **Accessibility:** Screen reader announcements for progress

**Cross-Page CTAs:**
- **Home → Enroll:** Primary conversion path
- **About → Enroll:** Post-trust building conversion
- **Pricing → Enroll:** Post-price transparency conversion
- **All Pages → Contact:** Secondary inquiry path

---

## Labeling System and Terminology

### Navigation Labels
- **"Home"** - Clear, universal understanding
- **"About"** - Standard expectation for studio/teacher information
- **"Pricing"** - Direct, transparent approach to cost information
- **"Enroll"** - Action-oriented, clear conversion intent
- **"Contact"** - Standard inquiry/support expectation

### Content Labels and Messaging

**Value Proposition Language:**
- **Warm & Nurturing:** "Supportive musical community"
- **Professional & Qualified:** "Expert music instruction"
- **Convenient & Accessible:** "Flexible scheduling options"

**Call-to-Action Labels:**
- **Primary CTA:** "Start Enrollment" (action-oriented, low friction)
- **Secondary CTAs:** "Learn More," "View Pricing," "Contact Us"
- **Configurator:** "Next Step," "Complete Enrollment"

**Trust-Building Language:**
- **Teacher Bios:** Focus on approachability over credentials
- **Studio Story:** Community and care emphasis
- **Pricing:** "Indicative pricing" (transparent, non-binding)

### Error and State Messaging
- **Loading States:** "Finding available times..." 
- **Empty States:** "No timeslots available for this selection"
- **Error States:** "Unable to load options. Please try again."
- **Success States:** "Redirecting to complete your enrollment..."

---

## Relationships and Dependencies

### Page Interdependencies

**Data Flow Dependencies:**
```
Pricing Page ← Billing Frequency Selection → Enroll Step 3
About Page ← Teacher Data → Enroll Step 2 (timeslot teacher mapping)
Enroll Completion → Protected App Handoff (external dependency)
```

**Content Dependencies:**
- **Teacher Photos:** Required for About page, impacts trust-building
- **Timeslot Data:** Critical for Enroll step 2 functionality
- **Pricing Rules:** Needed for both Pricing page and configurator

**Technical Dependencies:**
- **API Endpoints:** GET /public/teachers, GET /public/timeslots
- **Handoff URL:** https://app.cedarheightsmusic.com/enroll/start
- **Form Service:** Formspree integration for contact form
- **Seasonal Assets:** Background images for date-based switching

### User Flow Dependencies

**Sequential Trust Building:**
1. **Home** establishes initial warmth and value
2. **About** deepens trust through teacher expertise
3. **Pricing** provides cost transparency
4. **Enroll** converts with minimal friction

**Parallel Access Patterns:**
- Direct Home → Enroll for high-intent users
- Home → Pricing → Enroll for price-conscious users
- Any page → Contact for inquiry-based users

---

## Technical Constraints and Business Rules

### Performance Constraints
- **Core Web Vitals Targets:** LCP ≤ 2.5s, CLS ≤ 0.1 (75th percentile mobile)
- **Image Optimization:** Lazy loading, optimized formats
- **Bundle Size:** Minimize JavaScript, prioritize critical path

### Business Rules
- **Enrollment Handoff:** Must include all available parameters
- **Pricing Display:** Always labeled as "indicative" until live integration
- **Teacher Selection:** Implied through timeslot selection, not explicit
- **Data Privacy:** No PII collection on public site

### Integration Constraints
- **Mock → Live Transition:** Week 1 development, pre-launch switch
- **CORS Requirements:** Production domain must be whitelisted
- **Caching Strategy:** 120-second TTL with stale-while-revalidate

---

## Scalability Considerations

### Current Architecture Decisions
- **YAGNI Approach:** Build for current needs only
- **Simple Structure:** Flat navigation, minimal hierarchy
- **Component-Based:** React components allow future flexibility
- **API-Ready:** Data layer prepared for expansion

### Future Expansion Capability
- **Content Growth:** Existing pages can accommodate more teachers/content
- **Feature Addition:** Component architecture supports new functionality
- **Navigation Evolution:** Current structure can expand when needed
- **Data Integration:** API patterns established for additional endpoints

### Identified Future Needs (Not Implemented)
- Multiple locations support
- Group classes/recitals
- Advanced teacher filtering
- Student testimonials/galleries
- Blog/news section

---

## Risk Assessment and Mitigation

### Information Architecture Risks

**Risk 1: Conversion Drop-off in Configurator**
- **Mitigation:** Clear progress indicators, validation feedback, minimal steps
- **Monitoring:** Track completion rates by step

**Risk 2: Insufficient Trust Building**
- **Mitigation:** Strategic teacher photo placement, warm messaging consistency
- **Monitoring:** Time-on-site metrics, About page engagement

**Risk 3: Pricing Transparency Issues**
- **Mitigation:** Clear "indicative" labeling, final confirmation in protected app
- **Monitoring:** Pricing page bounce rates

**Risk 4: Mobile Experience Degradation**
- **Mitigation:** Mobile-first design, touch-friendly configurator
- **Monitoring:** Mobile conversion rates vs desktop

### Technical Risks
- **API Integration Delays:** Mock-first development approach
- **Performance Regressions:** Continuous monitoring, optimization gates
- **Content Delivery Timing:** Placeholder strategy, late-stage content swap

---

## Success Criteria and Validation

### Conversion Metrics
- **Primary Goal:** 15 completed enrollments per month via public site
- **Secondary Goal:** Increased click-through rate to enrollment flow
- **Tertiary Goal:** Improved time-on-site and page engagement

### User Experience Validation
- **Performance:** Meet Core Web Vitals targets across all pages
- **Accessibility:** WCAG 2.1 AA compliance verification
- **Usability:** Low bounce rate on enrollment configurator
- **Trust Building:** Increased completion rate of contact forms

### Information Architecture Success Indicators
- **Clear Navigation:** Low support inquiries about finding information
- **Effective Hierarchy:** High engagement with trust-building content
- **Optimal Flow:** Minimal drop-off between configurator steps
- **Content Effectiveness:** Strong About → Enroll conversion rates

---

## Implementation Guidelines

### Development Priorities
1. **Week 1:** Core IA implementation with mock data
2. **Week 2:** Live data integration and content finalization
3. **Launch:** Performance validation and user experience verification

### Content Strategy
- **Voice & Tone:** Warm, supportive, professional, community-focused
- **Consistency:** Same nurturing tone across all touchpoints
- **Clarity:** Simple language, clear action items, minimal cognitive load

### Quality Assurance
- **Cross-browser Testing:** Chrome, Safari, Firefox latest versions
- **Mobile Responsiveness:** iOS and Android device testing
- **Accessibility Testing:** Screen reader compatibility, keyboard navigation
- **Performance Validation:** Real-world connection speed testing

---

## Conclusion

This Information Architecture provides a solid foundation for Cedar Heights Music Academy's public website, optimized for conversion while maintaining the warm, nurturing brand experience. The structure balances trust-building with conversion efficiency, supporting the business goal of 20% enrollment increase through clear user journeys and minimal friction points.

The pragmatic approach focuses on current needs while establishing patterns that can accommodate future growth. The emphasis on performance, accessibility, and user experience ensures the site will serve all users effectively while driving measurable business results.

**Next Steps:**
1. Begin implementation following the defined page hierarchy
2. Develop components based on the established navigation patterns
3. Implement the enrollment configurator with the specified user flow
4. Prepare for mock-to-live data transition as outlined in technical constraints