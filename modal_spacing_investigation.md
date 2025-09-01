# Coming Soon Modal Spacing Investigation

## Symptom
In the coming soon modal, there is a large visual gap between the 'STUDENT NAME' label and its corresponding input field. We know this because:
- Visual inspection shows excessive spacing between label and input
- Gap is significantly larger than expected for normal form spacing
- User confirmed this is NOT a margin/padding/gap issue but a positioning issue
- Previous attempts to fix margins/padding/flexbox layout did not resolve the issue

## Steps to Recreate
1. Navigate to the website (localhost:5173)
2. Click the 'Inquire Now' button to open the modal
3. Observe the spacing between the 'STUDENT NAME' label and the input field below it
4. Notice the excessive gap that is much larger than typical form field spacing

## Attempts to Solve the Problem
- Initially attempted to fix by adjusting margin and padding values in CSS (form-group, form-label, form-row margins)
- Then attempted to fix positioning by removing position: relative and adding flexbox layout to inquiry-modal-content
- User confirmed this is NOT a margin/padding/gap issue but specifically a positioning issue
- The problem persists after these changes

## Hypotheses

1. **CSS Grid Layout Issue** (Most Fundamental)
   - hypothesis: The form layout is using CSS Grid with incorrect row gaps or grid-template-rows
   - null hypothesis: CSS Grid layout is not causing the spacing issue

2. **Inherited CSS Styles**
   - hypothesis: Parent container styles are being inherited and affecting form element positioning
   - null hypothesis: No inherited styles are causing positioning conflicts

3. **CSS Transform or Translate**
   - hypothesis: CSS transforms or translate properties are moving elements out of their natural position
   - null hypothesis: No CSS transforms are affecting element positioning

4. **Flexbox Alignment Issues**
   - hypothesis: Flexbox properties (align-items, justify-content, align-self) are creating unexpected spacing
   - null hypothesis: Flexbox alignment properties are working correctly

5. **CSS Box Model Issues**
   - hypothesis: Box-sizing, display properties, or content-box vs border-box is causing layout issues
   - null hypothesis: Box model properties are consistent and correct

6. **Browser Default Styles** (Most Dependent)
   - hypothesis: Browser default styles for form elements are creating unexpected spacing
   - null hypothesis: Browser defaults are not interfering with custom styles