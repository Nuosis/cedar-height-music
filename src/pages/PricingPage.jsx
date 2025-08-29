import { useState } from 'react'
import { Button } from '../components/core.jsx'

/**
 * Pricing Page Component
 * Updated per WBS - simplified pricing with single monthly price and semester commitment
 */
const PricingPage = ({ onEnrollClick }) => {
  const [selectedBilling, setSelectedBilling] = useState('monthly')

  const billingOptions = [
    {
      id: 'monthly',
      period: 'Monthly',
      price: '$125/month',
      description: '4 lessons per month',
      popular: false
    },
    {
      id: 'semester',
      period: 'Semester',
      price: '$500/semester',
      description: '16 lessons, save $100',
      popular: true
    },
    {
      id: 'yearly',
      period: 'Yearly',
      price: '$1,200/year',
      description: '48 lessons, save $300',
      popular: false
    }
  ]

  const handleBillingChange = (billingId) => {
    setSelectedBilling(billingId)
  }

  const getIncludedFeatures = (frequency) => {
    const baseFeatures = [
      '30-minute one-on-one lessons',
      'Personalized lesson plans',
      'Progress tracking and feedback',
      'Flexible rescheduling (24hr notice)',
      'Performance opportunities'
    ]

    switch(frequency) {
      case 'semester':
        return [...baseFeatures, 'Mid-semester progress review', 'Semester recital participation']
      case 'yearly':
        return [...baseFeatures, 'Quarterly progress reviews', 'Two recital performances', 'Priority booking for popular time slots']
      default:
        return baseFeatures
    }
  }

  return (
    <div className="pricing-page">
      {/* Pricing Hero Section */}
      <section className="pricing-hero-section section">
        <div className="page-container">
          <div className="pricing-hero-content">
            
            <div className="hero-eyebrow">
              Transparent pricing
            </div>
            
            <h1 className="pricing-hero-headline">
              Quality music education that fits your family
            </h1>
            
            <p className="pricing-hero-subcopy">
              Clear, straightforward pricing with flexible payment options. No hidden fees, no surprises—just honest pricing for exceptional music instruction.
            </p>
          </div>
          
          {/* Background Elements */}
          <div className="pricing-hero-background">
            <div className="hero-background-base"></div>
            <div className="hero-seasonal-element"></div>
            
            <div className="pricing-decorative">
              <div className="musical-note-accent note-1">♪</div>
              <div className="musical-note-accent note-2">♫</div>
            </div>
          </div>
        </div>
      </section>

      {/* Billing Selector Section */}
      <section className="billing-selector-section section">
        <div className="page-container">
          <div className="billing-selector-content">
            
            <div className="billing-frequency-selector">
              <div className="billing-options">
                
                {billingOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`billing-option ${option.popular ? 'popular' : ''} ${selectedBilling === option.id ? 'selected' : ''}`}
                  >
                    {option.popular && (
                      <div className="popular-badge">Most Popular</div>
                    )}
                    
                    <input 
                      type="radio" 
                      id={option.id} 
                      name="billing-frequency" 
                      value={option.id} 
                      className="billing-radio"
                      checked={selectedBilling === option.id}
                      onChange={() => handleBillingChange(option.id)}
                    />
                    
                    <label htmlFor={option.id} className="billing-label">
                      <div className="billing-period">{option.period}</div>
                      <div className="billing-price">{option.price}</div>
                      <div className="billing-description">{option.description}</div>
                    </label>
                  </div>
                ))}
                
              </div>
            </div>
            
            <div className="pricing-details">
              <div className="pricing-breakdown">
                <h3 className="breakdown-title">What's included:</h3>
                <ul className="breakdown-list">
                  {getIncludedFeatures(selectedBilling).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              {/* Pricing Disclaimer */}
              <div className="pricing-disclaimer">
                <p className="disclaimer-text">
                  <strong>Price shown is per month; final price confirmed during enrollment.</strong><br/>
                  Commitment: current semester (aligned to school calendar)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Block Section */}
      <section className="pricing-cta-section section">
        <div className="page-container">
          <div className="pricing-cta-content">
            
            <h2 className="cta-heading">Ready to start your musical journey?</h2>
            <p className="cta-description">
              Choose your preferred payment plan and begin with a personalized lesson that fits your schedule and goals.
            </p>
            
            <div className="pricing-cta-buttons">
              <Button 
                variant="primary" 
                onClick={onEnrollClick}
                className="primary-cta"
              >
                Enroll Now
                <span className="cta-arrow">→</span>
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/contact'}
                className="secondary-cta"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage