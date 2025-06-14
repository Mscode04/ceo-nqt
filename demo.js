// ==========================================================================
// DOM Elements
// ==========================================================================

const navToggle = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const floatingBtn = document.getElementById('chatbot-button');
const viewToggleBtn = document.querySelector('.view-toggle');
const imageGrid = document.querySelector('.image-grid');
const imageCarousel = document.querySelector('.image-carousel');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const skillBars = document.querySelectorAll('.skill-progress');
const timelineItems = document.querySelectorAll('.timeline-item');
const contactForm = document.querySelector('.newsletter-form');
const currentYear = document.getElementById('current-year');

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait = 20) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if an element is in the viewport
 * @param {Element} el - The element to check
 * @param {number} offset - Additional offset from the top/bottom
 * @returns {boolean} True if the element is in the viewport
 */
function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= offset
    );
}

/**
 * Smooth scroll to a target element
 * @param {string} target - The selector of the target element
 * @param {number} duration - The duration of the scroll animation
 */
function smoothScroll(target, duration = 800) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ==========================================================================
// Navigation
// ==========================================================================

// Toggle mobile navigation
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('nav-active');
});

// Close mobile menu when clicking a nav item
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('nav-active');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target === '#') return;
        
        smoothScroll(target);
        
        // Update URL without page jump
        if (history.pushState) {
            history.pushState(null, null, target);
        } else {
            location.hash = target;
        }
    });
});

// Change navigation style on scroll
window.addEventListener('scroll', debounce(() => {
    const nav = document.querySelector('.main-nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}));

// ==========================================================================
// Blog Section - Image View Toggle
// ==========================================================================

let currentView = 'grid';

viewToggleBtn.addEventListener('click', () => {
    const gridIcon = viewToggleBtn.querySelector('[data-view="grid"]');
    const carouselIcon = viewToggleBtn.querySelector('[data-view="carousel"]');
    
    if (currentView === 'grid') {
        // Switch to carousel view
        imageGrid.style.display = 'none';
        imageCarousel.style.display = 'block';
        gridIcon.style.display = 'none';
        carouselIcon.style.display = 'block';
        currentView = 'carousel';
        
        // Initialize carousel if not already active
        if (!document.querySelector('.carousel-slide.active')) {
            carouselSlides[0].classList.add('active');
        }
    } else {
        // Switch to grid view
        imageGrid.style.display = 'grid';
        imageCarousel.style.display = 'none';
        gridIcon.style.display = 'block';
        carouselIcon.style.display = 'none';
        currentView = 'grid';
    }
});

// ==========================================================================
// Carousel Functionality
// ==========================================================================

let currentSlide = 0;

function showSlide(index) {
    carouselSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
    showSlide(currentSlide);
}

carouselNext.addEventListener('click', nextSlide);
carouselPrev.addEventListener('click', prevSlide);

// Auto-advance carousel
let carouselInterval;
function startCarousel() {
    if (currentView === 'carousel') {
        carouselInterval = setInterval(nextSlide, 5000);
    }
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Start carousel when in carousel view
viewToggleBtn.addEventListener('click', () => {
    stopCarousel();
    if (currentView === 'carousel') {
        startCarousel();
    }
});

// Pause carousel on hover
imageCarousel.addEventListener('mouseenter', stopCarousel);
imageCarousel.addEventListener('mouseleave', startCarousel);

// Touch support for carousel
let touchStartX = 0;
let touchEndX = 0;

imageCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

imageCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
    }
}

// ==========================================================================
// Skill Bars Animation
// ==========================================================================

function animateSkillBars() {
    skillBars.forEach(bar => {
        if (isInViewport(bar, 100)) {
            const level = bar.getAttribute('data-level');
            bar.style.width = level;
            bar.removeAttribute('data-level'); // Prevent re-animation
        }
    });
}

// Initial check on load
animateSkillBars();

// Check on scroll
window.addEventListener('scroll', debounce(animateSkillBars));

// ==========================================================================
// Timeline Animation
// ==========================================================================

function animateTimeline() {
    timelineItems.forEach(item => {
        if (isInViewport(item, 100)) {
            item.classList.add('visible');
        }
    });
}

// Initial check on load
animateTimeline();

// Check on scroll
window.addEventListener('scroll', debounce(animateTimeline));

// ==========================================================================
// Floating Chatbot Button
// ==========================================================================

floatingBtn.addEventListener('click', () => {
    // This would be connected to your chatbot service
    console.log('Chatbot initiated');
    
    // Pulse animation for visual feedback
    floatingBtn.classList.add('pulse');
    setTimeout(() => {
        floatingBtn.classList.remove('pulse');
    }, 300);
});

// ==========================================================================
// Form Handling
// ==========================================================================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = contactForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email && validateEmail(email)) {
            // Here you would typically send the data to your server
            console.log('Subscribed with email:', email);
            
            // Show success feedback
            contactForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <p>Thanks for subscribing!</p>
                </div>
            `;
        } else {
            // Show error feedback
            emailInput.classList.add('error');
            setTimeout(() => {
                emailInput.classList.remove('error');
            }, 2000);
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==========================================================================
// Current Year in Footer
// ==========================================================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// ==========================================================================
// Scroll Reveal Animation
// ==========================================================================

// Initialize WOW.js if it's included
if (typeof WOW !== 'undefined') {
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: true,
        live: true
    }).init();
}

// Custom scroll reveal for elements without WOW.js
function scrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    revealElements.forEach(element => {
        if (isInViewport(element, 100)) {
            element.classList.add('revealed');
        }
    });
}

// Initial check on load
scrollReveal();

// Check on scroll
window.addEventListener('scroll', debounce(scrollReveal));

// ==========================================================================
// Page Load Animation
// ==========================================================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Start carousel if in carousel view initially
    if (currentView === 'carousel') {
        startCarousel();
    }
});

// ==========================================================================
// Responsive Adjustments
// ==========================================================================

function handleResponsiveChanges() {
    // Adjust timeline for mobile
    if (window.innerWidth <= 992) {
        document.querySelectorAll('.timeline-content').forEach(content => {
            content.style.width = 'calc(100% - 120px)';
            content.style.left = '80px';
        });
    } else {
        document.querySelectorAll('.timeline-item:nth-child(odd) .timeline-content').forEach(content => {
            content.style.width = 'calc(50% - 40px)';
            content.style.left = 'calc(50% + 20px)';
        });
        document.querySelectorAll('.timeline-item:nth-child(even) .timeline-content').forEach(content => {
            content.style.width = 'calc(50% - 40px)';
            content.style.left = '0';
        });
    }
}

// Initial check
handleResponsiveChanges();

// Check on resize
window.addEventListener('resize', debounce(handleResponsiveChanges));