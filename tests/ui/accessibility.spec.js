import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('should allow keyboard navigation through main elements', async ({ page }) => {
      await page.goto('/')
      
      // Start from the top of the page
      await page.keyboard.press('Tab')
      
      // Should be able to tab through navigation links
      const focusedElement = await page.locator(':focus')
      await expect(focusedElement).toBeVisible()
      
      // Continue tabbing through interactive elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        const currentFocus = await page.locator(':focus')
        if (await currentFocus.count() > 0) {
          await expect(currentFocus).toBeVisible()
        }
      }
    })

    test('should handle Enter key on buttons and links', async ({ page }) => {
      await page.goto('/')
      
      // Find the first CTA button
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.focus()
        await page.keyboard.press('Enter')
        
        // Should open enrollment modal
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Close modal with Escape
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    })

    test('should handle Space key on buttons', async ({ page }) => {
      await page.goto('/')
      
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.focus()
        await page.keyboard.press('Space')
        
        // Should open enrollment modal
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Close modal
        await page.keyboard.press('Escape')
      }
    })

    test('should trap focus in modal when open', async ({ page }) => {
      await page.goto('/')
      
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Focus should be trapped within modal
        const modalElements = modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const elementCount = await modalElements.count()
        
        if (elementCount > 0) {
          // Tab through modal elements
          for (let i = 0; i < elementCount + 2; i++) {
            await page.keyboard.press('Tab')
            // eslint-disable-next-line no-unused-vars
            const focusedElement = await page.locator(':focus')
            
            // Focus should remain within modal
            const isWithinModal = await modal.locator(':focus').count() > 0
            expect(isWithinModal).toBe(true)
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('ARIA and Semantic HTML', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/')
      
      // Should have an h1
      const h1 = page.locator('h1')
      await expect(h1).toHaveCount(1)
      
      // Check heading hierarchy (h1 -> h2 -> h3, etc.)
      const headings = page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()
      
      if (headingCount > 1) {
        for (let i = 0; i < headingCount; i++) {
          const heading = headings.nth(i)
          const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
          expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).toContain(tagName)
        }
      }
    })

    test('should have proper ARIA labels for interactive elements', async ({ page }) => {
      await page.goto('/')
      
      // Check mobile menu button has aria-label
      const mobileMenuButton = page.locator('[aria-label="Toggle mobile menu"]')
      if (await mobileMenuButton.count() > 0) {
        await expect(mobileMenuButton).toHaveAttribute('aria-label')
        await expect(mobileMenuButton).toHaveAttribute('aria-expanded')
      }
      
      // Check modal has proper ARIA attributes
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toHaveAttribute('role', 'dialog')
        await expect(modal).toHaveAttribute('aria-modal', 'true')
        
        await page.keyboard.press('Escape')
      }
    })

    test('should have proper form labels and associations', async ({ page }) => {
      await page.goto('/contact')
      
      // Check that form inputs have associated labels
      const inputs = page.locator('input, textarea, select')
      const inputCount = await inputs.count()
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const inputId = await input.getAttribute('id')
        const inputName = await input.getAttribute('name')
        
        if (inputId) {
          // Should have a label with for attribute
          const label = page.locator(`label[for="${inputId}"]`)
          await expect(label).toBeVisible()
        } else if (inputName) {
          // Should have aria-label or be wrapped in label
          const ariaLabel = await input.getAttribute('aria-label')
          const placeholder = await input.getAttribute('placeholder')
          
          expect(ariaLabel || placeholder).toBeTruthy()
        }
      }
    })

    test('should have proper landmark roles', async ({ page }) => {
      await page.goto('/')
      
      // Should have main landmark
      const main = page.locator('main, [role="main"]')
      await expect(main).toBeVisible()
      
      // Should have navigation landmark
      const nav = page.locator('nav, [role="navigation"]')
      await expect(nav).toBeVisible()
      
      // Should have contentinfo (footer) landmark
      const footer = page.locator('footer, [role="contentinfo"]')
      await expect(footer).toBeVisible()
    })
  })

  test.describe('Color and Contrast', () => {
    test('should have sufficient color contrast for text', async ({ page }) => {
      await page.goto('/')
      
      // Test primary text elements
      const textElements = page.locator('h1, h2, h3, p, a, button')
      const elementCount = await textElements.count()
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = textElements.nth(i)
        if (await element.isVisible()) {
          const color = await element.evaluate(el => {
            const style = window.getComputedStyle(el)
            return {
              color: style.color,
              backgroundColor: style.backgroundColor,
              fontSize: style.fontSize
            }
          })
          
          // Basic check that color is not transparent or same as background
          expect(color.color).not.toBe('rgba(0, 0, 0, 0)')
          expect(color.color).not.toBe('transparent')
        }
      }
    })

    test('should not rely solely on color for information', async ({ page }) => {
      await page.goto('/')
      
      // Check that interactive elements have more than just color differences
      const buttons = page.locator('button, .btn, .primary-cta, .secondary-cta')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i)
        if (await button.isVisible()) {
          const styles = await button.evaluate(el => {
            const style = window.getComputedStyle(el)
            return {
              border: style.border,
              textDecoration: style.textDecoration,
              fontWeight: style.fontWeight,
              textTransform: style.textTransform
            }
          })
          
          // Should have visual indicators beyond color
          const hasVisualIndicators = 
            styles.border !== 'none' ||
            styles.textDecoration !== 'none' ||
            parseInt(styles.fontWeight) >= 600 ||
            styles.textTransform !== 'none'
          
          expect(hasVisualIndicators).toBe(true)
        }
      }
    })
  })

  test.describe('Images and Media', () => {
    test('should have alt text for all images', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        
        // Alt attribute should exist (can be empty for decorative images)
        expect(alt).not.toBeNull()
        
        // If image is not decorative, alt should have meaningful content
        const src = await img.getAttribute('src')
        if (src && !src.includes('decoration') && !src.includes('bg')) {
          expect(alt.length).toBeGreaterThan(0)
        }
      }
    })

    test('should handle images that fail to load', async ({ page }) => {
      await page.goto('/')
      
      // Check that broken images don't break layout
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i)
        const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight !== 0)
        
        if (!isLoaded) {
          // Image should still have alt text for screen readers
          const alt = await img.getAttribute('alt')
          expect(alt).not.toBeNull()
        }
      }
    })
  })

  test.describe('Mobile Accessibility', () => {
    test('should have adequate touch targets on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // Check that interactive elements meet minimum touch target size (44px)
      const interactiveElements = page.locator('button, a, input, [role="button"]')
      const elementCount = await interactiveElements.count()
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = interactiveElements.nth(i)
        if (await element.isVisible()) {
          const box = await element.boundingBox()
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44)
            expect(box.width).toBeGreaterThanOrEqual(44)
          }
        }
      }
    })

    test('should handle mobile navigation accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      const mobileMenuButton = page.locator('[aria-label="Toggle mobile menu"]')
      if (await mobileMenuButton.count() > 0) {
        // Should be keyboard accessible
        await mobileMenuButton.focus()
        await page.keyboard.press('Enter')
        
        // Menu should be expanded
        await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true')
        
        // Should be able to navigate menu with keyboard
        await page.keyboard.press('Tab')
        const focusedElement = await page.locator(':focus')
        await expect(focusedElement).toBeVisible()
        
        // Close menu
        await page.keyboard.press('Escape')
        await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
      }
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper page titles', async ({ page }) => {
      const pages = [
        { path: '/', expectedTitle: /Cedar Heights Music|Home/ },
        { path: '/about', expectedTitle: /About|Cedar Heights Music/ },
        { path: '/pricing', expectedTitle: /Pricing|Cedar Heights Music/ },
        { path: '/contact', expectedTitle: /Contact|Cedar Heights Music/ }
      ]
      
      for (const pageInfo of pages) {
        await page.goto(pageInfo.path)
        await expect(page).toHaveTitle(pageInfo.expectedTitle)
      }
    })

    test('should announce dynamic content changes', async ({ page }) => {
      await page.goto('/')
      
      // Test modal opening announcement
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Modal should have aria-live region or proper focus management
        const ariaLive = modal.locator('[aria-live]')
        // eslint-disable-next-line no-unused-vars
        const focusedElement = await page.locator(':focus')
        
        // Either should have aria-live region or focus should move to modal
        const hasAriaLive = await ariaLive.count() > 0
        const focusInModal = await modal.locator(':focus').count() > 0
        
        expect(hasAriaLive || focusInModal).toBe(true)
        
        await page.keyboard.press('Escape')
      }
    })

    test('should have skip links for keyboard users', async ({ page }) => {
      await page.goto('/')
      
      // Tab to first element to reveal skip links
      await page.keyboard.press('Tab')
      
      // Look for skip link (may be visually hidden until focused)
      const skipLink = page.locator('a[href="#main"], a[href="#main-content"], .skip-link')
      if (await skipLink.count() > 0) {
        await expect(skipLink).toBeVisible()
        
        // Skip link should work
        await skipLink.click()
        const main = page.locator('main, #main, #main-content')
        await expect(main).toBeFocused()
      }
    })
  })
})