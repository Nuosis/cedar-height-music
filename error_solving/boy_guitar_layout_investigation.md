# Boy+Guitar Layout Position Investigation

## Symptom
Boy+guitar image appears on the right side of the layout instead of the left side despite multiple attempts to reposition it. We know this because:
- Visual inspection shows image on right side consistently
- Multiple HTML structure changes have not resolved the issue
- CSS flexbox modifications have not changed the positioning

## Steps to Recreate
1. View the ComingSoon component in browser
2. Observe that boy+guitar image appears on right side
3. Expected: image should be on left side with content on right side

## Attempts to Solve the Problem
Multiple attempts made:
1. Swapped HTML div order in JSX multiple times
2. Changed CSS class names from content-left to content-right and back
3. Updated flexbox order properties
4. Modified mobile responsive CSS order properties
5. All changes resulted in image still appearing on right side

## Hypotheses

1. **CSS Specificity Override** (Most Fundamental)
   - hypothesis: Higher specificity CSS rules are overriding our flexbox layout changes
   - null hypothesis: Our CSS rules have sufficient specificity to control layout

2. **Browser Cache Issue**
   - hypothesis: Browser is caching old CSS and not reflecting our changes
   - null hypothesis: Browser is loading fresh CSS with our changes

3. **CSS File Loading Order**
   - hypothesis: Another CSS file is loading after ComingSoon.css and overriding our styles
   - null hypothesis: ComingSoon.css is the final authority on layout styles

4. **Flexbox Direction Property**
   - hypothesis: flex-direction is set to row-reverse somewhere, reversing our intended order
   - null hypothesis: flex-direction is set to row (default) allowing normal left-to-right flow

5. **CSS Grid Override**
   - hypothesis: A parent element is using CSS Grid that overrides our flexbox layout
   - null hypothesis: Parent elements use flexbox or normal flow, not grid

6. **Media Query Interference** (Most Dependent)
   - hypothesis: Media queries are applying different layout rules that override our base styles
   - null hypothesis: Media queries complement rather than override our base layout

## Investigation Process - COMPLETED

**LIVE EVIDENCE COLLECTED FROM PLAYWRIGHT TEST:**

### Desktop Evidence (Chromium & iPad):
- **DOM Order**: ["hero-image", "content-right"] - Hero image IS first child ✓
- **Flex Direction**: row ✓
- **Positioning**: Hero image left: 867px, Content left: 240px
- **PROBLEM**: Hero image appears AFTER content despite being first child
- **Root Cause**: Content has `flex: 1 1 0%` (grows to fill space), Hero image has `flex: 0 0 auto` (fixed size)

### Mobile Evidence:
- **Flex Direction**: column (responsive design working) ✓
- **Order**: Hero image order: 2, Content order: 1 (mobile stacking working) ✓

## ROOT CAUSE IDENTIFIED: CSS FLEX PROPERTIES

**NULL HYPOTHESIS DISPROVEN**: The flexbox layout is NOT working as expected.

**EVIDENCE**:
- Hero image is first in DOM ✓
- Flex direction is row ✓
- BUT content-right has `flex: 1` which makes it expand to fill available space
- Hero image has `flex: 0 0 auto` which keeps it at natural size
- This causes content to take up the LEFT space, pushing image to RIGHT

**SOLUTION**: The CSS flex properties are causing the content to expand and fill the left space, pushing the fixed-size image to the right, regardless of DOM order.