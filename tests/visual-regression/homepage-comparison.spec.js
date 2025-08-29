import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Visual Regression Test Suite: HomePage.jsx vs wireframes/index.html
 * 
 * This test suite compares the current React implementation with the wireframe
 * reference design to identify visual regressions and document differences.
 */

test.describe('Homepage Visual Regression Analysis', () => {
  let wireframeUrl;
  let reactUrl;
  
  test.beforeAll(async () => {
    // Set up URLs for comparison
    wireframeUrl = `file://${path.resolve('./wireframes/index.html')}`;
    reactUrl = 'http://localhost:5173/';
    
    // Ensure screenshots directory exists
    const screenshotsDir = path.resolve('./test-results/visual-regression');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('should capture wireframe reference screenshots', async ({ page }) => {
    await page.goto(wireframeUrl);
    
    // Wait for components to load
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.screenshot({
      path: 'test-results/visual-regression/wireframe-full-page.png',
      fullPage: true
    });
    
    // Section-specific screenshots
    const sections = [
      { name: 'hero', selector: '.hero-section' },
      { name: 'value-props', selector: '.value-props-section' },
      { name: 'about-teaser', selector: '.about-teaser-section' },
      { name: 'availability', selector: '.availability-section' },
      { name: 'micro-faq', selector: '.micro-faq-section' }
    ];
    
    for (const section of sections) {
      const element = page.locator(section.selector);
      if (await element.count() > 0) {
        await element.screenshot({
          path: `test-results/visual-regression/wireframe-${section.name}.png`
        });
      }
    }
  });

  test('should capture React implementation screenshots', async ({ page }) => {
    // Check if dev server is running
    try {
      await page.goto(reactUrl, { timeout: 5000 });
    } catch {
      test.skip('Dev server not running. Start with: npm run dev');
    }
    
    // Wait for React to render and components to load
    await page.waitForSelector('.home-page', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.screenshot({
      path: 'test-results/visual-regression/react-full-page.png',
      fullPage: true
    });
    
    // Section-specific screenshots
    const sections = [
      { name: 'hero', selector: '.hero-section' },
      { name: 'value-props', selector: '.value-props-section' },
      { name: 'about-teaser', selector: '.about-teaser-section' },
      { name: 'availability', selector: '.availability-section' },
      { name: 'micro-faq', selector: '.micro-faq-section' }
    ];
    
    for (const section of sections) {
      const element = page.locator(section.selector);
      if (await element.count() > 0) {
        await element.screenshot({
          path: `test-results/visual-regression/react-${section.name}.png`
        });
      }
    }
  });

  test('should analyze structural differences', async ({ page }) => {
    const differences = [];
    let reactStructure = null;
    
    // Test wireframe structure
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    const wireframeStructure = await page.evaluate(() => {
      const sections = {};
      
      // Hero section analysis
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        sections.hero = {
          exists: true,
          tagline: !!document.querySelector('.hero-tagline'),
          headline: !!document.querySelector('.hero-headline'),
          cta: !!document.querySelector('.primary-cta'),
          figure: !!document.querySelector('.hero-figure'),
          background: !!document.querySelector('.hero-background'),
          decorative: !!document.querySelector('.hero-decorative')
        };
      }
      
      // Value props analysis
      const valuePropsSection = document.querySelector('.value-props-section');
      if (valuePropsSection) {
        sections.valueProps = {
          exists: true,
          cardCount: document.querySelectorAll('.value-prop-card').length,
          hasIcons: !!document.querySelector('.card-icon'),
          hasGrid: !!document.querySelector('.three-column-grid')
        };
      }
      
      // About teaser analysis
      const aboutSection = document.querySelector('.about-teaser-section');
      if (aboutSection) {
        sections.aboutTeaser = {
          exists: true,
          hasEyebrow: !!document.querySelector('.eyebrow'),
          hasHeading: !!document.querySelector('.section-heading'),
          hasDescription: !!document.querySelector('.section-description'),
          hasImage: !!document.querySelector('.about-teaser-image img'),
          hasLink: !!document.querySelector('.inline-link')
        };
      }
      
      // Availability analysis
      const availabilitySection = document.querySelector('.availability-section');
      if (availabilitySection) {
        sections.availability = {
          exists: true,
          slotCount: document.querySelectorAll('.slot-chip').length,
          hasHighlighted: !!document.querySelector('.slot-chip.highlighted'),
          hasCta: !!document.querySelector('.availability-cta')
        };
      }
      
      // FAQ analysis
      const faqSection = document.querySelector('.micro-faq-section');
      if (faqSection) {
        sections.faq = {
          exists: true,
          itemCount: document.querySelectorAll('.accordion-item').length,
          hasAccordion: !!document.querySelector('.accordion')
        };
      }
      
      return sections;
    });
    
    // Test React structure
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      reactStructure = await page.evaluate(() => {
        const sections = {};
        
        // Hero section analysis
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          sections.hero = {
            exists: true,
            tagline: !!document.querySelector('.hero-tagline'),
            headline: !!document.querySelector('.hero-headline'),
            cta: !!document.querySelector('.primary-cta'),
            figure: !!document.querySelector('.hero-figure'),
            background: !!document.querySelector('.hero-background'),
            decorative: !!document.querySelector('.hero-decorative')
          };
        }
        
        // Value props analysis
        const valuePropsSection = document.querySelector('.value-props-section');
        if (valuePropsSection) {
          sections.valueProps = {
            exists: true,
            cardCount: document.querySelectorAll('.value-prop-card').length,
            hasIcons: !!document.querySelector('.card-icon'),
            hasGrid: !!document.querySelector('.three-column-grid')
          };
        }
        
        // About teaser analysis
        const aboutSection = document.querySelector('.about-teaser-section');
        if (aboutSection) {
          sections.aboutTeaser = {
            exists: true,
            hasEyebrow: !!document.querySelector('.eyebrow'),
            hasHeading: !!document.querySelector('.section-heading'),
            hasDescription: !!document.querySelector('.section-description'),
            hasImage: !!document.querySelector('.about-teaser-image img'),
            hasLink: !!document.querySelector('.inline-link')
          };
        }
        
        // Availability analysis
        const availabilitySection = document.querySelector('.availability-section');
        if (availabilitySection) {
          sections.availability = {
            exists: true,
            slotCount: document.querySelectorAll('.slot-chip').length,
            hasHighlighted: !!document.querySelector('.slot-chip.highlighted'),
            hasCta: !!document.querySelector('.availability-cta')
          };
        }
        
        // FAQ analysis
        const faqSection = document.querySelector('.micro-faq-section');
        if (faqSection) {
          sections.faq = {
            exists: true,
            itemCount: document.querySelectorAll('.accordion-item').length,
            hasAccordion: !!document.querySelector('.accordion')
          };
        }
        
        return sections;
      });
      
      // Compare structures and document differences
      const sectionNames = ['hero', 'valueProps', 'aboutTeaser', 'availability', 'faq'];
      
      for (const sectionName of sectionNames) {
        const wireframe = wireframeStructure[sectionName];
        const react = reactStructure[sectionName];
        
        if (!wireframe && !react) continue;
        
        if (!wireframe) {
          differences.push(`❌ MISSING IN WIREFRAME: ${sectionName} section exists in React but not in wireframe`);
          continue;
        }
        
        if (!react) {
          differences.push(`❌ MISSING IN REACT: ${sectionName} section exists in wireframe but not in React`);
          continue;
        }
        
        // Compare section properties
        for (const [key, wireframeValue] of Object.entries(wireframe)) {
          const reactValue = react[key];
          
          if (wireframeValue !== reactValue) {
            differences.push(`⚠️  DIFFERENCE in ${sectionName}.${key}: wireframe=${wireframeValue}, react=${reactValue}`);
          }
        }
      }
      
    } catch (error) {
      differences.push(`❌ REACT APP ERROR: Could not analyze React structure - ${error.message}`);
    }
    
    // Log all differences
    console.log('\n=== STRUCTURAL ANALYSIS RESULTS ===');
    if (differences.length === 0) {
      console.log('✅ No structural differences detected');
    } else {
      console.log(`Found ${differences.length} structural differences:`);
      differences.forEach(diff => console.log(diff));
    }
    
    // Write results to file
    const reportPath = 'test-results/visual-regression/structural-analysis.json';
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      wireframeStructure,
      reactStructure,
      differences,
      summary: {
        totalDifferences: differences.length,
        status: differences.length === 0 ? 'PASS' : 'DIFFERENCES_FOUND'
      }
    }, null, 2));
    
    console.log(`\n📄 Detailed analysis saved to: ${reportPath}`);
  });

  test('should test responsive behavior comparison', async ({ page }) => {
    const viewports = [
      { name: 'desktop', width: 1200, height: 800 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Wireframe responsive screenshots
      await page.goto(wireframeUrl);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `test-results/visual-regression/wireframe-${viewport.name}.png`,
        fullPage: true
      });
      
      // React responsive screenshots (if available)
      try {
        await page.goto(reactUrl, { timeout: 5000 });
        await page.waitForSelector('.home-page', { timeout: 5000 });
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `test-results/visual-regression/react-${viewport.name}.png`,
          fullPage: true
        });
      } catch (error) {
        console.log(`⚠️  Could not capture React ${viewport.name} screenshot: ${error.message}`);
      }
    }
  });

  test('should test interactive elements', async ({ page }) => {
    const interactionResults = {
      wireframe: {},
      react: {}
    };
    
    // Test wireframe interactions
    await page.goto(wireframeUrl);
    await page.waitForTimeout(2000);
    
    // Test FAQ accordion
    const wireframeFaqHeaders = page.locator('.accordion-header');
    const wireframeFaqCount = await wireframeFaqHeaders.count();
    interactionResults.wireframe.faqAccordion = {
      itemCount: wireframeFaqCount,
      interactive: wireframeFaqCount > 0
    };
    
    if (wireframeFaqCount > 0) {
      await wireframeFaqHeaders.first().click();
      await page.waitForTimeout(500);
      const isExpanded = await page.locator('.accordion-item.active').count() > 0;
      interactionResults.wireframe.faqAccordion.expandsOnClick = isExpanded;
    }
    
    // Test slot chips
    const wireframeSlots = page.locator('.slot-chip');
    const wireframeSlotCount = await wireframeSlots.count();
    interactionResults.wireframe.slotChips = {
      count: wireframeSlotCount,
      hasHighlighted: await page.locator('.slot-chip.highlighted').count() > 0
    };
    
    // Test React interactions (if available)
    try {
      await page.goto(reactUrl, { timeout: 5000 });
      await page.waitForSelector('.home-page', { timeout: 5000 });
      await page.waitForTimeout(2000);
      
      // Test FAQ accordion
      const reactFaqHeaders = page.locator('.accordion-header');
      const reactFaqCount = await reactFaqHeaders.count();
      interactionResults.react.faqAccordion = {
        itemCount: reactFaqCount,
        interactive: reactFaqCount > 0
      };
      
      if (reactFaqCount > 0) {
        await reactFaqHeaders.first().click();
        await page.waitForTimeout(500);
        const isExpanded = await page.locator('.accordion-item.active').count() > 0;
        interactionResults.react.faqAccordion.expandsOnClick = isExpanded;
      }
      
      // Test slot chips
      const reactSlots = page.locator('.slot-chip');
      const reactSlotCount = await reactSlots.count();
      interactionResults.react.slotChips = {
        count: reactSlotCount,
        hasHighlighted: await page.locator('.slot-chip.highlighted').count() > 0
      };
      
    } catch (error) {
      interactionResults.react.error = error.message;
    }
    
    // Save interaction test results
    const interactionReportPath = 'test-results/visual-regression/interaction-analysis.json';
    fs.writeFileSync(interactionReportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: interactionResults,
      summary: {
        wireframeWorking: Object.keys(interactionResults.wireframe).length > 0,
        reactWorking: Object.keys(interactionResults.react).length > 0 && !interactionResults.react.error,
        status: interactionResults.react.error ? 'REACT_ERROR' : 'COMPARISON_COMPLETE'
      }
    }, null, 2));
    
    console.log('\n=== INTERACTION ANALYSIS RESULTS ===');
    console.log('Wireframe interactions:', JSON.stringify(interactionResults.wireframe, null, 2));
    console.log('React interactions:', JSON.stringify(interactionResults.react, null, 2));
    console.log(`📄 Interaction analysis saved to: ${interactionReportPath}`);
  });

  test('should generate comprehensive regression report', async () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      testSuite: 'Homepage Visual Regression Analysis',
      comparison: {
        wireframe: 'wireframes/index.html',
        react: 'src/pages/HomePage.jsx'
      },
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0
      },
      findings: [],
      recommendations: [],
      screenshots: {
        wireframe: [
          'wireframe-full-page.png',
          'wireframe-hero.png',
          'wireframe-value-props.png',
          'wireframe-about-teaser.png',
          'wireframe-availability.png',
          'wireframe-micro-faq.png'
        ],
        react: [
          'react-full-page.png',
          'react-hero.png',
          'react-value-props.png',
          'react-about-teaser.png',
          'react-availability.png',
          'react-micro-faq.png'
        ],
        responsive: [
          'wireframe-desktop.png',
          'wireframe-tablet.png',
          'wireframe-mobile.png',
          'react-desktop.png',
          'react-tablet.png',
          'react-mobile.png'
        ]
      }
    };
    
    // Read existing analysis files if they exist
    try {
      const structuralPath = 'test-results/visual-regression/structural-analysis.json';
      if (fs.existsSync(structuralPath)) {
        const structuralData = JSON.parse(fs.readFileSync(structuralPath, 'utf8'));
        reportData.structuralAnalysis = structuralData;
        
        if (structuralData.differences.length > 0) {
          reportData.findings.push({
            category: 'Structural Differences',
            severity: 'HIGH',
            count: structuralData.differences.length,
            details: structuralData.differences
          });
        }
      }
      
      const interactionPath = 'test-results/visual-regression/interaction-analysis.json';
      if (fs.existsSync(interactionPath)) {
        const interactionData = JSON.parse(fs.readFileSync(interactionPath, 'utf8'));
        reportData.interactionAnalysis = interactionData;
        
        if (interactionData.results.react.error) {
          reportData.findings.push({
            category: 'React Application Error',
            severity: 'CRITICAL',
            details: [interactionData.results.react.error]
          });
        }
      }
    } catch (error) {
      reportData.findings.push({
        category: 'Report Generation Error',
        severity: 'MEDIUM',
        details: [error.message]
      });
    }
    
    // Generate recommendations based on findings
    if (reportData.findings.length === 0) {
      reportData.recommendations.push('✅ No major visual regressions detected. Implementation appears to match wireframe specifications.');
    } else {
      reportData.recommendations.push('🔍 Review identified differences and determine if they are intentional design changes or regressions.');
      reportData.recommendations.push('📸 Compare screenshot pairs manually to identify visual discrepancies.');
      reportData.recommendations.push('🧪 Run tests with React dev server running for complete analysis.');
    }
    
    // Save comprehensive report
    const finalReportPath = 'test-results/visual-regression/REGRESSION_REPORT.json';
    fs.writeFileSync(finalReportPath, JSON.stringify(reportData, null, 2));
    
    // Generate markdown report
    const markdownReport = generateMarkdownReport(reportData);
    const markdownReportPath = 'test-results/visual-regression/REGRESSION_REPORT.md';
    fs.writeFileSync(markdownReportPath, markdownReport);
    
    console.log('\n=== FINAL REGRESSION REPORT ===');
    console.log(`📄 JSON Report: ${finalReportPath}`);
    console.log(`📝 Markdown Report: ${markdownReportPath}`);
    console.log(`🖼️  Screenshots available in: test-results/visual-regression/`);
    
    if (reportData.findings.length > 0) {
      console.log(`\n⚠️  Found ${reportData.findings.length} categories of differences`);
      reportData.findings.forEach(finding => {
        console.log(`   ${finding.severity}: ${finding.category}`);
      });
    } else {
      console.log('\n✅ No significant regressions detected');
    }
  });
});

/**
 * Generate a markdown report from the analysis data
 */
function generateMarkdownReport(data) {
  return `# Homepage Visual Regression Report

**Generated:** ${data.timestamp}

## Overview

This report compares the React implementation (\`${data.comparison.react}\`) with the wireframe reference (\`${data.comparison.wireframe}\`) to identify visual regressions and structural differences.

## Summary

${data.findings.length === 0 ? '✅ **No major regressions detected**' : `⚠️ **${data.findings.length} categories of differences found**`}

## Findings

${data.findings.length === 0 ? 'No significant differences detected between wireframe and React implementation.' : data.findings.map(finding => `
### ${finding.category} (${finding.severity})

${finding.count ? `**Count:** ${finding.count}` : ''}

**Details:**
${finding.details.map(detail => `- ${detail}`).join('\n')}
`).join('\n')}

## Screenshots Generated

### Wireframe Reference
${data.screenshots.wireframe.map(file => `- \`${file}\``).join('\n')}

### React Implementation
${data.screenshots.react.map(file => `- \`${file}\``).join('\n')}

### Responsive Comparison
${data.screenshots.responsive.map(file => `- \`${file}\``).join('\n')}

## Recommendations

${data.recommendations.map(rec => `- ${rec}`).join('\n')}

## Technical Details

${data.structuralAnalysis ? `
### Structural Analysis
- **Wireframe sections detected:** ${Object.keys(data.structuralAnalysis.wireframeStructure).length}
- **React sections detected:** ${data.structuralAnalysis.reactStructure ? Object.keys(data.structuralAnalysis.reactStructure).length : 'N/A (app not running)'}
- **Differences found:** ${data.structuralAnalysis.differences.length}
` : ''}

${data.interactionAnalysis ? `
### Interaction Analysis
- **Wireframe interactive elements:** ${Object.keys(data.interactionAnalysis.results.wireframe).length}
- **React interactive elements:** ${data.interactionAnalysis.results.react.error ? 'Error occurred' : Object.keys(data.interactionAnalysis.results.react).length}
` : ''}

---

*Report generated by Playwright Visual Regression Test Suite*
`;
}