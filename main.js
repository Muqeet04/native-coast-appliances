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

  /* ─────────────────────────────────────────
     HERO — entrance animation
     ───────────────────────────────────────── */
  const heroTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
  });

  heroTl
    .from('.hero__img', {
      scale: 1.2,
      duration: 2.2,
      ease: 'power2.out',
    })
    .from(
      '.hero__title-word',
      {
        yPercent: 130,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
      },
      '-=1.4'
    )
    .from(
      '.hero__sub',
      {
        y: 30,
        opacity: 0,
        duration: 0.9,
      },
      '-=0.5'
    )
    .from(
      '.hero__btn',
      {
        y: 20,
        opacity: 0,
        duration: 0.7,
      },
      '-=0.45'
    )
    .from(
      '.hero__scroll',
      {
        opacity: 0,
        duration: 1,
      },
      '-=0.3'
    );

  /* ═══════════════════════════════════════════
     SECTION 1 — SCROLL ANIMATION
     Pin the section and cycle through text panels
     ═══════════════════════════════════════════ */
  const scrollSection = document.querySelector('.scroll-anim');
  const scrollPanels = gsap.utils.toArray('.scroll-anim__panel');
  const scrollTexts = scrollPanels.map((p) => p.querySelector('.scroll-anim__text'));

  if (scrollSection && scrollPanels.length) {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSection,
        start: 'top top',
        // Pin for (N panels * 100vh) of scroll distance
        end: () => `+=${scrollPanels.length * window.innerHeight}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    // Animate each text: fade-in → hold → fade-out
    scrollTexts.forEach((text, i) => {
      // Fade in + slide up
      scrollTl.fromTo(
        text,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      // Hold visible
      scrollTl.to(text, { duration: 0.6 });

      // Fade out + slide up (skip for last panel — leave it visible)
      if (i < scrollTexts.length - 1) {
        scrollTl.to(text, {
          opacity: 0,
          y: -70,
          duration: 1,
          ease: 'power2.in',
        });
      }
    });

    // Subtle parallax on background image
    gsap.to('.scroll-anim__bg-img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ═══════════════════════════════════════════
     SECTION 2 — PICTURE BUFFER EFFECT
     Images transition from blurred to sharp on scroll
     ═══════════════════════════════════════════ */
  const bufferItems = document.querySelectorAll('.buffer__item');

  bufferItems.forEach((item) => {
    const imgWrap = item.querySelector('.buffer__img-wrap');

    ScrollTrigger.create({
      trigger: item,
      start: 'top 78%',
      once: true,
      onEnter() {
        imgWrap.classList.add('is-revealed');
        item.classList.add('is-revealed');
      },
    });
  });

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
     GALLERY — staggered reveal
     ───────────────────────────────────────── */
  const galleryItems = gsap.utils.toArray('.gallery__item');

  if (galleryItems.length) {
    gsap.from(galleryItems, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.gallery__grid',
        start: 'top 82%',
        once: true,
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
