// Core Components Library — Phase 2 (Header, Footer, Buttons, Card, Enrollment Modal Shell)
// Implements wireframe-informed tokens, accessibility, and responsive behavior
// Exports: Header, Footer, Button, Card, EnrollmentModalShell

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { Squash as Hamburger } from 'hamburger-react'

// Inject component CSS (derived from wireframes) once
const CORE_STYLE_ID = 'chm-core-components-styles'
const CORE_CSS = `
/* === Core Components Styles (Phase 2) === */
:root {
  --chm-shadow-1: 0 2px 4px rgba(0,0,0,0.05);
  --chm-shadow-2: 0 4px 12px rgba(0,0,0,0.1);
}

/* Page container per wireframes */
.page-container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding-left: var(--content-padding-desktop);
  padding-right: var(--content-padding-desktop);
}
@media (max-width: 1199px) {
  .page-container {
    padding-left: var(--content-padding-tablet);
    padding-right: var(--content-padding-tablet);
  }
}
@media (max-width: 767px) {
  .page-container {
    padding-left: var(--content-padding-mobile);
    padding-right: var(--content-padding-mobile);
  }
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  min-height: 44px;
  padding: 12px 20px;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  border: 2px solid transparent;
}
.btn:focus-visible {
  outline: 2px solid var(--color-warm-yellow);
  outline-offset: 2px;
}
.btn-primary {
  background: var(--color-primary-green);
  color: var(--color-dark-text);
  box-shadow: var(--chm-shadow-1);
}
.btn-primary:hover {
  background: #3d8542;
  transform: translateY(-1px);
  box-shadow: var(--chm-shadow-2);
}
.btn-secondary {
  background: transparent;
  color: var(--color-dark-text);
  border-color: var(--color-dark-text);
}
.btn-secondary:hover {
  background: var(--color-dark-text);
  color: var(--color-warm-off-white);
}

/* Aliases mapped to wireframe class names (.primary-cta / .secondary-cta) */
.primary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  min-height: 44px;
  padding: 12px 20px;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  border: 2px solid transparent;
  background: var(--color-primary-green);
  color: var(--color-dark-text);
  box-shadow: var(--chm-shadow-1);
}
.primary-cta:hover {
  background: #3d8542;
  transform: translateY(-1px);
  box-shadow: var(--chm-shadow-2);
}
.primary-cta:focus-visible {
  outline: 2px solid var(--color-warm-yellow);
  outline-offset: 2px;
}
.secondary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  min-height: 44px;
  padding: 12px 20px;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  border: 2px solid var(--color-dark-text);
  background: transparent;
  color: var(--color-dark-text);
}
.secondary-cta:hover {
  background: var(--color-dark-text);
  color: var(--color-warm-off-white);
}
.secondary-cta:focus-visible {
  outline: 2px solid var(--color-warm-yellow);
  outline-offset: 2px;
}

/* Card */
.card {
  background: var(--color-warm-gold);
  border-radius: var(--border-radius-medium);
  padding: 1.5rem;
  box-shadow: var(--chm-shadow-1);
  transition: var(--transition-normal);
}
.card:hover {
  box-shadow: var(--chm-shadow-2);
  transform: translateY(-2px);
}

/* Header / Navigation */
.global-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-warm-off-white);
  border-bottom: 1px solid rgba(0, 5, 16, 0.1);
  box-shadow: var(--chm-shadow-1);
}
.global-header .nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 1rem 0;
}
.nav-brand .brand-link {
  text-decoration: none;
  color: var(--color-dark-text);
}
.nav-brand .wordmark {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: var(--font-family-display);
  letter-spacing: -0.025em;
}
.nav-menu {
  display: flex;
  align-items: center;
}
.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}
.nav-item {
  position: relative;
}
.nav-link {
  text-decoration: none;
  color: var(--color-dark-text);
  font-weight: 500;
  padding: 0.5rem 0;
  transition: var(--transition-normal);
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
.nav-link:hover {
  color: var(--color-primary-green);
}
.nav-link[aria-current="page"],
.nav-link.active {
  color: var(--color-primary-green);
  font-weight: 600;
}
.nav-link[aria-current="page"]::after,
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary-green);
  border-radius: 1px;
}
.enroll-cta {
  background: var(--color-primary-green);
  color: var(--color-dark-text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: var(--transition-normal);
}
.enroll-cta:hover {
  background: #3d8542;
}

/* Mobile nav */
.mobile-menu-toggle {
  display: none;
}
.mobile-menu {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-warm-off-white);
  border-top: 1px solid rgba(0, 5, 16, 0.1);
  box-shadow: var(--chm-shadow-2);
  transform: translateY(100%);
  transition: transform var(--transition-normal);
  z-index: 99;
}
.mobile-menu.active {
  transform: translateY(0);
}
.mobile-menu-content {
  padding: 1rem 0;
}
.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mobile-nav-item {
  border-bottom: 1px solid rgba(0, 5, 16, 0.05);
}
.mobile-nav-item:last-child {
  border-bottom: none;
}
.mobile-nav-link {
  display: block;
  padding: 1rem var(--content-padding-mobile);
  text-decoration: none;
  color: var(--color-dark-text);
  font-weight: 500;
  transition: var(--transition-normal);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  text-align: left;
}
.mobile-nav-link:hover,
.mobile-nav-link[aria-current="page"],
.mobile-nav-link.active {
  background: rgba(153, 227, 158, 0.1);
  color: var(--color-primary-green);
}
@media (max-width: 767px) {
  .nav-menu { display: none; }
  .mobile-menu-toggle { display: flex; }
  .mobile-menu { display: block; }
  .nav-brand .wordmark { font-size: 1.125rem; }
}
@media (max-width: 1199px) {
  .nav-list { gap: 1.5rem; }
}

/* Footer */
.global-footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: var(--color-warm-off-white);
  margin-top: var(--section-spacing-desktop);
  border-top: 3px solid var(--color-primary-green);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  padding: 4rem 0 2.5rem 0;
}
.footer-brand .footer-wordmark {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-family-display);
  color: var(--color-warm-off-white);
  display: block;
  margin-bottom: 1.25rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.footer-description {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(252, 244, 226, 0.85);
  margin: 0;
}
.footer-heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-warm-off-white);
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--color-primary-green);
  padding-bottom: 0.5rem;
  display: inline-block;
}
.footer-nav-list {
  list-style: none; margin: 0; padding: 0;
}
.footer-nav-item { margin-bottom: 0.75rem; }
.footer-nav-link {
  color: rgba(252, 244, 226, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-block;
  padding: 0.25rem 0;
  position: relative;
}
.footer-nav-link::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; width: 0; height: 2px;
  background: var(--color-primary-green);
  transition: width 0.3s ease;
}
.footer-nav-link:hover {
  color: var(--color-primary-green);
  transform: translateX(4px);
}
.footer-nav-link:hover::before { width: 100%; }
.footer-enroll-button {
  background: var(--color-primary-green) !important;
  color: var(--color-dark-text) !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  width: auto;
  text-align: center;
  padding: 0.5rem 1rem !important;
  display: inline-block;
  min-height: 36px;
}
.footer-enroll-button:hover {
  background: #3d8542 !important;
  transform: translateX(4px);
}
.footer-enroll-button:hover::before { display: none; }
.footer-bottom {
  border-top: 1px solid rgba(252, 244, 226, 0.2);
  padding: 2rem 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
}
.footer-social .social-links {
  display: flex; flex-direction: column; gap: 1rem;
}
.footer-social .social-link {
  color: rgba(252, 244, 226, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.1);
}
.footer-social .social-link:hover {
  color: var(--color-primary-green);
  background: rgba(153,227,158,0.1);
  border-color: var(--color-primary-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(153, 227, 158, 0.2);
}
@media (max-width: 1199px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    padding: 3rem 0 2rem 0;
  }
  .footer-brand { grid-column: 1 / -1; max-width: none; margin-bottom: 1.5rem; text-align: center; }
  .footer-social { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2.5rem 0 2rem 0;
  }
  .footer-brand, .footer-links, .footer-legal, .footer-social { text-align: center; }
}

/* Modal Shell */
.enroll-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.enroll-modal-container {
  background: white;
  border-radius: var(--border-radius-medium);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.enroll-modal-header {
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  position: relative;
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; font-size: 1.5rem; cursor: pointer;
  width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; transition: var(--transition-normal);
}
.modal-close:hover { background: rgba(0,0,0,0.08); }
.modal-title { font-size: 1.75rem; font-weight: 600; margin-bottom: .5rem; color: var(--color-dark-text); }
.modal-subtitle { font-size: 1rem; color: rgba(0,5,16,0.7); margin-bottom: 1.25rem; }
.progress-steps {
  display: flex; justify-content: space-between; margin-bottom: 1rem;
}
.progress-step {
  display: flex; flex-direction: column; align-items: center; flex: 1; position: relative;
}
.progress-step:not(:last-child)::after {
  content: ''; position: absolute; top: 15px; left: 60%; right: -40%; height: 2px; background: #e0e0e0; z-index: 1;
}
.progress-step.active:not(:last-child)::after,
.progress-step.completed:not(:last-child)::after { background: var(--color-primary-green); }
.step-number {
  width: 30px; height: 30px; border-radius: 50%;
  background: #e0e0e0; color: #666; display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: .875rem; margin-bottom: .5rem; position: relative; z-index: 2;
}
.progress-step.active .step-number, .progress-step.completed .step-number {
  background: var(--color-primary-green); color: var(--color-dark-text);
}
.step-label { font-size: .75rem; color: #666; font-weight: 500; }
.progress-step.active .step-label, .progress-step.completed .step-label { color: var(--color-dark-text); }
.progress-bar { height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary-green); width: 33.33%; transition: width var(--transition-normal); }

.enroll-modal-content { padding: 1.5rem 2rem; }
.modal-step { display: none; opacity: 0; transform: translateX(20px); transition: opacity var(--transition-normal), transform var(--transition-normal); }
.modal-step.active { display: block; opacity: 1; transform: translateX(0); }

.enroll-modal-footer {
  padding: 1.25rem 2rem 2rem 2rem; border-top: 1px solid rgba(0,0,0,0.1);
}
.modal-navigation { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.nav-button {
  padding: 0.75rem 1.5rem; border-radius: var(--border-radius-medium); font-weight: 600; cursor: pointer; transition: var(--transition-normal);
  border: none; min-height: 44px;
}
.back-button { background: #f0f0f0; color: #666; }
.back-button:hover { background: #e0e0e0; }
.nav-button:disabled { opacity: .5; cursor: not-allowed; }

@media (max-width: 767px) {
  .enroll-modal-container {
    max-width: none; width: 100%; height: 100%; max-height: 100vh; border-radius: 0; margin: 0;
  }
  .enroll-modal-header { padding: 1.5rem 1rem 1rem 1rem; }
  .enroll-modal-content { padding: 1.25rem 1rem; }
  .enroll-modal-footer { padding: 1rem; }
  .modal-navigation { flex-direction: column; gap: .75rem; }
  .nav-button { width: 100%; justify-content: center; }
}
`

function ensureCoreStylesInjected() {
  if (typeof document === 'undefined') return
  if (document.getElementById(CORE_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = CORE_STYLE_ID
  style.textContent = CORE_CSS
  document.head.appendChild(style)
}
ensureCoreStylesInjected()

// Button component (primary | secondary)
export function Button({ variant = 'primary', as = 'button', href, className, children, ...props }) {
  const Comp = href ? 'a' : as
  return (
    <Comp
      href={href}
      className={clsx('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

// Card primitive
export function Card({ className, children, ...props }) {
  return (
    <div className={clsx('card', className)} {...props}>
      {children}
    </div>
  )
}

// Header / Navigation
export function Header({ onEnrollClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close drawer on route change (NavLink handles navigation)
  useEffect(() => {
    const handler = () => setMobileOpen(false)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return (
    <header className="global-header">
      <nav className="main-navigation" role="navigation" aria-label="Main navigation">
        <div className="page-container">
          <div className="nav-container">
            <div className="nav-brand">
              <Link to="/" className="brand-link" aria-label="Cedar Heights Music Academy - Home">
                <span className="wordmark">Cedar Heights Music Academy</span>
              </Link>
            </div>

            <div className="nav-menu" aria-hidden={mobileOpen ? 'true' : 'false'}>
              <ul className="nav-list" role="menubar">
                <li className="nav-item" role="none">
                  <NavLink to="/" className="nav-link" role="menuitem">
                    <span>Home</span>
                  </NavLink>
                </li>
                <li className="nav-item" role="none">
                  <NavLink to="/about" className="nav-link" role="menuitem">
                    <span>About</span>
                  </NavLink>
                </li>
                <li className="nav-item" role="none">
                  <NavLink to="/pricing" className="nav-link" role="menuitem">
                    <span>Pricing</span>
                  </NavLink>
                </li>
                <li className="nav-item" role="none">
                  <button
                    type="button"
                    className="nav-link enroll-cta"
                    role="menuitem"
                    onClick={() => onEnrollClick?.()}
                  >
                    <span>Enroll</span>
                  </button>
                </li>
                <li className="nav-item" role="none">
                  <NavLink to="/contact" className="nav-link" role="menuitem">
                    <span>Contact</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="mobile-menu-toggle">
              <Hamburger
                toggled={mobileOpen}
                toggle={setMobileOpen}
                size={24}
                color="var(--color-dark-text)"
                duration={0.3}
                distance="sm"
                rounded
                label="Toggle mobile menu"
              />
            </div>
          </div>
        </div>

        <div className={clsx('mobile-menu', mobileOpen && 'active')} id="mobile-menu">
          <div className="mobile-menu-content">
            <ul className="mobile-nav-list" role="menu">
              <li className="mobile-nav-item" role="none">
                <NavLink to="/" className="mobile-nav-link" role="menuitem" onClick={() => setMobileOpen(false)}>
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="mobile-nav-item" role="none">
                <NavLink to="/about" className="mobile-nav-link" role="menuitem" onClick={() => setMobileOpen(false)}>
                  <span>About</span>
                </NavLink>
              </li>
              <li className="mobile-nav-item" role="none">
                <NavLink to="/pricing" className="mobile-nav-link" role="menuitem" onClick={() => setMobileOpen(false)}>
                  <span>Pricing</span>
                </NavLink>
              </li>
              <li className="mobile-nav-item" role="none">
                <button
                  type="button"
                  className="mobile-nav-link enroll-cta"
                  role="menuitem"
                  onClick={() => {
                    setMobileOpen(false)
                    onEnrollClick?.()
                  }}
                >
                  <span>Enroll</span>
                </button>
              </li>
              <li className="mobile-nav-item" role="none">
                <NavLink to="/contact" className="mobile-nav-link" role="menuitem" onClick={() => setMobileOpen(false)}>
                  <span>Contact</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

// Footer (Quick Links, Legal, Social)
export function Footer({ onEnrollClick }) {
  return (
    <footer className="global-footer" data-wireframe-section="global-footer">
      <div className="page-container">
        <div className="footer-content">
          <div className="footer-column footer-brand">
            <div className="footer-logo">
              <span className="footer-wordmark">Cedar Heights Music Academy</span>
            </div>
            <p className="footer-description">
              Personal, one-on-one music lessons in Cedar & Nanaimo. Nurturing young musicians in a supportive
              environment.
            </p>
          </div>

          <div className="footer-column footer-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <NavLink to="/about" className="footer-nav-link">About</NavLink>
              </li>
              <li className="footer-nav-item">
                <NavLink to="/pricing" className="footer-nav-link">Pricing</NavLink>
              </li>
              <li className="footer-nav-item">
                <button type="button" className="footer-nav-link footer-enroll-button" onClick={() => onEnrollClick?.()}>
                  Enroll
                </button>
              </li>
              <li className="footer-nav-item">
                <NavLink to="/contact" className="footer-nav-link">Contact</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-column footer-legal">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <NavLink to="/privacy" className="footer-nav-link">Privacy Policy</NavLink>
              </li>
              <li className="footer-nav-item">
                <NavLink to="/terms" className="footer-nav-link">Terms of Service</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-column footer-social">
            <h3 className="footer-heading">Connect</h3>
            <div className="social-links">
              <a href="mailto:hello@cedarheightsmusic.com" className="social-link" aria-label="Email us">
                <span className="social-icon">📧</span>
                <span className="social-text">hello@cedarheightsmusic.com</span>
              </a>
              <a href="tel:+1-250-555-0123" className="social-link" aria-label="Call us">
                <span className="social-icon">📞</span>
                <span className="social-text">(250) 555-0123</span>
              </a>
              <div className="social-link location-info" aria-label="Location">
                <span className="social-icon">📍</span>
                <span className="social-text">Cedar Heights, Nanaimo BC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom" data-wireframe-section="footer-copyright">
          <p className="copyright">Cedar Heights Music Academy © 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Enrollment Modal Shell (3-step: Instrument -> Time -> Review)
// Shell only (no data wiring). Keyboard/ARIA implemented.
export function EnrollmentModalShell({ open, onClose }) {
  const [step, setStep] = useState(1)
  const dialogRef = useRef(null)

  const progressWidth = useMemo(() => `${((step - 1) / 2) * 100}%`, [step])

  // Focus trap + Escape to close + body scroll lock
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    // autofocus first focusable
    setTimeout(() => {
      const first = dialogRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      first?.focus()
    }, 0)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="enroll-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="enroll-modal-title">
      <div className="enroll-modal-container" ref={dialogRef}>
        <div className="enroll-modal-header">
          <button className="modal-close" aria-label="Close enrollment modal" onClick={() => onClose?.()}>
            <span className="close-icon">×</span>
          </button>
          <h2 id="enroll-modal-title" className="modal-title">Start Your Musical Journey</h2>
          <p className="modal-subtitle">3 quick steps to get started</p>

          <div className="progress-indicator" aria-hidden="true">
            <div className="progress-steps">
              <div className={clsx('progress-step', step >= 1 && 'active', step > 1 && 'completed')} data-step="1">
                <span className="step-number">1</span>
                <span className="step-label">Instrument</span>
              </div>
              <div className={clsx('progress-step', step >= 2 && 'active', step > 2 && 'completed')} data-step="2">
                <span className="step-number">2</span>
                <span className="step-label">Time</span>
              </div>
              <div className={clsx('progress-step', step >= 3 && 'active')} data-step="3">
                <span className="step-number">3</span>
                <span className="step-label">Review</span>
              </div>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <div className="progress-fill" style={{ width: progressWidth }}></div>
            </div>
          </div>
        </div>

        <div className="enroll-modal-content">
          <div className={clsx('modal-step', step === 1 && 'active')}>
            <h3 className="step-title">Choose Your Instrument</h3>
            <p className="step-description">Piano, Guitar, Violin, Bass</p>
            {/* Placeholder grid (content wired in Phase 4) */}
            <div role="group" aria-label="Instrument options" style={{ display: 'grid', gap: '0.75rem' }}>
              <Button variant="secondary">🎹 Piano</Button>
              <Button variant="secondary">🎸 Guitar</Button>
              <Button variant="secondary">🎻 Violin</Button>
              <Button variant="secondary">🎸 Bass</Button>
            </div>
          </div>

          <div className={clsx('modal-step', step === 2 && 'active')}>
            <h3 className="step-title">Pick Your Preferred Time</h3>
            <p className="step-description">Available slots will appear here</p>
            <Card><strong>Week 1:</strong> Mock data placeholder</Card>
          </div>

          <div className={clsx('modal-step', step === 3 && 'active')}>
            <h3 className="step-title">Review & Confirm</h3>
            <p className="step-description">Review your selections then continue</p>
            <Card>
              <div>Instrument: <em>(selected later)</em></div>
              <div>Timeslot: <em>(selected later)</em></div>
              <div>Commitment: current semester</div>
            </Card>
          </div>
        </div>

        <div className="enroll-modal-footer">
          <div className="modal-navigation">
            <button
              className="nav-button back-button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              style={{ display: step > 1 ? 'inline-flex' : 'none' }}
            >
              ← Back
            </button>

            {step < 3 ? (
              <Button variant="primary" as="button" className="nav-button" onClick={() => setStep((s) => Math.min(3, s + 1))}>
                Next →
              </Button>
            ) : (
              <Button
                variant="primary"
                as="button"
                className="nav-button"
                onClick={() => {
                  // Phase 4 will build URL & redirect; Phase 2 just closes
                  onClose?.()
                }}
              >
                Complete Enrollment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default {
  Header,
  Footer,
  Button,
  Card,
  EnrollmentModalShell,
}