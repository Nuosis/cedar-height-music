import { test, expect } from '@playwright/test';

test.describe('Responsive Behavior', () => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
    largeDesktop: { width: 1440, height: 900 }
  };

  test.describe('Breakpoint Behavior', () => {
    test('should adapt layout for different screen sizes', async ({ page }) => {
      await page.goto('/');

      // Test Desktop (≥1200px)
      await page.setViewportSize(viewports.desktop);
      
      // Desktop nav should be visible
      const desktopNav = page.locator('.nav-menu');
      await expect(desktopNav).toBeVisible();
      
      // Mobile toggle should be hidden
      const mobileToggle = page.locator('.mobile-menu-toggle');
      await expect(mobileToggle).toHaveCSS('display', 'none');

      // Test Tablet (768-1199px)
      await page.setViewportSize(viewports.tablet);
      
      // Desktop nav should still be visible on tablet
      await expect(desktopNav).toBeVisible();
      await expect(mobileToggle).toHaveCSS('display', 'none');

      // Test Mobile (<768px)
      await page.setViewportSize(viewports.mobile);
      
      // Desktop nav should be hidden
      await expect(desktopNav).toHaveCSS('display', 'none');
      
      // Mobile toggle should be visible
      await expect(mobileToggle).toBeVisible();
    });

    test('should apply correct padding at different breakpoints', async ({ page }) => {
      await page.goto('/');

      // Test Desktop padding (80px)
      await page.setViewportSize(viewports.desktop);
      const pageContainer = page.locator('.page-container').first();
      
      const desktopPadding = await pageContainer.evaluate(el => 
        window.getComputedStyle(el).paddingLeft
      );
      expect(desktopPadding).toBe('80px');

      // Test Tablet padding (48px)
      await page.setViewportSize(viewports.tablet);
      await page.waitForTimeout(100); // Allow CSS to update
      
      const tabletPadding = await pageContainer.evaluate(el => 
        window.getComputedStyle(el).paddingLeft
      );
      expect(tabletPadding).toBe('48px');

      // Test Mobile padding (24px)
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(100);
      
      const mobilePadding = await pageContainer.evaluate(el => 
        window.getComputedStyle(el).paddingLeft
      );
      expect(mobilePadding).toBe('24px');
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should show mobile menu correctly', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Mobile menu should be hidden initially
      const mobileMenu = page.locator('.mobile-menu');
      await expect(mobileMenu).not.toHaveClass(/active/);

      // Click mobile toggle
      await page.click('.mobile-menu-toggle');

      // Mobile menu should be active
      await expect(mobileMenu).toHaveClass(/active/);
      await expect(mobileMenu).toBeVisible();

      // Should have all navigation items
      const mobileNavItems = page.locator('.mobile-nav-list .mobile-nav-item');
      await expect(mobileNavItems).toHaveCount(5); // Home, About, Pricing, Enroll, Contact
    });

    test('should handle mobile menu interactions', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Open mobile menu
      await page.click('.mobile-menu-toggle');
      await expect(page.locator('.mobile-menu.active')).toBeVisible();

      // Click a navigation item
      await page.click('.mobile-nav-link[href="/about"]');

      // Should navigate and close menu
      await page.waitForURL('/about');
      await expect(page.locator('.mobile-menu.active')).not.toBeVisible();
    });

    test('should prevent body scroll when mobile menu is open', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Check initial body overflow
      const initialOverflow = await page.evaluate(() => document.body.style.overflow);
      expect(initialOverflow).toBe('');

      // Open mobile menu
      await page.click('.mobile-menu-toggle');

      // Body should have overflow hidden
      const menuOpenOverflow = await page.evaluate(() => document.body.style.overflow);
      expect(menuOpenOverflow).toBe('hidden');

      // Close mobile menu
      await page.click('.mobile-menu-toggle');

      // Body overflow should be restored
      const menuClosedOverflow = await page.evaluate(() => document.body.style.overflow);
      expect(menuClosedOverflow).toBe('');
    });
  });

  test.describe('Modal Responsiveness', () => {
    test('should adapt enrollment modal for mobile', async ({ page }) => {
      await page.goto('/');

      // Test desktop modal first
      await page.setViewportSize(viewports.desktop);
      await page.click('.enroll-cta');

      const modalContainer = page.locator('.enroll-modal-container');
      await expect(modalContainer).toBeVisible();

      // Desktop modal should have max-width
      const desktopMaxWidth = await modalContainer.evaluate(el => 
        window.getComputedStyle(el).maxWidth
      );
      expect(desktopMaxWidth).toBe('600px');

      // Close modal
      await page.keyboard.press('Escape');

      // Test mobile modal
      await page.setViewportSize(viewports.mobile);
      await page.click('.enroll-cta');

      // Mobile modal should be full screen
      const mobileWidth = await modalContainer.evaluate(el => 
        window.getComputedStyle(el).width
      );
      const mobileHeight = await modalContainer.evaluate(el => 
        window.getComputedStyle(el).height
      );
      
      expect(mobileWidth).toBe('375px'); // Full viewport width
      expect(mobileHeight).toBe('667px'); // Full viewport height

      // Modal should have no border radius on mobile
      const mobileBorderRadius = await modalContainer.evaluate(el => 
        window.getComputedStyle(el).borderRadius
      );
      expect(mobileBorderRadius).toBe('0px');
    });

    test('should stack modal navigation buttons on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Open modal and navigate to step 2
      await page.click('.enroll-cta');
      await page.click('.nav-button:has-text("Next")');

      const modalNavigation = page.locator('.modal-navigation');
      
      // Should have flex-direction column on mobile
      const flexDirection = await modalNavigation.evaluate(el => 
        window.getComputedStyle(el).flexDirection
      );
      expect(flexDirection).toBe('column');

      // Buttons should be full width
      const navButtons = page.locator('.nav-button');
      const buttonCount = await navButtons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i);
        const width = await button.evaluate(el => 
          window.getComputedStyle(el).width
        );
        // Should be close to full width (accounting for padding)
        expect(parseInt(width)).toBeGreaterThan(300);
      }
    });
  });

  test.describe('Footer Responsiveness', () => {
    test('should adapt footer layout for different screen sizes', async ({ page }) => {
      await page.goto('/');

      // Test desktop footer (4 columns)
      await page.setViewportSize(viewports.desktop);
      const footerContent = page.locator('.footer-content');
      
      const desktopGridColumns = await footerContent.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      // Should have 4 columns on desktop
      expect(desktopGridColumns.split(' ')).toHaveLength(4);

      // Test tablet footer (2 columns)
      await page.setViewportSize(viewports.tablet);
      await page.waitForTimeout(100);
      
      const tabletGridColumns = await footerContent.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      // Should have 2 columns on tablet
      expect(tabletGridColumns.split(' ')).toHaveLength(2);

      // Test mobile footer (1 column)
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(100);
      
      const mobileGridColumns = await footerContent.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      // Should have 1 column on mobile
      expect(mobileGridColumns).toBe('1fr');
    });

    test('should center footer content on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Footer sections should be centered on mobile
      const footerSections = page.locator('.footer-brand, .footer-links, .footer-legal, .footer-social');
      const sectionCount = await footerSections.count();

      for (let i = 0; i < sectionCount; i++) {
        const section = footerSections.nth(i);
        const textAlign = await section.evaluate(el => 
          window.getComputedStyle(el).textAlign
        );
        expect(textAlign).toBe('center');
      }
    });
  });

  test.describe('Typography Responsiveness', () => {
    test('should scale typography appropriately', async ({ page }) => {
      await page.goto('/');

      // Test brand wordmark scaling
      const brandWordmark = page.locator('.nav-brand .wordmark');

      // Desktop size
      await page.setViewportSize(viewports.desktop);
      const desktopFontSize = await brandWordmark.evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      expect(desktopFontSize).toBe('20px'); // 1.25rem

      // Mobile size should be smaller
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(100);
      
      const mobileFontSize = await brandWordmark.evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      expect(mobileFontSize).toBe('18px'); // 1.125rem
      expect(parseInt(mobileFontSize)).toBeLessThan(parseInt(desktopFontSize));
    });
  });

  test.describe('Touch Interactions', () => {
    test('should handle touch interactions on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Test mobile menu toggle with touch
      await page.tap('.mobile-menu-toggle');
      await expect(page.locator('.mobile-menu.active')).toBeVisible();

      // Test navigation with touch
      await page.tap('.mobile-nav-link[href="/about"]');
      await page.waitForURL('/about');
      await expect(page).toHaveURL('/about');
    });

    test('should have appropriate touch targets', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Check that interactive elements meet minimum touch target size (44px)
      const interactiveElements = page.locator('button, a, .nav-link, .mobile-nav-link');
      const elementCount = await interactiveElements.count();

      for (let i = 0; i < Math.min(elementCount, 10); i++) { // Check first 10 elements
        const element = interactiveElements.nth(i);
        const boundingBox = await element.boundingBox();
        
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          // Width can vary, but should be reasonable for touch
          expect(boundingBox.width).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Image Responsiveness', () => {
    test('should handle responsive images', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Test on different viewport sizes
        for (const [, viewport] of Object.entries(viewports)) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(200);

          // Images should not overflow their containers
          for (let i = 0; i < Math.min(imageCount, 5); i++) {
            const img = images.nth(i);
            const imgBox = await img.boundingBox();
            
            if (imgBox) {
              // Image should not be wider than viewport
              expect(imgBox.width).toBeLessThanOrEqual(viewport.width);
              
              // Image should be visible
              expect(imgBox.width).toBeGreaterThan(0);
              expect(imgBox.height).toBeGreaterThan(0);
            }
          }
        }
      }
    });
  });

  test.describe('Content Reflow', () => {
    test('should reflow content without horizontal scrolling', async ({ page }) => {
      const testPages = ['/', '/about', '/pricing', '/contact'];

      for (const pagePath of testPages) {
        await page.goto(pagePath);

        for (const [, viewport] of Object.entries(viewports)) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(200);

          // Check that body doesn't have horizontal overflow
          const bodyOverflowX = await page.evaluate(() => {
            const body = document.body;
            const html = document.documentElement;
            return Math.max(
              body.scrollWidth,
              body.offsetWidth,
              html.clientWidth,
              html.scrollWidth,
              html.offsetWidth
            );
          });

          // Body width should not exceed viewport width (with small tolerance for scrollbars)
          expect(bodyOverflowX).toBeLessThanOrEqual(viewport.width + 20);
        }
      }
    });

    test('should maintain readability at all breakpoints', async ({ page }) => {
      await page.goto('/');

      for (const [, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(200);

        // Check that text elements have reasonable line lengths
        const textElements = page.locator('p, h1, h2, h3, h4, h5, h6');
        const elementCount = await textElements.count();

        if (elementCount > 0) {
          const firstTextElement = textElements.first();
          const elementBox = await firstTextElement.boundingBox();
          
          if (elementBox) {
            // Text should not be too narrow or too wide for readability
            if (viewport.width >= 768) {
              // On larger screens, text shouldn't span full width
              expect(elementBox.width).toBeLessThan(viewport.width * 0.9);
            } else {
              // On mobile, text can be wider but should have padding
              expect(elementBox.width).toBeLessThan(viewport.width - 40); // Account for padding
            }
          }
        }
      }
    });
  });

  test.describe('Performance on Different Devices', () => {
    test('should maintain performance across viewports', async ({ page }) => {
      const performanceMetrics = [];

      for (const [viewportName, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        
        const startTime = Date.now();
        await page.goto('/', { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;

        performanceMetrics.push({ viewport: viewportName, loadTime });

        // Should load within reasonable time on all devices
        expect(loadTime).toBeLessThan(5000);
      }

      // Mobile shouldn't be significantly slower than desktop
      const mobileTime = performanceMetrics.find(m => m.viewport === 'mobile')?.loadTime || 0;
      const desktopTime = performanceMetrics.find(m => m.viewport === 'desktop')?.loadTime || 0;
      
      if (mobileTime > 0 && desktopTime > 0) {
        // Mobile should be at most 2x slower than desktop
        expect(mobileTime).toBeLessThan(desktopTime * 2);
      }
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle orientation changes on mobile', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Verify portrait layout
      await expect(page.locator('.mobile-menu-toggle')).toBeVisible();

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(200);

      // Should still show mobile navigation in landscape mobile
      await expect(page.locator('.mobile-menu-toggle')).toBeVisible();

      // Content should still be accessible
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('.global-header')).toBeVisible();
    });
  });
});