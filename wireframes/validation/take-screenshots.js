/* eslint-env node */
/* eslint-disable no-console */
/* global require, module, process, __dirname */
/**
 * Cedar Heights Music Academy - Wireframe Screenshot Generator
 * Uses Puppeteer to capture screenshots of all wireframe pages and states
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class WireframeScreenshotGenerator {
    constructor() {
        // Serve from project root and explicitly point to wireframes index
        this.baseUrl = 'http://localhost:3005/wireframes/index.html';
        this.outputDir = path.join(__dirname, '../screenshots');
        this.browser = null;
        this.page = null;
    }

    async init() {
        // Ensure output directory exists
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch {
            console.log('Output directory already exists or created');
        }

        // Launch browser
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        this.page = await this.browser.newPage();
        
        // Set viewport for consistent screenshots
        await this.page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1
        });

        console.log('🚀 Puppeteer initialized');
    }

    async takeScreenshots() {
        console.log('📸 Starting wireframe screenshot capture...');

        try {
            // Navigate to wireframes
            await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
            
            // Wait for JavaScript to load
            await this.page.waitForSelector('.wireframe-nav', { timeout: 5000 });
            
            // Take screenshots of all pages
            await this.captureAllPages();
            
            // Take screenshots of enrollment flow
            await this.captureEnrollmentFlow();
            
            // Take responsive screenshots
            await this.captureResponsiveViews();
            
            console.log('✅ All screenshots captured successfully');
            
        } catch (error) {
            console.error('❌ Error during screenshot capture:', error);
            throw error;
        }
    }

    async captureAllPages() {
        const pages = [
            { id: 'home', name: 'Homepage' },
            { id: 'about', name: 'About Page' },
            { id: 'pricing', name: 'Pricing Page' },
            { id: 'enroll', name: 'Enrollment Page' },
            { id: 'contact', name: 'Contact Page' }
        ];

        for (const pageInfo of pages) {
            console.log(`📷 Capturing ${pageInfo.name}...`);
            
            // Navigate to page
            await this.page.click(`a[href="#${pageInfo.id}"]`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for page transition
            
            // Take full page screenshot
            await this.page.screenshot({
                path: path.join(this.outputDir, `${pageInfo.id}-desktop.png`),
                fullPage: true
            });
            
            // Take viewport screenshot
            await this.page.screenshot({
                path: path.join(this.outputDir, `${pageInfo.id}-viewport.png`),
                fullPage: false
            });
        }
    }

    async captureEnrollmentFlow() {
        console.log('📷 Capturing enrollment flow...');
        
        // Navigate to enrollment page
        await this.page.click('a[href="#enroll"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 1: Instrument Selection
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step1-initial.png'),
            fullPage: false
        });
        
        // Select an instrument (click label for reliable interaction)
        await this.page.click('label[for="piano"]');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step1-selected.png'),
            fullPage: false
        });
        
        // Go to step 2 (ensure visible and enabled)
        await this.page.waitForSelector('#step-1 .next-btn:not([disabled])', { visible: true, timeout: 5000 });
        await this.page.$eval('#step-1 .next-btn:not([disabled])', (el) => { el.scrollIntoView({behavior: 'instant', block: 'center'}); el.click(); });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for loading simulation
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step2-loading.png'),
            fullPage: false
        });
        
        // Wait for timeslots to load
        await this.page.waitForSelector('.timeslot-grid', { visible: true, timeout: 3000 });
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step2-loaded.png'),
            fullPage: false
        });
        
        // Select a timeslot (click label for reliability)
        await this.page.click('label[for="slot1"]');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step2-selected.png'),
            fullPage: false
        });
        
        // Go to step 3 (ensure visible and enabled)
        await this.page.waitForSelector('#step-2 .next-btn:not([disabled])', { visible: true, timeout: 5000 });
        await this.page.$eval('#step-2 .next-btn:not([disabled])', (el) => { el.scrollIntoView({behavior: 'instant', block: 'center'}); el.click(); });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step3-initial.png'),
            fullPage: false
        });
        
        // Select billing frequency (click label for reliability)
        await this.page.click('label[for="semester-enroll"]');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'enrollment-step3-complete.png'),
            fullPage: false
        });
    }

    async captureResponsiveViews() {
        console.log('📷 Capturing responsive views...');
        
        const viewports = [
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'mobile', width: 375, height: 667 }
        ];
        
        for (const viewport of viewports) {
            await this.page.setViewport({
                width: viewport.width,
                height: viewport.height,
                deviceScaleFactor: 1
            });
            
            // Capture home page in different viewports
            await this.page.click('a[href="#home"]');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await this.page.screenshot({
                path: path.join(this.outputDir, `home-${viewport.name}.png`),
                fullPage: true
            });
            
            // Capture enrollment page in mobile
            if (viewport.name === 'mobile') {
                await this.page.click('a[href="#enroll"]');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                await this.page.screenshot({
                    path: path.join(this.outputDir, `enrollment-${viewport.name}.png`),
                    fullPage: true
                });
            }
        }
        
        // Reset to desktop viewport
        await this.page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1
        });
    }

    async captureInteractionStates() {
        console.log('📷 Capturing interaction states...');
        
        // Navigate to pricing page
        await this.page.click('a[href="#pricing"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Capture different billing selections
        const billingOptions = ['monthly', 'semester', 'yearly'];
        
        for (const option of billingOptions) {
            await this.page.click(`input[value="${option}"]`);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await this.page.screenshot({
                path: path.join(this.outputDir, `pricing-${option}-selected.png`),
                fullPage: false
            });
        }
        
        // Capture contact form
        await this.page.click('a[href="#contact"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'contact-form.png'),
            fullPage: true
        });
        
        // Fill out form partially
        await this.page.type('#contact-name', 'John Doe');
        await this.page.type('#contact-email', 'john@example.com');
        await this.page.select('#contact-subject', 'enrollment');
        
        await this.page.screenshot({
            path: path.join(this.outputDir, 'contact-form-filled.png'),
            fullPage: true
        });
    }

    async generateReport() {
        console.log('📊 Generating screenshot report...');
        
        const screenshots = await fs.readdir(this.outputDir);
        const pngFiles = screenshots.filter(file => file.endsWith('.png'));
        
        const report = {
            timestamp: new Date().toISOString(),
            totalScreenshots: pngFiles.length,
            screenshots: pngFiles.map(file => ({
                filename: file,
                path: path.join(this.outputDir, file),
                size: 'TBD' // Could add file size if needed
            })),
            categories: {
                desktop: pngFiles.filter(f => f.includes('desktop')).length,
                mobile: pngFiles.filter(f => f.includes('mobile')).length,
                tablet: pngFiles.filter(f => f.includes('tablet')).length,
                enrollment: pngFiles.filter(f => f.includes('enrollment')).length,
                interactions: pngFiles.filter(f => f.includes('selected') || f.includes('filled')).length
            }
        };
        
        await fs.writeFile(
            path.join(this.outputDir, 'screenshot-report.json'),
            JSON.stringify(report, null, 2)
        );
        
        console.log(`✅ Generated ${report.totalScreenshots} screenshots`);
        console.log('📁 Screenshots saved to:', this.outputDir);
        
        return report;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🧹 Browser closed');
        }
    }
}

// Main execution
async function main() {
    const generator = new WireframeScreenshotGenerator();
    
    try {
        await generator.init();
        await generator.takeScreenshots();
        await generator.captureInteractionStates();
        await generator.generateReport();
        
    } catch (error) {
        console.error('❌ Screenshot generation failed:', error);
        process.exit(1);
        
    } finally {
        await generator.cleanup();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = WireframeScreenshotGenerator;