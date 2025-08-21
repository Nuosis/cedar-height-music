/**
 * Cedar Heights Music Academy - Wireframe Interactive Script
 * Provides navigation and basic interaction for low-fidelity wireframes
 */

class WireframeController {
    constructor() {
        this.currentPage = 'home';
        this.enrollmentStep = 1;
        this.enrollmentData = {
            instrument: null,
            timeslot: null,
            billing: null
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEnrollmentFlow();
        this.setupFormInteractions();
        this.setupMobileMenu();
        this.setupAccessibility();
        
        // Show home page by default
        this.showPage('home');
        
        console.log('Cedar Heights Music Academy Wireframes Loaded');
    }

    /**
     * Navigation System
     */
    setupNavigation() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const pageId = href.replace('#', '');
                this.showPage(pageId);
                this.updateActiveNavLink(link);
            });
        });

        // CTA buttons that lead to enrollment
        const enrollButtons = document.querySelectorAll('[data-action="enroll"]');
        enrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('enroll');
                this.updateActiveNavLink(document.querySelector('[href="#enroll"]'));
            });
        });

        // Secondary CTAs
        const learnMoreButtons = document.querySelectorAll('[data-action="learn-more"]');
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('about');
                this.updateActiveNavLink(document.querySelector('[href="#about"]'));
            });
        });

        // View pricing buttons
        const pricingButtons = document.querySelectorAll('[data-action="pricing"]');
        pricingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('pricing');
                this.updateActiveNavLink(document.querySelector('[href="#pricing"]'));
            });
        });
    }

    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.wireframe-page');
        pages.forEach(page => page.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            
            // Reset enrollment flow if navigating to enrollment page
            if (pageId === 'enroll') {
                this.resetEnrollmentFlow();
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Announce page change for screen readers
            this.announcePageChange(pageId);
        }
    }

    updateActiveNavLink(activeLink) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Enrollment Flow Management
     */
    setupEnrollmentFlow() {
        this.setupInstrumentSelection();
        this.setupTimeslotSelection();
        this.setupBillingSelection();
        this.setupStepNavigation();
    }

    setupInstrumentSelection() {
        const instrumentOptions = document.querySelectorAll('input[name="instrument"]');
        instrumentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.enrollmentData.instrument = e.target.value;
                this.updateNextButton(1);
                this.updateEnrollmentSummary();
                
                // Simulate loading timeslots for selected instrument
                this.simulateTimeslotLoading();
            });
        });
    }

    setupTimeslotSelection() {
        const timeslotOptions = document.querySelectorAll('input[name="timeslot"]');
        timeslotOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.enrollmentData.timeslot = e.target.value;
                this.updateNextButton(2);
                this.updateEnrollmentSummary();
            });
        });

        // Day filter functionality
        const dayFilter = document.querySelector('.day-filter');
        if (dayFilter) {
            dayFilter.addEventListener('change', (e) => {
                this.filterTimeslotsByDay(e.target.value);
            });
        }
    }

    setupBillingSelection() {
        const billingOptions = document.querySelectorAll('input[name="billing-enroll"]');
        billingOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.enrollmentData.billing = e.target.value;
                this.updateCompleteButton();
                this.updateEnrollmentSummary();
            });
        });
    }

    setupStepNavigation() {
        // Next buttons
        const nextButtons = document.querySelectorAll('.next-btn');
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.enrollmentStep < 3) {
                    this.goToEnrollmentStep(this.enrollmentStep + 1);
                }
            });
        });

        // Back buttons
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.enrollmentStep > 1) {
                    this.goToEnrollmentStep(this.enrollmentStep - 1);
                }
            });
        });

        // Complete enrollment button
        const completeButton = document.querySelector('.complete-btn');
        if (completeButton) {
            completeButton.addEventListener('click', () => {
                this.completeEnrollment();
            });
        }
    }

    goToEnrollmentStep(step) {
        // Hide all steps
        const steps = document.querySelectorAll('.enrollment-step');
        steps.forEach(stepEl => stepEl.classList.remove('active'));

        // Show target step
        const targetStep = document.getElementById(`step-${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.enrollmentStep = step;
            this.updateProgressIndicator();
            
            // Announce step change
            this.announceStepChange(step);
        }
    }

    updateProgressIndicator() {
        // Update step indicators
        const stepIndicators = document.querySelectorAll('.step');
        stepIndicators.forEach((indicator, index) => {
            if (index + 1 <= this.enrollmentStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = (this.enrollmentStep / 3) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    updateNextButton(step) {
        const nextButton = document.querySelector(`#step-${step} .next-btn`);
        if (nextButton) {
            const hasSelection = this.hasRequiredSelection(step);
            nextButton.disabled = !hasSelection;
        }
    }

    updateCompleteButton() {
        const completeButton = document.querySelector('.complete-btn');
        if (completeButton) {
            const canComplete = this.enrollmentData.instrument && 
                               this.enrollmentData.timeslot && 
                               this.enrollmentData.billing;
            completeButton.disabled = !canComplete;
        }
    }

    hasRequiredSelection(step) {
        switch (step) {
            case 1:
                return !!this.enrollmentData.instrument;
            case 2:
                return !!this.enrollmentData.timeslot;
            case 3:
                return !!this.enrollmentData.billing;
            default:
                return false;
        }
    }

    updateEnrollmentSummary() {
        // Update summary display in step 3
        const instrumentSummary = document.querySelector('.selected-instrument');
        const timeslotSummary = document.querySelector('.selected-timeslot');
        const billingSummary = document.querySelector('.selected-billing');

        if (instrumentSummary && this.enrollmentData.instrument) {
            instrumentSummary.textContent = this.enrollmentData.instrument.toUpperCase();
        }

        if (timeslotSummary && this.enrollmentData.timeslot) {
            // Get the selected timeslot label
            const selectedOption = document.querySelector(`input[value="${this.enrollmentData.timeslot}"]`);
            if (selectedOption) {
                const label = selectedOption.nextElementSibling;
                const timeText = label.querySelector('.slot-time')?.textContent || this.enrollmentData.timeslot;
                timeslotSummary.textContent = timeText;
            }
        }

        if (billingSummary && this.enrollmentData.billing) {
            billingSummary.textContent = this.enrollmentData.billing.toUpperCase();
        }
    }

    simulateTimeslotLoading() {
        const timeslotGrid = document.querySelector('.timeslot-grid');
        const loadingState = document.querySelector('.loading-state');
        
        if (timeslotGrid && loadingState) {
            // Show loading state
            timeslotGrid.style.display = 'none';
            loadingState.classList.remove('hidden');
            
            // Simulate API call delay
            setTimeout(() => {
                loadingState.classList.add('hidden');
                timeslotGrid.style.display = 'grid';
                
                // Update timeslots based on selected instrument
                this.updateAvailableTimeslots();
            }, 1500);
        }
    }

    updateAvailableTimeslots() {
        // Simulate different available times based on instrument
        const timeslotCards = document.querySelectorAll('.timeslot-card');
        timeslotCards.forEach((card) => {
            const availability = card.querySelector('.slot-availability');
            if (availability) {
                // Randomly show some as unavailable for realism
                const isAvailable = Math.random() > 0.3;
                availability.textContent = isAvailable ? '[AVAILABLE]' : '[FULL]';
                availability.style.color = isAvailable ? '#28a745' : '#dc3545';
                
                // Disable unavailable options
                const input = card.previousElementSibling;
                if (input && input.type === 'radio') {
                    input.disabled = !isAvailable;
                    card.style.opacity = isAvailable ? '1' : '0.6';
                }
            }
        });
    }

    filterTimeslotsByDay(selectedDay) {
        const timeslotOptions = document.querySelectorAll('.timeslot-option');
        
        timeslotOptions.forEach(option => {
            const timeText = option.querySelector('.slot-time')?.textContent || '';
            
            if (selectedDay === '' || selectedDay === '[ALL DAYS]') {
                option.style.display = 'block';
            } else {
                const dayMatch = timeText.toLowerCase().includes(selectedDay.toLowerCase().replace('[', '').replace(']', ''));
                option.style.display = dayMatch ? 'block' : 'none';
            }
        });
    }

    completeEnrollment() {
        // Simulate enrollment completion
        const completeButton = document.querySelector('.complete-btn');
        if (completeButton) {
            completeButton.textContent = '[REDIRECTING...]';
            completeButton.disabled = true;
            
            // Simulate redirect to protected app
            setTimeout(() => {
                alert('WIREFRAME: Would redirect to protected app with enrollment data:\n\n' + 
                      JSON.stringify(this.enrollmentData, null, 2));
                
                // Reset for demo purposes
                this.resetEnrollmentFlow();
                completeButton.textContent = '[COMPLETE ENROLLMENT]';
            }, 2000);
        }
    }

    resetEnrollmentFlow() {
        this.enrollmentStep = 1;
        this.enrollmentData = {
            instrument: null,
            timeslot: null,
            billing: null
        };
        
        // Reset form selections
        const allInputs = document.querySelectorAll('input[type="radio"]');
        allInputs.forEach(input => input.checked = false);
        
        // Reset buttons
        const nextButtons = document.querySelectorAll('.next-btn');
        nextButtons.forEach(btn => btn.disabled = true);
        
        const completeButton = document.querySelector('.complete-btn');
        if (completeButton) {
            completeButton.disabled = true;
        }
        
        // Show first step
        this.goToEnrollmentStep(1);
        this.updateEnrollmentSummary();
    }

    /**
     * Form Interactions
     */
    setupFormInteractions() {
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit(contactForm);
            });
        }

        // Billing frequency selectors on pricing page
        const billingOptions = document.querySelectorAll('input[name="billing"]');
        billingOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.updatePricingDisplay(e.target.value);
            });
        });
    }

    handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = '[SENDING...]';
        submitButton.disabled = true;
        
        setTimeout(() => {
            alert('WIREFRAME: Contact form would be submitted via Formspree:\n\n' + 
                  JSON.stringify(data, null, 2));
            
            // Reset form
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    updatePricingDisplay(billingFrequency) {
        // Simulate pricing updates based on billing frequency
        const pricingCards = document.querySelectorAll('.billing-card');
        pricingCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`input[value="${billingFrequency}"]`)?.nextElementSibling;
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    /**
     * Mobile Menu
     */
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
                mobileToggle.textContent = navMenu.classList.contains('mobile-open') ? '[✕]' : '[☰]';
            });
            
            // Close mobile menu when clicking nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('mobile-open');
                    mobileToggle.textContent = '[☰]';
                });
            });
        }
    }

    /**
     * Accessibility Features
     */
    setupAccessibility() {
        // Keyboard navigation for custom radio buttons
        const customRadios = document.querySelectorAll('.instrument-card, .timeslot-card, .billing-card');
        customRadios.forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const input = card.previousElementSibling;
                    if (input && input.type === 'radio') {
                        input.checked = true;
                        input.dispatchEvent(new Event('change'));
                    }
                }
            });
            
            // Make cards focusable
            card.setAttribute('tabindex', '0');
        });

        // Skip navigation link
        this.addSkipNavigation();
    }

    addSkipNavigation() {
        const skipNav = document.createElement('a');
        skipNav.href = '#main-content';
        skipNav.textContent = 'Skip to main content';
        skipNav.className = 'sr-only skip-nav';
        skipNav.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
        `;
        
        skipNav.addEventListener('focus', () => {
            skipNav.style.top = '6px';
        });
        
        skipNav.addEventListener('blur', () => {
            skipNav.style.top = '-40px';
        });
        
        document.body.insertBefore(skipNav, document.body.firstChild);
    }

    announcePageChange(pageId) {
        const pageNames = {
            'home': 'Home Page',
            'about': 'About Page',
            'pricing': 'Pricing Page',
            'enroll': 'Enrollment Page',
            'contact': 'Contact Page'
        };
        
        this.announceToScreenReader(`Navigated to ${pageNames[pageId] || pageId}`);
    }

    announceStepChange(step) {
        const stepNames = {
            1: 'Step 1: Instrument Selection',
            2: 'Step 2: Timeslot Selection',
            3: 'Step 3: Billing Selection'
        };
        
        this.announceToScreenReader(stepNames[step] || `Step ${step}`);
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

/** Initialize and apply high-fidelity behaviors */
document.addEventListener('DOMContentLoaded', () => {
    new WireframeController();
    applySeasonalBackground();
    setHeroCharacter();
});

/** Seasonal background selection using repository assets in /public */
function applySeasonalBackground() {
    try {
        const el = document.querySelector('.seasonal-background');
        if (!el) return;
        const month = new Date().getMonth();
        let file = 'summer_bg_lrg.png';
        if (month >= 8 && month <= 10) file = 'fall_bg_lrg.png';
        else if (month === 11 || month <= 1) file = 'winter_bg_lrg.png';
        const prefix = location.pathname.includes('/wireframes/') ? '../public/' : '/public/';
        el.style.backgroundImage = `url('${prefix}${file}')`;
    } catch (err) { void err; }
}

/** Hero character image selection */
function setHeroCharacter() {
    const img = document.querySelector('.hero-character');
    if (!img) return;
    const prefix = location.pathname.includes('/wireframes/') ? '../public/' : '/public/';
    const file = 'girl+guitar.png';
    img.src = `${prefix}${file}`;
    img.alt = img.alt || 'Young student playing guitar';
}

// Add mobile menu styles
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #fff;
            border: 3px solid #2c1810;
            flex-direction: column;
            padding: 1rem;
            display: none;
        }
        
        .nav-menu.mobile-open {
            display: flex;
        }
        
        .mobile-menu-toggle {
            display: block !important;
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);