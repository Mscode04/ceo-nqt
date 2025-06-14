// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // ==========================================================================
  // Global Variables
  // ==========================================================================
  
  const body = document.body;
  const currentYear = new Date().getFullYear();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // Helper Functions
  // ==========================================================================

  /**
   * Debounce function to limit how often a function is called
   * @param {Function} func - The function to debounce
   * @param {number} wait - The delay in milliseconds
   * @returns {Function} - The debounced function
   */
  function debounce(func, wait = 10) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /**
   * Check if an element is in the viewport
   * @param {HTMLElement} el - The element to check
   * @param {number} offset - Additional offset from the viewport edges
   * @returns {boolean} - Whether the element is in the viewport
   */
  function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= offset &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) - offset &&
      rect.right >= offset
    );
  }

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');
  const floatingButton = document.getElementById('chatbot-button');
  const timelineProgress = document.querySelector('.timeline-progress');
  const ganttBars = document.querySelector('.gantt-bars');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const currentYearElement = document.getElementById('current-year');

  // ==========================================================================
  // Initialize Components
  // ==========================================================================

  // Set current year in footer
  if (currentYearElement) {
    currentYearElement.textContent = currentYear;
  }

  // Initialize WOW.js if not preferring reduced motion
  if (!prefersReducedMotion && typeof WOW !== 'undefined') {
    new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 100,
      mobile: true,
      live: true
    }).init();
  }

  // ==========================================================================
  // Navigation
  // ==========================================================================

  // Toggle mobile menu
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      body.classList.toggle('nav-active');
    });
  }

  // Close mobile menu when clicking a nav link
  navLinksItems.forEach(link => {
    link.addEventListener('click', function() {
      if (body.classList.contains('nav-active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('nav-active');
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', debounce(() => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinksItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  }));

  // ==========================================================================
  // Floating Chatbot Button
  // ==========================================================================

  if (floatingButton) {
    // Animate button on page load
    setTimeout(() => {
      floatingButton.style.transform = 'scale(1)';
    }, 1000);

    // Float animation
    if (!prefersReducedMotion) {
      setInterval(() => {
        floatingButton.classList.toggle('float');
      }, 3000);
    }

    // Click handler (placeholder - would connect to chatbot service)
    floatingButton.addEventListener('click', function() {
      // In a real implementation, this would open a chat interface
      console.log('Chatbot initiated');
      this.innerHTML = '<i class="fas fa-comment-dots"></i>';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-robot"></i>';
      }, 2000);
    });
  }

  // ==========================================================================
  // Experience Timeline
  // ==========================================================================

  if (timelineProgress) {
    // Animate timeline progress bar on scroll
    const animateTimeline = () => {
      const timelineContainer = document.querySelector('.timeline-container');
      if (isInViewport(timelineContainer, 100)) {
        timelineProgress.style.height = '100%';
        window.removeEventListener('scroll', animateTimeline);
      }
    };

    window.addEventListener('scroll', debounce(animateTimeline));
  }

  // Generate Gantt chart bars
  if (ganttBars) {
    // Sample data - in a real implementation, this would come from your actual experience
    const ganttData = [
      { skill: 'Skill Category 1', start: 2015, end: 2023, level: 80 },
      { skill: 'Skill Category 2', start: 2017, end: 2023, level: 90 },
      { skill: 'Skill Category 3', start: 2018, end: 2023, level: 75 },
      { skill: 'Skill Category 4', start: 2020, end: 2023, level: 85 }
    ];

    // Calculate the total timespan
    const minYear = 2015;
    const maxYear = 2023;
    const totalYears = maxYear - minYear;

    ganttData.forEach((item, index) => {
      const bar = document.createElement('div');
      bar.className = 'gantt-bar';
      
      // Calculate position and width
      const startPosition = ((item.start - minYear) / totalYears) * 100;
      const width = ((item.end - item.start) / totalYears) * 100;
      
      // Set styles
      bar.style.left = `${startPosition}%`;
      bar.style.width = `${width}%`;
      bar.style.top = `${index * (30 + 16)}px`; // 30px height + 16px gap
      bar.style.height = '30px';
      bar.style.backgroundColor = `hsl(${index * 60}, 70%, 50%)`;
      bar.style.opacity = item.level / 100;
      bar.style.position = 'absolute';
      bar.style.borderRadius = '4px';
      
      // Add tooltip
      bar.setAttribute('data-tooltip', `${item.skill}: ${item.start}-${item.end} (${item.level}% proficiency)`);
      
      ganttBars.appendChild(bar);
    });

    // Animate Gantt bars on scroll
    const animateGantt = () => {
      const ganttContainer = document.querySelector('.gantt-container');
      if (isInViewport(ganttContainer, 100)) {
        document.querySelectorAll('.gantt-bar').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.transform = 'scaleX(1)';
          }, i * 150);
        });
        window.removeEventListener('scroll', animateGantt);
      }
    };

    window.addEventListener('scroll', debounce(animateGantt));
  }

  // ==========================================================================
  // Blog Image Grid/Slider Toggle
  // ==========================================================================

  const viewSliderButtons = document.querySelectorAll('.view-slider-btn');
  viewSliderButtons.forEach(button => {
    button.addEventListener('click', function() {
      const imageGrid = this.closest('.blog-media').querySelector('.image-grid');
      imageGrid.classList.toggle('slider-mode');
      
      if (imageGrid.classList.contains('slider-mode')) {
        this.textContent = 'View as Grid';
        initImageSlider(imageGrid);
      } else {
        this.textContent = 'View as Slider';
        destroyImageSlider(imageGrid);
      }
    });
  });

  /**
   * Initialize a simple image slider
   * @param {HTMLElement} container - The container element with images
   */
  function initImageSlider(container) {
    const images = container.querySelectorAll('.grid-item');
    let currentIndex = 0;
    
    // Add slider controls
    const sliderControls = document.createElement('div');
    sliderControls.className = 'slider-controls';
    sliderControls.innerHTML = `
      <button class="slider-prev"><i class="fas fa-chevron-left"></i></button>
      <button class="slider-next"><i class="fas fa-chevron-right"></i></button>
      <div class="slider-dots"></div>
    `;
    container.appendChild(sliderControls);
    
    // Create dots
    const dotsContainer = sliderControls.querySelector('.slider-dots');
    images.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'slider-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    // Set up initial state
    images.forEach((img, index) => {
      img.style.transform = `translateX(${index * 100}%)`;
      img.style.transition = 'transform 0.5s ease';
    });
    
    // Previous button
    sliderControls.querySelector('.slider-prev').addEventListener('click', () => {
      goToSlide(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    });
    
    // Next button
    sliderControls.querySelector('.slider-next').addEventListener('click', () => {
      goToSlide(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    });
    
    // Go to specific slide
    function goToSlide(index) {
      images.forEach((img, i) => {
        img.style.transform = `translateX(${(i - index) * 100}%)`;
      });
      
      // Update dots
      document.querySelectorAll('.slider-dot').forEach(dot => {
        dot.classList.remove('active');
      });
      dotsContainer.children[index].classList.add('active');
      
      currentIndex = index;
    }
    
    // Auto-advance slides (if not preferring reduced motion)
    if (!prefersReducedMotion) {
      let slideInterval = setInterval(() => {
        goToSlide(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
      }, 5000);
      
      // Pause on hover
      container.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      container.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
          goToSlide(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
        }, 5000);
      });
    }
  }

  /**
   * Remove slider functionality and return to grid
   * @param {HTMLElement} container - The container element with images
   */
  function destroyImageSlider(container) {
    const sliderControls = container.querySelector('.slider-controls');
    if (sliderControls) {
      sliderControls.remove();
    }
    
    const images = container.querySelectorAll('.grid-item');
    images.forEach(img => {
      img.style.transform = '';
      img.style.transition = '';
    });
  }

  // ==========================================================================
  // Scroll Indicator
  // ==========================================================================

  if (scrollIndicator) {
    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > window.innerHeight * 0.5) {
        scrollIndicator.style.opacity = '0';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    }));
  }

  // ==========================================================================
  // Scroll to Top Button
  // ==========================================================================

  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.className = 'scroll-to-top';
  scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollToTopButton);

  // Show/hide based on scroll position
  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > window.innerHeight) {
      scrollToTopButton.style.opacity = '1';
      scrollToTopButton.style.pointerEvents = 'auto';
    } else {
      scrollToTopButton.style.opacity = '0';
      scrollToTopButton.style.pointerEvents = 'none';
    }
  }));

  // Scroll to top functionality
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================================================
  // Tooltips
  // ==========================================================================

  // Simple tooltip implementation for Gantt bars
  document.addEventListener('mouseover', function(e) {
    if (e.target.hasAttribute('data-tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = e.target.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      const updateTooltipPosition = () => {
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
      };
      
      updateTooltipPosition();
      
      // Handle mouse leave
      e.target.addEventListener('mouseleave', function onLeave() {
        tooltip.remove();
        e.target.removeEventListener('mouseleave', onLeave);
      }, { once: true });
    }
  });

  // ==========================================================================
  // Style the dynamically added elements
  // ==========================================================================

  const style = document.createElement('style');
  style.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: var(--accent-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      z-index: 90;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      box-shadow: var(--shadow-md);
    }
    
    .scroll-to-top:hover {
      background-color: var(--accent-dark);
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }
    
    .slider-controls {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      z-index: 2;
    }
    
    .slider-prev,
    .slider-next {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .slider-prev:hover,
    .slider-next:hover {
      background-color: var(--accent-color);
    }
    
    .slider-dots {
      display: flex;
      gap: 8px;
    }
    
    .slider-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .slider-dot.active {
      background-color: var(--accent-color);
      transform: scale(1.2);
    }
    
    .tooltip {
      position: fixed;
      background-color: var(--secondary-color);
      color: var(--text-color);
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.9rem;
      pointer-events: none;
      z-index: 100;
      transform: translateY(-5px);
      opacity: 0;
      animation: tooltipFadeIn 0.2s ease forwards;
    }
    
    @keyframes tooltipFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .float {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
});