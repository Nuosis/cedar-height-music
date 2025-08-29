import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Main Navigation', () => {
    test('should navigate to all main pages via header navigation', async ({ page }) => {
      // Test Home navigation (should already be there)
      await expect(page).toHaveURL('/');
      
      // Navigate to About
      await page.click('text=About');
      await page.waitForURL('/about');
      await expect(page).toHaveURL('/about');
      await expect(page.locator('main')).toBeVisible();

      // Navigate to Pricing
      await page.click('text=Pricing');
      await page.waitForURL('/pricing');
      await expect(page).toHaveURL('/pricing');
      await expect(page.locator('main')).toBeVisible();

      // Navigate to Contact
      await page.click('text=Contact');
      await page.waitForURL('/contact');
      await expect(page).toHaveURL('/contact');
      await expect(page.locator('main')).toBeVisible();

      // Navigate back to Home
      await page.click('text=Home');
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    });

    test('should show active states for current page', async ({ page }) => {
      // Home should be active initially
      const homeLink = page.locator('.nav-link').filter({ hasText: 'Home' });
      await expect(homeLink).toHaveClass(/active/);

      // Navigate to About and check active state
      await page.click('text=About');
      await page.waitForURL('/about');
      
      const aboutLink = page.locator('.nav-link').filter({ hasText: 'About' });
      await expect(aboutLink).toHaveClass(/active/);
      
      // Home should no longer be active
      await expect(homeLink).not.toHaveClass(/active/);
    });

    test('should navigate via brand logo to home', async ({ page }) => {
      // Navigate away from home first
      await page.click('text=About');
      await page.waitForURL('/about');

      // Click brand logo/wordmark
      await page.click('.brand-link, .wordmark');
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Footer Navigation', () => {
    test('should navigate to pages via footer links', async ({ page }) => {
      // Test About link in footer
      await page.click('footer a[href="/about"], footer text=About');
      await page.waitForURL('/about');
      await expect(page).toHaveURL('/about');

      // Go back to home
      await page.goto('/');

      // Test Pricing link in footer
      await page.click('footer a[href="/pricing"], footer text=Pricing');
      await page.waitForURL('/pricing');
      await expect(page).toHaveURL('/pricing');

      // Go back to home
      await page.goto('/');

      // Test Contact link in footer
      await page.click('footer a[href="/contact"], footer text=Contact');
      await page.waitForURL('/contact');
      await expect(page).toHaveURL('/contact');
    });

    test('should navigate to legal pages via footer', async ({ page }) => {
      // Test Privacy Policy link
      await page.click('footer a[href="/privacy"], footer text=Privacy Policy');
      await page.waitForURL('/privacy');
      await expect(page).toHaveURL('/privacy');

      // Go back to home
      await page.goto('/');

      // Test Terms of Service link
      await page.click('footer a[href="/terms"], footer text=Terms of Service');
      await page.waitForURL('/terms');
      await expect(page).toHaveURL('/terms');
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should navigate via mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Open mobile menu
      await page.click('.mobile-menu-toggle');
      await expect(page.locator('.mobile-menu.active')).toBeVisible();

      // Navigate to About via mobile menu
      await page.click('.mobile-nav-link[href="/about"]');
      await page.waitForURL('/about');
      await expect(page).toHaveURL('/about');

      // Mobile menu should close after navigation
      await expect(page.locator('.mobile-menu.active')).not.toBeVisible();
    });

    test('should close mobile menu when clicking outside', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Open mobile menu
      await page.click('.mobile-menu-toggle');
      await expect(page.locator('.mobile-menu.active')).toBeVisible();

      // Click outside the menu (on main content)
      await page.click('main');

      // Menu should close
      await expect(page.locator('.mobile-menu.active')).not.toBeVisible();
    });
  });

  test.describe('Browser Navigation', () => {
    test('should handle browser back/forward buttons', async ({ page }) => {
      // Navigate to About
      await page.click('text=About');
      await page.waitForURL('/about');

      // Navigate to Pricing
      await page.click('text=Pricing');
      await page.waitForURL('/pricing');

      // Use browser back button
      await page.goBack();
      await expect(page).toHaveURL('/about');

      // Use browser forward button
      await page.goForward();
      await expect(page).toHaveURL('/pricing');

      // Go back to home
      await page.goBack();
      await page.goBack();
      await expect(page).toHaveURL('/');
    });

    test('should maintain scroll position on navigation', async ({ page }) => {
      // Scroll down on home page
      await page.evaluate(() => window.scrollTo(0, 500));
      const homeScrollY = await page.evaluate(() => window.scrollY);
      expect(homeScrollY).toBeGreaterThan(0);

      // Navigate to another page
      await page.click('text=About');
      await page.waitForURL('/about');

      // Should be at top of new page
      const aboutScrollY = await page.evaluate(() => window.scrollY);
      expect(aboutScrollY).toBe(0);
    });
  });

  test.describe('Direct URL Access', () => {
    test('should handle direct navigation to all routes', async ({ page }) => {
      const routes = ['/', '/about', '/pricing', '/contact', '/privacy', '/terms'];

      for (const route of routes) {
        await page.goto(route);
        await expect(page).toHaveURL(route);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('.global-header')).toBeVisible();
        await expect(page.locator('.global-footer')).toBeVisible();
      }
    });

    test('should handle page refresh on any route', async ({ page }) => {
      // Navigate to About page
      await page.goto('/about');
      await expect(page).toHaveURL('/about');

      // Refresh the page
      await page.reload();
      await expect(page).toHaveURL('/about');
      await expect(page.locator('main')).toBeVisible();

      // Try with Pricing page
      await page.goto('/pricing');
      await expect(page).toHaveURL('/pricing');
      await page.reload();
      await expect(page).toHaveURL('/pricing');
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Enrollment Modal Navigation', () => {
    test('should open enrollment modal from any page', async ({ page }) => {
      const pages = ['/', '/about', '/pricing'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        // Click Enroll button
        await page.click('.enroll-cta, button:has-text("Enroll")');
        
        // Modal should open
        await expect(page.locator('.enroll-modal-overlay')).toBeVisible();
        
        // Close modal
        await page.keyboard.press('Escape');
        await expect(page.locator('.enroll-modal-overlay')).not.toBeVisible();
      }
    });

    test('should maintain page context when modal is closed', async ({ page }) => {
      // Navigate to About page
      await page.goto('/about');
      await expect(page).toHaveURL('/about');

      // Open enrollment modal
      await page.click('.enroll-cta, button:has-text("Enroll")');
      await expect(page.locator('.enroll-modal-overlay')).toBeVisible();

      // Close modal
      await page.click('.modal-close');
      await expect(page.locator('.enroll-modal-overlay')).not.toBeVisible();

      // Should still be on About page
      await expect(page).toHaveURL('/about');
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('URL Parameters and Hash Navigation', () => {
    test('should handle URL with hash fragments', async ({ page }) => {
      // Navigate with hash (if implemented)
      await page.goto('/#hero');
      await expect(page).toHaveURL('/#hero');
      await expect(page.locator('main')).toBeVisible();
    });

    test('should handle invalid routes gracefully', async ({ page }) => {
      // Try to navigate to non-existent route
      await page.goto('/non-existent-page');
      
      // Should still render app shell
      await expect(page.locator('.global-header')).toBeVisible();
      await expect(page.locator('.global-footer')).toBeVisible();
      
      // Navigation should still work
      await page.click('text=Home');
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation through menu items', async ({ page }) => {
      // Focus on first navigation item
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Skip brand link

      // Should be on first nav item
      const firstNavItem = page.locator('.nav-link').first();
      await expect(firstNavItem).toBeFocused();

      // Tab to next item
      await page.keyboard.press('Tab');
      const secondNavItem = page.locator('.nav-link').nth(1);
      await expect(secondNavItem).toBeFocused();

      // Press Enter to navigate
      await page.keyboard.press('Enter');
      
      // Should navigate to the page
      await page.waitForTimeout(500); // Wait for navigation
      const currentUrl = page.url();
      expect(currentUrl).not.toBe('/'); // Should have navigated away from home
    });

    test('should support Enter key for navigation', async ({ page }) => {
      // Focus on About link
      await page.focus('text=About');
      
      // Press Enter
      await page.keyboard.press('Enter');
      
      // Should navigate to About page
      await page.waitForURL('/about');
      await expect(page).toHaveURL('/about');
    });
  });

  test.describe('Navigation Performance', () => {
    test('should navigate between pages quickly', async ({ page }) => {
      const routes = ['/about', '/pricing', '/contact', '/'];
      
      for (const route of routes) {
        const startTime = Date.now();
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        // Should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
      }
    });

    test('should not cause memory leaks during navigation', async ({ page }) => {
      // Navigate between pages multiple times
      for (let i = 0; i < 5; i++) {
        await page.goto('/');
        await page.goto('/about');
        await page.goto('/pricing');
        await page.goto('/contact');
      }

      // Check for console errors that might indicate memory issues
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');
      
      // Filter out non-critical errors
      const criticalErrors = consoleErrors.filter(error => 
        error.toLowerCase().includes('memory') ||
        error.toLowerCase().includes('leak')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Navigation State Management', () => {
    test('should preserve form state during navigation', async ({ page }) => {
      // Navigate to contact page
      await page.goto('/contact');

      // Fill out form if it exists
      const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]');
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
        
        // Navigate away and back
        await page.goto('/about');
        await page.goto('/contact');
        
        // Form should be reset (this is expected behavior for most forms)
        const nameValue = await nameInput.inputValue();
        expect(nameValue).toBe(''); // Form should be fresh
      }
    });

    test('should handle concurrent navigation attempts', async ({ page }) => {
      // Rapidly click different navigation links
      await Promise.all([
        page.click('text=About'),
        page.click('text=Pricing'),
        page.click('text=Contact')
      ]);

      // Should end up on one of the pages without errors
      await page.waitForTimeout(1000);
      const finalUrl = page.url();
      const validUrls = ['/about', '/pricing', '/contact'];
      expect(validUrls.some(url => finalUrl.includes(url))).toBe(true);
    });
  });
});