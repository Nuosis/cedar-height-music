import { useState } from 'react'
import { Button } from '../components/core.jsx'

/**
 * Contact Page Component
 * Includes contact form with validation, honeypot spam protection, and direct contact info
 */
const ContactPage = ({ onEnrollClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
    website: '' // Honeypot field
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    if (!formData.consent) {
      newErrors.consent = 'You must agree to be contacted'
    }
    
    return newErrors
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (digits.length >= 6) {
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    } else if (digits.length >= 3) {
      return digits.replace(/(\d{3})(\d{0,3})/, '($1) $2')
    }
    return digits
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    // Check honeypot
    if (formData.website) {
      // Spam detected, fail silently
      setSubmitStatus('error')
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      // In a real implementation, this would submit to Formspree or similar service
      // For now, simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate success
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent: false,
        website: ''
      })
      setErrors({})
      
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      {/* Contact Hero Section */}
      <section className="contact-hero-section section">
        <div className="page-container">
          <div className="contact-hero-content">
            
            <div className="hero-eyebrow">
              Get in touch
            </div>
            
            <h1 className="contact-hero-headline">
              We're here to help with your musical journey
            </h1>
            
            <p className="contact-hero-subcopy">
              Questions about lessons? Want to discuss your child's musical goals? We'd love to hear from you and help you get started.
            </p>
          </div>
          
          {/* Background Elements */}
          <div className="contact-hero-background">
            <div className="hero-background-base"></div>
            
            <div className="contact-decorative">
              <div className="musical-accent accent-1">♪</div>
              <div className="musical-accent accent-2">♫</div>
              <div className="character-illustration">🎵</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section section">
        <div className="page-container">
          <div className="contact-form-container">
            
            <div className="contact-layout">
              
              {/* Contact Form */}
              <div className="contact-form-wrapper">
                <h2 className="form-title">Send us a message</h2>
                <p className="form-description">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
                
                <form className="contact-form" onSubmit={handleSubmit}>
                  
                  {/* Honeypot field */}
                  <div className="honeypot">
                    <input 
                      type="text" 
                      name="website" 
                      tabIndex="-1" 
                      autoComplete="off"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name" className="form-label">Name *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        name="name" 
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                      />
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-email" className="form-label">Email *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        name="email" 
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-phone" className="form-label">Phone</label>
                      <input 
                        type="tel" 
                        id="contact-phone" 
                        name="phone" 
                        className="form-input"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="(250) 555-0123"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-message" className="form-label">Message *</label>
                      <textarea 
                        id="contact-message" 
                        name="message" 
                        className={`form-textarea ${errors.message ? 'error' : ''}`}
                        rows="5" 
                        value={formData.message}
                        onChange={handleInputChange}
                        required 
                      />
                      {errors.message && <span className="error-text">{errors.message}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          id="contact-consent" 
                          name="consent" 
                          className="form-checkbox"
                          checked={formData.consent}
                          onChange={handleInputChange}
                          required 
                        />
                        <span className="checkbox-text">I agree to be contacted by Cedar Heights Music Academy regarding my inquiry. *</span>
                      </label>
                      {errors.consent && <span className="error-text">{errors.consent}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <Button 
                      type="submit" 
                      variant="primary"
                      className={`form-submit ${isSubmitting ? 'loading' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                  
                  {/* Status Messages */}
                  <div className="form-status">
                    {submitStatus === 'success' && (
                      <div className="success-message">
                        <p>✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="error-message">
                        <p>❌ Sorry, there was an error sending your message. Please try again or contact us directly.</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
              
              {/* Direct Contact Info */}
              <div className="contact-info-wrapper">
                <h3 className="info-title">Get in touch directly</h3>
                
                <div className="contact-methods">
                  
                  <div className="contact-method">
                    <div className="method-icon">📧</div>
                    <div className="method-details">
                      <div className="method-label">Email</div>
                      <a href="mailto:hello@cedarheightsmusic.com" className="method-link">
                        hello@cedarheightsmusic.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">📞</div>
                    <div className="method-details">
                      <div className="method-label">Phone</div>
                      <a href="tel:+1-250-555-0123" className="method-link">
                        (250) 555-0123
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">🕐</div>
                    <div className="method-details">
                      <div className="method-label">Hours</div>
                      <div className="method-text">
                        By appointment<br/>
                        Monday - Saturday
                      </div>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">📍</div>
                    <div className="method-details">
                      <div className="method-label">Service Area</div>
                      <div className="method-text">
                        Cedar Heights, Nanaimo<br/>
                        British Columbia
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="contact-cta">
                  <p className="cta-text">
                    Ready to start your musical journey?
                  </p>
                  <Button variant="primary" onClick={onEnrollClick} className="primary-cta">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage