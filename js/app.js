(() => {
  const year = document.querySelector("[data-year]");
  const progress = document.querySelector("[data-progress]");
  const topbar = document.querySelector("[data-topbar]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const liveStatus = document.querySelector("[data-live-status]");
  const desktopNav = document.querySelector("[data-desktop-nav]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (year) year.textContent = new Date().getFullYear();

  // -------------------------------------------------------
  // Scroll progress + subtle header state
  // -------------------------------------------------------
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;

    if (progress) {
      progress.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
    }

    if (topbar) {
      topbar.classList.toggle("is-scrolled", window.scrollY > 10);
    }
  };

  let scrollFrame = 0;
  const scheduleProgressUpdate = () => {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      updateProgress();
      scrollFrame = 0;
    });
  };

  updateProgress();
  window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
  window.addEventListener("resize", scheduleProgressUpdate);

  // -------------------------------------------------------
  // Accessible mobile menu
  // -------------------------------------------------------
  let lastFocusedElement = null;

  const setMenu = (open) => {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", String(open));
    mobileMenu.hidden = !open;
    menuButton.textContent = open ? "Cerrar" : "Menú";

    if (liveStatus) {
      liveStatus.textContent = open ? "Menú abierto" : "Menú cerrado";
    }

    if (open) {
      lastFocusedElement = document.activeElement;
      const firstLink = mobileMenu.querySelector("a");
      requestAnimationFrame(() => firstLink?.focus());
    } else if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        return;
      }

      // Simple focus trap while the full-screen mobile menu is open.
      if (
        event.key === "Tab" &&
        menuButton.getAttribute("aria-expanded") === "true"
      ) {
        const focusables = [menuButton, ...mobileMenu.querySelectorAll("a")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    });
  }

  // -------------------------------------------------------
  // Active-section navigation (scrollspy)
  // -------------------------------------------------------
  const sections = [...document.querySelectorAll("[data-section]")];
  const navLinks = [
    ...(desktopNav ? desktopNav.querySelectorAll('a[href^="#"]') : []),
    ...(mobileNav ? mobileNav.querySelectorAll('a[href^="#"]') : [])
  ];

  const markActive = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) markActive(visible.target.id);
      },
      {
        rootMargin: "-22% 0px -62% 0px",
        threshold: [0.05, 0.2, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // -------------------------------------------------------
  // Better anchor focus behavior for keyboard users
  // -------------------------------------------------------
  const scrollExperienceIntoFrame = (target) => {
    const focus = target.querySelector('.exp-hero-main') || target.querySelector('.exp-head');
    if (!focus) return false;

    const topbarHeight = topbar?.getBoundingClientRect().height || 0;
    const gap = window.innerWidth <= 780 ? 12 : 18;
    const destination = Math.max(0, window.scrollY + focus.getBoundingClientRect().top - topbarHeight - gap);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: destination,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
    return true;
  };

  // Main navigation should frame the first meaningful visual block of each
  // chapter, not the section boundary. Native anchor offsets were stacking
  // html scroll-padding with section scroll-margin and leaving the previous
  // chapter visible below the fixed header.
  const mainSectionFocus = {
    work: '.section-intro',
    system: '.section-intro',
    about: '.about-index',
    // Contact already has a deliberate section-level frame: keep the dark
    // chapter boundary visible immediately below the fixed header.
    contact: null
  };

  const scrollMainSectionIntoFrame = (target, id) => {
    if (!Object.prototype.hasOwnProperty.call(mainSectionFocus, id)) return false;
    const selector = mainSectionFocus[id];
    const focus = selector ? target.querySelector(selector) : target;
    if (!focus) return false;

    const topbarHeight = topbar?.getBoundingClientRect().height || 0;
    const gap = window.innerWidth <= 780 ? 12 : 18;
    const destination = Math.max(0, window.scrollY + focus.getBoundingClientRect().top - topbarHeight - gap);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: destination,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
    return true;
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      const isPrimaryNavLink = anchor.closest('[data-desktop-nav], [data-mobile-nav]');

      if (isPrimaryNavLink && Object.prototype.hasOwnProperty.call(mainSectionFocus, id)) {
        event.preventDefault();
        if (location.hash === `#${id}`) history.replaceState(null, '', `#${id}`);
        else history.pushState(null, '', `#${id}`);
        scrollMainSectionIntoFrame(target, id);
      }
      // Experience links land on the case's primary narrative block rather
      // than the outer section boundary. This keeps the kicker + headline
      // consistently framed even when the side column has a different height.
      else if (target.matches('[data-experience]')) {
        event.preventDefault();
        if (location.hash === `#${id}`) history.replaceState(null, '', `#${id}`);
        else history.pushState(null, '', `#${id}`);
        scrollExperienceIntoFrame(target);
      }

      // Keep the visual scroll behavior but do not steal focus for mouse/touch.
      if (anchor.matches(":focus-visible")) {
        requestAnimationFrame(() => {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        });
      }
    });
  });
})();

// -------------------------------------------------------
// CR Master motion background + PDF preview
// -------------------------------------------------------
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const crmSurface = document.querySelector('.crm-curated-media');
  const revealCards = [...document.querySelectorAll('.reveal-card')];
  const pdfModal = document.querySelector('[data-pdf-modal]');
  const pdfOpeners = [...document.querySelectorAll('[data-pdf-open]')];
  const pdfClosers = [...document.querySelectorAll('[data-pdf-close]')];
  const motionLayers = crmSurface ? [...crmSurface.querySelectorAll('[data-crm-motion-layer]')] : [];

  if (!window.gsap && 'IntersectionObserver' in window && revealCards.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    revealCards.forEach((card) => revealObserver.observe(card));
  } else {
    revealCards.forEach((card) => card.classList.add('is-visible'));
  }

  if (crmSurface && motionLayers.length && !reduceMotion) {
    const resetMotion = () => {
      motionLayers.forEach((layer) => {
        layer.style.transform = '';
      });
    };

    crmSurface.addEventListener('pointermove', (event) => {
      const rect = crmSurface.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) - 0.5;
      const py = ((event.clientY - rect.top) / rect.height) - 0.5;

      motionLayers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 1);
        const x = px * depth * 18;
        const y = py * depth * 14;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    });

    crmSurface.addEventListener('pointerleave', resetMotion);
  }

  let pdfReturnFocus = null;

  const setPdfModal = (open, opener = null) => {
    if (!pdfModal) return;
    const dialog = pdfModal.querySelector('[role="dialog"]');
    const closeButton = pdfModal.querySelector('.crm-pdf-close');

    if (open) {
      pdfReturnFocus = opener || document.activeElement;
      pdfModal.hidden = false;
      requestAnimationFrame(() => closeButton?.focus({ preventScroll: true }));
    } else {
      pdfModal.hidden = true;
      if (pdfReturnFocus instanceof HTMLElement) {
        requestAnimationFrame(() => pdfReturnFocus.focus({ preventScroll: true }));
      }
      pdfReturnFocus = null;
    }
  };

  pdfOpeners.forEach((btn) => btn.addEventListener('click', () => setPdfModal(true, btn)));
  pdfClosers.forEach((btn) => btn.addEventListener('click', () => setPdfModal(false)));
  document.addEventListener('keydown', (event) => {
    if (!pdfModal || pdfModal.hidden) return;

    if (event.key === 'Escape') {
      setPdfModal(false);
      return;
    }

    if (event.key === 'Tab') {
      const focusables = [...pdfModal.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.hasAttribute('disabled'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();

// -------------------------------------------------------
// Experience rail: keep orientation without changing identity
// -------------------------------------------------------
(() => {
  const wrapper = document.querySelector('[data-experiences]');
  const sections = [...document.querySelectorAll('[data-experience]')];
  const links = [...document.querySelectorAll('[data-experience-link]')];
  if (!wrapper || !sections.length || !links.length || !('IntersectionObserver' in window)) return;

  const wrapperObserver = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting);
    document.body.classList.toggle('is-in-experiences', visible);
  }, { threshold: 0.01, rootMargin: '-72px 0px -8% 0px' });
  wrapperObserver.observe(wrapper);

  const sectionObserver = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;

    document.body.classList.toggle('exp-rail-dark', active.target.classList.contains('exp-case-dark'));

    links.forEach((link) => {
      const isActive = link.dataset.experienceLink === active.target.id;
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { threshold: [0.08, 0.2, 0.45], rootMargin: '-20% 0px -55% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
})();

// -------------------------------------------------------
// FINAL MOTION SYSTEM — native scroll first
// One GSAP/ScrollTrigger orchestration layer. No pinning,
// no scrubbed content, no scroll hijacking.
// -------------------------------------------------------
(() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
  });

  const mm = gsap.matchMedia();

  const rootStyles = getComputedStyle(document.documentElement);
  const motionSeconds = (token, fallbackMs) => {
    const raw = rootStyles.getPropertyValue(token).trim();
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return fallbackMs / 1000;
    return raw.endsWith('ms') ? value / 1000 : value;
  };
  const MOTION = {
    reveal: motionSeconds('--motion-reveal', 320),
    editorial: motionSeconds('--motion-editorial', 520),
    major: motionSeconds('--motion-major', 760),
    stagger: motionSeconds('--motion-stagger', 55)
  };

  const reveal = (targets, trigger, options = {}) => {
    const els = gsap.utils.toArray(targets);
    if (!els.length || !trigger) return;

    const {
      x = 0,
      y = 28,
      scale = 1,
      duration = MOTION.reveal,
      stagger = MOTION.stagger,
      start = 'top 88%',
      ease = 'power3.out'
    } = options;

    gsap.from(els, {
      autoAlpha: 0,
      x,
      y,
      scale,
      duration,
      stagger,
      ease,
      immediateRender: false,
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: {
        trigger,
        start,
        once: true
      }
    });
  };

  mm.add(
    {
      desktop: '(min-width: 981px)',
      compact: '(max-width: 980px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;
      if (reduceMotion) return;

      // Hero: V2.13 intro owns the first entrance. Legacy entrance remains as a fallback
      // only when the V2.13 module is not active/resolved.
      const heroLines = gsap.utils.toArray('.hero-line > span');
      const v213IntroOwnsHero = document.documentElement.classList.contains('has-experience-intro') ||
        document.documentElement.classList.contains('intro-resolved');
      if (heroLines.length && !v213IntroOwnsHero) {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        gsap.set(heroLines, { yPercent: 112 });
        gsap.set('.hero-index > span, .hero-copy .kicker, .hero-description, .hero-side-block, .signal-strip > span', {
          autoAlpha: 0,
          y: 14
        });

        heroTl
          .to('.hero-index > span', { autoAlpha: 1, y: 0, duration: .42, stagger: .045 }, 0)
          .to('.hero-copy .kicker', { autoAlpha: 1, y: 0, duration: .4 }, .06)
          .to(heroLines, { yPercent: 0, duration: MOTION.major, stagger: MOTION.stagger }, .1)
          .to('.hero-description', { autoAlpha: 1, y: 0, duration: MOTION.editorial }, .44)
          .to('.hero-side-block', { autoAlpha: 1, y: 0, duration: MOTION.editorial, stagger: MOTION.stagger }, .5)
          .to('.signal-strip > span', { autoAlpha: 1, y: 0, duration: MOTION.reveal, stagger: MOTION.stagger }, .62);
      }

      // Selected work.
      const workRows = gsap.utils.toArray('.project-row');
      if (workRows.length) {
        ScrollTrigger.batch(workRows, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.from(batch, {
            autoAlpha: 0,
            y: 22,
            duration: .54,
            stagger: .055,
            ease: 'power2.out',
            immediateRender: false,
            clearProps: 'transform,opacity,visibility'
          })
        });
      }

      // Shared headings for the four experience cases.
      gsap.utils.toArray('[data-experience]').forEach((section) => {
        const targets = section.querySelectorAll('.exp-head > *, .exp-hero-main > *, .exp-hero-side > *');
        reveal(targets, section.querySelector('.exp-head'), {
          y: 24,
          duration: .64,
          stagger: .045,
          start: 'top 86%'
        });
      });

      // TKOH / CR Master — evidence arrives, page remains native.
      const tkohStage = document.querySelector('#case-tkoh .exp-stage');
      if (tkohStage) {
        const shot = tkohStage.querySelector('.exp-product-shot');
        const annotations = tkohStage.querySelectorAll('.exp-annotations > div');
        if (shot) {
          gsap.from(shot, {
            autoAlpha: 0,
            y: 14,
            scale: .992,
            clipPath: 'inset(0 7% 0 0)',
            duration: .74,
            ease: 'power3.out',
            immediateRender: false,
            clearProps: 'transform,opacity,visibility,clipPath',
            scrollTrigger: { trigger: tkohStage, start: 'top 88%', once: true }
          });
        }
        reveal(annotations, tkohStage.querySelector('.exp-annotations'), { y: 18, duration: .48, stagger: .06, start: 'top 90%' });
      }
      reveal('#case-tkoh .exp-evidence', document.querySelector('#case-tkoh .exp-evidence-grid'), { y: 28, duration: .58, start: 'top 90%' });
      reveal('#case-tkoh .exp-sequence-list article', document.querySelector('#case-tkoh .exp-sequence-list'), { y: 18, duration: .48, start: 'top 90%' });
      reveal('#case-tkoh .exp-sequence-images figure', document.querySelector('#case-tkoh .exp-sequence-images'), { y: 26, scale: .99, duration: .56, start: 'top 91%' });

      // Amazon Magic Park — editorial native-scroll journey.
      gsap.utils.toArray('#case-amp [data-amp-moment]').forEach((moment, index) => {
        reveal(moment, moment, {
          x: desktop ? (index % 2 === 0 ? -20 : 20) : 0,
          y: desktop ? 0 : 18,
          duration: .52,
          stagger: 0,
          start: 'top 91%'
        });
      });
      reveal('#case-amp .amp-metrics article', document.querySelector('#case-amp .amp-metrics'), { y: 22, duration: .5, start: 'top 90%' });
      reveal('#case-amp .amp-operation-lines > div', document.querySelector('#case-amp .amp-operation-lines'), { x: 18, y: 0, duration: .46, stagger: .055, start: 'top 89%' });

      // 20 Prod — archive rhythm, no sticky-driven dependency.
      gsap.utils.toArray('#case-20prod .prod-archive-row').forEach((row, index) => {
        gsap.from(row, {
          autoAlpha: 0,
          y: 14,
          clipPath: 'inset(0 0 12% 0)',
          duration: .48,
          delay: index * .045,
          ease: 'power2.out',
          immediateRender: false,
          clearProps: 'transform,opacity,visibility,clipPath',
          scrollTrigger: { trigger: row, start: 'top 93%', once: true }
        });
      });
      reveal('#case-20prod .prod-social-images figure', document.querySelector('#case-20prod .prod-social-images'), { y: 26, scale: .992, duration: .58, start: 'top 92%' });

      // SUNAFIL — deliberately calmer.
      const sunaMain = document.querySelector('#case-visual .sunafil-documentary-main');
      if (sunaMain) {
        const photo = sunaMain.querySelector('img');
        const caption = sunaMain.querySelector('figcaption');
        if (photo) reveal(photo, sunaMain, { y: 10, scale: 1.01, duration: .76, stagger: 0, start: 'top 91%' });
        if (caption) reveal(caption, sunaMain, { y: 12, duration: .44, stagger: 0, start: 'top 89%' });
      }
      reveal('#case-visual .sunafil-verbs article', document.querySelector('#case-visual .sunafil-verbs'), { y: 14, duration: .5, stagger: .07, start: 'top 91%' });
      reveal('#case-visual .sunafil-documentary-grid figure', document.querySelector('#case-visual .sunafil-documentary-grid'), { y: 22, duration: .56, stagger: .08, start: 'top 92%' });

      // Ambient assets move in time, not as a function of scroll.
      // ScrollTrigger only pauses off-screen loops; it never controls the page.
      gsap.utils.toArray('[data-ambient-motion]').forEach((slot, index) => {
        const section = slot.closest('section') || slot.parentElement;
        if (!section || !desktop) return;

        const direction = index % 2 === 0 ? 1 : -1;
        const ambientTween = gsap.to(slot, {
          xPercent: direction * 1.8,
          yPercent: direction * -2.2,
          rotation: direction * .45,
          duration: 8 + (index % 4) * 1.1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          paused: true
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => self.isActive ? ambientTween.play() : ambientTween.pause()
        });
      });

      // MI SISTEMA — one-time entrance; interaction is handled independently below.
      const engine = document.querySelector('[data-system-engine]');
      if (engine) {
        const core = engine.querySelector('.system-core');
        const nodes = gsap.utils.toArray(engine.querySelectorAll('[data-system-node]'));
        const orbit = engine.querySelector('.system-engine-orbit');

        if (core) {
          gsap.from(core, {
            autoAlpha: 0, scale: .955, duration: .62, ease: 'power2.out', immediateRender: false,
            scrollTrigger: { trigger: engine, start: 'top 82%', once: true }
          });
        }

        if (nodes.length) {
          gsap.from(nodes, {
            autoAlpha: 0, y: desktop ? 18 : 12, duration: .52, stagger: .075, ease: 'power2.out', immediateRender: false,
            scrollTrigger: { trigger: engine, start: 'top 81%', once: true }
          });
        }

        if (orbit && desktop) {
          gsap.fromTo(orbit,
            { rotation: -24 },
            { rotation: 18, duration: 1.4, ease: 'power2.inOut', immediateRender: false,
              scrollTrigger: { trigger: engine, start: 'top 80%', once: true } }
          );
        }
      }

      reveal('.system-quote', document.querySelector('.system-quote'), { y: 28, duration: .66, stagger: 0, start: 'top 93%' });

      // PROFILE — hierarchy reveals once; no scroll-linked translation.
      reveal('.about-layout h2', document.querySelector('.about-layout h2'), { y: 30, duration: .68, stagger: 0, start: 'top 90%' });
      reveal('.about-copy p', document.querySelector('.about-copy'), { y: 16, duration: .48, stagger: .075, start: 'top 91%' });
      reveal('.profile-signature-head > *', document.querySelector('.profile-signature-head'), { y: 22, duration: .58, start: 'top 91%' });
      reveal('[data-profile-lens]', document.querySelector('.profile-lenses'), { y: 28, duration: .62, stagger: .08, start: 'top 91%' });
      reveal('.profile-current-intro', document.querySelector('.profile-current'), { x: desktop ? -18 : 0, y: desktop ? 0 : 18, duration: .58, stagger: 0, start: 'top 92%' });
      reveal('[data-profile-current]', document.querySelector('.profile-current'), { y: 24, duration: .58, stagger: .08, start: 'top 91%' });
      reveal('.profile-grid-refined article, .profile-grid article', document.querySelector('.profile-grid-refined, .profile-grid'), { y: 22, duration: .52, stagger: .06, start: 'top 92%' });

      // CONTACT — final payoff, still normal document flow.
      const contact = document.querySelector('#contact');
      const contactLines = gsap.utils.toArray('.contact-line > span');
      if (contact && contactLines.length) {
        gsap.from(contactLines, {
          autoAlpha: 0,
          yPercent: 70,
          duration: .68,
          stagger: .075,
          ease: 'power3.out',
          immediateRender: false,
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: contact, start: 'top 82%', once: true }
        });
      }
      reveal('.contact-actions', document.querySelector('.contact-actions'), { y: 18, duration: .5, stagger: 0, start: 'top 90%' });
      reveal('[data-contact-capability]', document.querySelector('.contact-capabilities'), { y: 24, duration: .56, stagger: .075, start: 'top 92%' });
      reveal('footer > *', document.querySelector('footer'), { y: 10, duration: .4, stagger: .045, start: 'top 98%' });
    }
  );

  // Keep trigger measurements reliable after fonts/lazy images settle.
  let refreshTimer = 0;
  const queueRefresh = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  if (document.fonts?.ready) document.fonts.ready.then(queueRefresh);
  window.addEventListener('load', queueRefresh, { once: true });
  window.addEventListener('pageshow', queueRefresh);
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (!img.complete) img.addEventListener('load', queueRefresh, { once: true });
  });
})();

// -------------------------------------------------------
// V2.11 — Interactive reading system
// -------------------------------------------------------
(() => {
  const consoleEl = document.querySelector('[data-explore-console]');
  const toggle = document.querySelector('[data-explore-toggle]');
  const panel = document.querySelector('[data-explore-panel]');
  const closePanel = document.querySelector('[data-explore-close]');
  const countEl = document.querySelector('[data-discovery-count]');
  const discoveryDots = [...document.querySelectorAll('.discovery-dots i')];
  const discoveryItems = [...document.querySelectorAll('[data-discovery-item]')];
  const projectRows = [...document.querySelectorAll('.project-row')];
  const lensButtons = [...document.querySelectorAll('[data-lens-filter]')];
  const lensTargets = [...document.querySelectorAll('[data-lens-target]')];
  const toast = document.querySelector('[data-discovery-toast]');
  const toastKicker = toast?.querySelector('[data-toast-kicker]');
  const toastTitle = toast?.querySelector('[data-toast-title]');
  const toastCopy = toast?.querySelector('[data-toast-copy]');
  const mapDialog = document.querySelector('[data-profile-map]');
  const mapOpen = document.querySelector('[data-profile-map-open]');
  const mapClose = document.querySelector('[data-profile-map-close]');
  const mapProgress = document.querySelector('[data-map-progress]');
  const mapProgressBar = document.querySelector('[data-map-progress-bar]');
  const mapLensCards = [...document.querySelectorAll('[data-map-lens]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroExplore = document.querySelector('[data-hero-explore]');

  const caseIds = ['case-tkoh', 'case-amp', 'case-20prod', 'case-visual'];
  const storageKey = 'ls-portfolio-discovered-v213';
  let toastTimer = 0;

  const safeRead = () => {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
      return new Set(parsed.filter((id) => caseIds.includes(id)));
    } catch {
      return new Set();
    }
  };
  const discovered = safeRead();

  const safeWrite = () => {
    try { sessionStorage.setItem(storageKey, JSON.stringify([...discovered])); } catch {}
  };

  const setPanel = (open) => {
    if (!panel || !toggle) return;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    consoleEl?.classList.toggle('is-open', open);
    if (open && !reduceMotion && window.gsap) {
      gsap.fromTo(panel, { autoAlpha: 0, y: 10, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .26, ease: 'power2.out' });
    }
  };

  toggle?.addEventListener('click', () => setPanel(panel?.hidden ?? true));
  closePanel?.addEventListener('click', () => setPanel(false));
  heroExplore?.addEventListener('click', () => {
    setPanel(true);
    window.setTimeout(() => lensButtons[1]?.focus({ preventScroll: true }), reduceMotion ? 0 : 280);
  });

  document.addEventListener('pointerdown', (event) => {
    if (!consoleEl || panel?.hidden) return;
    if (!consoleEl.contains(event.target)) setPanel(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel && !panel.hidden) setPanel(false);
  });

  const validLenses = new Set(['all', 'producto', 'comunicacion', 'datos']);
  const lensFromUrl = () => {
    const value = new URL(window.location.href).searchParams.get('lens');
    return validLenses.has(value) ? value : 'all';
  };
  const writeLensToUrl = (active) => {
    const url = new URL(window.location.href);
    if (active === 'all') url.searchParams.delete('lens');
    else url.searchParams.set('lens', active);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const setLens = (lens, { syncUrl = true } = {}) => {
    const active = validLenses.has(lens) ? lens : 'all';
    document.body.classList.toggle('is-lens-mode', active !== 'all');
    document.body.dataset.activeLens = active;

    lensButtons.forEach((button) => {
      const selected = button.dataset.lensFilter === active;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.dataset.stateLabel = selected ? '✓' : '';
    });

    lensTargets.forEach((target) => {
      const lenses = (target.dataset.lens || '').split(/\s+/).filter(Boolean);
      const match = active === 'all' || lenses.includes(active);
      target.classList.toggle('lens-match', active !== 'all' && match);
      target.classList.toggle('lens-muted', active !== 'all' && !match);
    });

    if (syncUrl) writeLensToUrl(active);
    const live = document.querySelector('[data-live-status]');
    if (live) live.textContent = active === 'all' ? 'Mostrando todas las áreas.' : `Lente activa: ${active}.`;
  };

  lensButtons.forEach((button) => button.addEventListener('click', () => setLens(button.dataset.lensFilter)));
  setLens(lensFromUrl(), { syncUrl: false });

  const updateMapLensState = () => {
    const map = {
      comunicacion: ['case-amp', 'case-20prod', 'case-visual'],
      producto: ['case-tkoh', 'case-20prod'],
      datos: ['case-tkoh', 'case-amp']
    };
    mapLensCards.forEach((card) => {
      const relevant = map[card.dataset.mapLens] || [];
      const seen = relevant.some((id) => discovered.has(id));
      card.classList.toggle('is-seen', seen);
    });
  };

  const updateDiscoveryUI = () => {
    const total = discovered.size;
    if (countEl) countEl.textContent = `${total}/4`;
    discoveryDots.forEach((dot, index) => dot.classList.toggle('is-found', index < total));
    discoveryItems.forEach((item) => item.classList.toggle('is-found', discovered.has(item.dataset.discoveryItem)));
    projectRows.forEach((row) => {
      const targetId = row.querySelector('a[href^="#"]')?.getAttribute('href')?.slice(1);
      row.classList.toggle('is-discovered', Boolean(targetId && discovered.has(targetId)));
    });
    consoleEl?.classList.toggle('is-complete', total === 4);
    document.body.classList.toggle('has-complete-map', total === 4);
    if (mapProgress) mapProgress.textContent = `${total} de 4 experiencias recorridas`;
    if (mapProgressBar) mapProgressBar.style.width = `${(total / 4) * 100}%`;
    updateMapLensState();
  };

  const hideToast = () => {
    if (!toast || toast.hidden) return;
    if (!reduceMotion && window.gsap) {
      gsap.to(toast, { autoAlpha: 0, y: -8, duration: .2, ease: 'power1.in', onComplete: () => { toast.hidden = true; gsap.set(toast, { clearProps: 'all' }); } });
    } else {
      toast.hidden = true;
    }
  };

  const showToast = (title, copy, complete = false) => {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.hidden = false;
    if (toastKicker) toastKicker.textContent = complete ? 'MAPA COMPLETO' : 'SEÑAL DESCUBIERTA';
    if (toastTitle) toastTitle.textContent = title;
    if (toastCopy) toastCopy.textContent = copy;
    if (!reduceMotion && window.gsap) {
      gsap.fromTo(toast, { autoAlpha: 0, y: -10, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .28, ease: 'power2.out' });
    }
    toastTimer = window.setTimeout(hideToast, complete ? 4200 : 3200);
  };

  const discover = (section) => {
    if (!section?.id || discovered.has(section.id)) return;
    discovered.add(section.id);
    safeWrite();
    updateDiscoveryUI();

    if (discovered.size === 4) {
      showToast('Ya viste las cuatro capas de experiencia.', 'El mapa del perfil está completo. Puedes abrirlo desde “Explorar”.', true);
    } else {
      showToast(section.dataset.discoveryTitle || 'Nueva señal', section.dataset.discoveryCopy || 'Has descubierto una nueva capa del perfil.');
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target.closest('[data-experience]');
        if (section) discover(section);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -45% 0px' });

    caseIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((section) => section.querySelector('.exp-head') || section)
      .forEach((marker) => observer.observe(marker));
  }

  discoveryItems.forEach((item) => item.querySelector('a')?.addEventListener('click', () => setPanel(false)));

  const closeMap = () => mapDialog?.close ? mapDialog.close() : mapDialog?.removeAttribute('open');

  mapOpen?.addEventListener('click', (event) => {
    event.preventDefault();
    setPanel(false);
    if (!mapDialog) return;
    if (typeof mapDialog.showModal === 'function') mapDialog.showModal();
    else mapDialog.setAttribute('open', '');
  });
  mapClose?.addEventListener('click', closeMap);
  mapDialog?.addEventListener('click', (event) => { if (event.target === mapDialog) closeMap(); });
  mapDialog?.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', closeMap));

  mapLensCards.forEach((card) => {
    const lens = card.dataset.mapLens;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Aplicar lente ${lens}`);
    const apply = () => {
      setLens(lens);
      closeMap();
      document.getElementById('work')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };
    card.addEventListener('click', apply);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        apply();
      }
    });
  });

  // MI SISTEMA: hover/focus preview the system; click/tap/Enter commit a stage.
  const engine = document.querySelector('[data-system-engine]');
  if (engine) {
    const nodes = [...engine.querySelectorAll('[data-system-node]')];
    const states = [...engine.querySelectorAll('.system-core-states p')];
    const projectsRegion = document.querySelector('[data-system-projects]');
    const projectsTitle = projectsRegion?.querySelector('[data-system-projects-title]');
    const projectsList = projectsRegion?.querySelector('[data-system-projects-list]');
    const SYSTEM_PROJECTS = {
      signals: [['Amazon Magic Park', 'strong'], ['SUNAFIL', 'strong'], ['Studios TKOH', 'medium'], ['20 Prod.', 'contextual']],
      structure: [['Studios TKOH', 'strong'], ['Amazon Magic Park', 'strong'], ['20 Prod.', 'medium'], ['SUNAFIL', 'contextual']],
      interface: [['Studios TKOH', 'strong'], ['20 Prod.', 'medium'], ['Amazon Magic Park', 'contextual'], ['SUNAFIL', 'contextual']],
      learn: [['Amazon Magic Park', 'strong'], ['Studios TKOH', 'strong'], ['SUNAFIL', 'medium'], ['20 Prod.', 'medium']]
    };
    const STRENGTH_LABEL = { strong: 'FUERTE', medium: 'MEDIA', contextual: 'CONTEXTUAL' };
    let selectedIndex = 0;
    let previewIndex = null;
    let displayedIndex = -1;

    // Preview changes are visual only; the global live status announces committed choices.
    projectsRegion?.removeAttribute('aria-live');

    const animateProjectChange = () => {
      if (reduceMotion || typeof Element === 'undefined' || !Element.prototype.animate) return;
      [projectsTitle, projectsList].filter(Boolean).forEach((target, index) => {
        target.getAnimations().forEach((animation) => animation.cancel());
        target.animate(
          [
            { opacity: .42, transform: 'translateY(4px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          {
            duration: 180 + (index * 30),
            easing: 'cubic-bezier(.2,.8,.2,1)',
            fill: 'none'
          }
        );
      });
    };

    const renderProjects = (node, { animate = true } = {}) => {
      if (!projectsList || !node) return;
      const key = node.dataset.systemKey || 'signals';
      const items = SYSTEM_PROJECTS[key] || SYSTEM_PROJECTS.signals;
      if (projectsTitle) projectsTitle.textContent = node.querySelector('h3')?.textContent || 'Señales';
      projectsList.replaceChildren(...items.map(([name, strength]) => {
        const item = document.createElement('div');
        item.className = 'system-project-link';
        item.dataset.strength = strength;
        const title = document.createElement('strong');
        title.textContent = name;
        const meta = document.createElement('em');
        meta.textContent = STRENGTH_LABEL[strength];
        item.append(title, meta);
        return item;
      }));
      if (animate) animateProjectChange();
    };

    const syncCommittedSelection = () => {
      nodes.forEach((node, index) => {
        const selected = index === selectedIndex;
        node.classList.toggle('is-selected', selected);
        node.setAttribute('aria-pressed', String(selected));
      });
    };

    const renderStep = (index, { preview = false, animateProjects = true } = {}) => {
      if (!nodes[index] || !states[index]) return;
      engine.dataset.activeStep = String(index);
      nodes.forEach((node, nodeIndex) => {
        const active = nodeIndex === index;
        node.classList.toggle('is-active', active);
        node.classList.toggle('is-preview', preview && active);
      });
      states.forEach((state, stateIndex) => {
        const active = stateIndex === index;
        state.classList.toggle('is-current', active);
        if (window.gsap && !reduceMotion) {
          gsap.killTweensOf(state);
          gsap.to(state, { autoAlpha: active ? 1 : 0, y: active ? 0 : 5, duration: .2, ease: 'power1.out', overwrite: true });
        } else {
          state.style.opacity = active ? '1' : '0';
          state.style.visibility = active ? 'visible' : 'hidden';
        }
      });
      if (displayedIndex !== index) renderProjects(nodes[index], { animate: animateProjects });
      displayedIndex = index;
    };

    const announceSelection = (index) => {
      const live = document.querySelector('[data-live-status]');
      if (live) live.textContent = `Etapa ${index + 1}: ${nodes[index].querySelector('h3')?.textContent || ''}.`;
    };

    const commitStep = (index, { announce = true, animateProjects = true } = {}) => {
      if (!nodes[index] || !states[index]) return;
      selectedIndex = index;
      previewIndex = null;
      syncCommittedSelection();
      renderStep(index, { preview: false, animateProjects });
      if (announce) announceSelection(index);
    };

    const previewStep = (index) => {
      if (!nodes[index] || index === selectedIndex) return;
      previewIndex = index;
      renderStep(index, { preview: true });
    };

    const restoreCommittedStep = (index) => {
      if (previewIndex !== index) return;
      previewIndex = null;
      renderStep(selectedIndex, { preview: false });
    };

    nodes.forEach((node, index) => {
      node.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        previewStep(index);
      });
      node.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'touch') return;
        restoreCommittedStep(index);
      });
      node.addEventListener('focus', () => previewStep(index));
      node.addEventListener('blur', () => restoreCommittedStep(index));
      node.addEventListener('click', () => commitStep(index));
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          commitStep(index);
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          nodes[(index + 1) % nodes.length].focus();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          nodes[(index - 1 + nodes.length) % nodes.length].focus();
        }
      });
    });

    commitStep(0, { announce: false, animateProjects: false });
  }

  updateDiscoveryUI();
})();
