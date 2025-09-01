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
  border-color: var(--color-primary-green);
}
.btn-secondary:hover {
  background: rgba(153, 227, 158, 0.1) !important;
  color: var(--color-dark-text) !important;
  border-color: var(--color-primary-green) !important;
}
.btn-secondary.selected {
  background: var(--color-primary-green) !important;
  color: var(--color-dark-text) !important;
  border-color: var(--color-primary-green) !important;
}

/* Time slot styles for modal - copied from homepage.css */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 636px;
  margin: 2rem auto;
  justify-items: center;
}

.slot-chip {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.slot-chip:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: var(--color-primary-green);
}

.slot-chip:focus-visible {
  outline: 2px solid var(--color-primary-green);
  outline-offset: 2px;
}

.slot-chip .day {
  font-weight: bold;
  font-size: 0.875rem;
  color: var(--color-dark-text);
  line-height: 1.2;
}

.slot-chip .time {
  font-size: 0.75rem;
  line-height: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.slot-chip .time .start-time {
  color: #4caf50;
  font-weight: 500;
}

.slot-chip .time .end-time {
  color: #ff5722;
  font-weight: 500;
}

/* Time slot chip selected state */
.slot-chip.selected {
  background: var(--color-primary-green) !important;
  border-color: var(--color-primary-green) !important;
}
.slot-chip.selected .day,
.slot-chip.selected .time {
  color: var(--color-dark-text) !important;
}

/* Responsive adjustments for modal time slots */
@media (max-width: 767px) {
  .slots-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    max-width: none;
  }
  
  .slot-chip {
    width: 100%;
    min-width: 150px;
    min-height: 80px;
    padding: 0.75rem;
  }
}

/* Enrollment form styles - similar to ComingSoon form */
.enrollment-form {
  max-width: 600px;
  margin: 0 auto;
}

.enrollment-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.enrollment-form .form-group {
  margin-bottom: 0.5rem;
}

.enrollment-form .form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-dark-text);
  font-size: 0.9rem;
}

.enrollment-form .form-input,
.enrollment-form .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: var(--border-radius-small);
  font-size: 1rem;
  font-family: var(--font-family-primary);
  background: white;
  color: var(--color-dark-text);
  transition: border-color var(--transition-normal);
  box-sizing: border-box;
}

.enrollment-form .form-input:focus,
.enrollment-form .form-select:focus {
  outline: none;
  border-color: var(--color-primary-green);
}

.enrollment-form .form-select {
  cursor: pointer;
}

/* Scrollable content area for the form */
.modal-step-scrollable {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.modal-step-scrollable::-webkit-scrollbar {
  width: 6px;
}

.modal-step-scrollable::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-step-scrollable::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-step-scrollable::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive form adjustments */
@media (max-width: 767px) {
  .enrollment-form .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .modal-step-scrollable {
    max-height: 350px;
  }
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
  border: 2px solid var(--color-primary-green);
  background: transparent;
  color: var(--color-dark-text);
}
.secondary-cta:hover {
  background: rgba(153, 227, 158, 0.1) !important;
  color: var(--color-dark-text) !important;
  border-color: var(--color-primary-green) !important;
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
  max-width: 800px;
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
.modal-close:hover { background: rgba(153, 227, 158, 0.1); }
.modal-title { font-size: 1.75rem; font-weight: 600; margin-bottom: .5rem; color: var(--color-dark-text); }
.modal-subtitle { font-size: 1rem; color: rgba(0,5,16,0.7); margin-bottom: 1.25rem; }
.progress-steps {
  display: flex; justify-content: space-between; margin-bottom: 1rem;
}
.progress-step {
  display: flex; flex-direction: column; align-items: center; flex: 1; position: relative;
}
.progress-step:not(:last-child)::after {
  content: ''; position: absolute; top: 15px; left: 60%; right: -40%; height: 2px; background: rgba(0,5,16,0.1); z-index: 1;
}
.progress-step.active:not(:last-child)::after,
.progress-step.completed:not(:last-child)::after { background: var(--color-primary-green); }
.step-number {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(0,5,16,0.1); color: rgba(0,5,16,0.6); display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: .875rem; margin-bottom: .5rem; position: relative; z-index: 2;
}
.progress-step.active .step-number, .progress-step.completed .step-number {
  background: var(--color-primary-green); color: var(--color-dark-text);
}
.step-label { font-size: .75rem; color: rgba(0,5,16,0.6); font-weight: 500; }
.progress-step.active .step-label, .progress-step.completed .step-label { color: var(--color-dark-text); }
.progress-bar { height: 4px; background: rgba(0,5,16,0.1); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary-green); width: 33.33%; transition: width var(--transition-normal); }

.enroll-modal-content { padding: 1.5rem 2rem; }
.modal-step { display: none; opacity: 0; transform: translateX(20px); transition: opacity var(--transition-normal), transform var(--transition-normal); }
.modal-step.active { display: block; opacity: 1; transform: translateX(0); }

.step-title { font-size: 1.5rem; font-weight: 600; color: var(--color-dark-text); margin-bottom: 0.5rem; }
.step-description { font-size: 1rem; color: rgba(0,5,16,0.7); margin-bottom: 1.5rem; }

.enroll-modal-footer {
  padding: 1.25rem 2rem 2rem 2rem; border-top: 1px solid rgba(0,5,16,0.1);
}
.modal-navigation { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.nav-button {
  padding: 0.75rem 1.5rem; border-radius: var(--border-radius-medium); font-weight: 600; cursor: pointer; transition: var(--transition-normal);
  border: none; min-height: 44px;
}
.back-button {
  background: #f5f5f5;
  color: var(--color-dark-text);
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.back-button:hover {
  background: #e8e8e8;
  border-color: var(--color-primary-green);
}
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
  const [selectedInstrument, setSelectedInstrument] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [formData, setFormData] = useState({
    studentName: '',
    studentAge: '',
    skillLevel: 'beginner',
    contactName: '',
    relation: 'parent',
    email: '',
    phone: ''
  })
  const dialogRef = useRef(null)

  const progressWidth = useMemo(() => `${((step - 1) / 2) * 100}%`, [step])

  // Mock available time slots
  const availableTimeSlots = [
    { day: 'Tuesday', startTime: '4:00 PM', endTime: '4:30 PM' },
    { day: 'Thursday', startTime: '6:00 PM', endTime: '6:30 PM' },
    { day: 'Saturday', startTime: '10:00 AM', endTime: '10:30 AM' }
  ]

  const handleInstrumentSelect = (instrument) => {
    setSelectedInstrument(instrument)
    // Auto-advance to next step
    setTimeout(() => setStep(2), 150) // Small delay for visual feedback
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    // Auto-advance to next step
    setTimeout(() => setStep(3), 150) // Small delay for visual feedback
  }

  const handleFormInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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
            <p className="step-description">Piano, Guitar, Bass</p>
            {/* Instrument selection with auto-advance */}
            <div role="group" aria-label="Instrument options" style={{ display: 'grid', gap: '0.75rem' }}>
              <Button
                variant="secondary"
                onClick={() => handleInstrumentSelect('piano')}
                className={selectedInstrument === 'piano' ? 'selected' : ''}
              >
                🎹 Piano
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleInstrumentSelect('guitar')}
                className={selectedInstrument === 'guitar' ? 'selected' : ''}
              >
                🎸 Guitar
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleInstrumentSelect('bass')}
                className={selectedInstrument === 'bass' ? 'selected' : ''}
              >
                🎸 Bass
              </Button>
            </div>
          </div>

          <div className={clsx('modal-step', step === 2 && 'active')}>
            <h3 className="step-title">Pick Your Preferred Time</h3>
            <p className="step-description">Choose from available time slots</p>
            
            {/* Time slot grid using same styling as HomePage */}
            <div className="slots-grid">
              {availableTimeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`slot-chip ${selectedTimeSlot === slot ? 'selected' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${slot.day} ${slot.startTime} to ${slot.endTime}`}
                  onClick={() => handleTimeSlotSelect(slot)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleTimeSlotSelect(slot)
                    }
                  }}
                >
                  <div className="day">{slot.day}</div>
                  <div className="time">
                    <span className="start-time">{slot.startTime}</span> • <span className="end-time">{slot.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={clsx('modal-step', step === 3 && 'active')}>
            <h3 className="step-title">Complete Your Enrollment</h3>
            <p className="step-description">Please provide student and contact information</p>
            
            <div className="modal-step-scrollable">
              <form className="enrollment-form">
                {/* Selection Summary */}
                <Card style={{ marginBottom: '1.5rem' }}>
                  <div><strong>Selected:</strong> {selectedInstrument ? selectedInstrument.charAt(0).toUpperCase() + selectedInstrument.slice(1) : '(not selected)'} • {selectedTimeSlot ? `${selectedTimeSlot.day} ${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}` : '(not selected)'}</div>
                </Card>

                {/* Student Information */}
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Student Information</h4>
                
                <div className="form-group">
                  <label htmlFor="studentName" className="form-label">Student Name *</label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleFormInputChange}
                    required
                    className="form-input"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="studentAge" className="form-label">Student Age *</label>
                    <input
                      type="number"
                      id="studentAge"
                      name="studentAge"
                      value={formData.studentAge}
                      onChange={handleFormInputChange}
                      required
                      min="3"
                      max="99"
                      className="form-input"
                      placeholder="Age"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="skillLevel" className="form-label">Skill Level</label>
                    <select
                      id="skillLevel"
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleFormInputChange}
                      className="form-select"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <h4 style={{ margin: '1.5rem 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Contact Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactName" className="form-label">Contact Name *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleFormInputChange}
                      required
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="relation" className="form-label">Relation to Student</label>
                    <select
                      id="relation"
                      name="relation"
                      value={formData.relation}
                      onChange={handleFormInputChange}
                      className="form-select"
                    >
                      <option value="parent">Parent</option>
                      <option value="guardian">Guardian</option>
                      <option value="self">Self</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormInputChange}
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormInputChange}
                    className="form-input"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </form>
            </div>
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

            {step === 3 ? (
              <Button
                variant="primary"
                as="button"
                className="nav-button"
                onClick={() => {
                  // Phase 4 will build URL & redirect; Phase 2 just closes
                  onClose?.()
                }}
              >
                Secure Your Spot Now!
              </Button>
            ) : null}
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