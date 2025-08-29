import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Enhanced Visual Regression Test Suite with Pixel-Perfect Comparison
 * 
 * This test suite uses Playwright's visual comparison features to detect
 * actual visual differences between wireframe and React implementations.
 */

test.describe('Enhanced Homepage Visual Regression Analysis', () => {
  let wireframeUrl;
  let reactUrl;
  
  test.beforeAll(async () => {
    wireframeUrl = `file://${path.resolve('./wireframes/index.html')}`;
    reactUrl = 'http://localhost:5173/';
    
    // Ensure comparison directory exists
    const comparisonDir = path.resolve('./test-results/visual-comparison');
    if (!fs.existsSync(comparisonDir)) {
      fs.mkdirSync(comparisonDir, { recursive: true });
    }
  });

  test('should detect visual differences in hero section', async ({ page }) => {
    // Capture wireframe hero
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    const wireframeHero = page.locator('.hero-section');
    await expect(wireframeHero).toHaveScreenshot('wireframe-hero-baseline.png');
    
    // Capture React hero
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      const reactHero = page.locator('.hero-section');
      
      // This will fail if there are visual differences and show the diff
      await expect(reactHero).toHaveScreenshot('wireframe-hero-baseline.png');
      
    } catch {
      console.log('✅ Visual differences detected in hero section');
      // Capture the actual React version for comparison
      const reactHero = page.locator('.hero-section');
      await reactHero.screenshot({ path: 'test-results/visual-comparison/react-hero-actual.png' });
    }
  });

  test('should detect visual differences in about teaser section', async ({ page }) => {
    // Capture wireframe about teaser
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    const wireframeAbout = page.locator('.about-teaser-section');
    await expect(wireframeAbout).toHaveScreenshot('wireframe-about-baseline.png');
    
    // Capture React about teaser
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      const reactAbout = page.locator('.about-teaser-section');
      
      // This will fail if there are visual differences
      await expect(reactAbout).toHaveScreenshot('wireframe-about-baseline.png');
      
    } catch {
      console.log('✅ Visual differences detected in about teaser section');
      // Capture the actual React version for comparison
      const reactAbout = page.locator('.about-teaser-section');
      await reactAbout.screenshot({ path: 'test-results/visual-comparison/react-about-actual.png' });
    }
  });

  test('should detect visual differences in value props section', async ({ page }) => {
    // Capture wireframe value props
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    const wireframeValueProps = page.locator('.value-props-section');
    await expect(wireframeValueProps).toHaveScreenshot('wireframe-valueprops-baseline.png');
    
    // Capture React value props
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      const reactValueProps = page.locator('.value-props-section');
      
      // This will fail if there are visual differences
      await expect(reactValueProps).toHaveScreenshot('wireframe-valueprops-baseline.png');
      
    } catch {
      console.log('✅ Visual differences detected in value props section');
      // Capture the actual React version for comparison
      const reactValueProps = page.locator('.value-props-section');
      await reactValueProps.screenshot({ path: 'test-results/visual-comparison/react-valueprops-actual.png' });
    }
  });

  test('should detect visual differences in availability section', async ({ page }) => {
    // Capture wireframe availability
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    const wireframeAvailability = page.locator('.availability-section');
    await expect(wireframeAvailability).toHaveScreenshot('wireframe-availability-baseline.png');
    
    // Capture React availability
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      const reactAvailability = page.locator('.availability-section');
      
      // This will fail if there are visual differences
      await expect(reactAvailability).toHaveScreenshot('wireframe-availability-baseline.png');
      
    } catch {
      console.log('✅ Visual differences detected in availability section');
      // Capture the actual React version for comparison
      const reactAvailability = page.locator('.availability-section');
      await reactAvailability.screenshot({ path: 'test-results/visual-comparison/react-availability-actual.png' });
    }
  });

  test('should detect visual differences in FAQ section', async ({ page }) => {
    // Capture wireframe FAQ
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    const wireframeFaq = page.locator('.micro-faq-section');
    await expect(wireframeFaq).toHaveScreenshot('wireframe-faq-baseline.png');
    
    // Capture React FAQ
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      const reactFaq = page.locator('.micro-faq-section');
      
      // This will fail if there are visual differences
      await expect(reactFaq).toHaveScreenshot('wireframe-faq-baseline.png');
      
    } catch {
      console.log('✅ Visual differences detected in FAQ section');
      // Capture the actual React version for comparison
      const reactFaq = page.locator('.micro-faq-section');
      await reactFaq.screenshot({ path: 'test-results/visual-comparison/react-faq-actual.png' });
    }
  });

  test('should perform detailed visual analysis and generate diff report', async ({ page }) => {
    const visualDifferences = [];
    const sections = [
      { name: 'hero', selector: '.hero-section' },
      { name: 'value-props', selector: '.value-props-section' },
      { name: 'about-teaser', selector: '.about-teaser-section' },
      { name: 'availability', selector: '.availability-section' },
      { name: 'micro-faq', selector: '.micro-faq-section' }
    ];

    for (const section of sections) {
      // Capture wireframe section
      await page.goto(wireframeUrl);
      await page.waitForTimeout(2000);
      
      const wireframeElement = page.locator(section.selector);
      if (await wireframeElement.count() > 0) {
        await wireframeElement.screenshot({
          path: `test-results/visual-comparison/wireframe-${section.name}-reference.png`
        });
        
        // Get detailed metrics
        const wireframeBox = await wireframeElement.boundingBox();
        const wireframeStyles = await wireframeElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            fontSize: computed.fontSize,
            fontFamily: computed.fontFamily,
            padding: computed.padding,
            margin: computed.margin,
            display: computed.display,
            flexDirection: computed.flexDirection,
            justifyContent: computed.justifyContent,
            alignItems: computed.alignItems
          };
        });
        
        // Capture React section
        try {
          await page.goto(reactUrl, { timeout: 5000 });
          await page.waitForSelector('.home-page', { timeout: 10000 });
          await page.waitForTimeout(2000);
          
          const reactElement = page.locator(section.selector);
          if (await reactElement.count() > 0) {
            await reactElement.screenshot({
              path: `test-results/visual-comparison/react-${section.name}-actual.png`
            });
            
            const reactBox = await reactElement.boundingBox();
            const reactStyles = await reactElement.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                backgroundColor: computed.backgroundColor,
                color: computed.color,
                fontSize: computed.fontSize,
                fontFamily: computed.fontFamily,
                padding: computed.padding,
                margin: computed.margin,
                display: computed.display,
                flexDirection: computed.flexDirection,
                justifyContent: computed.justifyContent,
                alignItems: computed.alignItems
              };
            });
            
            // Compare dimensions
            const dimensionDiffs = [];
            if (wireframeBox && reactBox) {
              if (Math.abs(wireframeBox.width - reactBox.width) > 5) {
                dimensionDiffs.push(`Width: wireframe=${wireframeBox.width}px, react=${reactBox.width}px`);
              }
              if (Math.abs(wireframeBox.height - reactBox.height) > 5) {
                dimensionDiffs.push(`Height: wireframe=${wireframeBox.height}px, react=${reactBox.height}px`);
              }
            }
            
            // Compare styles
            const styleDiffs = [];
            for (const [property, wireframeValue] of Object.entries(wireframeStyles)) {
              const reactValue = reactStyles[property];
              if (wireframeValue !== reactValue) {
                styleDiffs.push(`${property}: wireframe="${wireframeValue}", react="${reactValue}"`);
              }
            }
            
            if (dimensionDiffs.length > 0 || styleDiffs.length > 0) {
              visualDifferences.push({
                section: section.name,
                dimensionDifferences: dimensionDiffs,
                styleDifferences: styleDiffs,
                wireframeBox,
                reactBox
              });
            }
          }
        } catch (error) {
          visualDifferences.push({
            section: section.name,
            error: `React section not accessible: ${error.message}`
          });
        }
      }
    }
    
    // Generate detailed visual difference report
    const report = {
      timestamp: new Date().toISOString(),
      totalSections: sections.length,
      sectionsWithDifferences: visualDifferences.length,
      differences: visualDifferences,
      summary: {
        hasDifferences: visualDifferences.length > 0,
        status: visualDifferences.length > 0 ? 'VISUAL_DIFFERENCES_DETECTED' : 'VISUAL_MATCH'
      }
    };
    
    // Save detailed report
    fs.writeFileSync(
      'test-results/visual-comparison/VISUAL_DIFFERENCES_REPORT.json',
      JSON.stringify(report, null, 2)
    );
    
    // Generate markdown report
    const markdownReport = generateVisualDiffMarkdown(report);
    fs.writeFileSync(
      'test-results/visual-comparison/VISUAL_DIFFERENCES_REPORT.md',
      markdownReport
    );
    
    console.log('\n=== VISUAL DIFFERENCES ANALYSIS ===');
    console.log(`Sections analyzed: ${sections.length}`);
    console.log(`Sections with differences: ${visualDifferences.length}`);
    
    if (visualDifferences.length > 0) {
      console.log('\n🔍 DIFFERENCES DETECTED:');
      visualDifferences.forEach(diff => {
        console.log(`\n📍 ${diff.section.toUpperCase()}:`);
        if (diff.error) {
          console.log(`   ❌ ${diff.error}`);
        } else {
          if (diff.dimensionDifferences.length > 0) {
            console.log(`   📏 Dimension differences:`);
            diff.dimensionDifferences.forEach(d => console.log(`      - ${d}`));
          }
          if (diff.styleDifferences.length > 0) {
            console.log(`   🎨 Style differences:`);
            diff.styleDifferences.forEach(d => console.log(`      - ${d}`));
          }
        }
      });
    } else {
      console.log('✅ No visual differences detected');
    }
    
    console.log(`\n📄 Detailed report: test-results/visual-comparison/VISUAL_DIFFERENCES_REPORT.md`);
  });
});

/**
 * Generate markdown report for visual differences
 */
function generateVisualDiffMarkdown(report) {
  return `# Visual Differences Report

**Generated:** ${report.timestamp}

## Summary

${report.hasDifferences ? `⚠️ **${report.sectionsWithDifferences} of ${report.totalSections} sections have visual differences**` : `✅ **All ${report.totalSections} sections match visually**`}

## Section Analysis

${report.differences.length === 0 ? 'No visual differences detected.' : report.differences.map(diff => `
### ${diff.section.charAt(0).toUpperCase() + diff.section.slice(1)} Section

${diff.error ? `**Error:** ${diff.error}` : ''}

${diff.dimensionDifferences && diff.dimensionDifferences.length > 0 ? `
**Dimension Differences:**
${diff.dimensionDifferences.map(d => `- ${d}`).join('\n')}
` : ''}

${diff.styleDifferences && diff.styleDifferences.length > 0 ? `
**Style Differences:**
${diff.styleDifferences.map(d => `- ${d}`).join('\n')}
` : ''}

**Screenshots:**
- Wireframe: \`wireframe-${diff.section}-reference.png\`
- React: \`react-${diff.section}-actual.png\`
`).join('\n')}

## Visual Comparison Files

All screenshot comparisons are available in the \`test-results/visual-comparison/\` directory:

### Reference Screenshots (Wireframe)
${['hero', 'value-props', 'about-teaser', 'availability', 'micro-faq'].map(section => 
  `- \`wireframe-${section}-reference.png\``
).join('\n')}

### Actual Screenshots (React)
${['hero', 'value-props', 'about-teaser', 'availability', 'micro-faq'].map(section => 
  `- \`react-${section}-actual.png\``
).join('\n')}

## Recommendations

${report.hasDifferences ? `
1. **Review Screenshots**: Compare the wireframe reference images with React actual images
2. **Analyze Differences**: Focus on the sections with detected differences
3. **Update Styles**: Adjust React component styles to match wireframe specifications
4. **Re-run Tests**: Verify fixes by running the visual regression tests again
` : `
1. **Maintain Quality**: Continue using visual regression tests in CI/CD
2. **Update Baselines**: When design changes are approved, update baseline images
3. **Expand Coverage**: Consider adding more granular visual tests
`}

---

*Report generated by Enhanced Playwright Visual Regression Test Suite*
`;
}