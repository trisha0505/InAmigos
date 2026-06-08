document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STICKY HEADER & SCROLL EFFECTS
  // ==========================================
  const header = document.querySelector('.header-area');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on load to catch current position

  // ==========================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      
      // Transform hamburger menu to "X"
      const spans = mobileToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu when clicking nav link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ==========================================
  // 3. PROJECTS FILTERING LOGIC
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and add to clicked
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Dynamic animation transition
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(10px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // ==========================================
  // 4. SCROLL-TRIGGERED STATS COUNT-UP
  // ==========================================
  const counters = document.querySelectorAll('.counter-number');
  const duration = 2000; // Animation duration in ms

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const start = 0;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = Math.floor(start + easedProgress * (target - start));
      
      // Format output with commas for large numbers
      el.textContent = currentVal.toLocaleString() + (el.getAttribute('data-suffix') || '');

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Set up Intersection Observer to trigger when visible
  const statsSection = document.querySelector('.impact-section');
  if (statsSection) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          counters.forEach(counter => animateCount(counter));
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }

  // ==========================================
  // 5. VOLUNTEER REGISTRATION MODAL
  // ==========================================
  const openModalBtns = document.querySelectorAll('.open-volunteer-modal');
  const closeModalBtn = document.querySelector('.modal-close-btn');
  const modalOverlay = document.querySelector('.modal-overlay');

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = 'auto'; // Restore background scrolling
    resetForm();
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Escape key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================
  // 6. FORM VALIDATION & SIMULATION
  // ==========================================
  const volunteerForm = document.getElementById('volunteerForm');
  const formAlert = document.getElementById('formAlert');

  const resetForm = () => {
    if (volunteerForm) {
      volunteerForm.reset();
      formAlert.style.display = 'none';
      formAlert.className = 'form-alert';
      formAlert.textContent = '';
      const submitBtn = volunteerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = 'Submit Application <i class="fa fa-paper-plane"></i>';
        submitBtn.disabled = false;
      }
    }
  };

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('volName').value.trim();
      const email = document.getElementById('volEmail').value.trim();
      const phone = document.getElementById('volPhone').value.trim();
      const project = document.getElementById('volProject').value;

      // Reset alert state
      formAlert.style.display = 'none';
      formAlert.className = 'form-alert';

      // Basic Validation
      if (!name || !email || !phone || !project) {
        formAlert.classList.add('error');
        formAlert.textContent = 'Please fill out all fields.';
        formAlert.style.display = 'block';
        return;
      }

      // Email Format Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formAlert.classList.add('error');
        formAlert.textContent = 'Please enter a valid email address.';
        formAlert.style.display = 'block';
        return;
      }

      // Phone Format Check (India format: 10 digits digits optional prefix)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/[\s-+]/g, '').slice(-10))) {
        formAlert.classList.add('error');
        formAlert.textContent = 'Please enter a valid 10-digit mobile number.';
        formAlert.style.display = 'block';
        return;
      }

      // If valid, show loading and simulate request
      const submitBtn = volunteerForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Processing... <i class="fa fa-spinner fa-spin"></i>';

      setTimeout(() => {
        // Success response
        formAlert.classList.add('success');
        formAlert.textContent = `Thank you, ${name}! Your application to join ${project} has been submitted successfully. Our coordinator will contact you at ${email} or ${phone} shortly.`;
        formAlert.style.display = 'block';
        
        submitBtn.innerHTML = 'Submitted <i class="fa fa-check"></i>';
        
        // Auto-close modal after 4 seconds
        setTimeout(() => {
          closeModal();
        }, 4000);
      }, 1500);
    });
  }
});
