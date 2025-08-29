import React, { useState, useEffect, useRef } from 'react'
import { sendContactEmails } from '../services/emailService.js'
import './ComingSoon.css'

/**
 * ComingSoon Component
 * Displays a maintenance mode placeholder with inquiry form when the site is under maintenance
 */
const ComingSoon = () => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    instrument: 'piano',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  
  // Refs for layout investigation
  const mainContentRef = useRef(null)
  const heroImageRef = useRef(null)
  const contentRightRef = useRef(null)

  // Layout investigation logging
  useEffect(() => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] LAYOUT INVESTIGATION - Component mounted`)
    
    if (mainContentRef.current && heroImageRef.current && contentRightRef.current) {
      const mainContent = mainContentRef.current
      const heroImage = heroImageRef.current
      const contentRight = contentRightRef.current
      
      // Log DOM structure
      console.log(`[${timestamp}] DOM STRUCTURE:`)
      console.log(`[${timestamp}] - Main content children count:`, mainContent.children.length)
      console.log(`[${timestamp}] - First child class:`, mainContent.children[0]?.className)
      console.log(`[${timestamp}] - Second child class:`, mainContent.children[1]?.className)
      
      // Log computed styles
      const mainStyles = window.getComputedStyle(mainContent)
      const heroStyles = window.getComputedStyle(heroImage)
      const contentStyles = window.getComputedStyle(contentRight)
      
      console.log(`[${timestamp}] COMPUTED STYLES:`)
      console.log(`[${timestamp}] - Main content display:`, mainStyles.display)
      console.log(`[${timestamp}] - Main content flex-direction:`, mainStyles.flexDirection)
      console.log(`[${timestamp}] - Hero image order:`, heroStyles.order)
      console.log(`[${timestamp}] - Content right order:`, contentStyles.order)
      console.log(`[${timestamp}] - Hero image flex:`, heroStyles.flex)
      console.log(`[${timestamp}] - Content right flex:`, contentStyles.flex)
      
      // Log positioning
      const mainRect = mainContent.getBoundingClientRect()
      const heroRect = heroImage.getBoundingClientRect()
      const contentRect = contentRight.getBoundingClientRect()
      
      console.log(`[${timestamp}] POSITIONING:`)
      console.log(`[${timestamp}] - Main content left:`, mainRect.left)
      console.log(`[${timestamp}] - Hero image left:`, heroRect.left)
      console.log(`[${timestamp}] - Content right left:`, contentRect.left)
      console.log(`[${timestamp}] - Hero image is left of content:`, heroRect.left < contentRect.left)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Music Lesson Inquiry - ${formData.instrument} (Age: ${formData.age})`,
        message: `Name: ${formData.name}
Age: ${formData.age}
Instrument: ${formData.instrument}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}

This inquiry was submitted through the maintenance mode form.`
      }

      await sendContactEmails(emailData)
      setSubmitStatus('success')
      setFormData({
        name: '',
        age: '',
        instrument: 'piano',
        email: '',
        phone: '',
        message: ''
      })
    } catch (error) {
      console.error('Failed to send inquiry:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="coming-soon">
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="coming-soon-header">
            <img src="/8th_note_red.png" alt="Cedar Heights Music Academy" className="coming-soon-logo" />
            <h1 className="coming-soon-title">Cedar Heights Music Academy</h1>
            <p className="coming-soon-tagline">Website Coming Soon</p>
            <p className="coming-soon-subtitle">Accepting new students</p>
          </div>
          
          <div className="main-content">
            <div className="hero-image">
              <img
                src="/boy+guitar.png"
                alt="Young student with guitar"
                className="student-image"
              />
            </div>

            <div className="content-right">
              <div className="coming-soon-message">
                <p className="coming-soon-description">
                  Piano, guitar, and bass lessons available.
                </p>
              </div>

              <div className="coming-soon-cta">
                <button
                  className="primary-cta"
                  onClick={() => setShowForm(!showForm)}
                >
                  Inquire Now
                  <span className="cta-arrow">→</span>
                </button>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="inquiry-form-section">
              <form onSubmit={handleSubmit} className="inquiry-form">
                <h3 className="form-title">Music Lesson Inquiry</h3>
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Student Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age" className="form-label">Student Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="3"
                      max="99"
                      className="form-input"
                      placeholder="Age"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="instrument" className="form-label">Instrument</label>
                    <select
                      id="instrument"
                      name="instrument"
                      value={formData.instrument}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="piano">Piano</option>
                      <option value="guitar">Guitar</option>
                      <option value="bass">Bass</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Contact Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number (optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="primary-cta"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="form-message success">
                    <p>Thank you! We'll contact you soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="form-message error">
                    <p>Please try again or contact us directly.</p>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ComingSoon