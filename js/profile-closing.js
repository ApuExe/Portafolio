(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const about = document.querySelector('#about');
  const contact = document.querySelector('#contact');

  const animate = (node, keyframes, options) => {
    if (!node || reduceMotion || typeof node.animate !== 'function') return;
    node.animate(keyframes, { fill: 'both', ...options });
  };

  const observeOnce = (target, callback, options = {}) => {
    if (!target) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      callback(target);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        callback(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: options.threshold ?? .14, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' });
    observer.observe(target);
  };

  // ---------------- Profile: one connected editorial system ----------------
  if (about) {
    const heading = about.querySelector('.about-layout h2');
    const copy = [...about.querySelectorAll('.about-copy p')];
    const signatureHead = [...about.querySelectorAll('.profile-signature-head > *')];
    const lensesWrap = about.querySelector('.profile-lenses');
    const lenses = [...about.querySelectorAll('[data-profile-lens]')];
    const currentIntro = about.querySelector('.profile-current-intro');
    const current = [...about.querySelectorAll('[data-profile-current]')];
    const detailCards = [...about.querySelectorAll('.profile-grid-refined article')];

    observeOnce(about, () => {
      about.classList.add('profile-story-active');
      about.style.setProperty('--profile-thread-progress', '1');

      animate(heading, [
        { opacity: 0, transform: 'translate3d(0,42px,0)', clipPath: 'inset(0 0 78% 0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)', clipPath: 'inset(0 0 0% 0)' }
      ], { duration: 920, easing: 'cubic-bezier(.22,.61,.36,1)' });

      copy.forEach((node, index) => animate(node, [
        { opacity: 0, transform: 'translate3d(0,16px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 560, delay: 160 + index * 95, easing: 'cubic-bezier(.22,.61,.36,1)' }));

      signatureHead.forEach((node, index) => animate(node, [
        { opacity: 0, transform: 'translate3d(0,20px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 620, delay: 280 + index * 80, easing: 'cubic-bezier(.22,.61,.36,1)' }));

      lenses.forEach((node, index) => animate(node, [
        { opacity: 0, transform: `translate3d(${index === 0 ? '-18px' : index === 2 ? '18px' : '0'},26px,0)` },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 720, delay: 430 + index * 120, easing: 'cubic-bezier(.22,.61,.36,1)' }));

      animate(currentIntro, [
        { opacity: 0, transform: 'translate3d(-18px,0,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 620, delay: 700, easing: 'cubic-bezier(.22,.61,.36,1)' });

      current.forEach((node, index) => animate(node, [
        { opacity: 0, transform: 'translate3d(0,22px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 620, delay: 760 + index * 100, easing: 'cubic-bezier(.22,.61,.36,1)' }));

      detailCards.forEach((node, index) => animate(node, [
        { opacity: 0, transform: 'translate3d(0,18px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 560, delay: 930 + index * 80, easing: 'cubic-bezier(.22,.61,.36,1)' }));
    }, { threshold: .07, rootMargin: '0px 0px -5% 0px' });

    const setLensFocus = (lens) => {
      if (!lensesWrap) return;
      lensesWrap.classList.toggle('has-profile-focus', Boolean(lens));
      lenses.forEach((item) => item.classList.toggle('is-profile-focus', item === lens));
    };

    lenses.forEach((lens) => {
      lens.tabIndex = 0;
      lens.addEventListener('pointerenter', () => finePointer && setLensFocus(lens));
      lens.addEventListener('pointerleave', () => finePointer && setLensFocus(null));
      lens.addEventListener('focus', () => setLensFocus(lens));
      lens.addEventListener('blur', () => setLensFocus(null));
      lens.addEventListener('click', () => {
        if (!finePointer) setLensFocus(lens.classList.contains('is-profile-focus') ? null : lens);
      });
    });

    if (finePointer && !reduceMotion) {
      let profileRaf = 0;
      about.addEventListener('pointermove', (event) => {
        if (profileRaf) cancelAnimationFrame(profileRaf);
        profileRaf = requestAnimationFrame(() => {
          const rect = about.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
          const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2));
          about.style.setProperty('--profile-life-x', `${(x * 7).toFixed(2)}px`);
          about.style.setProperty('--profile-life-y', `${(y * 5).toFixed(2)}px`);
        });
      }, { passive: true });
      about.addEventListener('pointerleave', () => {
        about.style.setProperty('--profile-life-x', '0px');
        about.style.setProperty('--profile-life-y', '0px');
      }, { passive: true });
    }
  }

  // ---------------- Contact: narrative resolution ----------------
  if (contact) {
    const lines = [...contact.querySelectorAll('.contact-line > span')];
    const resolution = contact.querySelector('.contact-resolution');
    const actions = contact.querySelector('.contact-actions');
    const direct = contact.querySelector('.contact-direct');
    const capabilitiesWrap = contact.querySelector('.contact-capabilities');
    const capabilities = [...contact.querySelectorAll('[data-contact-capability]')];
    const monogram = contact.querySelector('.contact-monogram');

    contact.style.setProperty('--closing-x', '50%');
    contact.style.setProperty('--closing-y', '42%');

    observeOnce(contact, () => {
      contact.classList.add('closing-live');

      lines.forEach((node, index) => animate(node, [
        { opacity: 0, transform: 'translate3d(0,92%,0)', filter: 'blur(7px)' },
        { opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0px)' }
      ], { duration: 860, delay: index * 115, easing: 'cubic-bezier(.16,1,.3,1)' }));

      animate(resolution, [
        { opacity: 0, transform: 'translate3d(0,18px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 620, delay: 260, easing: 'cubic-bezier(.22,.61,.36,1)' });

      animate(actions, [
        { opacity: 0, transform: 'translate3d(0,24px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 680, delay: 390, easing: 'cubic-bezier(.22,.61,.36,1)' });

      animate(direct, [
        { opacity: .25, transform: 'translate3d(0,12px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 620, delay: 470, easing: 'cubic-bezier(.22,.61,.36,1)' });

      capabilities.forEach((node, index) => animate(node, [
        { opacity: 0, transform: 'translate3d(0,28px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 660, delay: 570 + index * 105, easing: 'cubic-bezier(.22,.61,.36,1)' }));

      animate(monogram, [
        { opacity: .15, transform: 'translate3d(32px,18px,0) scale(.975)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 1250, delay: 160, easing: 'cubic-bezier(.22,.61,.36,1)' });
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });

    const setCapabilityFocus = (card) => {
      if (!capabilitiesWrap) return;
      capabilitiesWrap.classList.toggle('has-contact-focus', Boolean(card));
      capabilities.forEach((item) => item.classList.toggle('is-contact-focus', item === card));
    };

    capabilities.forEach((card) => {
      card.tabIndex = 0;
      card.addEventListener('pointerenter', () => finePointer && setCapabilityFocus(card));
      card.addEventListener('pointerleave', () => finePointer && setCapabilityFocus(null));
      card.addEventListener('focus', () => setCapabilityFocus(card));
      card.addEventListener('blur', () => setCapabilityFocus(null));
      card.addEventListener('click', () => {
        if (!finePointer) setCapabilityFocus(card.classList.contains('is-contact-focus') ? null : card);
      });
    });

    if (finePointer && !reduceMotion) {
      let closingRaf = 0;
      contact.addEventListener('pointermove', (event) => {
        if (closingRaf) cancelAnimationFrame(closingRaf);
        closingRaf = requestAnimationFrame(() => {
          const rect = contact.getBoundingClientRect();
          const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
          const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
          const dx = (nx - .5) * 2;
          const dy = (ny - .5) * 2;
          contact.style.setProperty('--closing-x', `${(nx * 100).toFixed(1)}%`);
          contact.style.setProperty('--closing-y', `${(ny * 100).toFixed(1)}%`);
          contact.style.setProperty('--closing-life-x', `${(dx * 8).toFixed(2)}px`);
          contact.style.setProperty('--closing-life-y', `${(dy * 6).toFixed(2)}px`);
        });
      }, { passive: true });

      contact.addEventListener('pointerleave', () => {
        contact.style.setProperty('--closing-x', '50%');
        contact.style.setProperty('--closing-y', '42%');
        contact.style.setProperty('--closing-life-x', '0px');
        contact.style.setProperty('--closing-life-y', '0px');
      }, { passive: true });
    }

    // Keep continuous decorative motion alive only while Contact is visible.
    if ('IntersectionObserver' in window && !reduceMotion) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => contact.classList.toggle('closing-visible', entry.isIntersecting));
      }, { threshold: .03 });
      visibilityObserver.observe(contact);
    }
  }
})();
