/**
 * Terms of Service Page Component
 * Static legal page with proper typography hierarchy and navigation
 */
const TermsPage = () => {
  return (
    <div className="terms-page">
      <section className="legal-page-section section">
        <div className="page-container">
          <div className="legal-content">
            
            <div className="legal-header">
              <h1 className="legal-title">Terms of Service</h1>
              <p className="legal-updated">Last updated: January 1, 2025</p>
            </div>

            <div className="legal-body">
              
              <section className="legal-section">
                <h2 className="legal-heading">Acceptance of Terms</h2>
                <p>
                  By accessing and using the services of Cedar Heights Music Academy, you accept and agree 
                  to be bound by the terms and provision of this agreement. If you do not agree to abide 
                  by the above, please do not use this service.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Lesson Policies</h2>
                
                <h3 className="legal-subheading">Scheduling and Attendance</h3>
                <ul>
                  <li>Lessons are scheduled on a weekly basis at a consistent time</li>
                  <li>Students are expected to attend all scheduled lessons</li>
                  <li>Regular attendance is essential for musical progress</li>
                </ul>

                <h3 className="legal-subheading">Cancellation Policy</h3>
                <ul>
                  <li>24-hour notice is required for lesson cancellations</li>
                  <li>Lessons cancelled with proper notice may be rescheduled within the same month</li>
                  <li>Lessons cancelled without proper notice will be charged as normal</li>
                  <li>Emergency cancellations will be considered on a case-by-case basis</li>
                </ul>

                <h3 className="legal-subheading">Make-up Lessons</h3>
                <ul>
                  <li>Make-up lessons are offered for student cancellations with 24-hour notice</li>
                  <li>Teacher cancellations will automatically be rescheduled at no charge</li>
                  <li>Make-up lessons must be scheduled within the same calendar month</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Payment Terms</h2>
                <ul>
                  <li>Tuition is due monthly in advance</li>
                  <li>Payment is due by the first lesson of each month</li>
                  <li>Late payments may result in suspension of lessons</li>
                  <li>A $25 fee will be charged for returned checks</li>
                  <li>Tuition rates are subject to change with 30 days notice</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Student Responsibilities</h2>
                <ul>
                  <li>Come to lessons prepared and on time</li>
                  <li>Bring all required materials (books, music, etc.)</li>
                  <li>Practice regularly between lessons</li>
                  <li>Treat the instructor and studio with respect</li>
                  <li>Follow all studio policies and guidelines</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Termination of Services</h2>
                <p>
                  Either party may terminate lessons with two weeks written notice. Students who terminate 
                  mid-month will receive a prorated refund for unused lessons. Cedar Heights Music Academy 
                  reserves the right to terminate services immediately for non-payment or inappropriate behavior.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Liability</h2>
                <p>
                  Cedar Heights Music Academy is not responsible for personal injury or property damage 
                  that may occur on the premises. Students and parents participate in lessons at their own risk.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Intellectual Property</h2>
                <p>
                  All teaching materials, arrangements, and original compositions created by Cedar Heights 
                  Music Academy remain the intellectual property of the academy. Students may use these 
                  materials for personal practice and performance but may not distribute or reproduce them 
                  without permission.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Privacy and Recordings</h2>
                <p>
                  Lessons may occasionally be recorded for educational purposes with advance notice and consent. 
                  Student information will be kept confidential and used only for academy business purposes.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-heading">Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
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
                <h2 className="legal-heading">Changes to Terms</h2>
                <p>
                  Cedar Heights Music Academy reserves the right to modify these terms at any time. 
                  Changes will be effective immediately upon posting. Continued use of our services 
                  constitutes acceptance of any changes.
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

export default TermsPage