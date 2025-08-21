import { useState } from 'react'
import './App.css'
import { sendContactEmails } from './services/emailService'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timeSlot1: '',
    timeSlot2: '',
    timeSlot3: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset previous status
    setSubmitStatus(null)
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      // Prepare contact data for email service
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: 'New Music Academy Inquiry',
        message: `
Preferred Time Slots:
1. ${formData.timeSlot1}
2. ${formData.timeSlot2}
3. ${formData.timeSlot3}

This inquiry was submitted via the Coming Soon page.
        `.trim()
      }

      // Send emails using Brevo service
      const result = await sendContactEmails(contactData)

      if (result.success) {
        setSubmitStatus('success')
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          timeSlot1: '',
          timeSlot2: '',
          timeSlot3: ''
        })
        
        // Hide form after a delay to show success message
        setTimeout(() => {
          setShowForm(false)
          setSubmitStatus(null)
        }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.errors.join('. ') || 'Failed to send inquiry. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage('Failed to send inquiry. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <div className="hero-section">
        <div className="content-wrapper">
          <div className="logo-section">
            <img src="/logo.JPG" alt="Cedar Heights Music Academy" className="academy-logo" />
          </div>
          
          <div className="coming-soon-container">
            <h1 className="coming-soon">Coming Soon</h1>
            <p className="tagline">Nurturing young musicians in a supportive environment</p>
          </div>

          <div className="cta-section">
            {!showForm ? (
              <button 
                className="cta-button"
                onClick={() => setShowForm(true)}
              >
                Inquire Now
              </button>
            ) : (
              <form className="inquiry-form" onSubmit={handleSubmit}>
                <h3>Get Started Today</h3>
                
                {submitStatus === 'success' && (
                  <div className="success-message">
                    <p>✅ Thank you! Your inquiry has been sent successfully.</p>
                    <p>You should receive a confirmation email shortly.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="error-message">
                    <p>❌ {errorMessage}</p>
                  </div>
                )}
                
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Parent/Student Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting || submitStatus === 'success'}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting || submitStatus === 'success'}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting || submitStatus === 'success'}
                    required
                  />
                </div>

                <div className="time-slots">
                  <label>Preferred Time Slots:</label>
                  <input
                    type="text"
                    name="timeSlot1"
                    placeholder="First choice (e.g., Monday 4-5 PM)"
                    value={formData.timeSlot1}
                    onChange={handleInputChange}
                    disabled={isSubmitting || submitStatus === 'success'}
                    required
                  />
                  <input
                    type="text"
                    name="timeSlot2"
                    placeholder="Second choice"
                    value={formData.timeSlot2}
                    onChange={handleInputChange}
                    disabled={isSubmitting || submitStatus === 'success'}
                    required
                  />
                  <input
                    type="text"
                    name="timeSlot3"
                    placeholder="Third choice"
                    value={formData.timeSlot3}
                    onChange={handleInputChange}
                    disabled={isSubmitting || submitStatus === 'success'}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting || submitStatus === 'success'}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowForm(false)
                      setSubmitStatus(null)
                      setErrorMessage('')
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <img src="/boy+guitar.png" alt="Boy with guitar" className="hero-image" />
      </div>
    </div>
  )
}

export default App
