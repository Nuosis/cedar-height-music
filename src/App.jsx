import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Header, Footer, EnrollmentModalShell } from './components/core.jsx'
import { ENV } from './config/env.js'
import ComingSoon from './components/ComingSoon.jsx'

// Import page components
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'

function App() {
  const [showEnrollModal, setShowEnrollModal] = useState(false)

  const handleEnrollClick = () => {
    setShowEnrollModal(true)
  }

  const handleCloseModal = () => {
    setShowEnrollModal(false)
  }

  // If under maintenance, show only the ComingSoon component
  if (ENV.UNDER_MAINTENANCE) {
    return <ComingSoon />
  }

  return (
    <div className="app">
      <Header onEnrollClick={handleEnrollClick} />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage onEnrollClick={handleEnrollClick} />} />
          <Route path="/about" element={<AboutPage onEnrollClick={handleEnrollClick} />} />
          <Route path="/pricing" element={<PricingPage onEnrollClick={handleEnrollClick} />} />
          <Route path="/contact" element={<ContactPage onEnrollClick={handleEnrollClick} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>
      <Footer onEnrollClick={handleEnrollClick} />
      <EnrollmentModalShell open={showEnrollModal} onClose={handleCloseModal} />
    </div>
  )
}

export default App
