import { Button, Card } from '../components/core.jsx'

/**
 * About Page Component
 * Matches wireframe specifications exactly with hero, studio story, teacher card, and CTA sections
 */
const AboutPage = ({ onEnrollClick }) => {
  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero-section section" data-wireframe-section="about-hero" data-measurement-point="about-hero-height">
        <div className="page-container">
          {/* Page Blueprints Main Headline - Line 163 */}
          <h1 className="about-hero-headline" data-typography-container="about-hero-headline" data-measurement-point="about-headline-size">
            Teaching music with heart and patience
          </h1>

          {/* Page Blueprints Hero Layout Structure - Lines 161-165 */}
          <div className="about-hero-content" data-measurement-point="about-hero-content">
            {/* Page Blueprints Call-to-Action - Lines 178-181 */}
            <div className="about-hero-cta" data-measurement-point="about-hero-cta">
              <Button
                variant="primary"
                onClick={onEnrollClick}
                className="primary-cta"
                data-measurement-point="about-primary-cta"
              >
                Free Demo Lesson
              </Button>
            </div>
          </div>

          {/* Page Blueprints Background Composition - Lines 165-177 */}
          <div className="about-hero-background" data-wireframe-section="about-hero-background">
            {/* Page Blueprints Central Element - Line 167: Group 255.png */}
            <div className="hero-background-shape" data-asset-container="group-255-background" data-measurement-point="background-shape-size"></div>
          </div>

          {/* Page Blueprints Character Illustration - Lines 169-173 */}
          <div className="hero-character-container" data-asset-container="girl-guitar-character" data-measurement-point="character-positioning">
            <img src="/girl&guitar.png" alt="" role="presentation" className="about-hero-character" />
          </div>
        </div>
      </section>

      {/* Studio Story Section */}
      <section className="studio-story-section section">
        <div className="page-container">
          <div className="two-column-grid">
            
            {/* Left Column Content */}
            <div className="studio-story-content">
              <div className="eyebrow">About us</div>
              
              <h2 className="section-heading">
                Master Music from the Core and Achieve Excellence
              </h2>
              
              <div className="studio-story-text">
                <p>At Cedar Heights Music Academy, we believe that every student has the potential to excel in music. Our personalized approach focuses on building strong fundamentals while nurturing each student's unique musical voice.</p>
                <p>Located in the heart of Cedar Heights, we're proud to serve the Nanaimo community with dedicated, one-on-one instruction that adapts to each student's learning style and goals.</p>
              </div>
              
              {/* Feature Highlights */}
              <div className="feature-highlights">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Private Lessons</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">All Ages Welcome</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image Cluster */}
            <div className="studio-story-images">
              <div className="image-cluster">
                
                {/* North Row: West ⅔, East ⅓ */}
                <div className="north-row">
                  <div className="cluster-image north-west">
                    <img src="/piano-teacher-student.jpg" alt="Piano teacher working with student" />
                  </div>
                  <div className="cluster-image north-east">
                    <img src="/guitar-lesson-teaching.jpg" alt="Guitar lesson instruction" />
                  </div>
                </div>
                
                {/* South Row: West ⅓, East ⅔ */}
                <div className="south-row">
                  <div className="cluster-image south-west">
                    <img src="/bass-lesson-instruction.jpg" alt="Bass lesson instruction" />
                  </div>
                  <div className="cluster-image south-east">
                    <img src="/music-lesson-general.jpg" alt="General music lesson" />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Card Section */}
      <section className="teacher-card-section section">
        <div className="page-container">
          <div className="teacher-card-container">
            
            <Card className="teacher-card">
              {/* Teacher Photo */}
              <div className="teacher-photo">
                <img src="/logo.JPG" alt="Cedar Heights Music Academy Teacher" className="teacher-image" />
              </div>
              
              <div className="teacher-info">
                <h3 className="teacher-name">Kaeden Ottenbreit</h3>
                
                <div className="teacher-instruments">
                  Piano, Guitar, Bass
                </div>
                
                <p className="teacher-bio">
                  Kaeden brings patience and expertise to every lesson. He specializes in helping beginners build confidence while challenging advanced students to reach new heights. 
                  Kaeden has already help many musicians and believes every student can find joy in music.
                </p>
                
                {/* Availability Chips */}
                <div className="teacher-availability">
                  <span className="availability-chip">Daytime Appointments Available</span>
                  <span className="availability-chip">Open Wed/Thu</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Compact CTA Band */}
      <section className="compact-cta-section section">
        <div className="page-container">
          <div className="compact-cta-content">
            <p className="cta-prompt">Ready to start?</p>
            <Button variant="primary" onClick={onEnrollClick} className="primary-cta">
              Enroll Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage