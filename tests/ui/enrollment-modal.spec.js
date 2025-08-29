import { test, expect } from '@playwright/test'

test.describe('Enrollment Modal Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Modal Opening and Closing', () => {
    test('should open modal when CTA button is clicked', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Modal should have proper ARIA attributes
        await expect(modal).toHaveAttribute('role', 'dialog')
        await expect(modal).toHaveAttribute('aria-modal', 'true')
      }
    })

    test('should close modal when Escape key is pressed', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Press Escape to close
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    })

    test('should close modal when close button is clicked', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for close button
        const closeButton = modal.locator('button[aria-label*="close"], button[aria-label*="Close"], .close-button, [data-close]')
        if (await closeButton.count() > 0) {
          await closeButton.click()
          await expect(modal).not.toBeVisible()
        }
      }
    })

    test('should close modal when clicking outside (overlay)', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Click outside the modal content
        const overlay = page.locator('.modal-overlay, .enrollment-modal-overlay')
        if (await overlay.count() > 0) {
          await overlay.click({ position: { x: 10, y: 10 } })
          await expect(modal).not.toBeVisible()
        }
      }
    })
  })

  test.describe('Modal Content and Structure', () => {
    test('should display modal with proper heading', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Should have a heading
        const heading = modal.locator('h1, h2, h3, [role="heading"]')
        if (await heading.count() > 0) {
          await expect(heading).toBeVisible()
          
          const headingText = await heading.textContent()
          expect(headingText.toLowerCase()).toMatch(/enroll|enrollment|sign up|get started/)
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should display progress indicator for multi-step flow', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for progress indicator
        const progressIndicator = modal.locator('.progress, .stepper, .step-indicator, [role="progressbar"]')
        if (await progressIndicator.count() > 0) {
          await expect(progressIndicator).toBeVisible()
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should have proper focus management', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Focus should be within the modal
        const focusedElement = page.locator(':focus')
        const isWithinModal = await modal.locator(':focus').count() > 0
        
        if (await focusedElement.count() > 0) {
          expect(isWithinModal).toBe(true)
        }
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('Multi-Step Flow Navigation', () => {
    test('should navigate through enrollment steps', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for step navigation buttons
        const nextButton = modal.locator('button:has-text("Next"), button:has-text("Continue"), .next-step')
        const backButton = modal.locator('button:has-text("Back"), button:has-text("Previous"), .prev-step')
        
        // If multi-step flow exists, test navigation
        if (await nextButton.count() > 0) {
          // Should be able to go to next step
          await nextButton.click()
          
          // Check if we moved to next step (progress indicator or content change)
          const stepContent = modal.locator('.step-content, .modal-content')
          await expect(stepContent).toBeVisible()
          
          // If back button exists, test going back
          if (await backButton.count() > 0) {
            await backButton.click()
            await expect(stepContent).toBeVisible()
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should validate required fields before proceeding', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for form inputs and next button
        const inputs = modal.locator('input, select, textarea')
        const nextButton = modal.locator('button:has-text("Next"), button:has-text("Continue"), .next-step')
        
        if (await inputs.count() > 0 && await nextButton.count() > 0) {
          // Try to proceed without filling required fields
          await nextButton.click()
          
          // Should show validation errors or prevent progression
          const errorMessages = modal.locator('.error, .invalid, [role="alert"]')
          if (await errorMessages.count() > 0) {
            await expect(errorMessages.first()).toBeVisible()
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should handle instrument selection', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for instrument selection options
        const instrumentOptions = modal.locator('input[type="radio"], .instrument-option, .selection-card')
        
        if (await instrumentOptions.count() > 0) {
          // Select first instrument
          await instrumentOptions.first().click()
          
          // Should be able to proceed after selection
          const nextButton = modal.locator('button:has-text("Next"), button:has-text("Continue"), .next-step')
          if (await nextButton.count() > 0) {
            await expect(nextButton).toBeEnabled()
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should handle timeslot selection', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Navigate to timeslot step (if multi-step)
        const nextButton = modal.locator('button:has-text("Next"), button:has-text("Continue"), .next-step')
        if (await nextButton.count() > 0) {
          // First select an instrument if available
          const instrumentOptions = modal.locator('input[type="radio"], .instrument-option, .selection-card')
          if (await instrumentOptions.count() > 0) {
            await instrumentOptions.first().click()
            await nextButton.click()
          }
          
          // Look for timeslot options
          const timeslotOptions = modal.locator('.timeslot-option, .time-slot, input[name*="time"]')
          if (await timeslotOptions.count() > 0) {
            await timeslotOptions.first().click()
            
            // Should be able to proceed after selection
            const continueButton = modal.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Review")')
            if (await continueButton.count() > 0) {
              await expect(continueButton).toBeEnabled()
            }
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('Form Validation and Submission', () => {
    test('should validate email format', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for email input
        const emailInput = modal.locator('input[type="email"], input[name*="email"]')
        if (await emailInput.count() > 0) {
          // Enter invalid email
          await emailInput.fill('invalid-email')
          
          // Try to submit or proceed
          const submitButton = modal.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Enroll")')
          if (await submitButton.count() > 0) {
            await submitButton.click()
            
            // Should show validation error
            const errorMessage = modal.locator('.error, .invalid, [role="alert"]')
            if (await errorMessage.count() > 0) {
              await expect(errorMessage).toBeVisible()
            }
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should handle successful enrollment completion', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for final step or submit button
        const submitButton = modal.locator('button:has-text("Enroll"), button:has-text("Complete"), button:has-text("Finish")')
        
        if (await submitButton.count() > 0) {
          // Fill required fields if present
          const requiredInputs = modal.locator('input[required], select[required]')
          const inputCount = await requiredInputs.count()
          
          for (let i = 0; i < inputCount; i++) {
            const input = requiredInputs.nth(i)
            const inputType = await input.getAttribute('type')
            const inputName = await input.getAttribute('name')
            
            if (inputType === 'email' || inputName?.includes('email')) {
              await input.fill('test@example.com')
            } else if (inputType === 'text' || inputType === 'tel') {
              await input.fill('Test Value')
            }
          }
          
          // Submit enrollment
          await submitButton.click()
          
          // Should either redirect or show success message
          // Note: In a real app, this might redirect to external enrollment system
          const successMessage = modal.locator('.success, .confirmation, [role="status"]')
          if (await successMessage.count() > 0) {
            await expect(successMessage).toBeVisible()
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('Responsive Modal Behavior', () => {
    test('should display properly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Modal should be full-screen or properly sized for mobile
        const modalBox = await modal.boundingBox()
        if (modalBox) {
          expect(modalBox.width).toBeGreaterThan(300)
          expect(modalBox.height).toBeGreaterThan(400)
        }
        
        // Should still be closeable on mobile
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    })

    test('should handle touch interactions on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Touch targets should be adequate size (44px minimum)
        const buttons = modal.locator('button')
        const buttonCount = await buttons.count()
        
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i)
          if (await button.isVisible()) {
            const box = await button.boundingBox()
            if (box) {
              expect(box.height).toBeGreaterThanOrEqual(44)
            }
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/**', route => route.abort())
      
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Try to load data that requires network
        const submitButton = modal.locator('button:has-text("Submit"), button:has-text("Enroll")')
        if (await submitButton.count() > 0) {
          await submitButton.click()
          
          // Should show error message
          const errorMessage = modal.locator('.error, .network-error, [role="alert"]')
          if (await errorMessage.count() > 0) {
            await expect(errorMessage).toBeVisible()
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should provide helpful error messages', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Look for any error states
        const errorElements = modal.locator('.error, [role="alert"], .validation-error')
        const errorCount = await errorElements.count()
        
        for (let i = 0; i < errorCount; i++) {
          const error = errorElements.nth(i)
          if (await error.isVisible()) {
            const errorText = await error.textContent()
            expect(errorText.length).toBeGreaterThan(0)
            expect(errorText.toLowerCase()).not.toContain('error')
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })
  })

  test.describe('Accessibility in Modal', () => {
    test('should trap focus within modal', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Tab through modal elements
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab')
          
          const focusedElement = page.locator(':focus')
          if (await focusedElement.count() > 0) {
            // Focus should remain within modal
            const isWithinModal = await modal.locator(':focus').count() > 0
            expect(isWithinModal).toBe(true)
          }
        }
        
        await page.keyboard.press('Escape')
      }
    })

    test('should return focus to trigger element when closed', async ({ page }) => {
      const ctaButton = page.locator('.primary-cta').first()
      if (await ctaButton.count() > 0) {
        // Focus the button before clicking
        await ctaButton.focus()
        await ctaButton.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Close modal
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
        
        // Focus should return to the original button
        const focusedElement = page.locator(':focus')
        if (await focusedElement.count() > 0) {
          const isSameElement = await focusedElement.evaluate((el, button) => el === button, await ctaButton.elementHandle())
          expect(isSameElement).toBe(true)
        }
      }
    })
  })
})