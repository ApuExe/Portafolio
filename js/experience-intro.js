(() => {
  const root = document.documentElement;
  const intro = document.querySelector('[data-experience-intro]');
  const skip = document.querySelector('[data-intro-skip]');
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const compactViewport = window.matchMedia('(max-width: 820px)').matches;
  const boot = window.__portfolioIntroBoot || {};
  const storageKey = boot.storageKey || 'ls-v11-signal-clarity-rc4-played';
  // Review shortcut: append ?intro=replay to force the cinematic sequence on every refresh.
  const forceReplay = Boolean(boot.forceReplay) || new URLSearchParams(window.location.search).get('intro') === 'replay';

  const INTRO_TIMING = Object.freeze({
    desktopSeconds: 5.35,
    compactSeconds: 3.90,
    SATURATION_HOLD: 1.65,
    VISUAL_SILENCE: 3.62
  });

  const TOTAL_SECONDS = INTRO_TIMING.desktopSeconds;
  const timeScale = compactViewport ? INTRO_TIMING.compactSeconds / INTRO_TIMING.desktopSeconds : 1;
  const ms = (seconds) => seconds * 1000 * timeScale;
  const offset = (seconds) => Math.max(0, Math.min(1, seconds / TOTAL_SECONDS));

  let resolved = false;
  let started = false;
  let pointerHandler = null;
  let livePointerHandler = null;
  let liveLeaveHandler = null;
  let liveMotionReady = false;
  let liveRaf = 0;
  let completionTimer = 0;
  let blendTimer = 0;
  const animations = [];
  const touched = new Set();

  const hasPlayed = () => {
    if (forceReplay) return false;
    try { return sessionStorage.getItem(storageKey) === '1'; } catch { return false; }
  };

  const rememberPlayed = () => {
    try { sessionStorage.setItem(storageKey, '1'); } catch {}
  };

  const trackAnimation = (element, frames, options = {}) => {
    if (!element || typeof element.animate !== 'function') return null;
    const animation = element.animate(frames, {
      duration: ms(TOTAL_SECONDS),
      easing: 'linear',
      fill: 'both',
      ...options
    });
    animations.push(animation);
    touched.add(element);
    return animation;
  };

  const frame = (seconds, styles) => ({ offset: offset(seconds), ...styles });

  function initResolvedHeroMotion() {
    if (!hero || reduceMotion || !finePointer || liveMotionReady) return;
    liveMotionReady = true;

    const setLivePosition = (x, y) => {
      hero.style.setProperty('--hero-live-x', `${x.toFixed(2)}px`);
      hero.style.setProperty('--hero-live-y', `${y.toFixed(2)}px`);
    };

    livePointerHandler = (event) => {
      if (liveRaf) cancelAnimationFrame(liveRaf);
      liveRaf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const px = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
        const py = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
        setLivePosition(px * 4.4, py * 3.1);
      });
    };

    liveLeaveHandler = () => setLivePosition(0, 0);
    hero.addEventListener('pointermove', livePointerHandler, { passive: true });
    hero.addEventListener('pointerleave', liveLeaveHandler, { passive: true });
  }

  function clearIntroPresentation() {
    animations.splice(0).forEach((animation) => {
      try { animation.cancel(); } catch {}
    });
    touched.forEach((node) => {
      node.style.removeProperty('opacity');
      node.style.removeProperty('visibility');
      node.style.removeProperty('transform');
      node.style.removeProperty('filter');
      node.style.removeProperty('color');
    });
    touched.clear();
  }

  function resolve(reason = 'complete') {
    if (resolved) return;
    resolved = true;
    window.clearTimeout(completionTimer);
    window.clearTimeout(blendTimer);
    clearIntroPresentation();
    if (started && !['reduced-motion', 'session', 'prepaint-timeout'].includes(reason)) rememberPlayed();
    if (pointerHandler && hero) hero.removeEventListener('pointermove', pointerHandler);
    root.classList.remove('intro-pending', 'intro-running', 'intro-css-fallback', 'intro-blending');
    root.classList.add('intro-resolved');
    intro?.setAttribute('aria-hidden', 'true');
    if (skip) skip.hidden = true;
    initResolvedHeroMotion();
    document.dispatchEvent(new CustomEvent('portfolio:intro-resolved', { detail: { reason } }));
  }

  function runNativeTimeline() {
    const signals = [...document.querySelectorAll('[data-intro-signal]')];
    const largeSignals = [...document.querySelectorAll('.experience-intro__signal--xl')];
    const smallSignals = signals.filter((node) => !node.classList.contains('experience-intro__signal--xl'));
    const lines = [...document.querySelectorAll('[data-intro-line]')];
    const noise = [...document.querySelectorAll('[data-intro-noise] i')];
    const cut = document.querySelector('[data-intro-cut]');
    const mark = document.querySelector('.experience-intro__mark');
    const brandmark = document.querySelector('.experience-intro__brandmark');
    const heroTitle = document.querySelector('[data-hero-title]');
    const heroReveals = [...document.querySelectorAll('[data-hero-reveal]')];
    const heroSecondary = [...document.querySelectorAll('.hero-description, .hero-side, .hero-index, .signal-strip')];

    const markRect = mark?.getBoundingClientRect();
    const center = markRect
      ? { x: markRect.left + markRect.width / 2, y: markRect.top + markRect.height / 2 }
      : { x: innerWidth / 2, y: innerHeight / 2 };

    const convergence = (target) => {
      const rect = target.getBoundingClientRect();
      return {
        x: center.x - (rect.left + rect.width / 2),
        y: center.y - (rect.top + rect.height / 2)
      };
    };

    const largeDrift = [
      { x: -190, y: -42, r: -7 },
      { x: 190, y: 48, r: 6 },
      { x: -170, y: 62, r: -5 }
    ];

    largeSignals.forEach((node, index) => {
      const drift = largeDrift[index % largeDrift.length];
      const conv = convergence(node);
      const saturationX = (index - 1) * 34;
      const saturationY = index % 2 === 0 ? 26 : -24;
      trackAnimation(node, [
        frame(0, { opacity: 0, transform: `translate3d(${drift.x}px, ${drift.y}px, 0) rotate(${drift.r}deg) scale(1.08)`, filter: 'blur(12px)' }),
        frame(.18 + index * .10, { opacity: .18, transform: `translate3d(${drift.x * .68}px, ${drift.y * .7}px, 0) rotate(${drift.r * .65}deg) scale(1.06)`, filter: 'blur(8px)' }),
        frame(.92 + index * .11, { opacity: 1, transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', filter: 'blur(0px)', color: 'rgba(244,245,248,.21)' }),
        frame(1.05 + index * .05, { opacity: 1, transform: `translate3d(${saturationX}px, ${saturationY}px, 0) rotate(0deg) scale(1.075)`, color: 'rgba(244,245,248,.38)' }),
        frame(INTRO_TIMING.SATURATION_HOLD + .35, { opacity: .92, transform: `translate3d(${saturationX + 10}px, ${saturationY - 8}px, 0) rotate(0deg) scale(1.06)`, color: 'rgba(244,245,248,.34)' }),
        frame(2.10, { opacity: .88, transform: `translate3d(${saturationX * .35}px, ${saturationY * .35}px, 0) rotate(0deg) scale(.96)`, filter: 'blur(0px)' }),
        frame(3.22, { opacity: .14, transform: `translate3d(${conv.x}px, ${conv.y}px, 0) rotate(0deg) scale(.11)`, filter: 'blur(0px)' }),
        frame(3.48, { opacity: 0, transform: `translate3d(${conv.x}px, ${conv.y}px, 0) scale(.08)` }),
        frame(TOTAL_SECONDS, { opacity: 0, transform: `translate3d(${conv.x}px, ${conv.y}px, 0) scale(.08)` })
      ]);
    });

    const smallDrift = [
      { x: -96, y: 54, r: -8 }, { x: 86, y: -56, r: 7 }, { x: -72, y: -38, r: -5 },
      { x: 108, y: 44, r: 8 }, { x: -88, y: 62, r: 6 }
    ];

    smallSignals.forEach((node, index) => {
      const drift = smallDrift[index % smallDrift.length];
      const conv = convergence(node);
      const jitterX = ((index % 3) - 1) * 18;
      const jitterY = index % 2 === 0 ? -14 : 16;
      trackAnimation(node, [
        frame(.08 + index * .04, { opacity: 0, transform: `translate3d(${drift.x}px, ${drift.y}px, 0) rotate(${drift.r}deg)`, filter: 'blur(8px)' }),
        frame(.84 + index * .075, { opacity: 1, transform: 'translate3d(0,0,0) rotate(0deg)', filter: 'blur(0px)' }),
        frame(1.16 + index * .04, { opacity: .92, transform: `translate3d(${jitterX}px, ${jitterY}px, 0) rotate(${drift.r * .18}deg)` }),
        frame(INTRO_TIMING.SATURATION_HOLD + .42, { opacity: 1, transform: `translate3d(${jitterX * -.45}px, ${jitterY * -.55}px, 0) rotate(0deg)` }),
        frame(2.10, { opacity: .86, transform: 'translate3d(0,0,0) rotate(0deg)', filter: 'blur(0px)' }),
        frame(3.22, { opacity: .38, transform: `translate3d(${conv.x}px, ${conv.y}px, 0) scale(.58)` }),
        frame(3.48, { opacity: 0, transform: `translate3d(${conv.x}px, ${conv.y}px, 0) scale(.44)` }),
        frame(TOTAL_SECONDS, { opacity: 0, transform: `translate3d(${conv.x}px, ${conv.y}px, 0) scale(.44)` })
      ]);
    });

    lines.forEach((node, index) => {
      const rotation = [-4, 3, 4, -3][index % 4];
      trackAnimation(node, [
        frame(0, { opacity: 0, transform: 'scaleX(0) rotate(0deg)' }),
        frame(.30 + index * .09, { opacity: 0, transform: 'scaleX(0) rotate(0deg)' }),
        frame(1.18, { opacity: .94, transform: `scaleX(1.08) rotate(${rotation}deg)` }),
        frame(2.34, { opacity: .30, transform: 'scaleX(.28) rotate(0deg)' }),
        frame(3.48, { opacity: 0, transform: 'scaleX(.18) rotate(0deg)' }),
        frame(TOTAL_SECONDS, { opacity: 0, transform: 'scaleX(.18)' })
      ]);
    });

    noise.forEach((node, index) => {
      trackAnimation(node, [
        frame(0, { opacity: 0, transform: 'scale(.48) rotate(0deg)' }),
        frame(.18 + index * .06, { opacity: .82, transform: 'scale(1) rotate(0deg)' }),
        frame(INTRO_TIMING.SATURATION_HOLD + .36, { opacity: .78, transform: `scale(1.18) rotate(${35 + index * 7}deg)` }),
        frame(2.40, { opacity: .12, transform: 'scale(.72) rotate(48deg)' }),
        frame(3.48, { opacity: 0, transform: 'scale(.62) rotate(54deg)' }),
        frame(TOTAL_SECONDS, { opacity: 0 })
      ]);
    });

    if (mark) {
      trackAnimation(mark, [
        frame(0, { opacity: 0, transform: 'translate(-50%, -50%) scale(.58) rotate(-9deg)' }),
        frame(2.66, { opacity: 0, transform: 'translate(-50%, -50%) scale(.58) rotate(-9deg)' }),
        frame(3.18, { opacity: 1, transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' }),
        frame(3.30, { opacity: 1, transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' }),
        frame(INTRO_TIMING.VISUAL_SILENCE, { opacity: .10, transform: 'translate(-50%, -50%) scale(.84) rotate(0deg)' }),
        frame(4.18, { opacity: .06, transform: 'translate(-50%, -50%) scale(.82)' }),
        frame(TOTAL_SECONDS, { opacity: 0, transform: 'translate(-50%, -50%) scale(.80)' })
      ]);
    }

    if (brandmark) {
      trackAnimation(brandmark, [
        frame(0, { transform: 'scale(.86) rotate(-4deg)', filter: 'blur(4px)' }),
        frame(2.76, { transform: 'scale(.86) rotate(-4deg)', filter: 'blur(4px)' }),
        frame(3.24, { transform: 'scale(1) rotate(0deg)', filter: 'blur(0px)' }),
        frame(TOTAL_SECONDS, { transform: 'scale(1) rotate(0deg)', filter: 'blur(0px)' })
      ]);
    }

    if (cut) {
      trackAnimation(cut, [
        frame(0, { opacity: 0, transform: 'scaleX(0)' }),
        frame(3.90, { opacity: 0, transform: 'scaleX(0)' }),
        frame(4.12, { opacity: 1, transform: 'scaleX(1)' }),
        frame(4.32, { opacity: 0, transform: 'scaleX(1)' }),
        frame(TOTAL_SECONDS, { opacity: 0, transform: 'scaleX(1)' })
      ]);
    }

    if (intro) {
      trackAnimation(intro, [
        frame(0, { opacity: 1, backgroundColor: '#07090d' }),
        frame(4.02, { opacity: 1, backgroundColor: '#07090d' }),
        frame(4.28, { opacity: 1, backgroundColor: '#171b22' }),
        frame(4.54, { opacity: .96, backgroundColor: '#737b87' }),
        frame(4.82, { opacity: .72, backgroundColor: '#d8dde5' }),
        frame(5.04, { opacity: .30, backgroundColor: '#f4f5f8' }),
        frame(5.18, { opacity: 0, backgroundColor: '#f4f5f8' }),
        frame(TOTAL_SECONDS, { opacity: 0, backgroundColor: '#f4f5f8' })
      ]);
    }

    blendTimer = window.setTimeout(() => {
      if (!resolved) root.classList.add('intro-blending');
    }, ms(4.04));

    if (heroTitle) {
      trackAnimation(heroTitle, [
        frame(0, { opacity: 0 }),
        frame(4.14, { opacity: 0 }),
        frame(4.16, { opacity: 1 }),
        frame(TOTAL_SECONDS, { opacity: 1 })
      ]);
    }

    heroReveals.forEach((node, index) => {
      const start = 4.17 + index * .13;
      trackAnimation(node, [
        frame(0, { transform: 'translateY(126%) skewY(4deg)' }),
        frame(start, { transform: 'translateY(126%) skewY(4deg)' }),
        frame(Math.min(TOTAL_SECONDS, start + .78), { transform: 'translateY(0%) skewY(0deg)' }),
        frame(TOTAL_SECONDS, { transform: 'translateY(0%) skewY(0deg)' })
      ]);
    });

    heroSecondary.forEach((node, index) => {
      const start = 4.55 + index * .06;
      trackAnimation(node, [
        frame(0, { opacity: 0, transform: 'translateY(20px)' }),
        frame(start, { opacity: 0, transform: 'translateY(20px)' }),
        frame(Math.min(TOTAL_SECONDS, start + .58), { opacity: 1, transform: 'translateY(0)' }),
        frame(TOTAL_SECONDS, { opacity: 1, transform: 'translateY(0)' })
      ]);
    });

    completionTimer = window.setTimeout(() => resolve('complete'), ms(TOTAL_SECONDS) + 120);
  }

  function init() {
    if (!intro || !skip) {
      resolve('missing-intro');
      return;
    }
    if (reduceMotion) {
      resolve('reduced-motion');
      return;
    }
    if (boot.aborted) {
      resolve('prepaint-timeout');
      return;
    }
    if (hasPlayed()) {
      resolve('session');
      return;
    }

    started = true;
    root.classList.add('has-experience-intro');
    root.classList.remove('intro-pending', 'intro-resolved');
    root.classList.add('intro-running');
    skip.hidden = false;
    intro.setAttribute('aria-hidden', 'false');

    if (finePointer && hero) {
      pointerHandler = (event) => {
        if (resolved) return;
        const rect = hero.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const py = ((event.clientY - rect.top) / rect.height - .5) * 2;
        intro.style.setProperty('--intro-pointer-x', `${(px * 13).toFixed(2)}px`);
        intro.style.setProperty('--intro-pointer-y', `${(py * 9).toFixed(2)}px`);
      };
      hero.addEventListener('pointermove', pointerHandler, { passive: true });
    }

    runNativeTimeline();
  }

  skip?.addEventListener('click', () => resolve('skip'));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !resolved) resolve('escape');
  });

  window.PortfolioIntroTiming = INTRO_TIMING;
  window.PortfolioIntro = { init, resolve, initResolvedHeroMotion, runNativeTimeline };
  init();
})();
