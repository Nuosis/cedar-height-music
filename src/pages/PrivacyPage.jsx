/**
 * Privacy Policy Page Component
 * Static legal page with proper typography hierarchy and navigation
 */
const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <section className="legal-page-section section">
        <div className="page-container">
          <div className="legal-content">
            
            <div className="legal-header">
              <h1 className="legal-title">Privacy Policy</h1>
              <p className="legal-updated">Last updated: January 1, 2025</p>
            </div>

            <div className="legal-body">
              
              <section className="legal-section">
                <h2 className="legal-heading">Information We Collect</h2>
                <p>
                  Cedar Heights Music Academy collects information you provide directly to us, such as when you:
                </p>
                <ul>
                  <li>Fill out our contact form or inquiry form</li>
                  <li>Enroll in music lessons</li>
                  <li>Communicate with us via email or phone</li>
                  <li>Subscribe to our newsletter or updates</li>
                </ul>
                <p>
                  The types of information we may collect include your name, email address, phone number, 
                  student information (name, age, instrument preferences), and any other information you 
                  choose to provide.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our music education services</li>
                  <li>Process enrollments and schedule lessons</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Communicate with you about services, offers, and events</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. We may share your information:
                </p>
                <ul>
                  <li>With your consent or at your direction</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety and the rights and safety of others</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Data Security</h2>
                <p>
                  We take reasonable measures to help protect your personal information from loss, theft, 
                  misuse, and unauthorized access, disclosure, alteration, and destruction. However, no 
                  internet or electronic storage system is 100% secure.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Contact Information</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="contact-block">
                  <p>
                    <strong>Cedar Heights Music Academy</strong><br/>
                    Email: <a href="mailto:hello@cedarheightsmusic.com">hello@cedarheightsmusic.com</a><br/>
                    Phone: <a href="tel:+1-250-555-0123">(250) 555-0123</a><br/>
                    Address: Cedar Heights, Nanaimo, BC
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

            </div>

            <div className="legal-footer">
              <a href="/" className="back-link">← Back to Home</a>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage