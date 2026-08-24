/* ═══════════════════════════════════════════════════════════
   Native Coast Appliances — Main JavaScript
   GSAP ScrollTrigger animations + interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────
     NAV — scroll-aware background
     ───────────────────────────────────────── */
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate(self) {
      nav.classList.toggle('nav--scrolled', self.scroll() > 80);
    },
  });

  /* ─────────────────────────────────────────
     MOBILE MENU — hamburger toggle
     ───────────────────────────────────────── */
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu--open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ═══════════════════════════════════════════
     HERO — PINNED FRAME SCROLL ANIMATION
     Full viewport frame sequence controlled by scroll
     ═══════════════════════════════════════════ */
  const heroSection = document.querySelector('.hero-scroll');
  const canvas = document.getElementById('scrollCanvas');
  const introPanel = document.querySelector('.hero-scroll__panel--intro');
  const allPanels = gsap.utils.toArray('.hero-scroll__panel');
  const narrativePanels = allPanels.filter((p) => !p.classList.contains('hero-scroll__panel--intro'));

  if (heroSection && canvas) {
    const context = canvas.getContext('2d');
    const frameCount = 192;
    const currentFrame = (index) =>
      `frames/frame_${(index + 1).toString().padStart(4, '0')}.webp`;

    const images = [];
    const playhead = { frame: 0 };

    function render() {
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(playhead.frame))
      );
      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }

    // Preload first frame immediately
    const firstImg = new Image();
    firstImg.src = currentFrame(0);
    images[0] = firstImg;
    firstImg.onload = () => {
      render();
    };

    // Preload remaining frames in background
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images[i] = img;
    }

    // Hero entrance animation on initial page load
    if (introPanel) {
      gsap.from('.hero-scroll__tag', {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: 'power2.out',
      });
      gsap.from('.hero-scroll__title', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        delay: 0.35,
        ease: 'power3.out',
      });
      gsap.from('.hero-scroll__sub', {
        y: 25,
        opacity: 0,
        duration: 0.9,
        delay: 0.55,
        ease: 'power2.out',
      });
      gsap.from('.hero-scroll__indicator', {
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power2.out',
      });
    }

    // Pinned ScrollTrigger Timeline
    const scrollDistance = (narrativePanels.length + 1) * window.innerHeight * 1.2;
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      },
    });

    const totalDuration = 5;

    // 1. Scrub video frames from 0 to 191
    heroTl.to(
      playhead,
      {
        frame: frameCount - 1,
        ease: 'none',
        duration: totalDuration,
        onUpdate: render,
      },
      0
    );

    // 2. Fade out intro hero panel quickly at start of scroll
    if (introPanel) {
      heroTl.to(
        introPanel,
        {
          opacity: 0,
          y: -40,
          duration: 0.8,
          ease: 'power2.in',
        },
        0
      );
    }

    // 3. Stagger narrative panels across remaining timeline
    const panelInterval = (totalDuration - 0.9) / narrativePanels.length;

    narrativePanels.forEach((panel, i) => {
      const text = panel.querySelector('.hero-scroll__text');
      const cta = panel.querySelector('.hero-scroll__cta-btn');
      const startTime = 0.9 + i * panelInterval;

      // Reveal text
      heroTl.fromTo(
        text,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: panelInterval * 0.38, ease: 'power2.out' },
        startTime
      );

      // If last panel, also reveal CTA button
      if (cta) {
        heroTl.fromTo(
          cta,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: panelInterval * 0.3, ease: 'power2.out' },
          startTime + panelInterval * 0.2
        );
      }

      // Fade out (skip for last panel so it lingers until section unpins)
      if (i < narrativePanels.length - 1) {
        heroTl.to(
          text,
          {
            opacity: 0,
            y: -50,
            duration: panelInterval * 0.3,
            ease: 'power2.in',
          },
          startTime + panelInterval * 0.7
        );
      }
    });
  }

  /* ═══════════════════════════════════════════
     SECTION 2 — PICTURE BUFFER (CURSOR TRAIL)
     Dynamic image buffer trail on mouse/touch movement
     ═══════════════════════════════════════════ */
  const bufferStage = document.getElementById('bufferStage');
  const bufferTrail = document.getElementById('bufferTrail');

  if (bufferStage && bufferTrail) {
    const trailImages = [
      'peakpx (1).jpg',
      'peakpx (2).jpg',
      'peakpx (3).jpg',
      'peakpx (4).jpg',
      'peakpx (5).jpg',
      'peakpx (6).jpg',
      'peakpx (7).jpg',
      'peakpx (8).jpg',
      'peakpx (9).jpg',
      'peakpx (10).jpg',
      'peakpx (11).jpg',
      'peakpx (12).jpg',
      'peakpx (13).jpg',
      'peakpx.jpg',
    ];

    // Preload trail images
    trailImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let imageIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let zIndexCounter = 1;
    const threshold = 70; // Distance in pixels before spawning next image

    function spawnTrailItem(x, y) {
      const item = document.createElement('div');
      item.className = 'cursor-buffer__trail-item';

      const rot = (Math.random() * 14 - 7).toFixed(1); // -7deg to +7deg
      item.style.setProperty('--rot', `${rot}deg`);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.zIndex = ++zIndexCounter;

      const img = document.createElement('img');
      img.src = trailImages[imageIndex % trailImages.length];
      img.alt = 'Bespoke kitchen detail';
      imageIndex++;

      item.appendChild(img);
      bufferTrail.appendChild(item);

      // Trigger active state on next animation frame
      requestAnimationFrame(() => {
        item.classList.add('is-active');
      });

      // Maintain max 12 active items in DOM
      if (bufferTrail.children.length > 12) {
        const oldest = bufferTrail.firstElementChild;
        if (oldest) {
          oldest.classList.add('is-fading');
          setTimeout(() => oldest.remove(), 700);
        }
      }

      // Automatically fade out and remove item
      setTimeout(() => {
        if (item.parentNode) {
          item.classList.add('is-fading');
          setTimeout(() => {
            if (item.parentNode) item.remove();
          }, 700);
        }
      }, 2200);
    }

    function handlePointerMove(e) {
      const rect = bufferStage.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);

      if (clientX === null || clientY === null) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > threshold || (lastX === 0 && lastY === 0)) {
        spawnTrailItem(x, y);
        lastX = x;
        lastY = y;
      }
    }

    bufferStage.addEventListener('mousemove', handlePointerMove, { passive: true });
    bufferStage.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Initial auto-trail intro when scrolled into view
    ScrollTrigger.create({
      trigger: '#buffer',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const rect = bufferStage.getBoundingClientRect();
        const startX = rect.width * 0.2;
        const endX = rect.width * 0.8;
        const y = rect.height * 0.52;

        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const posX = startX + (endX - startX) * (i / 3);
            const posY = y + (i % 2 === 0 ? -25 : 25);
            spawnTrailItem(posX, posY);
          }, i * 260);
        }
      },
    });
  }

  /* ─────────────────────────────────────────
     CTA BANNER — staggered entrance
     ───────────────────────────────────────── */
  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner) {
    gsap.from('.cta-banner__title', {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: ctaBanner, start: 'top 72%', once: true },
    });

    gsap.from('.cta-banner__btn', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      delay: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: ctaBanner, start: 'top 72%', once: true },
    });

    gsap.from('.cta-banner__text', {
      y: 25,
      opacity: 0,
      duration: 0.7,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: { trigger: ctaBanner, start: 'top 72%', once: true },
    });
  }

  /* ─────────────────────────────────────────
     CRAFT CARDS — staggered fade-up
     ───────────────────────────────────────── */
  const craftCards = gsap.utils.toArray('.craft__card');

  if (craftCards.length) {
    gsap.from(craftCards, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.craft__grid',
        start: 'top 78%',
        once: true,
      },
    });
  }

  /* ─────────────────────────────────────────
     PROCESS STEPS — staggered slide-in
     ───────────────────────────────────────── */
  const processSteps = gsap.utils.toArray('.process__step');

  if (processSteps.length) {
    gsap.from(processSteps, {
      x: -30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.process__timeline',
        start: 'top 78%',
        once: true,
      },
    });
  }

  /* ─────────────────────────────────────────
     GALLERY — HORIZONTAL SCROLL ANIMATION
     Pin section and scrub gallery track horizontally
     ───────────────────────────────────────── */
  const galleryWrapper = document.getElementById('work');
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryProgressBar = document.getElementById('galleryProgressBar');

  if (galleryWrapper && galleryTrack) {
    const getScrollAmount = () => {
      const trackWidth = galleryTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(trackWidth - viewportWidth + 60);
    };

    gsap.to(galleryTrack, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: galleryWrapper,
        start: 'top top',
        end: () => `+=${galleryTrack.scrollWidth - window.innerWidth + window.innerHeight}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (galleryProgressBar) {
            galleryProgressBar.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });
  }

  /* ─────────────────────────────────────────
     CONTACT — split entrance
     ───────────────────────────────────────── */
  const contactSection = document.querySelector('.contact');

  if (contactSection) {
    gsap.from('.contact__info', {
      x: -40,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: contactSection, start: 'top 72%', once: true },
    });

    gsap.from('.contact__form-wrap', {
      x: 40,
      opacity: 0,
      duration: 0.9,
      delay: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: contactSection, start: 'top 72%', once: true },
    });
  }

  /* ─────────────────────────────────────────
     SMOOTH ANCHOR SCROLLING
     ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     CONTACT FORM — demo submit handler
     ───────────────────────────────────────── */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.contact__submit');
      const originalText = btn.textContent;

      btn.textContent = 'Message sent ✓';
      btn.style.background = 'var(--c-accent)';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }
});
