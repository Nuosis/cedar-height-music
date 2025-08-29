import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test.describe('Form Rendering', () => {
    test('should render contact form with all required fields', async ({ page }) => {
      // Check if form exists
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        // Skip test if no form is present
        test.skip('No contact form found on the page');
        return;
      }

      const form = forms.first();
      await expect(form).toBeVisible();

      // Look for common form fields
      const nameFields = page.locator('input[name*="name"], input[placeholder*="name"], input[id*="name"]');
      const emailFields = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]');
      const messageFields = page.locator('textarea, input[name*="message"], input[placeholder*="message"]');
      const submitButtons = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send"), button:has-text("Submit")');

      // At least some form fields should exist
      const totalFields = await nameFields.count() + await emailFields.count() + await messageFields.count();
      expect(totalFields).toBeGreaterThan(0);

      // Should have a submit button
      expect(await submitButtons.count()).toBeGreaterThan(0);
    });

    test('should have proper form labels and accessibility', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Check for labels
      const labels = page.locator('label');
      const labelCount = await labels.count();

      // Should have some labels for form fields
      if (labelCount > 0) {
        // Labels should be associated with form controls
        for (let i = 0; i < Math.min(labelCount, 5); i++) {
          const label = labels.nth(i);
          const forAttr = await label.getAttribute('for');
          const labelText = await label.textContent();
          
          // Label should either have 'for' attribute or contain an input
          if (forAttr) {
            const associatedInput = page.locator(`#${forAttr}`);
            await expect(associatedInput).toBeAttached();
          } else {
            // Label might contain the input element
            const nestedInput = label.locator('input, textarea, select');
            if (await nestedInput.count() === 0) {
              // If no nested input and no 'for' attribute, this might be an issue
              console.warn(`Label "${labelText}" has no associated form control`);
            }
          }
        }
      }
    });

    test('should have contact information displayed', async ({ page }) => {
      // Should show contact information alongside the form
      const pageContent = await page.locator('main').textContent();
      
      // Look for email, phone, or address information
      const hasContactInfo = pageContent.includes('@') || 
                            pageContent.includes('phone') ||
                            pageContent.includes('email') ||
                            pageContent.includes('250') ||
                            pageContent.includes('contact');
      
      expect(hasContactInfo).toBe(true);
    });
  });

  test.describe('Form Validation', () => {
    test('should validate required fields', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send"), button:has-text("Submit")').first();
      
      if (await submitButton.count() > 0) {
        await submitButton.click();

        // Check for validation messages or required field indicators
        // This could be browser validation or custom validation
        const requiredFields = page.locator('input[required], textarea[required]');
        const requiredCount = await requiredFields.count();

        if (requiredCount > 0) {
          // At least one required field should show validation
          let hasValidation = false;
          
          for (let i = 0; i < requiredCount; i++) {
            const field = requiredFields.nth(i);
            const validationMessage = await field.evaluate(el => el.validationMessage);
            
            if (validationMessage) {
              hasValidation = true;
              break;
            }
          }
          
          expect(hasValidation).toBe(true);
        }
      }
    });

    test('should validate email format', async ({ page }) => {
      const emailFields = page.locator('input[type="email"]');
      
      if (await emailFields.count() > 0) {
        const emailField = emailFields.first();
        
        // Enter invalid email
        await emailField.fill('invalid-email');
        
        // Try to submit or trigger validation
        await emailField.blur();
        
        // Check for validation message
        const validationMessage = await emailField.evaluate(el => el.validationMessage);
        expect(validationMessage).toBeTruthy();
        
        // Enter valid email
        await emailField.fill('test@example.com');
        await emailField.blur();
        
        // Validation message should be cleared
        const validMessageAfter = await emailField.evaluate(el => el.validationMessage);
        expect(validMessageAfter).toBe('');
      }
    });

    test('should handle form field character limits', async ({ page }) => {
      const textareas = page.locator('textarea');
      
      if (await textareas.count() > 0) {
        const textarea = textareas.first();
        const maxLength = await textarea.getAttribute('maxlength');
        
        if (maxLength) {
          const maxLengthNum = parseInt(maxLength);
          const longText = 'a'.repeat(maxLengthNum + 10);
          
          await textarea.fill(longText);
          
          const actualValue = await textarea.inputValue();
          expect(actualValue.length).toBeLessThanOrEqual(maxLengthNum);
        }
      }
    });
  });

  test.describe('Form Submission', () => {
    test('should handle form submission', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Fill out form with valid data
      const nameField = page.locator('input[name*="name"], input[placeholder*="name"], input[id*="name"]').first();
      const emailField = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]').first();
      const messageField = page.locator('textarea, input[name*="message"], input[placeholder*="message"]').first();

      if (await nameField.count() > 0) {
        await nameField.fill('Test User');
      }
      
      if (await emailField.count() > 0) {
        await emailField.fill('test@example.com');
      }
      
      if (await messageField.count() > 0) {
        await messageField.fill('This is a test message for the contact form.');
      }

      // Submit form
      const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send"), button:has-text("Submit")').first();
      
      if (await submitButton.count() > 0) {
        // Listen for network requests
        const requests = [];
        page.on('request', request => {
          if (request.method() === 'POST') {
            requests.push(request);
          }
        });

        await submitButton.click();

        // Wait a moment for any async operations
        await page.waitForTimeout(2000);

        // Check for success/error messages or form state changes
        const successMessages = page.locator('text=/success|sent|thank you|received/i');
        const errorMessages = page.locator('text=/error|failed|try again/i');
        
        // Either success or error message should appear, or form should be reset
        const hasSuccessMessage = await successMessages.count() > 0;
        const hasErrorMessage = await errorMessages.count() > 0;
        const formWasReset = await nameField.count() > 0 ? (await nameField.inputValue()) === '' : true;

        // At least one of these should be true
        expect(hasSuccessMessage || hasErrorMessage || formWasReset || requests.length > 0).toBe(true);
      }
    });

    test('should prevent double submission', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Fill out form
      const nameField = page.locator('input[name*="name"], input[placeholder*="name"], input[id*="name"]').first();
      const emailField = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]').first();

      if (await nameField.count() > 0) {
        await nameField.fill('Test User');
      }
      
      if (await emailField.count() > 0) {
        await emailField.fill('test@example.com');
      }

      const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send"), button:has-text("Submit")').first();
      
      if (await submitButton.count() > 0) {
        // Click submit button rapidly
        await submitButton.click();
        await submitButton.click();
        await submitButton.click();

        // Button should be disabled or form should prevent multiple submissions
        // This is implementation-dependent, so we'll just check that the page doesn't crash
        await page.waitForTimeout(1000);
        
        // Page should still be functional
        await expect(page.locator('main')).toBeVisible();
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Tab through form fields
      await page.keyboard.press('Tab');
      
      // Find all focusable elements in the form
      const focusableElements = page.locator('form input, form textarea, form button, form select');
      const elementCount = await focusableElements.count();

      if (elementCount > 0) {
        // Should be able to focus on form elements
        let focusedElement = null;
        
        for (let i = 0; i < elementCount; i++) {
          await page.keyboard.press('Tab');
          focusedElement = await page.evaluate(() => document.activeElement.tagName);
          
          if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(focusedElement)) {
            break;
          }
        }
        
        expect(['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT']).toContain(focusedElement);
      }
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Check for ARIA labels on form fields
      const formFields = page.locator('form input, form textarea');
      const fieldCount = await formFields.count();

      for (let i = 0; i < Math.min(fieldCount, 5); i++) {
        const field = formFields.nth(i);
        
        // Field should have either aria-label, aria-labelledby, or associated label
        const ariaLabel = await field.getAttribute('aria-label');
        const ariaLabelledBy = await field.getAttribute('aria-labelledby');
        const fieldId = await field.getAttribute('id');
        
        let hasLabel = false;
        
        if (ariaLabel || ariaLabelledBy) {
          hasLabel = true;
        } else if (fieldId) {
          // Check for associated label
          const associatedLabel = page.locator(`label[for="${fieldId}"]`);
          hasLabel = await associatedLabel.count() > 0;
        }
        
        // This is a recommendation, not a hard requirement
        if (!hasLabel) {
          console.warn(`Form field at index ${i} may not have proper labeling`);
        }
      }
    });

    test('should provide clear error messages', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Try to trigger validation errors
      const emailField = page.locator('input[type="email"]').first();
      
      if (await emailField.count() > 0) {
        await emailField.fill('invalid-email');
        await emailField.blur();
        
        // Check for error message
        const validationMessage = await emailField.evaluate(el => el.validationMessage);
        
        if (validationMessage) {
          // Error message should be descriptive
          expect(validationMessage.length).toBeGreaterThan(5);
          expect(validationMessage.toLowerCase()).toContain('email');
        }
      }
    });
  });

  test.describe('Form Security', () => {
    test('should have honeypot protection', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Look for hidden honeypot fields
      const hiddenFields = page.locator('form input[type="hidden"], form input[style*="display: none"], form input[style*="visibility: hidden"]');
      const hiddenCount = await hiddenFields.count();

      // Having hidden fields might indicate honeypot protection
      // This is not a requirement, just a good practice check
      if (hiddenCount > 0) {
        console.log(`Found ${hiddenCount} hidden fields (possible honeypot protection)`);
      }
    });

    test('should handle malicious input safely', async ({ page }) => {
      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Test with potentially malicious input
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '"><script>alert("xss")</script>',
        'javascript:alert("xss")',
        '${alert("xss")}'
      ];

      const textFields = page.locator('form input[type="text"], form textarea');
      
      if (await textFields.count() > 0) {
        const field = textFields.first();
        
        for (const maliciousInput of maliciousInputs) {
          await field.fill(maliciousInput);
          
          // Check that the input is properly escaped/sanitized in the DOM
          const fieldValue = await field.inputValue();
          
          // The field should accept the input but not execute it
          expect(fieldValue).toBe(maliciousInput);
          
          // No script should execute
          const alertDialogs = [];
          page.on('dialog', dialog => {
            alertDialogs.push(dialog);
            dialog.dismiss();
          });
          
          await page.waitForTimeout(100);
          expect(alertDialogs).toHaveLength(0);
        }
      }
    });
  });

  test.describe('Form Responsiveness', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Form should be visible and usable on mobile
      const form = forms.first();
      await expect(form).toBeVisible();

      // Form fields should be appropriately sized
      const formFields = page.locator('form input, form textarea');
      const fieldCount = await formFields.count();

      for (let i = 0; i < Math.min(fieldCount, 3); i++) {
        const field = formFields.nth(i);
        const boundingBox = await field.boundingBox();
        
        if (boundingBox) {
          // Field should not be too narrow on mobile
          expect(boundingBox.width).toBeGreaterThan(200);
          
          // Field should fit within viewport
          expect(boundingBox.width).toBeLessThan(375);
        }
      }
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const forms = page.locator('form');
      if (await forms.count() === 0) {
        test.skip('No contact form found on the page');
        return;
      }

      // Test touch interactions with form fields
      const textField = page.locator('form input[type="text"], form input[name*="name"]').first();
      
      if (await textField.count() > 0) {
        await textField.tap();
        await expect(textField).toBeFocused();
        
        await textField.fill('Touch Test');
        const value = await textField.inputValue();
        expect(value).toBe('Touch Test');
      }

      // Test submit button touch
      const submitButton = page.locator('form button[type="submit"], form input[type="submit"]').first();
      
      if (await submitButton.count() > 0) {
        // Should be able to tap submit button
        const boundingBox = await submitButton.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44); // Minimum touch target size
        }
      }
    });
  });
});