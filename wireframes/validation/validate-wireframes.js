/**
 * Cedar Heights Music Academy - Page Blueprints Validation Tool
 * Phase 04: High-Fidelity Wireframe Extensions
 *
 * Validates implementation against Page Blueprints specifications
 * Reference: ai_docs/context/core_docs/page_blueprints.md
 */

import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PageBlueprintsValidator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:5173'; // Vite dev server default
    this.outputDir = path.join(__dirname, '../screenshots');
    this.validationResults = {
      timestamp: new Date().toISOString(),
      overallCompliance: 0,
      pages: {},
      globalElements: {},
      issues: [],
      passed: [],
      failed: []
    };
  }

  async initialize() {
    // Ensure output directory exists
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set viewport for desktop validation (Page Blueprints: 1300px content width)
    await this.page.setViewport({
      width: 1300,
      height: 800,
      deviceScaleFactor: 1
    });
  }

  async validateGlobalElements() {
    console.log('🔍 Validating Global Elements against Page Blueprints...');
    
    await this.page.goto(`${this.baseUrl}/`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const globalValidation = await this.page.evaluate(() => {
      const results = {
        header: { passed: [], failed: [] },
        navigation: { passed: [], failed: [] },
        footer: { passed: [], failed: [] },
        branding: { passed: [], failed: [] }
      };

      // Page Blueprints Line 27-30: Header/Nav validation
      const header = document.querySelector('header, nav');
      if (header) {
        // Check for sticky behavior (Page Blueprints Line 30)
        const headerStyles = window.getComputedStyle(header);
        if (headerStyles.position === 'sticky' || headerStyles.position === 'fixed') {
          results.header.passed.push('Header has sticky positioning');
        } else {
          results.header.failed.push('Header missing sticky positioning (Page Blueprints Line 30)');
        }

        // Check for required navigation items (Page Blueprints Line 29)
        const requiredNavItems = ['Home', 'About', 'Pricing', 'Enroll', 'Contact'];
        const navLinks = Array.from(header.querySelectorAll('a, .nav-item'));
        const navTexts = navLinks.map(link => link.textContent.trim());
        
        requiredNavItems.forEach(item => {
          if (navTexts.some(text => text.includes(item))) {
            results.navigation.passed.push(`Navigation includes required item: ${item}`);
          } else {
            results.navigation.failed.push(`Missing required navigation item: ${item} (Page Blueprints Line 29)`);
          }
        });

        // Check for Cedar Heights branding (Page Blueprints Line 28)
        const brandText = header.textContent;
        if (brandText.includes('Cedar Heights Music Academy')) {
          results.branding.passed.push('Correct branding: Cedar Heights Music Academy');
        } else if (brandText.includes('BeatWave')) {
          results.branding.failed.push('CRITICAL: Still using BeatWave branding - must be Cedar Heights Music Academy (Page Blueprints Line 28)');
        } else {
          results.branding.failed.push('Missing or incorrect branding (Page Blueprints Line 28)');
        }
      } else {
        results.header.failed.push('Header/navigation element not found');
      }

      // Page Blueprints Line 31-33: Footer validation
      const footer = document.querySelector('footer');
      if (footer) {
        const footerText = footer.textContent;
        
        // Check for required footer sections
        if (footerText.includes('Privacy') && footerText.includes('Terms')) {
          results.footer.passed.push('Footer includes Privacy and Terms links');
        } else {
          results.footer.failed.push('Footer missing Privacy and/or Terms links (Page Blueprints Line 32)');
        }

        // Check for copyright line (Page Blueprints Line 33)
        if (footerText.includes('Cedar Heights Music Academy © 2025')) {
          results.footer.passed.push('Footer includes correct copyright line');
        } else {
          results.footer.failed.push('Footer missing correct copyright line (Page Blueprints Line 33)');
        }
      } else {
        results.footer.failed.push('Footer element not found');
      }

      return results;
    });

    this.validationResults.globalElements = globalValidation;
    return globalValidation;
  }

  async validateHomePage() {
    console.log('🏠 Validating Home Page against Page Blueprints...');
    
    await this.page.goto(`${this.baseUrl}/`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const homeValidation = await this.page.evaluate(() => {
      const results = {
        hero: { passed: [], failed: [] },
        valueProps: { passed: [], failed: [] },
        aboutTeaser: { passed: [], failed: [] },
        availability: { passed: [], failed: [] },
        microFaq: { passed: [], failed: [] },
        measurements: {}
      };

      // Page Blueprints Line 44-111: Hero Section Validation
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        // Check hero content structure (Page Blueprints Line 45)
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
          const contentStyles = window.getComputedStyle(heroContent);
          const maxWidth = parseInt(contentStyles.maxWidth);
          
          // Page Blueprints Line 45: ~856px max width
          if (maxWidth >= 800 && maxWidth <= 900) {
            results.hero.passed.push(`Hero content max-width within spec: ${maxWidth}px`);
          } else {
            results.hero.failed.push(`Hero content max-width outside spec (800-900px): ${maxWidth}px (Page Blueprints Line 45)`);
          }
        }

        // Check for tagline (Page Blueprints Line 55-59)
        const tagline = heroSection.querySelector('.hero-tagline, .tagline');
        if (tagline) {
          const taglineStyles = window.getComputedStyle(tagline);
          const fontSize = parseInt(taglineStyles.fontSize);
          
          // Page Blueprints Line 57: ~16px desktop
          if (fontSize >= 14 && fontSize <= 18) {
            results.hero.passed.push(`Tagline font size within spec: ${fontSize}px`);
          } else {
            results.hero.failed.push(`Tagline font size outside spec (14-18px): ${fontSize}px (Page Blueprints Line 57)`);
          }

          // Check tagline content (Page Blueprints Line 56)
          if (tagline.textContent.includes('Personal, one-on-one music lessons')) {
            results.hero.passed.push('Tagline content matches Page Blueprints specification');
          } else {
            results.hero.failed.push('Tagline content does not match Page Blueprints Line 56');
          }
        } else {
          results.hero.failed.push('Hero tagline not found (Page Blueprints Line 55-59)');
        }

        // Check for headline (Page Blueprints Line 60-64)
        const headline = heroSection.querySelector('.hero-headline, h1');
        if (headline) {
          const headlineStyles = window.getComputedStyle(headline);
          const fontSize = parseInt(headlineStyles.fontSize);
          
          // Page Blueprints Line 62: ~56-64px desktop
          if (fontSize >= 50 && fontSize <= 70) {
            results.hero.passed.push(`Headline font size within spec: ${fontSize}px`);
          } else {
            results.hero.failed.push(`Headline font size outside spec (50-70px): ${fontSize}px (Page Blueprints Line 62)`);
          }

          // Check headline content (Page Blueprints Line 399)
          if (headline.textContent.includes('Where Your Musical Journey Begins')) {
            results.hero.passed.push('Headline content matches Page Blueprints specification');
          } else {
            results.hero.failed.push('Headline content does not match Page Blueprints Line 399');
          }

          // Store measurements
          const headlineRect = headline.getBoundingClientRect();
          results.measurements.heroHeadline = {
            fontSize: fontSize,
            width: headlineRect.width,
            height: headlineRect.height,
            lineHeight: headlineStyles.lineHeight
          };
        } else {
          results.hero.failed.push('Hero headline not found (Page Blueprints Line 60-64)');
        }

        // Check for primary CTA (Page Blueprints Line 65-71)
        const primaryCTA = heroSection.querySelector('.primary-cta');
        if (primaryCTA) {
          const ctaStyles = window.getComputedStyle(primaryCTA);
          const backgroundColor = ctaStyles.backgroundColor;
          const borderRadius = parseInt(ctaStyles.borderRadius);
          
          // Page Blueprints Line 67: 12px radius
          if (borderRadius >= 10 && borderRadius <= 14) {
            results.hero.passed.push(`Primary CTA border radius within spec: ${borderRadius}px`);
          } else {
            results.hero.failed.push(`Primary CTA border radius outside spec (10-14px): ${borderRadius}px (Page Blueprints Line 67)`);
          }

          // Check CTA text (Page Blueprints Line 66)
          if (primaryCTA.textContent.includes('Enroll Now')) {
            results.hero.passed.push('Primary CTA text matches Page Blueprints specification');
          } else {
            results.hero.failed.push('Primary CTA text does not match "Enroll Now" (Page Blueprints Line 66)');
          }

          // Store measurements
          const ctaRect = primaryCTA.getBoundingClientRect();
          results.measurements.primaryCTA = {
            width: ctaRect.width,
            height: ctaRect.height,
            borderRadius: borderRadius,
            backgroundColor: backgroundColor
          };
        } else {
          results.hero.failed.push('Primary CTA not found (Page Blueprints Line 65-71)');
        }

        // Check for boy+guitar figure (Page Blueprints Line 76-91)
        const heroFigure = heroSection.querySelector('.hero-figure, .hero-character');
        if (heroFigure) {
          const figureStyles = window.getComputedStyle(heroFigure);
          if (figureStyles.position === 'absolute') {
            results.hero.passed.push('Hero figure has absolute positioning');
          } else {
            results.hero.failed.push('Hero figure missing absolute positioning (Page Blueprints Line 76-91)');
          }
        } else {
          results.hero.failed.push('Hero figure (boy+guitar) not found (Page Blueprints Line 76-91)');
        }
      } else {
        results.hero.failed.push('Hero section not found');
      }

      // Page Blueprints Line 112-119: Value Props Section
      const valuePropsSection = document.querySelector('.value-props-section');
      if (valuePropsSection) {
        const valueCards = valuePropsSection.querySelectorAll('.value-prop-card, .card');
        if (valueCards.length === 3) {
          results.valueProps.passed.push('Value props section has 3 cards as specified');
        } else {
          results.valueProps.failed.push(`Value props section has ${valueCards.length} cards, expected 3 (Page Blueprints Line 112-119)`);
        }

        // Check for three-column grid
        const grid = valuePropsSection.querySelector('.three-column-grid');
        if (grid) {
          results.valueProps.passed.push('Value props uses three-column grid layout');
        } else {
          results.valueProps.failed.push('Value props missing three-column grid layout');
        }
      } else {
        results.valueProps.failed.push('Value props section not found (Page Blueprints Line 112-119)');
      }

      // Page Blueprints Line 120-129: About Teaser Section
      const aboutTeaserSection = document.querySelector('.about-teaser-section');
      if (aboutTeaserSection) {
        const twoColumnGrid = aboutTeaserSection.querySelector('.two-column-grid');
        if (twoColumnGrid) {
          results.aboutTeaser.passed.push('About teaser uses two-column layout');
        } else {
          results.aboutTeaser.failed.push('About teaser missing two-column layout (Page Blueprints Line 121)');
        }

        // Check for "Meet your teacher" link (Page Blueprints Line 126)
        const teacherLink = aboutTeaserSection.querySelector('a[href*="about"]');
        if (teacherLink && teacherLink.textContent.includes('Meet your teacher')) {
          results.aboutTeaser.passed.push('About teaser includes "Meet your teacher" link');
        } else {
          results.aboutTeaser.failed.push('About teaser missing "Meet your teacher" link (Page Blueprints Line 126)');
        }
      } else {
        results.aboutTeaser.failed.push('About teaser section not found (Page Blueprints Line 120-129)');
      }

      // Page Blueprints Line 130-147: Availability Section
      const availabilitySection = document.querySelector('.availability-section');
      if (availabilitySection) {
        const slotChips = availabilitySection.querySelectorAll('.slot-chip');
        if (slotChips.length <= 6) {
          results.availability.passed.push(`Availability section has ${slotChips.length} slot chips (≤6 as specified)`);
        } else {
          results.availability.failed.push(`Availability section has ${slotChips.length} slot chips, max 6 specified (Page Blueprints Line 132)`);
        }

        // Check slot chip dimensions (Page Blueprints Line 135)
        if (slotChips.length > 0) {
          const firstChip = slotChips[0];
          const chipRect = firstChip.getBoundingClientRect();
          // Check chip dimensions (Page Blueprints Line 135)
          
          // Page Blueprints Line 135: ~200×80px
          if (chipRect.width >= 180 && chipRect.width <= 220 && chipRect.height >= 70 && chipRect.height <= 100) {
            results.availability.passed.push(`Slot chip dimensions within spec: ${Math.round(chipRect.width)}×${Math.round(chipRect.height)}px`);
          } else {
            results.availability.failed.push(`Slot chip dimensions outside spec (180-220×70-100px): ${Math.round(chipRect.width)}×${Math.round(chipRect.height)}px (Page Blueprints Line 135)`);
          }
        }
      } else {
        results.availability.failed.push('Availability section not found (Page Blueprints Line 130-147)');
      }

      // Page Blueprints Line 149-152: Micro-FAQ Section
      const microFaqSection = document.querySelector('.micro-faq-section');
      if (microFaqSection) {
        const accordion = microFaqSection.querySelector('.accordion');
        if (accordion) {
          const accordionItems = accordion.querySelectorAll('.accordion-item');
          if (accordionItems.length >= 2 && accordionItems.length <= 3) {
            results.microFaq.passed.push(`Micro-FAQ has ${accordionItems.length} items (2-3 as specified)`);
          } else {
            results.microFaq.failed.push(`Micro-FAQ has ${accordionItems.length} items, expected 2-3 (Page Blueprints Line 150)`);
          }
        } else {
          results.microFaq.failed.push('Micro-FAQ missing accordion structure (Page Blueprints Line 150)');
        }
      } else {
        results.microFaq.failed.push('Micro-FAQ section not found (Page Blueprints Line 149-152)');
      }

      return results;
    });

    this.validationResults.pages.home = homeValidation;
    return homeValidation;
  }

  async validateResponsiveLayout() {
    console.log('📱 Validating Responsive Layout against Page Blueprints...');
    
    const viewports = [
      { name: 'desktop', width: 1300, height: 800, expectedGrid: '12-column' },
      { name: 'tablet', width: 768, height: 1024, expectedGrid: '8-column' },
      { name: 'mobile', width: 375, height: 667, expectedGrid: '4-column' }
    ];

    const responsiveResults = { passed: [], failed: [] };

    for (const viewport of viewports) {
      await this.page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1
      });

      await this.page.goto(`${this.baseUrl}/`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      const viewportValidation = await this.page.evaluate((vp) => {
        const results = { passed: [], failed: [] };
        
        // Page Blueprints Line 355-358: Responsive guidelines
        const pageContainer = document.querySelector('.page-container');
        if (pageContainer) {
          const containerStyles = window.getComputedStyle(pageContainer);
          const padding = parseInt(containerStyles.paddingLeft);
          
          // Check padding per viewport (Page Blueprints Line 356-358)
          let expectedPadding;
          if (vp.width >= 1200) {
            expectedPadding = { min: 70, max: 90 }; // ~80px desktop
          } else if (vp.width >= 768) {
            expectedPadding = { min: 40, max: 56 }; // ~48px tablet
          } else {
            expectedPadding = { min: 20, max: 32 }; // ~24px mobile
          }
          
          if (padding >= expectedPadding.min && padding <= expectedPadding.max) {
            results.passed.push(`${vp.name} padding within spec: ${padding}px`);
          } else {
            results.failed.push(`${vp.name} padding outside spec (${expectedPadding.min}-${expectedPadding.max}px): ${padding}px`);
          }
        }

        // Check grid behavior
        const threeColumnGrid = document.querySelector('.three-column-grid');
        if (threeColumnGrid) {
          const gridStyles = window.getComputedStyle(threeColumnGrid);
          const gridColumns = gridStyles.gridTemplateColumns;
          
          if (vp.width >= 1200) {
            // Desktop should have 3 columns
            if (gridColumns.includes('1fr 1fr 1fr') || gridColumns.split(' ').length === 3) {
              results.passed.push(`${vp.name} three-column grid maintains 3 columns`);
            } else {
              results.failed.push(`${vp.name} three-column grid not maintaining 3 columns`);
            }
          } else if (vp.width >= 768) {
            // Tablet should have 2 columns (Page Blueprints responsive behavior)
            if (gridColumns.includes('1fr 1fr') || gridColumns.split(' ').length === 2) {
              results.passed.push(`${vp.name} three-column grid adapts to 2 columns`);
            } else {
              results.failed.push(`${vp.name} three-column grid not adapting to 2 columns`);
            }
          } else {
            // Mobile should have 1 column (Page Blueprints Line 358)
            if (gridColumns.includes('1fr') && !gridColumns.includes('1fr 1fr')) {
              results.passed.push(`${vp.name} three-column grid adapts to 1 column`);
            } else {
              results.failed.push(`${vp.name} three-column grid not adapting to 1 column`);
            }
          }
        }

        return results;
      }, viewport);

      responsiveResults.passed.push(...viewportValidation.passed);
      responsiveResults.failed.push(...viewportValidation.failed);
    }

    this.validationResults.responsive = responsiveResults;
    return responsiveResults;
  }

  async validateTypography() {
    console.log('🔤 Validating Typography against Page Blueprints...');
    
    await this.page.setViewport({ width: 1300, height: 800, deviceScaleFactor: 1 });
    await this.page.goto(`${this.baseUrl}/`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const typographyValidation = await this.page.evaluate(() => {
      const results = { passed: [], failed: [] };

      // Page Blueprints Line 20: Typography system
      const headline = document.querySelector('.hero-headline, h1');
      if (headline) {
        const headlineStyles = window.getComputedStyle(headline);
        
        // Check font family (should be system fonts per Page Blueprints Line 20)
        const fontFamily = headlineStyles.fontFamily.toLowerCase();
        if (fontFamily.includes('system') || fontFamily.includes('apple') || fontFamily.includes('segoe')) {
          results.passed.push('Headline uses system font stack');
        } else {
          results.failed.push(`Headline not using system fonts: ${fontFamily} (Page Blueprints Line 20)`);
        }

        // Check font weight (Page Blueprints Line 63: Medium/Semibold)
        const fontWeight = headlineStyles.fontWeight;
        if (fontWeight === '500' || fontWeight === '600' || fontWeight === 'medium' || fontWeight === 'semibold') {
          results.passed.push(`Headline font weight appropriate: ${fontWeight}`);
        } else {
          results.failed.push(`Headline font weight not medium/semibold: ${fontWeight} (Page Blueprints Line 63)`);
        }
      }

      // Check color palette (Page Blueprints Line 21)
      const primaryCTA = document.querySelector('.primary-cta');
      if (primaryCTA) {
        const ctaStyles = window.getComputedStyle(primaryCTA);
        const backgroundColor = ctaStyles.backgroundColor;
        
        // Should use primary green #99E39E
        if (backgroundColor.includes('153, 227, 158') || backgroundColor.includes('#99E39E')) {
          results.passed.push('Primary CTA uses correct green color');
        } else {
          results.failed.push(`Primary CTA background color incorrect: ${backgroundColor} (should be #99E39E)`);
        }
      }

      return results;
    });

    this.validationResults.typography = typographyValidation;
    return typographyValidation;
  }

  async generateComplianceReport() {
    console.log('📊 Generating Compliance Report...');
    
    // Calculate overall compliance
    let totalChecks = 0;
    let passedChecks = 0;

    const countResults = (results) => {
      if (results.passed) {
        totalChecks += results.passed.length;
        passedChecks += results.passed.length;
      }
      if (results.failed) {
        totalChecks += results.failed.length;
      }
    };

    // Count all validation results
    Object.values(this.validationResults.globalElements).forEach(countResults);
    Object.values(this.validationResults.pages).forEach(section => {
      Object.values(section).forEach(countResults);
    });
    if (this.validationResults.responsive) countResults(this.validationResults.responsive);
    if (this.validationResults.typography) countResults(this.validationResults.typography);

    this.validationResults.overallCompliance = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

    // Collect all passed and failed items
    const collectItems = (results, category) => {
      if (results.passed) {
        results.passed.forEach(item => {
          this.validationResults.passed.push(`[${category}] ${item}`);
        });
      }
      if (results.failed) {
        results.failed.forEach(item => {
          this.validationResults.failed.push(`[${category}] ${item}`);
        });
      }
    };

    // Collect from all sections
    Object.entries(this.validationResults.globalElements).forEach(([key, results]) => {
      collectItems(results, `Global-${key}`);
    });

    if (this.validationResults.pages.home) {
      Object.entries(this.validationResults.pages.home).forEach(([key, results]) => {
        if (key !== 'measurements') collectItems(results, `Home-${key}`);
      });
    }

    if (this.validationResults.responsive) collectItems(this.validationResults.responsive, 'Responsive');
    if (this.validationResults.typography) collectItems(this.validationResults.typography, 'Typography');

    // Save validation report
    const reportPath = path.join(this.outputDir, 'validation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.validationResults, null, 2));

    return this.validationResults;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullValidation() {
    try {
      await this.initialize();
      
      console.log('🚀 Starting Page Blueprints Validation...\n');
      
      await this.validateGlobalElements();
      await this.validateHomePage();
      await this.validateResponsiveLayout();
      await this.validateTypography();
      
      const report = await this.generateComplianceReport();
      
      console.log('\n📋 VALIDATION SUMMARY');
      console.log('='.repeat(50));
      console.log(`Overall Compliance: ${report.overallCompliance.toFixed(1)}%`);
      console.log(`Passed Checks: ${report.passed.length}`);
      console.log(`Failed Checks: ${report.failed.length}`);
      
      if (report.overallCompliance >= 90) {
        console.log('✅ VALIDATION PASSED - Ready for Phase 05');
      } else {
        console.log('❌ VALIDATION FAILED - Must achieve ≥90% compliance');
      }
      
      console.log('\n🔍 FAILED CHECKS:');
      report.failed.forEach(item => console.log(`  ❌ ${item}`));
      
      console.log('\n✅ PASSED CHECKS:');
      report.passed.slice(0, 10).forEach(item => console.log(`  ✅ ${item}`));
      if (report.passed.length > 10) {
        console.log(`  ... and ${report.passed.length - 10} more`);
      }
      
      return report;
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Export for use in other modules
export default PageBlueprintsValidator;

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new PageBlueprintsValidator();
  validator.runFullValidation()
    .then(report => {
      process.exit(report.overallCompliance >= 90 ? 0 : 1);
    })
    .catch(error => {
      console.error('Validation error:', error);
      process.exit(1);
    });
}