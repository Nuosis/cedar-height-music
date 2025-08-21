# Design Brief Consultation - Cedar Heights Music Academy

## Current Context (Captured)
- **Project**: Multi-page public marketing website for Cedar Heights Music Academy
- **Business Goal**: 20% enrollment increase in 6 months via conversion-focused public site
- **Timeline**: 2 weeks for v1
- **Current State**: Coming soon landing page deployed (React/Vite)

## Key Requirements from Documentation
- **Routes**: /, /about, /pricing, /enroll, /contact, /privacy, /terms
- **Primary Flow**: Discovery → Enroll → Handoff to protected app
- **Tech Stack**: React + Vite, TypeScript, TanStack Query, Tailwind CSS
- **Performance**: LCP ≤ 2.5s, CLS ≤ 0.1 (75th percentile mobile)
- **Design Constraint**: Strict Figma adherence required

## Visual Foundation (Current Landing Page)
- **Color Palette**: Warm browns (#2c1810, #8b4513, #a0522d), Gold accents (#ffd700)
- **Typography**: System fonts, clean hierarchy
- **Assets**: Fall background, boy+guitar character, academy logo
- **Style**: Professional, warm, approachable with subtle animations

## Areas to Explore in Consultation
1. **Design Vision & Character** - What emotions should the full site evoke?
2. **User Journey Mapping** - How should parents flow through discovery to enrollment?
3. **Information Architecture** - Content hierarchy and navigation structure
4. **Visual Design System** - Extend current palette/typography systematically
5. **Component Library** - Reusable UI patterns across pages
6. **Accessibility Standards** - WCAG compliance level
7. **Mobile-First Strategy** - Responsive behavior priorities
8. **Performance Constraints** - Image optimization, loading strategies
9. **Content Strategy** - Teacher bios, pricing display, value propositions
10. **Conversion Optimization** - CTA placement, form design, trust signals

## Design Vision Decisions (Captured)
### Primary Emotional Goal: Warmth & Nurturing Community
- **First Impression**: Safe, supportive environment where children are cared for and encouraged
- **Core Feeling**: Parents should feel this is a nurturing community, not just a business
- **Design Implication**: Emphasize warmth, safety, personal connection, and child-centered approach

## Key Design Assets & Features Discovered
### Figma Design System
- **Source**: https://www.figma.com/design/8iXCoxrnEkJaAEVERBY4wr/Music?node-id=0-1&p=f&t=mEFgAvR3fs6muKHj-0
- **Constraint**: Strict adherence required for brand trust and consistency

### Available Assets (public/)
- **Seasonal Backgrounds**: summer_bg_lrg.png, fall_bg_lrg.png, winter_bg_lrg.png
- **Character Assets**: boy+guitar.png, girl+guitar.png, girl&guitar.png
- **Brand Elements**: logo.JPG, Group 255.png, Mask group.png
- **Current**: fall_bg.png (smaller version)

### Unique Feature: Seasonal Background System
- **Concept**: Hero background changes based on time of year
- **Assets**: Three seasonal variations (summer, fall, winter)
- **Implication**: Creates returning visitor engagement and seasonal relevance
- **Technical**: Requires date-based logic for background selection

## Reference Design Elements
- Button.png, hero.png, image_cluster.png, navigation.png, scheduling.png, secondary_section.png
- These provide visual reference for component styling and layout patterns

## Design Decisions Captured - COMPLETE ✓

### 1. Design Vision & Emotional Goal ✓
- **Primary Feeling**: Warmth & Nurturing Community
- **Strategy**: Consistent nurturing tone across all pages
- **Implementation**: Safe, supportive environment emphasis

### 2. Visual Design System ✓
- **Authority**: Strict Figma adherence for brand consistency
- **Color Strategy**: Maintain exact Figma relationships across all pages
- **Reference**: Design elements in context/design_elements/

### 3. Accessibility Standards ✓
- **Level**: WCAG 2.1 AA compliance - full industry standard
- **Scope**: Maximum inclusivity with comprehensive accessibility features

### 4. Enrollment Configurator UX ✓
- **Strategy**: Streamlined wizard experience
- **Goal**: Fast, simple steps with clear progress indicators
- **Focus**: Minimize drop-off through efficient flow

### 5. Unique Features Documented ✓
- **Seasonal Backgrounds**: Summer/Fall/Winter rotation based on date
- **Character Assets**: Boy/girl with guitar for approachable imagery
- **Performance Targets**: LCP ≤ 2.5s, CLS ≤ 0.1

## DESIGN BRIEF COMPLETED ✓
- **Document**: ai_docs/context/core_docs/design_brief.md
- **Status**: Comprehensive 191-line design brief created
- **Coverage**: All major design areas explored and documented
- **Ready**: For implementation following established guidelines