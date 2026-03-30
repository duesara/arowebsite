// =====================================
// ARO PHOTOGRAPHY - Main JavaScript
// =====================================
// Handles all interactive functionality across:
// - index.html (home page)
// - portfolio.html (portfolio & lightbox)
// - contact.html (contact form)
// - booking.html (booking form)
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initMobileNavigation();
  initNavbarScroll();

  // Load portfolio data if on portfolio.html
  const portfolioGallery = document.querySelector('#gallery-grid');
  if (portfolioGallery) {
    loadPortfolio();
  }

  // Load featured work if on index.html
  const featuredGrid = document.querySelector('#featured-grid');
  if (featuredGrid) {
    loadFeaturedWork();
  }

  initLightbox();
  initFormHandling();
  initScrollAnimations();
  initSmoothScroll();
  initActiveNavigation();
  initLazyLoading();
  initBackToTopButton();
});

// =====================================
// 1. MOBILE NAVIGATION
// =====================================
/**
 * Toggle hamburger menu and manage mobile navigation
 * - Toggle .mobile-menu open/closed
 * - Add/remove "active" class on .nav-toggle
 * - Close menu on link click
 * - Close menu on outside click
 * - Prevent body scroll when menu is open
 */
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-menu a');

  if (!navToggle || !mobileMenu) return;

  // Toggle menu open/closed
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking a nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  function toggleMenu() {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    navToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// =====================================
// 2. NAVBAR SCROLL EFFECT
// =====================================
/**
 * Add visual effect to navbar on scroll
 * - Add "scrolled" class when scrollY > 50px
 * - Remove when scrollY <= 50px
 * - CSS handles the visual styling (background opacity)
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// =====================================
// 3. PORTFOLIO FILTERING
// =====================================
/**
 * Filter gallery items by category
 * - Toggle "active" class on filter buttons
 * - Filter .gallery-item by data-category
 * - "all" shows everything
 * - Fade animation on filter change
 */
function initPortfolioFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items with animation
      filterItems(filter);
    });
  });

  function filterItems(filter) {
    galleryItems.forEach((item) => {
      const category = item.getAttribute('data-category');
      const matches = filter === 'all' || category === filter;

      if (matches) {
        // Fade in matching items
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        item.style.display = 'block';

        // Trigger animation
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        // Fade out non-matching items
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';

        // Hide after transition
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);
      }
    });
  }
}

// =====================================
// 4. LIGHTBOX
// =====================================
/**
 * Open gallery items in full-size lightbox
 * - Click gallery item to open lightbox
 * - Show image and caption
 * - Previous/Next buttons cycle through visible items
 * - Close with close button, ESC key, or backdrop click
 * - Prevent body scroll when open
 */
function initLightbox() {
  const lightbox = document.querySelector('#lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const lightboxCaption = document.querySelector('.lightbox__caption');
  const closeBtn = document.querySelector('.lightbox__close');
  const prevBtn = document.querySelector('.lightbox__prev');
  const nextBtn = document.querySelector('.lightbox__next');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg || galleryItems.length === 0) return;

  let currentIndex = 0;
  let visibleItems = Array.from(galleryItems);

  // Open lightbox on gallery item click
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Close lightbox
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      displayLightboxImage();
    });
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      displayLightboxImage();
    });
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  function openLightbox(index) {
    // Filter visible items (those with display !== 'none')
    visibleItems = Array.from(galleryItems).filter(
      (item) => item.style.display !== 'none'
    );

    // Find index in visible items
    currentIndex = visibleItems.findIndex((item) => item === galleryItems[index]);
    if (currentIndex === -1) currentIndex = 0;

    displayLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function displayLightboxImage() {
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item__title');
    const titleText = title ? title.textContent : '';

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = titleText;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// =====================================
// 5. FORM HANDLING
// =====================================
/**
 * Handle form submissions for contact and booking forms
 * - Validate required fields
 * - Show loading state
 * - Simulate submission (1.5s)
 * - Show success message
 * - Log form data
 */
function initFormHandling() {
  const contactForm = document.querySelector('#contact-form');
  const bookingForm = document.querySelector('#booking-form');

  if (contactForm) {
    handleForm(contactForm);
  }

  if (bookingForm) {
    handleForm(bookingForm);
  }

  function handleForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate form
      if (!validateForm(form)) {
        console.warn('Form validation failed');
        return;
      }

      // Get success message container - look for multiple possible locations
      let successMessage = form.nextElementSibling;
      if (!successMessage || (!successMessage.classList.contains('success-message') && !successMessage.classList.contains('booking-form-section__success'))) {
        // Try to find success message by ID or class
        successMessage = document.querySelector('#successMessage') || document.querySelector('#bookingSuccess') || form.parentElement.querySelector('.success-message') || form.parentElement.querySelector('.booking-form-section__success');
      }

      if (!successMessage) {
        console.warn('Success message element not found, form submitted anyway');
      }

      // Get submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      console.log('Form submitted:', data);

      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulate submission
      setTimeout(() => {
        // Hide form
        form.style.display = 'none';

        // Show success message with fade in
        if (successMessage) {
          successMessage.style.opacity = '0';
          successMessage.style.display = 'block';
          successMessage.removeAttribute('hidden');
          setTimeout(() => {
            successMessage.style.transition = 'opacity 0.4s ease';
            successMessage.style.opacity = '1';
          }, 10);
        }

        // Reset button (for potential re-use if form is shown again)
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Reset form fields
        form.reset();
      }, 1500);
    });
  }

  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        // For checkboxes/radios, check if at least one is checked
        const name = field.name;
        const checked = form.querySelector(`[name="${name}"]:checked`);
        if (!checked) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      } else {
        // For text inputs, email, etc.
        if (field.value.trim() === '') {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      }
    });

    return isValid;
  }
}

// =====================================
// 6. SCROLL ANIMATIONS
// =====================================
/**
 * Animate elements as they enter the viewport
 * - Observe elements with "animate-on-scroll" class
 * - Add "animated" class when visible
 * - Only animate once (unobserve after)
 * - CSS handles the actual animation
 */
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if (animateElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

// =====================================
// 7. SMOOTH SCROLL
// =====================================
/**
 * Smooth scroll to anchor links
 * - Handle all links with href starting with "#"
 * - Account for fixed navbar height (70px offset)
 */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');

    if (!link) return;

    const href = link.getAttribute('href');

    if (href === '#') {
      e.preventDefault();
      return;
    }

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    e.preventDefault();

    // Account for fixed navbar height (70px)
    const navbarHeight = 70;
    const targetPosition =
      targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  });
}

// =====================================
// 8. ACTIVE NAVIGATION HIGHLIGHTING
// =====================================
/**
 * Highlight current page in navigation
 * - Check current page URL
 * - Add "active" class to matching nav link
 */
function initActiveNavigation() {
  const navLinks = document.querySelectorAll('a[href]');

  if (navLinks.length === 0) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const linkPage = href.split('/').pop();

    if (linkPage === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// =====================================
// 9. LAZY LOADING IMAGES
// =====================================
/**
 * Lazy load images using IntersectionObserver
 * - Images should have data-src attribute
 * - Swap data-src to src when visible
 * - Uses blur placeholder initially (CSS handles styling)
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length === 0) return;

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.getAttribute('data-src');

          // Load the actual image
          img.src = dataSrc;
          img.removeAttribute('data-src');

          // Remove loading class after image loads
          img.addEventListener('load', () => {
            img.classList.remove('loading');
          });

          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  lazyImages.forEach((img) => {
    img.classList.add('loading');
    imageObserver.observe(img);
  });
}

// =====================================
// 10. BACK TO TOP BUTTON
// =====================================
/**
 * Show/hide back-to-top button based on scroll position
 * - Show when scrolled past 500px
 * - Smooth scroll to top on click
 */
function initBackToTopButton() {
  const backToTopBtn = document.querySelector('.back-to-top');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// =====================================
// 11. LOAD PORTFOLIO DATA
// =====================================
/**
 * Fetch portfolio-index.json and dynamically render gallery items
 * - Loads all portfolio items from the auto-generated index
 * - Generates filter buttons from categories
 * - Renders gallery items with overlays
 * - Supports existing filtering and lightbox functionality
 * - Shows error message if fetch fails
 */
async function loadPortfolio() {
  const galleryGrid = document.querySelector('#gallery-grid');
  const filterBar = document.querySelector('#filter-bar');

  if (!galleryGrid) return;

  try {
    // Fetch portfolio index
    const response = await fetch('_portfolio/portfolio-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const portfolioItems = await response.json();

    // Extract unique categories
    const categories = [...new Set(portfolioItems.map((item) => item.category))];

    // Clear loading message
    galleryGrid.innerHTML = '';

    // Generate filter buttons
    if (filterBar) {
      filterBar.innerHTML = '';

      // Add "All" button
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn filter-btn--active';
      allBtn.setAttribute('data-filter', 'all');
      allBtn.setAttribute('aria-pressed', 'true');
      allBtn.textContent = 'All';
      filterBar.appendChild(allBtn);

      // Add category buttons (capitalize first letter)
      categories.forEach((category) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', category);
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterBar.appendChild(btn);
      });
    }

    // Generate gallery items
    portfolioItems.forEach((item) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.setAttribute('data-category', item.category);

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt;
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item__overlay';

      const title = document.createElement('h3');
      title.className = 'gallery-item__title';
      title.textContent = item.title;

      const categoryLabel = document.createElement('p');
      categoryLabel.className = 'gallery-item__category';
      categoryLabel.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);

      overlay.appendChild(title);
      overlay.appendChild(categoryLabel);
      figure.appendChild(img);
      figure.appendChild(overlay);
      galleryGrid.appendChild(figure);
    });

    // Re-initialize filtering and lightbox after rendering
    initPortfolioFiltering();
    initLightbox();
  } catch (error) {
    console.error('Error loading portfolio:', error);
    galleryGrid.innerHTML = `
      <p style="text-align: center; color: #d32f2f; padding: 2rem; grid-column: 1 / -1;">
        Sorry, we couldn't load the portfolio. Please refresh the page.
      </p>
    `;
  }
}

/**
 * Fetch portfolio-index.json and render only featured items on home page
 * - Loads items where featured: true
 * - Renders simple gallery items without overlays
 * - Shows error message if fetch fails
 */
async function loadFeaturedWork() {
  const featuredGrid = document.querySelector('#featured-grid');

  if (!featuredGrid) return;

  try {
    // Fetch portfolio index
    const response = await fetch('_portfolio/portfolio-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const portfolioItems = await response.json();

    // Filter featured items
    const featuredItems = portfolioItems.filter((item) => item.featured === true);

    // Clear loading message
    featuredGrid.innerHTML = '';

    // Generate featured gallery items
    featuredItems.forEach((item) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt;
      img.loading = 'lazy';

      figure.appendChild(img);
      featuredGrid.appendChild(figure);
    });

    // Re-initialize lightbox for featured items
    initLightbox();
  } catch (error) {
    console.error('Error loading featured work:', error);
    featuredGrid.innerHTML = `
      <p style="text-align: center; color: #d32f2f; padding: 2rem; grid-column: 1 / -1;">
        Sorry, we couldn't load the featured work. Please refresh the page.
      </p>
    `;
  }
}

// =====================================
// END OF MAIN.JS
// =====================================
