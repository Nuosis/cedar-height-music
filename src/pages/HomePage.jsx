import { useState, useEffect } from 'react'
import { Button, Card } from '../components/core.jsx'
import { Plus, X } from 'lucide-react'
import ValuePropsCarousel from '../components/ValuePropsCarousel.jsx'
import { useAvailability, useSiteConfig } from '../hooks/usePublicAPI.js'
import '../styles/homepage.css'

/**
 * Seasonal background system - determines background based on current date
 * Jun-Aug: Summer, Sep-Nov: Fall, Dec-Feb: Winter, Mar-May: Summer fallback
 */
const getSeasonalBackground = () => {
  const currentDate = new Date()
  const month = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
  
  if (month >= 6 && month <= 8) {
    // Summer: June, July, August
    return {
      image: '/summer_bg_lrg.png',
      className: 'season-summer'
    }
  } else if (month >= 9 && month <= 11) {
    // Fall: September, October, November
    return {
      image: '/fall_bg.png',
      className: 'season-fall'
    }
  } else if (month >= 12 || month <= 2) {
    // Winter: December, January, February
    return {
      image: '/winter_bg_lrg.png',
      className: 'season-winter'
    }
  } else {
    // Spring fallback to Summer: March, April, May
    return {
      image: '/summer_bg_lrg.png',
      className: 'season-summer'
    }
  }
}

/**
 * FAQ Accordion Component
 */
const FAQAccordion = () => {
  const [activeItem, setActiveItem] = useState(null)

  const faqItems = [
    {
      id: 'faq-1',
      question: 'What age range do you teach?',
      answer: 'We welcome students of all ages, from young children (age 5+) to adults. Our teaching approach adapts to each student\'s developmental stage and learning style.'
    },
    {
      id: 'faq-2',
      question: 'How long are the lessons?',
      answer: 'Standard lessons are 30 minutes for most students. We also offer 45-minute and 60-minute sessions for advanced students or those who prefer longer sessions.'
    },
    {
      id: 'faq-3',
      question: 'What\'s your cancellation policy?',
      answer: 'We require 24-hour notice for cancellations. Lessons cancelled with proper notice can be rescheduled within the same month.'
    }
  ]

  const toggleItem = (itemId) => {
    setActiveItem(activeItem === itemId ? null : itemId)
  }

  const handleKeyDown = (e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleItem(itemId)
    }
  }

  return (
    <div className="accordion">
      {faqItems.map((item) => (
        <div key={item.id} className={`accordion-item ${activeItem === item.id ? 'active' : ''}`}>
          <div 
            className="accordion-header"
            tabIndex={0}
            role="button"
            aria-expanded={activeItem === item.id}
            aria-controls={`${item.id}-content`}
            onClick={() => toggleItem(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
          >
            <span className="accordion-question">{item.question}</span>
            <span className="accordion-icon">
              {activeItem === item.id ? (
                <X size={20} />
              ) : (
                <Plus size={20} />
              )}
            </span>
          </div>
          <div 
            id={`${item.id}-content`}
            className="accordion-content"
            style={{ display: activeItem === item.id ? 'block' : 'none' }}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Time Slot Chip Component
 */
const TimeSlotChip = ({ day, startTime, endTime, highlighted = false, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick({ day, startTime, endTime })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div 
      className={`slot-chip ${highlighted ? 'highlighted' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`${day} ${startTime} to ${endTime}${highlighted ? ' - Featured slot' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="day">{day}</div>
      <div className="time">
        <span className="start-time">{startTime}</span> • <span className="end-time">{endTime}</span>
      </div>
    </div>
  )
}

/**
 * Home Page Component
 */
const HomePage = ({ onEnrollClick }) => {
  const [seasonalBg, setSeasonalBg] = useState(null)
  
  const {
    data: siteConfig,
    isLoading: siteConfigLoading,
    error: siteConfigError
  } = useSiteConfig()

  // Fetch live calendar availability from the Cedar API.
  const {
    data: availabilitySlots,
    isLoading: slotsLoading,
    error: slotsError
  } = useAvailability()

  useEffect(() => {
    const bgInfo = getSeasonalBackground()
    setSeasonalBg(bgInfo)
  }, [])

  const handleSlotClick = (slotData) => {
    // For now, just open the enrollment modal
    // In Phase 4, this will pass the timeslot data to the modal
    console.log('Selected slot:', slotData)
    onEnrollClick()
  }

  const primaryTeacher = siteConfig?.teacher
  const teacherName = primaryTeacher?.name || 'Kaeden Ottenbreit'
  const teacherAbout = primaryTeacher?.about || 'At Cedar Heights Music Academy, every student receives focused one-on-one instruction shaped around their pace, goals, and confidence.'
  const instrumentNames = (siteConfig?.instruments || [])
    .filter((instrument) => instrument.active !== false)
    .map((instrument) => instrument.display_name || instrument.name)

  return (
    <div className="home-page">
      {/* Hero Section - Wireframe Compliant */}
      <section className="hero-section section" data-wireframe-section="home-hero" data-measurement-point="hero-section-height">
        <div className="page-container">
          
          {/* Hero Canvas - Centered content group within ~856px max width */}
          <div className="hero-content" data-measurement-point="hero-content-width" style={{ maxWidth: '856px', margin: '0 auto' }}>

            {/* Hero Stack - Foreground content group, decorative accent layer, background band */}
            <div className="hero-foreground" data-wireframe-section="hero-foreground">
              
              {/* Logo */}
              <div className="hero-logo" data-asset-container="hero-logo" data-measurement-point="logo-spacing">
                <img src="/logo.JPG" alt="Cedar Heights Music Academy" className="logo-image" />
              </div>
              
              {/* Tagline */}
              <div className="hero-tagline" data-typography-container="hero-tagline" data-measurement-point="tagline-spacing">
                Personal, one-on-one music lessons in Cedar & Nanaimo.
              </div>
              
              {/* Headline */}
              <h1 className="hero-headline" data-typography-container="hero-headline" data-measurement-point="headline-size">
                Where Your Musical Journey Begins
              </h1>
              
              {/* CTAs */}
              <div className="cta-group" data-measurement-point="cta-group-spacing">
                <Button
                  variant="primary"
                  onClick={onEnrollClick}
                  className="primary-cta"
                  data-measurement-point="primary-cta-size"
                >
                  Free Demo Lesson
                </Button>
              </div>
            </div>
            
            {/* Decorative Accents */}
            <div className="hero-decorative" data-wireframe-section="hero-decorative" data-asset-container="decorative-accents">
              {/* Soft glows/shape chips lightly behind content group */}
              <div className="decorative-accent accent-1"></div>
              <div className="decorative-accent accent-2"></div>
            </div>
          </div>
          
          {/* Seasonal Background */}
          <div
            className={`hero-background seasonal-background ${seasonalBg?.className || ''}`}
            data-asset-container="seasonal-background"
            data-measurement-point="background-coverage"
            style={{
              backgroundImage: seasonalBg?.image ? `url('${seasonalBg.image}')` : undefined
            }}
          ></div>
        </div>

        {/* Foreground Figure - anchored to section so feet stay on the road */}
        <div className="hero-figure" data-asset-container="boy-guitar-figure" data-measurement-point="figure-positioning">
          <img src="/boy+guitar.png" alt="" role="presentation" className="hero-character" />
        </div>
      </section>

      {/* Value Props Section - Carousel Implementation */}
      <section className="value-props-section section" data-wireframe-section="value-props" data-measurement-point="value-props-height">
        <div className="page-container">
          <ValuePropsCarousel />
        </div>
      </section>

      {/* About Teaser Section - Wireframe Compliant */}
      <section className="about-teaser-section section" data-wireframe-section="about-teaser" data-measurement-point="about-teaser-height" style={{ background: 'white' }}>
        <div className="page-container">
          <div className="two-column-grid" data-measurement-point="about-teaser-grid">
            
            {/* Left Column */}
            <div className="about-teaser-content" data-wireframe-section="about-teaser-text">
              <div className="eyebrow" data-typography-container="about-eyebrow">About the studio</div>
              <h2 className="section-heading" data-typography-container="about-heading">
                {siteConfigLoading ? 'Loading...' :
                 siteConfigError ? 'Personalized lessons from your dedicated teacher' :
                 `Personalized lessons from ${teacherName}`}
              </h2>
              <p className="section-description" data-typography-container="about-description">
                {siteConfigLoading ? 'Loading teacher information...' : teacherAbout}
              </p>
              {instrumentNames.length > 0 && (
                <div className="teacher-instruments" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Instruments:</strong> {instrumentNames.join(', ')}
                </div>
              )}
              <a href="/about#teacher" className="inline-link" data-typography-container="meet-teacher-link">
                Meet {teacherName}
              </a>
            </div>
            
            {/* Right Column */}
            <div className="about-teaser-image" data-asset-container="girl-guitar-collage" data-measurement-point="image-collage-size">
              <img src="/girl+guitar.png" alt="Student learning guitar" className="rounded-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Availability Snippet Section - Wireframe Compliant */}
      <section className="availability-section section" data-wireframe-section="availability-snippet" data-measurement-point="availability-height">
        <div className="page-container">
          <div className="availability-content" style={{ textAlign: 'center' }}>
            
            {/* Title */}
            <h2 className="section-heading" data-typography-container="availability-title">
              {slotsLoading ? 'Loading Availability...' : 'Availability'}
            </h2>
            
            {/* Slot Chips - Dynamic from API */}
            <div className="slots-grid" data-measurement-point="slots-grid-layout">
              {slotsLoading ? (
                // Loading state - show skeleton slots
                Array.from({ length: 6 }, (_, index) => (
                  <div key={`loading-${index}`} className="slot-chip loading" style={{ opacity: 0.6 }}>
                    <div className="day" data-typography-container="slot-day">Loading...</div>
                    <div className="time" data-typography-container="slot-time">
                      <span className="start-time">--:--</span> • <span className="end-time">--:--</span>
                    </div>
                  </div>
                ))
              ) : slotsError ? (
                <div className="no-slots-message" style={{ gridColumn: '1 / -1', padding: '2rem', color: '#444' }}>
                  <p>Live calendar availability is temporarily unavailable.</p>
                  <p>Please contact us to discuss scheduling options.</p>
                </div>
              ) : availabilitySlots && availabilitySlots.length > 0 ? (
                // Success state - show live calendar data
                availabilitySlots.slice(0, 6).map((slot, index) => {
                  const dayLabel = new Date(slot.start).toLocaleDateString([], {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })
                  const slotData = {
                    id: slot.availability_id,
                    day: dayLabel,
                    startTime: new Date(slot.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                    endTime: new Date(slot.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                    start: slot.start,
                    end: slot.end
                  }
                  
                  return (
                    <div
                      key={slot.availability_id || `slot-${index}`}
                      className="slot-chip"
                      data-wireframe-section={`time-slot-${index + 1}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${dayLabel}, ${slotData.startTime} to ${slotData.endTime}`}
                      onClick={() => handleSlotClick(slotData)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSlotClick(slotData)
                        }
                      }}
                    >
                      <div className="day" data-typography-container="slot-day">{dayLabel}</div>
                      <div className="time" data-typography-container="slot-time">
                        <span className="start-time">{slotData.startTime}</span> • <span className="end-time">{slotData.endTime}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                // No slots available
                <div className="no-slots-message" style={{ gridColumn: '1 / -1', padding: '2rem', color: '#666' }}>
                  <p>No available time slots at the moment.</p>
                  <p>Please contact us to discuss scheduling options.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* Micro-FAQ Section - Wireframe Compliant */}
      <section className="micro-faq-section section" data-wireframe-section="micro-faq" data-measurement-point="faq-height">
        <div className="page-container">
          <div className="faq-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* FAQ Header */}
            <h2 className="section-heading" data-typography-container="faq-heading" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Frequently Asked Questions
            </h2>
            
            {/* Inline Accordion */}
            <div className="accordion" data-measurement-point="accordion-width">
              <FAQAccordion />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
