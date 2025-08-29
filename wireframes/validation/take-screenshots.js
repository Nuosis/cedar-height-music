/**
 * Cedar Heights Music Academy - Screenshot Generation Tool
 * Phase 04: High-Fidelity Wireframe Extensions
 * 
 * Uses Playwright for reliable screenshot generation on macOS
 */

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ScreenshotGenerator {
  constructor() {
    this.baseDir = path.resolve(__dirname, '..');
    this.screenshotsDir = path.join(this.baseDir, 'screenshots');
    this.overlaysDir = path.join(this.baseDir, 'screenshots', 'overlays');
    this.proofsDir = path.join(this.baseDir, 'screenshots', 'proofs');
  }

  async ensureDirectories() {
    await fs.mkdir(this.screenshotsDir, { recursive: true });
    await fs.mkdir(this.overlaysDir, { recursive: true });
    await fs.mkdir(this.proofsDir, { recursive: true });
  }

  async generateScreenshots() {
    console.log('🔄 Starting screenshot generation with Playwright...');
    
    let browser;
    try {
      await this.ensureDirectories();

      // Launch Chromium browser
      browser = await chromium.launch({
        headless: true
      });

      const context = await browser.newContext({
        viewport: { width: 1300, height: 800 }
      });

      const page = await context.newPage();

      const pages = [
        { name: 'home', file: 'index.html', title: 'Home Page' },
        { name: 'about', file: 'about.html', title: 'About Page' },
        { name: 'pricing', file: 'pricing.html', title: 'Pricing Page' },
        { name: 'contact', file: 'contact.html', title: 'Contact Page' }
      ];

      const screenshots = {};

      for (const pageInfo of pages) {
        console.log(`📸 Capturing ${pageInfo.title}...`);
        
        const filePath = path.join(this.baseDir, pageInfo.file);
        const fileUrl = `file://${filePath}`;
        
        try {
          await page.goto(fileUrl, { waitUntil: 'networkidle' });
          
          // Wait for any animations or dynamic content
          await page.waitForTimeout(1000);
          
          // Full page screenshot
          const fullScreenshot = await page.screenshot({
            fullPage: true,
            type: 'png'
          });
          
          const fullPath = path.join(this.screenshotsDir, `${pageInfo.name}-full.png`);
          await fs.writeFile(fullPath, fullScreenshot);
          
          // Hero section screenshot (if exists)
          const heroElement = await page.$('.hero');
          if (heroElement) {
            const heroScreenshot = await heroElement.screenshot({
              type: 'png'
            });
            const heroPath = path.join(this.screenshotsDir, `${pageInfo.name}-hero.png`);
            await fs.writeFile(heroPath, heroScreenshot);
          }
          
          // Primary CTA screenshot (if exists)
          const ctaElement = await page.$('.primary-cta');
          if (ctaElement) {
            const ctaScreenshot = await ctaElement.screenshot({
              type: 'png'
            });
            const ctaPath = path.join(this.screenshotsDir, `${pageInfo.name}-cta.png`);
            await fs.writeFile(ctaPath, ctaScreenshot);
          }
          
          // Navigation screenshot
          const navElement = await page.$('.navigation');
          if (navElement) {
            const navScreenshot = await navElement.screenshot({
              type: 'png'
            });
            const navPath = path.join(this.screenshotsDir, `${pageInfo.name}-nav.png`);
            await fs.writeFile(navPath, navScreenshot);
          }
          
          screenshots[pageInfo.name] = {
            full: `${pageInfo.name}-full.png`,
            hero: heroElement ? `${pageInfo.name}-hero.png` : null,
            cta: ctaElement ? `${pageInfo.name}-cta.png` : null,
            nav: navElement ? `${pageInfo.name}-nav.png` : null
          };
          
          console.log(`✅ ${pageInfo.title} screenshots captured`);
          
        } catch (error) {
          console.error(`❌ Failed to capture ${pageInfo.title}:`, error.message);
          screenshots[pageInfo.name] = { error: error.message };
        }
      }

      // Mobile screenshots
      console.log('📱 Capturing mobile screenshots...');
      await page.setViewportSize({ width: 375, height: 667 });
      
      for (const pageInfo of pages) {
        console.log(`📸 Capturing mobile ${pageInfo.title}...`);
        
        const filePath = path.join(this.baseDir, pageInfo.file);
        const fileUrl = `file://${filePath}`;
        
        try {
          await page.goto(fileUrl, { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);
          
          const mobileScreenshot = await page.screenshot({
            fullPage: true,
            type: 'png'
          });
          
          const mobilePath = path.join(this.screenshotsDir, `${pageInfo.name}-mobile.png`);
          await fs.writeFile(mobilePath, mobileScreenshot);
          
          if (screenshots[pageInfo.name] && !screenshots[pageInfo.name].error) {
            screenshots[pageInfo.name].mobile = `${pageInfo.name}-mobile.png`;
          }
          
          console.log(`✅ Mobile ${pageInfo.title} screenshot captured`);
          
        } catch (error) {
          console.error(`❌ Failed to capture mobile ${pageInfo.title}:`, error.message);
        }
      }

      // Save screenshot manifest
      const manifest = {
        timestamp: new Date().toISOString(),
        screenshots,
        viewports: {
          desktop: { width: 1300, height: 800 },
          mobile: { width: 375, height: 667 }
        }
      };

      await fs.writeFile(
        path.join(this.screenshotsDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      console.log('✅ Screenshot generation completed successfully!');
      console.log(`📁 Screenshots saved to: ${this.screenshotsDir}`);
      
      return screenshots;

    } catch (error) {
      console.error('❌ Screenshot generation failed:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async generateValidationReport(screenshots) {
    console.log('📊 Generating validation report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      phase: '04_high_fidelity_wireframe_extensions',
      authority: 'Page Blueprints + Design Elements',
      screenshots,
      validation: {
        visualCompliance: 'pending',
        acceptanceMatrix: 'pending',
        authorityIntegration: 'pending'
      },
      nextSteps: [
        'Manual visual comparison with design authority',
        'Acceptance matrix validation',
        'Overlay generation for proof comparison'
      ]
    };

    const reportPath = path.join(this.baseDir, 'validation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Validation report saved to: ${reportPath}`);
    return report;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new ScreenshotGenerator();
  
  generator.generateScreenshots()
    .then(screenshots => generator.generateValidationReport(screenshots))
    .then(() => {
      console.log('🎉 Screenshot generation and validation report complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Process failed:', error);
      process.exit(1);
    });
}

export default ScreenshotGenerator;