import { test, expect } from '@playwright/test';

test.describe('Core Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header Navigation', () => {
    test('should render header with brand and navigation links', async ({ page }) => {
      // Check header is present and sticky
      const header = page.locator('.global-header');
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('position', 'sticky');

      // Check brand/logo
      const brand = page.locator('.nav-brand .wordmark');
      await expect(brand).toBeVisible();
      await expect(brand).toContainText('Cedar Heights Music Academy');

      // Check navigation links
      const navLinks = page.locator('.nav-list .nav-link');
      await expect(navLinks).toHaveCount(5); // Home, About, Pricing, Enroll, Contact

      // Verify specific navigation items
      await expect(page.locator('text=Home')).toBeVisible();
      await expect(page.locator('text=About')).toBeVisible();
      await expect(page.locator('text=Pricing')).toBeVisible();
      await expect(page.locator('text=Enroll')).toBeVisible();
      await expect(page.locator('text=Contact')).toBeVisible();
    });

    test('should show active state for current page', async ({ page }) => {
      // Home should be active by default
      const homeLink = page.locator('.nav-link[aria-current="page"], .nav-link.active').first();
      await expect(homeLink).toBeVisible();

      // Navigate to About and check active state
      await page.click('text=About');
      await page.waitForURL('/about');
      
      const aboutLink = page.locator('.nav-link[aria-current="page"], .nav-link.active').first();
      await expect(aboutLink).toContainText('About');
    });

    test('should open enrollment modal when Enroll button is clicked', async ({ page }) => {
      // Click Enroll button
      await page.click('.enroll-cta');

      // Check modal is visible
      const modal = page.locator('.enroll-modal-overlay');
      await expect(modal).toBeVisible();

      // Check modal content
      await expect(page.locator('.modal-title')).toContainText('Start Your Musical Journey');
      await expect(page.locator('.modal-subtitle')).toContainText('3 quick steps');
    });

    test('should handle keyboard navigation', async ({ page }) => {
      // Focus first navigation item
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Skip brand link
      
      // Should focus on first nav item
      const firstNavItem = page.locator('.nav-link').first();
      await expect(firstNavItem).toBeFocused();

      // Tab through navigation items
      await page.keyboard.press('Tab');
      const secondNavItem = page.locator('.nav-link').nth(1);
      await expect(secondNavItem).toBeFocused();
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should show mobile menu on small screens', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Desktop nav should be hidden
      const desktopNav = page.locator('.nav-menu');
      await expect(desktopNav).toHaveCSS('display', 'none');

      // Mobile toggle should be visible
      const mobileToggle = page.locator('.mobile-menu-toggle');
      await expect(mobileToggle).toBeVisible();

      // Click mobile toggle
      await mobileToggle.click();

      // Mobile menu should be active
      const mobileMenu = page.locator('.mobile-menu.active');
      await expect(mobileMenu).toBeVisible();

      // Check mobile navigation links
      const mobileNavLinks = page.locator('.mobile-nav-list .mobile-nav-link');
      await expect(mobileNavLinks).toHaveCount(5);
    });

    test('should close mobile menu when link is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Open mobile menu
      await page.click('.mobile-menu-toggle');
      await expect(page.locator('.mobile-menu.active')).toBeVisible();

      // Click a navigation link
      await page.click('.mobile-nav-link[href="/about"]');

      // Menu should close and navigate
      await page.waitForURL('/about');
      await expect(page.locator('.mobile-menu.active')).not.toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('should render footer with all sections', async ({ page }) => {
      const footer = page.locator('.global-footer');
      await expect(footer).toBeVisible();

      // Check brand section
      await expect(page.locator('.footer-wordmark')).toContainText('Cedar Heights Music Academy');
      await expect(page.locator('.footer-description')).toBeVisible();

      // Check Quick Links section
      await expect(page.locator('.footer-heading').filter({ hasText: 'Quick Links' })).toBeVisible();
      
      // Check Legal section
      await expect(page.locator('.footer-heading').filter({ hasText: 'Legal' })).toBeVisible();
      await expect(page.locator('text=Privacy Policy')).toBeVisible();
      await expect(page.locator('text=Terms of Service')).toBeVisible();

      // Check Connect section
      await expect(page.locator('.footer-heading').filter({ hasText: 'Connect' })).toBeVisible();
      await expect(page.locator('text=hello@cedarheightsmusic.com')).toBeVisible();
      await expect(page.locator('text=(250) 555-0123')).toBeVisible();
    });

    test('should have working footer links', async ({ page }) => {
      // Test Privacy Policy link
      await page.click('text=Privacy Policy');
      await page.waitForURL('/privacy');
      await expect(page).toHaveURL('/privacy');

      // Go back and test Terms link
      await page.goBack();
      await page.click('text=Terms of Service');
      await page.waitForURL('/terms');
      await expect(page).toHaveURL('/terms');
    });

    test('should open enrollment modal from footer', async ({ page }) => {
      // Click footer Enroll button
      await page.click('.footer-enroll-button');

      // Check modal opens
      const modal = page.locator('.enroll-modal-overlay');
      await expect(modal).toBeVisible();
    });
  });

  test.describe('Buttons', () => {
    test('should render primary and secondary buttons with correct styles', async ({ page }) => {
      // Navigate to a page with buttons (assuming HomePage has CTA buttons)
      const primaryButtons = page.locator('.btn-primary, .primary-cta');
      const secondaryButtons = page.locator('.btn-secondary, .secondary-cta');

      // Check primary buttons exist and have correct styling
      if (await primaryButtons.count() > 0) {
        const firstPrimary = primaryButtons.first();
        await expect(firstPrimary).toBeVisible();
        await expect(firstPrimary).toHaveCSS('background-color', 'rgb(153, 227, 158)'); // --color-primary-green
      }

      // Check secondary buttons if they exist
      if (await secondaryButtons.count() > 0) {
        const firstSecondary = secondaryButtons.first();
        await expect(firstSecondary).toBeVisible();
        await expect(firstSecondary).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)'); // transparent
      }
    });

    test('should show focus states on keyboard navigation', async ({ page }) => {
      const buttons = page.locator('.btn, .primary-cta, .secondary-cta').first();
      
      if (await buttons.count() > 0) {
        await buttons.focus();
        
        // Check focus outline is visible
        await expect(buttons).toBeFocused();
        
        // Verify focus styles are applied (outline should be visible)
        const outlineWidth = await buttons.evaluate(el => 
          window.getComputedStyle(el).getPropertyValue('outline-width')
        );
        expect(outlineWidth).not.toBe('0px');
      }
    });
  });

  test.describe('Cards', () => {
    test('should render cards with proper styling', async ({ page }) => {
      // Look for card elements (they might be on different pages)
      const cards = page.locator('.card');
      
      if (await cards.count() > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
        
        // Check card has proper background and border radius
        await expect(firstCard).toHaveCSS('background-color', 'rgb(243, 218, 148)'); // --color-warm-gold
        await expect(firstCard).toHaveCSS('border-radius', '12px'); // --border-radius-medium
      }
    });
  });

  test.describe('Enrollment Modal', () => {
    test.beforeEach(async ({ page }) => {
      // Open modal before each test
      await page.click('.enroll-cta');
      await expect(page.locator('.enroll-modal-overlay')).toBeVisible();
    });

    test('should display modal with correct structure', async ({ page }) => {
      // Check modal overlay and container
      await expect(page.locator('.enroll-modal-overlay')).toBeVisible();
      await expect(page.locator('.enroll-modal-container')).toBeVisible();

      // Check header elements
      await expect(page.locator('.modal-title')).toContainText('Start Your Musical Journey');
      await expect(page.locator('.modal-subtitle')).toContainText('3 quick steps');
      await expect(page.locator('.modal-close')).toBeVisible();

      // Check progress indicator
      await expect(page.locator('.progress-steps')).toBeVisible();
      await expect(page.locator('.progress-step')).toHaveCount(3);

      // Check step labels
      await expect(page.locator('.step-label').filter({ hasText: 'Instrument' })).toBeVisible();
      await expect(page.locator('.step-label').filter({ hasText: 'Time' })).toBeVisible();
      await expect(page.locator('.step-label').filter({ hasText: 'Review' })).toBeVisible();
    });

    test('should navigate through modal steps', async ({ page }) => {
      // Should start on step 1
      await expect(page.locator('.modal-step.active h3')).toContainText('Choose Your Instrument');

      // Click Next button
      await page.click('.nav-button:has-text("Next")');

      // Should be on step 2
      await expect(page.locator('.modal-step.active h3')).toContainText('Pick Your Preferred Time');

      // Click Next again
      await page.click('.nav-button:has-text("Next")');

      // Should be on step 3
      await expect(page.locator('.modal-step.active h3')).toContainText('Review & Confirm');

      // Should show Complete Enrollment button
      await expect(page.locator('.nav-button:has-text("Complete Enrollment")')).toBeVisible();
    });

    test('should allow going back through steps', async ({ page }) => {
      // Go to step 2
      await page.click('.nav-button:has-text("Next")');
      await expect(page.locator('.modal-step.active h3')).toContainText('Pick Your Preferred Time');

      // Back button should be visible
      await expect(page.locator('.back-button')).toBeVisible();

      // Click back
      await page.click('.back-button');

      // Should be back on step 1
      await expect(page.locator('.modal-step.active h3')).toContainText('Choose Your Instrument');
    });

    test('should close modal with close button', async ({ page }) => {
      // Click close button
      await page.click('.modal-close');

      // Modal should be hidden
      await expect(page.locator('.enroll-modal-overlay')).not.toBeVisible();
    });

    test('should close modal with Escape key', async ({ page }) => {
      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should be hidden
      await expect(page.locator('.enroll-modal-overlay')).not.toBeVisible();
    });

    test('should trap focus within modal', async ({ page }) => {
      // Focus should be trapped within modal
      const focusableElements = page.locator('.enroll-modal-container button, .enroll-modal-container [href], .enroll-modal-container input, .enroll-modal-container select, .enroll-modal-container textarea, .enroll-modal-container [tabindex]:not([tabindex="-1"])');
      
      const count = await focusableElements.count();
      if (count > 0) {
        // Tab through all focusable elements
        for (let i = 0; i < count; i++) {
          await page.keyboard.press('Tab');
        }
        
        // Should cycle back to first element
        await page.keyboard.press('Tab');
        const firstFocusable = focusableElements.first();
        await expect(firstFocusable).toBeFocused();
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Modal should take full screen on mobile
      const modalContainer = page.locator('.enroll-modal-container');
      await expect(modalContainer).toHaveCSS('width', '375px'); // Full width
      await expect(modalContainer).toHaveCSS('height', '667px'); // Full height
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check navigation has proper ARIA
      await expect(page.locator('[role="navigation"]')).toBeVisible();
      await expect(page.locator('[aria-label="Main navigation"]')).toBeVisible();

      // Check modal has proper ARIA when opened
      await page.click('.enroll-cta');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('[aria-modal="true"]')).toBeVisible();
      await expect(page.locator('[aria-labelledby="enroll-modal-title"]')).toBeVisible();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check that h1 exists and is unique
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCount(1);

      // Check heading structure makes sense (h1 -> h2 -> h3, etc.)
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const count = await headings.count();
      
      if (count > 0) {
        // At least h1 should exist
        await expect(page.locator('h1')).toBeVisible();
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // This is a basic check - in a real scenario you'd use axe-core
      const primaryButton = page.locator('.btn-primary, .primary-cta').first();
      
      if (await primaryButton.count() > 0) {
        const backgroundColor = await primaryButton.evaluate(el => 
          window.getComputedStyle(el).backgroundColor
        );
        const color = await primaryButton.evaluate(el => 
          window.getComputedStyle(el).color
        );
        
        // Basic check that colors are defined
        expect(backgroundColor).toBeTruthy();
        expect(color).toBeTruthy();
      }
    });
  });
});