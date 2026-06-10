/* ============================================================
   Portfolio – Main Script
   Vanilla JS · ES6+ · No Dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------------------------------------
     Utility helpers
  ---------------------------------------------------------- */

  /** Debounce – returns a debounced version of `fn`. */
  const debounce = (fn, delay = 15) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /** Safe querySelector – returns element or null without throwing. */
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ----------------------------------------------------------
     1. NAVIGATION – scroll‑aware styling
  ---------------------------------------------------------- */
  const nav = qs('.navbar');

  const handleNavScroll = () => {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // set initial state

  /* ----------------------------------------------------------
     1b. Smooth scroll for nav links & all anchor links
  ---------------------------------------------------------- */
  const allAnchorLinks = qsa('a[href^="#"]');

  allAnchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = qs(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     1c. Mobile hamburger menu
  ---------------------------------------------------------- */
  const hamburger = qs('.hamburger');
  const mobileMenu = qs('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    qsa('a', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* ----------------------------------------------------------
     1d. Active nav link highlighting based on scroll position
  ---------------------------------------------------------- */
  const sections = qsa('section[id]');
  const navItems = qsa('.navbar__link');

  const activateNavLink = () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    let currentSection = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', debounce(activateNavLink, 50), { passive: true });
  activateNavLink(); // initial check

  /* ----------------------------------------------------------
     2. TYPING EFFECT
  ---------------------------------------------------------- */
  const typingElement = qs('.typing-text');

  if (typingElement) {
    const designations = [
      'Python Developer',
      'AI/ML Engineer',
      'Backend Developer',
    ];

    const TYPING_SPEED = 100;   // ms per character typed
    const DELETING_SPEED = 50;  // ms per character deleted
    const PAUSE_DURATION = 2000; // ms pause after full word

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = designations[wordIndex];

      if (isDeleting) {
        charIndex--;
        typingElement.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        typingElement.textContent = currentWord.substring(0, charIndex);
      }

      let nextDelay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

      // Finished typing the word
      if (!isDeleting && charIndex === currentWord.length) {
        nextDelay = PAUSE_DURATION;
        isDeleting = true;
      }

      // Finished deleting the word
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % designations.length;
        nextDelay = 400; // brief pause before typing next word
      }

      setTimeout(type, nextDelay);
    };

    type();
  }

  /* ----------------------------------------------------------
     3. SCROLL ANIMATIONS (Intersection Observer)
     CSS uses .animate + .visible (not .animated)
  ---------------------------------------------------------- */
  const animateElements = qsa('.animate');

  if (animateElements.length) {
    const animateObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || 0;

            setTimeout(() => {
              el.classList.add('visible');
            }, Number(delay));

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    animateElements.forEach((el) => animateObserver.observe(el));
  }

  /* ----------------------------------------------------------
     4. SKILL BAR ANIMATIONS
     CSS class: .skill-bar-fill (also .skill-bar__fill)
  ---------------------------------------------------------- */
  const skillBars = qsa('.skill-bar-fill');

  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.dataset.width;

            if (targetWidth) {
              bar.style.width = targetWidth;
            }

            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.15 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  }

  /* ----------------------------------------------------------
     5. STAT COUNTER ANIMATIONS
  ---------------------------------------------------------- */
  const statNumbers = qsa('.stat-number');

  if (statNumbers.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 2000; // ~2 seconds
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease‑out quad for a polished feel
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        el.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + '+';
        }
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    statNumbers.forEach((num) => counterObserver.observe(num));
  }

  /* ----------------------------------------------------------
     6. CERTIFICATE CARDS – link to PDFs
  ---------------------------------------------------------- */
  const certCards = qsa('.cert-card');

  certCards.forEach((card) => {
    const pdfLink = card.dataset.pdf || card.querySelector('a[href$=".pdf"]')?.getAttribute('href');

    if (pdfLink) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Don't interfere if user clicked an explicit link inside the card
        if (e.target.closest('a')) return;
        window.open(pdfLink, '_blank', 'noopener');
      });
    }
  });

  /* ----------------------------------------------------------
     7. CONTACT FORM
  ---------------------------------------------------------- */
  const contactForm = qs('#contact-form');

  if (contactForm) {
    // Form submission – mailto approach
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = qs('[name="name"]', contactForm)?.value.trim() || '';
      const email = qs('[name="email"]', contactForm)?.value.trim() || '';
      const subject = qs('[name="subject"]', contactForm)?.value.trim() || 'Portfolio Contact';
      const message = qs('[name="message"]', contactForm)?.value.trim() || '';

      const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
      const mailto = `mailto:shikharyadav0503@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      window.location.href = mailto;

      // Show brief success feedback
      showFormSuccess();
    });
  }

  /** Display a temporary toast notification. */
  const showFormSuccess = () => {
    // Remove any existing toast
    const existing = qs('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast toast--success';
    toast.textContent = '✉ Opening your mail client…';
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('visible');
      });
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };

  /* ----------------------------------------------------------
     8. SCROLL INDICATOR (hero arrow)
  ---------------------------------------------------------- */
  const scrollIndicator = qs('.scroll-indicator');

  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutSection = qs('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ----------------------------------------------------------
     9. PARALLAX EFFECT on hero background
  ---------------------------------------------------------- */
  const heroBg = qs('.hero__bg');

  if (heroBg) {
    const handleParallax = () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ----------------------------------------------------------
     10. BACK TO TOP button
  ---------------------------------------------------------- */
  const backToTop = qs('.back-to-top');

  if (backToTop) {
    const handleBackToTopVisibility = () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
    handleBackToTopVisibility();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     11. Inject keyframe for form success fade-in
  ---------------------------------------------------------- */
  if (!qs('#portfolio-keyframes')) {
    const style = document.createElement('style');
    style.id = 'portfolio-keyframes';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
});
