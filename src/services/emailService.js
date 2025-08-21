/**
 * Brevo Email Service for Cedar Heights Music Academy
 * Handles email sending through Brevo API for contact form submissions
 */

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitizes text content to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeText(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/[<>]/g, '');
}

/**
 * Gets environment configuration for Brevo
 * @returns {Object} Configuration object
 */
function getBrevoConfig() {
    const apiKey = import.meta.env.VITE_BREVO_API_KEY;
    const fromEmail = import.meta.env.VITE_BREVO_FROM;
    
    if (!apiKey) {
        throw new Error('VITE_BREVO_API_KEY environment variable is not configured');
    }
    
    if (!fromEmail) {
        throw new Error('VITE_BREVO_FROM environment variable is not configured');
    }
    
    return { apiKey, fromEmail };
}

/**
 * Sends a contact form email to the business
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.phone - Contact phone (optional)
 * @param {string} contactData.subject - Contact subject
 * @param {string} contactData.message - Contact message
 * @returns {Promise<Object>} Response from Brevo API
 */
export async function sendContactFormEmail(contactData) {
    const { apiKey, fromEmail } = getBrevoConfig();
    const { name, email, phone, subject, message } = contactData;

    // Validate required fields
    if (!name || !email || !message) {
        throw new Error('Missing required fields: name, email, and message are required');
    }

    if (!validateEmail(email)) {
        throw new Error('Invalid email address format');
    }

    // Sanitize inputs
    const sanitizedName = sanitizeText(name);
    const sanitizedEmail = sanitizeText(email);
    const sanitizedPhone = sanitizeText(phone || '');
    const sanitizedSubject = sanitizeText(subject || 'Contact Form Submission');
    const sanitizedMessage = sanitizeText(message);

    // Create HTML content for the email
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c1810; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
                New Contact Form Submission
            </h2>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${sanitizedName}</p>
                <p><strong>Email:</strong> ${sanitizedEmail}</p>
                ${sanitizedPhone ? `<p><strong>Phone:</strong> ${sanitizedPhone}</p>` : ''}
                <p><strong>Subject:</strong> ${sanitizedSubject}</p>
            </div>
            <div style="margin: 20px 0;">
                <h3 style="color: #2c1810;">Message:</h3>
                <div style="background-color: #fff; padding: 15px; border-left: 4px solid #8B4513; margin: 10px 0;">
                    ${sanitizedMessage.replace(/\n/g, '<br>')}
                </div>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
                This email was sent from the Cedar Heights Music Academy website contact form.
            </p>
        </div>
    `;

    const textContent = `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
${sanitizedPhone ? `Phone: ${sanitizedPhone}` : ''}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

---
This email was sent from the Cedar Heights Music Academy website contact form.
    `.trim();

    const emailPayload = {
        sender: {
            name: 'Cedar Heights Music Academy',
            email: fromEmail
        },
        to: [
            {
                email: fromEmail,
                name: 'Cedar Heights Music Academy'
            }
        ],
        replyTo: {
            email: sanitizedEmail,
            name: sanitizedName
        },
        subject: `${sanitizedSubject} - From ${sanitizedName}`,
        htmlContent: htmlContent,
        textContent: textContent
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(emailPayload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Brevo API error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('Contact form email sent successfully:', result);
        return result;

    } catch (error) {
        console.error('Failed to send contact form email:', error);
        throw error;
    }
}

/**
 * Sends a confirmation email to the contact form submitter
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @returns {Promise<Object>} Response from Brevo API
 */
export async function sendContactConfirmationEmail(contactData) {
    const { apiKey, fromEmail } = getBrevoConfig();
    const { name, email } = contactData;

    if (!name || !email) {
        throw new Error('Missing required fields: name and email are required');
    }

    if (!validateEmail(email)) {
        throw new Error('Invalid email address format');
    }

    const sanitizedName = sanitizeText(name);
    const sanitizedEmail = sanitizeText(email);

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px; background-color: #2c1810; color: white; border-radius: 5px 5px 0 0;">
                <h1 style="margin: 0; color: white;">Cedar Heights Music Academy</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
                <h2 style="color: #2c1810; margin-top: 0;">Thank you for contacting us!</h2>
                <p>Dear ${sanitizedName},</p>
                <p>We have received your message and will get back to you as soon as possible, typically within 24 hours.</p>
                <p>In the meantime, feel free to explore our website to learn more about our music lessons and programs:</p>
                <ul style="color: #555;">
                    <li>Individual and group lessons available</li>
                    <li>All skill levels welcome</li>
                    <li>Flexible scheduling options</li>
                    <li>Professional, experienced instructors</li>
                </ul>
                <div style="background-color: #8B4513; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-weight: bold;">Ready to start your musical journey?</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Visit our website to learn more about enrollment!</p>
                </div>
                <p>Best regards,<br>
                <strong>The Cedar Heights Music Academy Team</strong></p>
            </div>
            <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this message.
            </div>
        </div>
    `;

    const textContent = `
Cedar Heights Music Academy

Thank you for contacting us!

Dear ${sanitizedName},

We have received your message and will get back to you as soon as possible, typically within 24 hours.

In the meantime, feel free to explore our website to learn more about our music lessons and programs:

• Individual and group lessons available
• All skill levels welcome  
• Flexible scheduling options
• Professional, experienced instructors

Ready to start your musical journey?
Visit our website to learn more about enrollment!

Best regards,
The Cedar Heights Music Academy Team

---
This is an automated confirmation email. Please do not reply to this message.
    `.trim();

    const emailPayload = {
        sender: {
            name: 'Cedar Heights Music Academy',
            email: fromEmail
        },
        to: [
            {
                email: sanitizedEmail,
                name: sanitizedName
            }
        ],
        subject: 'Thank you for contacting Cedar Heights Music Academy',
        htmlContent: htmlContent,
        textContent: textContent
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(emailPayload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Brevo API error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('Confirmation email sent successfully:', result);
        return result;

    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        throw error;
    }
}

/**
 * Sends both contact form and confirmation emails
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} Combined results from both email sends
 */
export async function sendContactEmails(contactData) {
    const results = {
        contactEmail: null,
        confirmationEmail: null,
        success: false,
        errors: []
    };

    try {
        // Send contact form email to business
        results.contactEmail = await sendContactFormEmail(contactData);
    } catch (error) {
        results.errors.push(`Contact email failed: ${error.message}`);
    }

    try {
        // Send confirmation email to user
        results.confirmationEmail = await sendContactConfirmationEmail(contactData);
    } catch (error) {
        results.errors.push(`Confirmation email failed: ${error.message}`);
    }

    // Consider success if at least the contact email was sent
    results.success = !!results.contactEmail;

    return results;
}