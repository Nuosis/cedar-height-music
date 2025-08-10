import { useState } from 'react'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(false)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Create email body
    const emailBody = `
New Inquiry from Cedar Heights Music Academy Website

Parent/Student Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Preferred Time Slots:
1. ${formData.timeSlot1}
2. ${formData.timeSlot2}
3. ${formData.timeSlot3}

---
This inquiry was submitted via the Coming Soon page.
    `.trim()

    // Create mailto link
    const mailtoLink = `mailto:kaeden@cedarheightsmusicacademy.com?subject=New Music Academy Inquiry&body=${encodeURIComponent(emailBody)}`
    
    // Open email client
    window.location.href = mailtoLink
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      timeSlot1: '',
      timeSlot2: '',
      timeSlot3: ''
    })
    setShowForm(false)
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
                
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Parent/Student Name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                    required
                  />
                  <input
                    type="text"
                    name="timeSlot2"
                    placeholder="Second choice"
                    value={formData.timeSlot2}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="timeSlot3"
                    placeholder="Third choice"
                    value={formData.timeSlot3}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-button">
                    Send Inquiry
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowForm(false)}
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
