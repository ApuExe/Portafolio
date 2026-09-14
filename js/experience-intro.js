(() => {
  const root = document.documentElement;
  const intro = document.querySelector('[data-experience-intro]');
  const skip = document.querySelector('[data-intro-skip]');
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const storageKey = 'ls-v213-intro-played';
  let resolved = false;
  let timeline = null;
  let pointerHandler = null;
  let started = false;

  const hasPlayed = () => {
    try { return sessionStorage.getItem(storageKey) === '1'; } catch { return false; }
  };

  const rememberPlayed = () => {
    try { sessionStorage.setItem(storageKey, '1'); } catch {}
  };

  function resolve(reason = 'complete') {
    if (resolved) return;
    resolved = true;
    timeline?.kill();
    if (started && !['fallback', 'reduced-motion'].includes(reason)) rememberPlayed();
    if (pointerHandler && hero) hero.removeEventListener('pointermove', pointerHandler);
    root.classList.remove('intro-running');
    root.classList.add('intro-resolved');
    intro?.setAttribute('aria-hidden', 'true');
    if (skip) skip.hidden = true;
    if (window.gsap) {
      window.gsap.set('[data-hero-title], .hero-description, .hero-side, .hero-index, .signal-strip', {
        clearProps: 'opacity,visibility,transform'
      });
    }
    document.dispatchEvent(new CustomEvent('portfolio:intro-resolved', { detail: { reason } }));
  }

  function init() {
    if (!intro || !skip) {
      resolve('fallback');
      return;
    }

    if (reduceMotion) {
      resolve('reduced-motion');
      return;
    }

    if (hasPlayed()) {
      resolve('session');
      return;
    }

    if (!window.gsap) {
      resolve('fallback');
      return;
    }

    started = true;
    root.classList.add('has-experience-intro', 'intro-running');
    skip.hidden = false;

    const gsap = window.gsap;
    const signals = gsap.utils.toArray('[data-intro-signal]');
    const lines = gsap.utils.toArray('[data-intro-line]');
    const mark = document.querySelector('.experience-intro__mark');
    const markPieces = gsap.utils.toArray('.experience-intro__mark span');
    const heroSecondary = gsap.utils.toArray('.hero-description, .hero-side, .hero-index, .signal-strip');

    gsap.set('[data-hero-title]', { autoAlpha: 0, y: 28 });
    gsap.set(heroSecondary, { autoAlpha: 0, y: 14 });
    gsap.set(signals, { autoAlpha: 0 });
    gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });
    if (mark) gsap.set(mark, { autoAlpha: 0, scale: .72, rotation: -7 });
    gsap.set(markPieces, { scale: .82, transformOrigin: 'center' });

    if (finePointer && hero) {
      pointerHandler = (event) => {
        if (resolved) return;
        const rect = hero.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const py = ((event.clientY - rect.top) / rect.height - .5) * 2;
        intro.style.setProperty('--intro-pointer-x', `${(px * 7).toFixed(2)}px`);
        intro.style.setProperty('--intro-pointer-y', `${(py * 5).toFixed(2)}px`);
      };
      hero.addEventListener('pointermove', pointerHandler, { passive: true });
    }

    const convergence = () => {
      const markRect = mark?.getBoundingClientRect();
      if (!markRect) return { x: 0, y: 0 };
      const cx = markRect.left + markRect.width / 2;
      const cy = markRect.top + markRect.height / 2;
      return (index, target) => {
        const rect = target.getBoundingClientRect();
        return {
          x: cx - (rect.left + rect.width / 2),
          y: cy - (rect.top + rect.height / 2)
        };
      };
    };

    timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => resolve('complete')
    });

    timeline
      .fromTo(signals,
        {
          autoAlpha: 0,
          x: () => gsap.utils.random(-64, 64),
          y: () => gsap.utils.random(-42, 42),
          rotation: () => gsap.utils.random(-6, 6)
        },
        { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .68, stagger: .045 }, 0)
      .to(lines, { scaleX: 1, duration: .56, stagger: .065, ease: 'power2.inOut' }, .24)
      .to(signals, {
        x: (i, el) => convergence()(i, el).x,
        y: (i, el) => convergence()(i, el).y,
        scale: .76,
        autoAlpha: .55,
        duration: .64,
        stagger: .02,
        ease: 'power2.inOut'
      }, 1.12)
      .to(mark, { autoAlpha: 1, scale: 1, rotation: 0, duration: .52, ease: 'back.out(1.35)' }, 1.38)
      .to(markPieces, { scale: 1, duration: .34, stagger: .035, ease: 'power2.out' }, 1.48)
      .to([signals, lines], { autoAlpha: 0, duration: .34, stagger: .008 }, 1.92)
      .to(mark, { scale: .88, autoAlpha: .18, duration: .44, ease: 'power2.inOut' }, 2.05)
      .to('[data-hero-title]', { autoAlpha: 1, y: 0, duration: .68, ease: 'power3.out' }, 2.12)
      .to(heroSecondary, { autoAlpha: 1, y: 0, duration: .48, stagger: .055 }, 2.38)
      .to(mark, { autoAlpha: 0, duration: .28 }, 2.66);
  }

  skip?.addEventListener('click', () => resolve('skip'));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !resolved) resolve('escape');
  });

  window.PortfolioIntro = { init, resolve };
  init();
})();
