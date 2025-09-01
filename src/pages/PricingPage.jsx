import { Button } from '../components/core.jsx'

/**
 * Pricing Page Component
 * Updated per core docs - simplified pricing with single monthly price and semester commitment
 * Removed billing frequency selector per 2025-08-28 update
 */
const PricingPage = ({ onEnrollClick }) => {
  // Single pricing model - no frequency selection needed
  const monthlyPrice = '$125'
  
  const includedFeatures = [
    '30-minute one-on-one lessons',
    'Personalized lesson plans',
    'Progress tracking and feedback'
  ]

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
              Clear, straightforward pricing with semester commitment. No hidden fees, no surprises—just honest pricing for exceptional music instruction.
            </p>
          </div>
          
          {/* Background Elements */}
          {/* <div className="pricing-hero-background">
            <div className="hero-background-base"></div>
            <div className="hero-seasonal-element"></div>
            
            <div className="pricing-decorative">
              <div className="musical-note-accent note-1">♪</div>
              <div className="musical-note-accent note-2">♫</div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Simplified Pricing Section */}
      <section className="pricing-display-section section">
        <div className="page-container">
          <div className="pricing-display-content">
            
            {/* Single Price Display */}
            <div className="single-price-display">
              <div className="price-card">
                <div className="price-amount">{monthlyPrice}</div>
                <div className="price-period">per month</div>
              </div>
            </div>
            
            <div className="pricing-details">
              <div className="pricing-breakdown">
                <h3 className="breakdown-title">What's included:</h3>
                <ul className="breakdown-list">
                  {includedFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              {/* Pricing Disclaimer */}
              <div className="pricing-disclaimer">
                <p className="disclaimer-text">
                  <strong>Commitment: current semester</strong><br/>
                  Final pricing confirmed during enrollment
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
              Begin with a personalized lesson that fits your schedule and goals. Commitment is for the current semester.
            </p>
            
            <div className="pricing-cta-buttons">
              <Button
                variant="primary"
                onClick={onEnrollClick}
                className="primary-cta"
              >
                Enroll Now
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