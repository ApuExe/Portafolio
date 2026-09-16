(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = window.matchMedia('(max-width: 760px)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cases = [...document.querySelectorAll('[data-experience]')];
  if (!cases.length) return;

  const caseMeta = {
    'case-tkoh': {
      no: '01', domain: 'PRODUCTO', dialect: 'build-system',
      nextNo: '02', nextDomain: 'MARKETING / DATOS'
    },
    'case-amp': {
      no: '02', domain: 'MARKETING / DATOS', dialect: 'follow-signal',
      nextNo: '03', nextDomain: 'COMUNICACIÓN VISUAL'
    },
    'case-20prod': {
      no: '03', domain: 'COMUNICACIÓN VISUAL', dialect: 'editorial-composition',
      nextNo: '04', nextDomain: 'CONTEXTO / PERSONAS'
    },
    'case-visual': {
      no: '04', domain: 'CONTEXTO / PERSONAS', dialect: 'human-context',
      nextNo: '05', nextDomain: 'MI SISTEMA / SÍNTESIS'
    }
  };

  const animate = (node, frames, options = {}) => {
    if (!node || reduceMotion || typeof node.animate !== 'function') return null;
    return node.animate(frames, {
      duration: compact ? 520 : 760,
      delay: 0,
      easing: 'cubic-bezier(.18,.82,.24,1)',
      fill: 'both',
      ...options
    });
  };

  const observeOnce = (nodes, callback, options = {}) => {
    const list = [...nodes].filter(Boolean);
    if (!list.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      list.forEach((node, index) => callback(node, index));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = list.indexOf(entry.target);
        callback(entry.target, index);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: options.threshold ?? .12,
      rootMargin: options.rootMargin ?? '0px 0px -8% 0px'
    });

    list.forEach((node) => observer.observe(node));
  };

  const addHandoff = (section, meta) => {
    if (section.querySelector(':scope > .case-handoff')) return;
    const handoff = document.createElement('div');
    handoff.className = 'case-handoff';
    handoff.setAttribute('aria-hidden', 'true');
    handoff.innerHTML = `
      <span class="case-handoff__from">${meta.no} / ${meta.domain}</span>
      <span class="case-handoff__track"><i></i><b></b></span>
      <span class="case-handoff__to">${meta.nextNo} / ${meta.nextDomain}</span>
    `;
    section.append(handoff);
  };

  const sequenceStory = (story) => {
    const steps = [...story.querySelectorAll(':scope > span, :scope > i')];
    if (!steps.length) return;

    if (reduceMotion) {
      steps.forEach((step) => step.classList.add('is-story-step-active'));
      story.classList.add('is-story-sequenced');
      return;
    }

    const delay = compact ? 48 : 72;
    steps.forEach((step, index) => {
      window.setTimeout(() => step.classList.add('is-story-step-active'), index * delay);
    });
    window.setTimeout(() => story.classList.add('is-story-sequenced'), steps.length * delay + 40);
  };

  // Shared chapter identity + narrative handoffs.
  cases.forEach((section) => {
    const meta = caseMeta[section.id];
    if (!meta) return;

    section.dataset.caseDialect = meta.dialect;
    section.dataset.caseNextDomain = meta.nextDomain;

    const story = section.querySelector('[data-story-line]');
    if (story) {
      story.classList.add('case-bridge');
      story.dataset.caseNo = meta.no;
      story.dataset.caseDomain = meta.domain;
    }

    addHandoff(section, meta);
  });

  observeOnce(document.querySelectorAll('.case-bridge'), (bridge) => {
    bridge.classList.add('is-bridge-active');
    sequenceStory(bridge);
  }, { threshold: .24 });

  observeOnce(document.querySelectorAll('.case-handoff'), (handoff) => {
    handoff.classList.add('is-handoff-active');
  }, { threshold: .45, rootMargin: '0px 0px -4% 0px' });

  // Section state is persistent visual context only; it never controls scroll.
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('choreo-active', entry.isIntersecting));
    }, { threshold: .05, rootMargin: '-8% 0px -10% 0px' });
    cases.forEach((section) => activeObserver.observe(section));
  } else {
    cases.forEach((section) => section.classList.add('choreo-active'));
  }

  // ---------------------------------------------------------------------------
  // 01 / TKOH — BUILD THE SYSTEM
  // Frame -> product surface -> annotations -> evidence/modules.
  // ---------------------------------------------------------------------------
  const tkoh = document.querySelector('#case-tkoh');
  if (tkoh) {
    const stage = tkoh.querySelector('.exp-stage-product');
    const shot = tkoh.querySelector('.exp-product-shot');
    const annotations = [...tkoh.querySelectorAll('.exp-annotations > div')];

    if (stage && !stage.querySelector('.tkoh-build-frame')) {
      const frame = document.createElement('span');
      frame.className = 'tkoh-build-frame';
      frame.setAttribute('aria-hidden', 'true');
      frame.innerHTML = '<i></i><i></i><i></i><i></i>';
      stage.append(frame);
    }

    observeOnce([stage], (node) => {
      node.classList.add('is-build-active');
      animate(node, [
        { opacity: .4, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: compact ? 620 : 860 });

      if (shot) {
        animate(shot, [
          { opacity: .18, clipPath: 'inset(0 100% 0 0)', transform: 'translateY(8px) scale(.992)' },
          { opacity: 1, clipPath: 'inset(0 0% 0 0)', transform: 'translateY(0) scale(1)' }
        ], { delay: compact ? 70 : 180, duration: compact ? 720 : 980 });
      }

      annotations.forEach((annotation, index) => {
        annotation.dataset.buildIndex = String(index + 1).padStart(2, '0');
        animate(annotation, [
          { opacity: 0, transform: `translate3d(${compact ? 0 : 16}px,12px,0)` },
          { opacity: 1, transform: 'translate3d(0,0,0)' }
        ], { delay: (compact ? 220 : 420) + index * (compact ? 70 : 105), duration: compact ? 460 : 620 });
      });
    }, { threshold: .08 });

    if (stage && finePointer && !reduceMotion) {
      const setDepth = (x = 0, y = 0) => {
        stage.style.setProperty('--tkoh-depth-x', `${x.toFixed(2)}px`);
        stage.style.setProperty('--tkoh-depth-y', `${y.toFixed(2)}px`);
      };

      stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const py = ((event.clientY - rect.top) / rect.height - .5) * 2;
        setDepth(px * 6, py * 4.5);
      }, { passive: true });
      stage.addEventListener('pointerleave', () => setDepth(), { passive: true });
    }

    const evidence = tkoh.querySelectorAll('.tkoh-context-grid, .tkoh-criteria, .exp-evidence, .tkoh-scale-card, .tkoh-current-evidence, .exp-resource-line');
    observeOnce(evidence, (node, index) => {
      animate(node, [
        { opacity: 0, transform: `translate3d(${compact ? 0 : (index % 2 ? 18 : -18)}px,${compact ? 14 : 22}px,0)` },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { delay: Math.min(index, 5) * (compact ? 42 : 68), duration: compact ? 520 : 720 });
    });
  }

  // ---------------------------------------------------------------------------
  // 02 / AMAZON — FOLLOW THE SIGNAL
  // One signal travels the operational path; journey nodes resolve in sequence.
  // ---------------------------------------------------------------------------
  const amp = document.querySelector('#case-amp');
  if (amp) {
    const list = amp.querySelector('.amp-journey-list');
    const steps = [...amp.querySelectorAll('.amp-journey-list article')];

    if (list && !list.querySelector('.amp-signal-runner')) {
      const runner = document.createElement('i');
      runner.className = 'amp-signal-runner';
      runner.setAttribute('aria-hidden', 'true');
      list.append(runner);
    }

    observeOnce([list], (node) => {
      node.classList.add('is-signal-running');
      steps.forEach((step, index) => {
        step.dataset.choreoStep = String(index + 1).padStart(2, '0');
        window.setTimeout(() => step.classList.add('is-signal-step'), reduceMotion ? 0 : index * (compact ? 90 : 155));
        animate(step, [
          { opacity: .12, transform: `translate3d(${compact ? 0 : -22}px,16px,0)` },
          { opacity: 1, transform: 'translate3d(0,0,0)' }
        ], { delay: index * (compact ? 70 : 120), duration: compact ? 500 : 690 });
      });
      window.setTimeout(() => node.classList.add('is-signal-complete'), reduceMotion ? 0 : (compact ? 650 : 1050));
    }, { threshold: .1 });

    if (list && finePointer) {
      const clearFocus = () => {
        list.classList.remove('has-signal-focus');
        steps.forEach((step) => step.classList.remove('is-signal-focus', 'is-signal-neighbor'));
      };

      steps.forEach((step, index) => {
        step.addEventListener('pointerenter', () => {
          clearFocus();
          list.classList.add('has-signal-focus');
          step.classList.add('is-signal-focus');
          steps[index + 1]?.classList.add('is-signal-neighbor');
        });
      });
      list.addEventListener('pointerleave', clearFocus, { passive: true });
    }

    const metrics = amp.querySelectorAll('.amp-metrics article, .amp-operation-lines > div');
    observeOnce(metrics, (node, index) => {
      animate(node, [
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { delay: Math.min(index, 6) * 55, duration: compact ? 480 : 650 });
    });
  }

  // ---------------------------------------------------------------------------
  // 03 / 20 PROD. — EDITORIAL COMPOSITION
  // Index rows resolve alternately; visual pieces settle into an editorial board.
  // ---------------------------------------------------------------------------
  const prod = document.querySelector('#case-20prod');
  if (prod) {
    const rows = [...prod.querySelectorAll('.prod-archive-row')];
    observeOnce(rows, (node, index) => {
      node.dataset.editorialIndex = String(index + 1).padStart(2, '0');
      const x = compact ? 0 : (index % 2 === 0 ? -28 : 28);
      animate(node, [
        { opacity: 0, transform: `translate3d(${x}px,14px,0)` },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { delay: index * (compact ? 45 : 95), duration: compact ? 500 : 710 });
    });

    const board = prod.querySelector('.prod-social-images');
    const pieces = board ? [...board.querySelectorAll('figure')] : [];
    observeOnce(pieces, (node, index) => {
      node.dataset.editorialPiece = String(index + 1).padStart(2, '0');
      animate(node, [
        { opacity: 0, transform: `translate3d(0,${18 + index * 5}px,0) rotate(${compact ? 0 : (index - 1) * 1.8}deg) scale(.97)` },
        { opacity: 1, transform: 'translate3d(0,0,0) rotate(0deg) scale(1)' }
      ], { delay: index * (compact ? 70 : 125), duration: compact ? 560 : 820 });
    });

    if (board && pieces.length && finePointer && !reduceMotion) {
      const setPieceDepth = (px = 0, py = 0) => {
        pieces.forEach((piece, index) => {
          const depth = 3.8 + index * 1.25;
          piece.style.setProperty('--piece-x', `${(px * depth).toFixed(2)}px`);
          piece.style.setProperty('--piece-y', `${(py * depth * .72).toFixed(2)}px`);
        });
      };

      board.addEventListener('pointermove', (event) => {
        const rect = board.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const py = ((event.clientY - rect.top) / rect.height - .5) * 2;
        setPieceDepth(px, py);
      }, { passive: true });
      board.addEventListener('pointerleave', () => setPieceDepth(), { passive: true });
    }
  }

  // ---------------------------------------------------------------------------
  // 04 / SUNAFIL — HUMAN CONTEXT
  // Deliberately calmer: context first, verbs second, documentary evidence last.
  // ---------------------------------------------------------------------------
  const visual = document.querySelector('#case-visual');
  if (visual) {
    observeOnce([visual.querySelector('.sunafil-documentary-main')], (node) => {
      node.classList.add('is-documentary-resolved');
      animate(node, [
        { opacity: 0, transform: 'translateY(18px) scale(1.022)', filter: 'grayscale(1) contrast(.94)' },
        { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'grayscale(.78) contrast(1.02)' }
      ], { duration: compact ? 760 : 1180 });
    }, { threshold: .08 });

    observeOnce(visual.querySelectorAll('.sunafil-verbs article'), (node, index) => {
      node.dataset.documentaryVerb = String(index + 1).padStart(2, '0');
      animate(node, [
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { delay: index * (compact ? 80 : 150), duration: compact ? 540 : 780 });
    });

    const grid = visual.querySelector('.sunafil-documentary-grid');
    const photos = grid ? [...grid.querySelectorAll('figure')] : [];
    observeOnce(photos, (node, index) => {
      animate(node, [
        { opacity: 0, transform: `translate3d(0,${compact ? 14 : 26}px,0) scale(.985)` },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { delay: index * (compact ? 90 : 160), duration: compact ? 640 : 920 });
    });

    if (grid && photos.length && finePointer) {
      const clearDocumentaryFocus = () => {
        grid.classList.remove('has-documentary-focus');
        photos.forEach((photo) => photo.classList.remove('is-documentary-focus'));
      };

      photos.forEach((photo) => {
        photo.addEventListener('pointerenter', () => {
          clearDocumentaryFocus();
          grid.classList.add('has-documentary-focus');
          photo.classList.add('is-documentary-focus');
        });
      });
      grid.addEventListener('pointerleave', clearDocumentaryFocus, { passive: true });
    }
  }
})();
