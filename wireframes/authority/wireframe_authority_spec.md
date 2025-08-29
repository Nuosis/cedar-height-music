# Cedar Heights Music Academy - Wireframe Authority Specification
**Phase 04: High-Fidelity Wireframe Extensions**  
**Version:** 1.0  
**Date:** August 28, 2025  
**Status:** Active Development  

---

## Authority Binding Summary

### Primary Design System Authority
- **Source**: Figma Design System
- **URL**: https://www.figma.com/design/8iXCoxrnEkJaAEVERBY4wr/Music?node-id=0-1&p=f&t=mEFgAvR3fs6muKHj-0
- **Authority Level**: Primary visual authority for layout, typography, spacing, and component specifications
- **Usage Constraint**: Strict adherence required for brand trust and consistency
- **Adaptation Rule**: Generic "Beat" branding in Figma adapted to Cedar Heights Music Academy identity

### Design Reference Elements (Figma-Derived)
**Location**: `ai_docs/context/design_elements/`  
**Provenance**: Design system exports adapted for Cedar Heights Music Academy

| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| Hero Layout | `hero.png` | Homepage hero section layout and composition | Spatial relationships, character positioning, CTA placement |
| Button Specifications | `Button.png` | Primary and secondary button styling reference | Color gradients, border radius, typography, hover states |
| Navigation Design | `navigation.png` | Global navigation structure and styling | Menu layout, typography, active states, responsive behavior |
| Secondary Section | `secondary_section.png` | Content section layout patterns | Grid systems, content hierarchy, spacing relationships |
| About Hero | `about_hero.png` | About page hero section layout | Teacher bio layouts, studio story presentation |
| About Secondary | `about_secondary_section.png` | About page content sections | Content organization and visual hierarchy |
| Image Cluster | `image_cluster.png` | Multi-image arrangement patterns | Teacher photo galleries, feature showcases |
| Scheduling Interface | `scheduling.png` | Time slot selection and booking interface | Enrollment configurator step design |

### Production Assets (Cedar Heights Branded)
**Location**: `public/` directory  
**Provenance**: Academy-provided brand materials and custom illustrations

---

## Asset Map Table

### Brand Identity Assets
| Asset | Path | Dimensions | Format | Usage | Authority |
|-------|------|------------|--------|-------|-----------|
| Primary Logo | `public/logo.JPG` | 280x280px | JPG | Official Cedar Heights Music Academy logo | Primary brand identity |
| Brand Element 1 | `public/Group 255.png` | Variable | PNG | Supporting brand element/icon | Primary brand identity |
| Brand Element 2 | `public/Mask group.png` | Variable | PNG | Brand element/mask | Primary brand identity |

### Seasonal Background System
| Asset | Path | Format | Usage | Implementation |
|-------|------|--------|-------|----------------|
| Summer Background | `public/summer_bg_lrg.png` | PNG | Hero background (Jun-Aug) | **ACTIVE** - Current season |
| Fall Background | `public/fall_bg_lrg.png` | PNG | Hero background (Sep-Nov) | Date-driven selection |
| Winter Background | `public/winter_bg_lrg.png` | PNG | Hero background (Dec-Feb) | Date-driven selection |
| Base Color | rgb(252, 244, 226) | CSS | Warm, nurturing foundation | Background overlay base |

### Character Illustrations
| Asset | Path | Format | Usage | Positioning |
|-------|------|--------|-------|-------------|
| Boy with Guitar | `public/boy+guitar.png` | PNG | Hero character, primary | Bottom-right with drop-shadow |
| Girl with Guitar (v1) | `public/girl+guitar.png` | PNG | Alternative character | Bottom-right with drop-shadow |
| Girl with Guitar (v2) | `public/girl&guitar.png` | PNG | Alternative character | Bottom-right with drop-shadow |

### Decorative Elements
| Asset | Path | Format | Usage | Context |
|-------|------|--------|-------|---------|
| Green 8th Note | `public/8th_note_green.png` | PNG | Musical accent element | Decorative accents |
| Red 8th Note | `public/8th_note_red.png` | PNG | Musical accent element | Decorative accents |
| Green 8th Notes | `public/8th_notes_green.png` | PNG | Musical accent cluster | Decorative accents |
| Orange Dot | `public/dot_orange.png` | PNG | Accent element | Visual punctuation |

### Photography Assets
| Asset | Path | Format | Usage | Context |
|-------|------|--------|-------|---------|
| Bass Lesson | `public/bass-lesson-instruction.jpg` | JPG | Lesson instruction imagery | About/teaching content |
| Guitar Teaching | `public/guitar-lesson-teaching.jpg` | JPG | Teaching moment capture | About/teaching content |
| Piano Student | `public/piano-teacher-student.jpg` | JPG | Piano lesson imagery | About/teaching content |
| General Music | `public/music-lesson-general.jpg` | JPG | General lesson imagery | About/teaching content |

---

## Typography Lockup Table

### Primary Typography System
Based on Design Brief specifications and Figma design system authority.

| Element | Family | Weight | Size (Desktop) | Size (Tablet) | Size (Mobile) | Line Height | Letter Spacing | Max Width |
|---------|--------|--------|----------------|---------------|---------------|-------------|----------------|-----------|
| **Hero Headline** | System Sans | 600 | 56-64px (3.5rem) | 44-52px (3rem) | 34-40px (2.25rem) | 1.15 | Normal | 800-860px |
| **Hero Tagline** | System Sans | 400 | 16px (1rem) | 16px (1rem) | 14px (0.875rem) | 1.4 | Normal | - |
| **Section Heading** | System Sans | 600 | 40px (2.5rem) | 36px (2.25rem) | 32px (2rem) | 1.2 | Normal | - |
| **Subsection Heading** | System Sans | 600 | 28px (1.75rem) | 24px (1.5rem) | 20px (1.25rem) | 1.3 | Normal | - |
| **Body Text** | System Sans | 400 | 16px (1rem) | 16px (1rem) | 16px (1rem) | 1.6 | Normal | - |
| **CTA Button** | System Sans | 600 | 16px (1rem) | 16px (1rem) | 16px (1rem) | 1.4 | Normal | - |
| **Navigation** | System Sans | 500 | 16px (1rem) | 16px (1rem) | 16px (1rem) | 1.4 | Normal | - |

### Typography Implementation Notes
- **System Sans Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
- **Display Accent**: `'Georgia', 'Times New Roman', serif` (for wordmark if needed)
- **Color Authority**: All text colors must match Design Brief specifications
- **Contrast Requirements**: Minimum 4.5:1 for normal text, 3:1 for large text (WCAG 2.1 AA)

---

## Acceptance Matrix

### Hero/Primary Content Area
| Metric | Target | Tolerance | Measurement Method |
|--------|--------|-----------|-------------------|
| Text Block Positioning | Exact match to Figma overlay | ±12px X/Y | Overlay comparison |
| Visual Element Scale | Match reference height | ±5% | Pixel measurement |
| Character Positioning | Bottom-right per hero.png | ±8px | Coordinate measurement |
| Background Coverage | Full section coverage | 100% | Visual inspection |

### Typography Compliance
| Metric | Target | Tolerance | Measurement Method |
|--------|--------|-----------|-------------------|
| Headline Font Size | Per typography table | ±6% | Computed style inspection |
| Line Height | Per typography table | ±8% | Computed style inspection |
| Font Family | Exact match | 0 tolerance | Computed style inspection |
| Font Weight | Exact match | 0 tolerance | Computed style inspection |

### Primary CTA Requirements
| Metric | Target | Tolerance | Measurement Method |
|--------|--------|-----------|-------------------|
| Contrast Ratio | ≥4.5:1 | 0 tolerance | Color contrast analyzer |
| Button Area | Match Button.png specs | ±8% | Pixel measurement |
| Padding | Match Button.png specs | ±2px | Computed style inspection |
| Border Radius | 12px per specifications | ±1px | Computed style inspection |
| Hover State | Match Button.png specs | Exact | Visual inspection |

### Navigation Component
| Metric | Target | Tolerance | Measurement Method |
|--------|--------|-----------|-------------------|
| Logo-Menu Gap | Per navigation.png | ±8px | Pixel measurement |
| Item-Item Gap | Per navigation.png | ±6px | Pixel measurement |
| Hover Indicator | Match navigation.png | Exact | Visual inspection |
| Active State | Match navigation.png | Exact | Visual inspection |

---

## Overlay/Proof Checklist

### Required Overlay Comparisons
- [ ] **Hero Section Overlay**: Semi-transparent hero.png over current implementation
- [ ] **Navigation Overlay**: Semi-transparent navigation.png over header implementation
- [ ] **Button Overlay**: Semi-transparent Button.png over CTA implementations
- [ ] **Secondary Section Overlay**: Semi-transparent secondary_section.png over content sections

### Storage Locations
- **Overlays**: `wireframes/screenshots/overlays/`
- **Side-by-Side Proofs**: `wireframes/screenshots/proofs/`
- **Validation Screenshots**: `wireframes/screenshots/validation/`

### Required Views
1. **Primary Content Crop**: Hero section with character and CTA positioning
2. **Full Header**: Complete navigation implementation
3. **Primary CTA Close-up**: Button styling and hover states
4. **Representative Section**: One complete content section with typography

---

## Open Questions and Decisions Log

### Design Authority Clarifications
| Date | Question | Decision | Authority Source |
|------|----------|----------|------------------|
| 2025-08-28 | Seasonal background rotation logic | Jun-Aug (Summer), Sep-Nov (Fall), Dec-Feb (Winter), Mar-May (Fall fallback) | Design Brief specifications |
| 2025-08-28 | Character asset selection priority | boy+guitar.png as primary hero character | Design Brief and hero.png reference |
| 2025-08-28 | Typography system authority | System font stack with Figma sizing specifications | Design Brief typography section |

### Implementation Decisions
| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2025-08-28 | Use CSS custom properties for design tokens | Enables systematic consistency and Phase 05 promotion | Facilitates token extraction |
| 2025-08-28 | Implement seasonal background via CSS classes | Maintains performance while enabling date-based switching | JavaScript logic required |
| 2025-08-28 | Maintain existing wireframe structure | Preserves Phase 03 validation framework | Extends rather than replaces |

### Outstanding Questions
- [ ] Exact color values for gradients in Button.png
- [ ] Specific hover animation timing and easing
- [ ] Mobile breakpoint behavior for character positioning
- [ ] Accessibility considerations for seasonal background contrast

---

## Token Candidates for Phase 05 Promotion

### Color Tokens
```css
/* Primary Colors */
--color-primary-green: #99E39E;
--color-dark-text: #000510;
--color-warm-yellow: #ffd700;
--color-warm-gold: #F3DA94;
--color-warm-off-white: #FCF4E2;

/* Seasonal Background Base */
--color-hero-background: rgb(252, 244, 226);
```

### Typography Tokens
```css
/* Font Families */
--font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
--font-family-display: 'Georgia', 'Times New Roman', serif;

/* Font Sizes */
--font-size-hero-headline: 3.5rem;
--font-size-section-heading: 2.5rem;
--font-size-body: 1rem;
--font-size-tagline: 1rem;

/* Line Heights */
--line-height-hero: 1.15;
--line-height-heading: 1.2;
--line-height-body: 1.6;
```

### Spacing Tokens
```css
/* Layout */
--content-width: 1300px;
--content-padding-desktop: 80px;
--content-padding-tablet: 48px;
--content-padding-mobile: 24px;

/* Section Spacing */
--section-spacing-desktop: 120px;
--section-spacing-tablet: 80px;
--section-spacing-mobile: 56px;

/* Component Spacing */
--cta-gap: 12px;
--card-gap: 2rem;
```

### Border Radius Tokens
```css
--border-radius-small: 8px;
--border-radius-medium: 12px;
--border-radius-large: 15px;
--border-radius-pill: 50px;
```

### Transition Tokens
```css
--transition-normal: 250ms ease-in-out;
--transition-fast: 150ms ease-in-out;
```

---

## Implementation Status

### Phase 04 Progress Tracking
- [ ] Authority binding completed and documented
- [ ] Asset map table completed with all repository paths
- [ ] Typography lockup table implemented with exact specifications
- [ ] Acceptance matrix defined with measurable tolerances
- [ ] Overlay comparison protocol established
- [ ] Validation hooks implemented
- [ ] Visual compliance measurement system active
- [ ] Token candidates documented for Phase 05

### Next Steps
1. Implement high-fidelity styling based on authority specifications
2. Generate overlay comparisons and validation proofs
3. Run acceptance matrix validation
4. Achieve ≥90% visual compliance threshold
5. Document final compliance report for Phase 05 handoff

---

**Document Status**: Active Development  
**Last Updated**: August 28, 2025  
**Next Review**: Upon completion of high-fidelity implementation