(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------
  // Structural line traces
  // The original borders remain in place. A transient signal travels along
  // them once, so there is no layout shift and no dependency on scroll speed.
  // -------------------------------------------------------
  const lineSpecs = [
    ['.signal-strip', ['top', 'bottom']],
    ['.signal-strip span:not(:last-child)', ['right']],
    ['.project-list', ['top']],
    ['.project-row', ['bottom']],
    ['.exp-head', ['bottom']],
    ['.exp-facts', ['top']],
    ['.exp-facts > div', ['bottom']],
    ['.exp-stage-product', ['top']],
    ['.exp-annotations', ['bottom']],
    ['.exp-annotations > div + div', ['left']],
    ['.exp-sequence', ['top']],
    ['.exp-sequence-list', ['top', 'bottom']],
    ['.exp-sequence-list article + article', ['left']],
    ['.exp-proof', ['top']],
    ['.exp-resource-line', ['top', 'bottom']],
    ['.amp-flow', ['top', 'bottom']],
    ['.amp-metrics', ['top', 'bottom']],
    ['.amp-metrics article + article', ['left']],
    ['.amp-operation-lines', ['top']],
    ['.amp-operation-lines > div', ['bottom']],
    ['.prod-archive', ['top']],
    ['.prod-archive-row', ['top']],
    ['.prod-archive-row:last-child', ['bottom']],
    ['.sunafil-documentary-main', ['top']],
    ['.sunafil-verbs', ['top', 'bottom']],
    ['.sunafil-verbs article + article', ['left']],
    ['.system-node', ['top']],
    ['.profile-signature', ['top']],
    ['.profile-lenses', ['top', 'bottom']],
    ['.profile-lens + .profile-lens', ['left']],
    ['.profile-current', ['top', 'bottom']],
    ['.profile-current > * + *', ['left']],
    ['.profile-grid-refined', ['top', 'bottom']],
    ['.profile-grid-refined article + article', ['left']],
    ['.contact-direct', ['top']],
    ['.contact-capabilities', ['top', 'bottom']],
    ['.contact-capabilities article + article', ['left']],
    ['.profile-map-grid article + article', ['left']],
    ['footer', ['top']]
  ];

  const observedHosts = [];

  const addLine = (host, edge) => {
    if (host.querySelector(`:scope > .motion-line--${edge}`)) return;
    const originalPosition = window.getComputedStyle(host).position;
    host.classList.add('motion-line-host');
    if (originalPosition === 'static') host.classList.add('motion-line-context');
    const line = document.createElement('span');
    line.className = `motion-line motion-line--${edge}`;
    line.setAttribute('aria-hidden', 'true');
    host.append(line);
  };

  lineSpecs.forEach(([selector, edges]) => {
    document.querySelectorAll(selector).forEach((host) => {
      edges.forEach((edge) => addLine(host, edge));
      observedHosts.push(host);
    });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const lineObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const lines = [...entry.target.querySelectorAll(':scope > .motion-line')];
        lines.forEach((line, index) => {
          window.setTimeout(() => line.classList.add('is-tracing'), index * 55);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    [...new Set(observedHosts)].forEach((host) => lineObserver.observe(host));
  }

  // V2.13 chapter story lines: local, one-shot, never scroll-scrubbed.
  const storyLines = [...document.querySelectorAll('[data-story-line]')];
  if (storyLines.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      storyLines.forEach((line) => line.classList.add('is-traced'));
    } else {
      const storyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-traced');
          observer.unobserve(entry.target);
        });
      }, { threshold: .35, rootMargin: '0px 0px -10% 0px' });
      storyLines.forEach((line) => storyObserver.observe(line));
    }
  }

  // Mi Sistema gets one structural-line entrance independent from its node interaction.
  const systemEngine = document.querySelector('[data-system-engine]');
  if (systemEngine) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      systemEngine.classList.add('is-line-active');
    } else {
      const systemObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        systemEngine.classList.add('is-line-active');
        observer.disconnect();
      }, { threshold: .2 });
      systemObserver.observe(systemEngine);
    }
  }

  // -------------------------------------------------------
  // Metric evidence
  // Counts are animated only once and only when they become meaningful.
  // Final values remain in the DOM and reduced-motion users see them directly.
  // -------------------------------------------------------
  const metricNodes = [...document.querySelectorAll('.amp-metrics strong')];
  const metricArticles = [...document.querySelectorAll('.amp-metrics article')];

  const parseMetric = (node) => {
    const source = node.textContent.trim();
    const match = source.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    const value = Number(match[1]);
    if (!Number.isFinite(value)) return null;
    return {
      source,
      value,
      suffix: match[2] || '',
      decimals: (match[1].split('.')[1] || '').length
    };
  };

  const animateMetric = (node) => {
    const metric = parseMetric(node);
    if (!metric || reduceMotion) return;
    node.setAttribute('aria-label', metric.source);
    const started = performance.now();
    const duration = 680;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const frame = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const current = metric.value * ease(progress);
      node.textContent = `${current.toFixed(metric.decimals)}${metric.suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
      else node.textContent = metric.source;
    };
    requestAnimationFrame(frame);
  };

  const revealMetrics = () => {
    metricNodes.forEach(animateMetric);
    metricArticles.forEach((article, index) => {
      const node = article.querySelector('strong');
      const metric = node ? parseMetric(node) : null;
      if (metric) {
        const ratio = Math.max(.14, Math.min(1, metric.value / 100));
        article.style.setProperty('--metric-ratio', ratio.toFixed(3));
      }
      window.setTimeout(() => article.classList.add('is-metric-seen'), reduceMotion ? 0 : index * 55);
    });
  };

  if (metricArticles.length && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealMetrics();
      observer.disconnect();
    }, { threshold: .32 });
    metricObserver.observe(document.querySelector('.amp-metrics'));
  } else if (metricArticles.length) {
    metricArticles.forEach((article) => article.classList.add('is-metric-seen'));
  }

  // -------------------------------------------------------
  // Keyboard-friendly project intent feedback.
  // Adds a readable state cue to the live region without changing layout.
  // -------------------------------------------------------
  const live = document.querySelector('[data-live-status]');
  document.querySelectorAll('.project-link').forEach((link) => {
    link.addEventListener('focus', () => {
      if (!live) return;
      const title = link.querySelector('h3')?.textContent?.trim();
      if (title) live.textContent = `Proyecto seleccionado: ${title}. Presiona Enter para abrir el caso.`;
    });
  });
})();
