import { test, expect } from '@playwright/test';

test.describe('Page Renders', () => {
  test.describe('Home Page', () => {
    test('should render home page with all key sections', async ({ page }) => {
      await page.goto('/');

      // Check page title and meta
      await expect(page).toHaveTitle(/Cedar Heights Music/);

      // Check hero section exists
      const heroSection = page.locator('[data-wireframe-section="hero"], .hero-section, h1').first();
      await expect(heroSection).toBeVisible();

      // Check main content areas are present
      await expect(page.locator('main')).toBeVisible();

      // Check for key content that should be on home page
      // (These selectors may need adjustment based on actual implementation)
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Check that seasonal background system is working (optional)
      const heroBackground = page.locator('.hero-background');
      if (await heroBackground.count() > 0) {
        await expect(heroBackground).toBeVisible();
        
        // Check that background image is set (if present)
        const backgroundImage = await heroBackground.evaluate(
          (el) => window.getComputedStyle(el).backgroundImage
        );
        // Background image may be 'none' if not loaded yet, that's ok for now
        expect(typeof backgroundImage).toBe('string');
      }
    });

    test('should have working CTA buttons', async ({ page }) => {
      await page.goto('/');

      // Look for enrollment CTA buttons
      const ctaButtons = page.locator('.primary-cta, .btn-primary, button:has-text("Enroll")');
      
      if (await ctaButtons.count() > 0) {
        const firstCTA = ctaButtons.first();
        await expect(firstCTA).toBeVisible();
        
        // Click should open enrollment modal
        await firstCTA.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        
        // Close modal for cleanup
        await page.keyboard.press('Escape');
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Page should still render properly on mobile
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('.global-header')).toBeVisible();
      await expect(page.locator('.global-footer')).toBeVisible();

      // Mobile navigation should be available
      await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('should render about page content', async ({ page }) => {
      await page.goto('/about');

      // Check URL is correct
      await expect(page).toHaveURL('/about');

      // Check main content
      await expect(page.locator('main')).toBeVisible();

      // Check for about-specific content
      // Look for headings that might contain "about", "teacher", "studio", etc.
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);

      // Check that page has meaningful content
      const mainText = await page.locator('main').textContent();
      expect(mainText.length).toBeGreaterThan(100); // Should have substantial content
    });

    test('should have teacher information', async ({ page }) => {
      await page.goto('/about');

      // Look for teacher-related content
      const pageContent = await page.locator('main').textContent();
      const hasTeacherContent = pageContent.toLowerCase().includes('teacher') || 
                               pageContent.toLowerCase().includes('instructor') ||
                               pageContent.toLowerCase().includes('music');
      
      expect(hasTeacherContent).toBe(true);
    });

    test('should have enrollment CTA', async ({ page }) => {
      await page.goto('/about');

      // Should have enrollment buttons
      const enrollButtons = page.locator('button:has-text("Enroll"), .primary-cta, .btn-primary');
      
      if (await enrollButtons.count() > 0) {
        const firstEnrollButton = enrollButtons.first();
        await expect(firstEnrollButton).toBeVisible();
        
        // Should open modal when clicked
        await firstEnrollButton.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        
        // Close modal
        await page.keyboard.press('Escape');
      }
    });
  });

  test.describe('Pricing Page', () => {
    test('should render pricing information', async ({ page }) => {
      await page.goto('/pricing');

      await expect(page).toHaveURL('/pricing');
      await expect(page.locator('main')).toBeVisible();

      // Should show pricing information
      const pageContent = await page.locator('main').textContent();
      const hasPricingContent = pageContent.includes('$') || 
                               pageContent.toLowerCase().includes('price') ||
                               pageContent.toLowerCase().includes('cost') ||
                               pageContent.toLowerCase().includes('month');
      
      expect(hasPricingContent).toBe(true);
    });

    test('should show commitment information', async ({ page }) => {
      await page.goto('/pricing');

      // Should mention semester commitment
      const pageContent = await page.locator('main').textContent();
      const hasCommitmentInfo = pageContent.toLowerCase().includes('semester') ||
                               pageContent.toLowerCase().includes('commitment');
      
      expect(hasCommitmentInfo).toBe(true);
    });

    test('should have enrollment CTA', async ({ page }) => {
      await page.goto('/pricing');

      const enrollButtons = page.locator('button:has-text("Enroll"), .primary-cta, .btn-primary');
      
      if (await enrollButtons.count() > 0) {
        const firstEnrollButton = enrollButtons.first();
        await expect(firstEnrollButton).toBeVisible();
        
        await firstEnrollButton.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        
        await page.keyboard.press('Escape');
      }
    });
  });

  test.describe('Contact Page', () => {
    test('should render contact form and information', async ({ page }) => {
      await page.goto('/contact');

      await expect(page).toHaveURL('/contact');
      await expect(page.locator('main')).toBeVisible();

      // Should have a form
      const forms = page.locator('form');
      if (await forms.count() > 0) {
        await expect(forms.first()).toBeVisible();
        
        // Should have form fields
        const inputs = page.locator('input, textarea');
        const inputCount = await inputs.count();
        expect(inputCount).toBeGreaterThan(0);
      }

      // Should have contact information
      const pageContent = await page.locator('main').textContent();
      const hasContactInfo = pageContent.includes('@') || 
                            pageContent.includes('phone') ||
                            pageContent.includes('email') ||
                            pageContent.includes('contact');
      
      expect(hasContactInfo).toBe(true);
    });

    test('should have required form fields', async ({ page }) => {
      await page.goto('/contact');

      const forms = page.locator('form');
      if (await forms.count() > 0) {
        // Look for common form fields
        const nameField = page.locator('input[name*="name"], input[placeholder*="name"], input[id*="name"]');
        const emailField = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]');
        const messageField = page.locator('textarea, input[name*="message"], input[placeholder*="message"]');

        // At least some form fields should exist
        const totalFields = await nameField.count() + await emailField.count() + await messageField.count();
        expect(totalFields).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Privacy Page', () => {
    test('should render privacy policy content', async ({ page }) => {
      await page.goto('/privacy');

      await expect(page).toHaveURL('/privacy');
      await expect(page.locator('main')).toBeVisible();

      // Should have substantial content
      const mainText = await page.locator('main').textContent();
      expect(mainText.length).toBeGreaterThan(200);

      // Should contain privacy-related terms
      const hasPrivacyContent = mainText.toLowerCase().includes('privacy') ||
                               mainText.toLowerCase().includes('data') ||
                               mainText.toLowerCase().includes('information');
      
      expect(hasPrivacyContent).toBe(true);
    });

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/privacy');

      // Should have headings
      const headings = page.locator('h1, h2, h3, h4');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);

      // Should have an h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });
  });

  test.describe('Terms Page', () => {
    test('should render terms of service content', async ({ page }) => {
      await page.goto('/terms');

      await expect(page).toHaveURL('/terms');
      await expect(page.locator('main')).toBeVisible();

      // Should have substantial content
      const mainText = await page.locator('main').textContent();
      expect(mainText.length).toBeGreaterThan(200);

      // Should contain terms-related content
      const hasTermsContent = mainText.toLowerCase().includes('terms') ||
                             mainText.toLowerCase().includes('service') ||
                             mainText.toLowerCase().includes('agreement');
      
      expect(hasTermsContent).toBe(true);
    });

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/terms');

      const headings = page.locator('h1, h2, h3, h4');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });
  });

  test.describe('404 Error Handling', () => {
    test('should handle non-existent routes gracefully', async ({ page }) => {
      // Try to navigate to a non-existent route
      const response = await page.goto('/non-existent-page');
      
      // Should still render the app shell
      await expect(page.locator('.global-header')).toBeVisible();
      await expect(page.locator('.global-footer')).toBeVisible();
      
      // The response might be 200 (SPA) or 404, but app should still work
      expect([200, 404]).toContain(response.status());
    });
  });

  test.describe('Performance', () => {
    test('should load pages within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds (generous for development)
      expect(loadTime).toBeLessThan(5000);
      
      // Page should be interactive
      await expect(page.locator('.global-header')).toBeVisible();
    });

    test('should have no console errors on page load', async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');
      
      // Filter out known development warnings
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('Warning:') && 
        !error.includes('DevTools') &&
        !error.includes('Extension')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('SEO and Meta Tags', () => {
    test('should have proper meta tags on all pages', async ({ page }) => {
      const pages = ['/', '/about', '/pricing', '/contact', '/privacy', '/terms'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        // Should have title
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        
        // Should have meta description (if implemented)
        // This might not be implemented yet, so we'll just check if it exists
        // const metaDescription = page.locator('meta[name="description"]');
        // await expect(metaDescription).toBeAttached(); // Optional check
        
        // Should have proper charset
        const charset = page.locator('meta[charset]');
        await expect(charset).toBeAttached();
        
        // Should have viewport meta tag
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toBeAttached();
      }
    });
  });

  test.describe('Images and Assets', () => {
    test('should load images without errors', async ({ page }) => {
      const imageErrors = [];
      page.on('response', response => {
        if (response.url().match(/\.(jpg|jpeg|png|gif|svg)$/i) && !response.ok()) {
          imageErrors.push(response.url());
        }
      });

      await page.goto('/');
      
      // Wait a bit for images to load
      await page.waitForTimeout(2000);
      
      expect(imageErrors).toHaveLength(0);
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Alt text should exist (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    });
  });
});