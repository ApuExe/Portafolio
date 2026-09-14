# V2.13 Lite Experience Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the V2.12.1 portfolio into a more memorable but still maintainable 2D browsing experience, led by a “Complejidad → Claridad” Hero and a coherent motion/line language across all chapters.

**Architecture:** Keep the existing static-site architecture and responsibility split. Add one focused intro module (`js/experience-intro.js`) plus a small intro-specific CSS layer (`css/experience-intro.css`), while extending the existing motion and interaction files rather than restructuring the whole codebase. Use DOM/CSS/GSAP only; no Three.js, WebGL, pinning, scrub, scroll hijacking, or persistent state.

**Tech Stack:** HTML5, CSS custom properties/Grid/Flexbox, vanilla JavaScript, GSAP already bundled in the project, IntersectionObserver, requestAnimationFrame only for bounded numeric animation.

**Spec:** `docs/superpowers/specs/2026-09-14-v2-13-lite-experience-design.md`

## Global Constraints

- Opening sequence target: approximately **2.8–3.4 seconds** on capable desktop devices.
- No Three.js, WebGL, canvas, ScrollSmoother, `pin: true`, scrub-driven narrative, custom cursor, audio, floating work previews, backend/API work, or modal case-study navigation.
- No `transition: all`.
- Prefer `transform`, `opacity`, and bounded `clip-path` for motion.
- `prefers-reduced-motion: reduce` must render the resolved Hero immediately and reduce spatial motion elsewhere.
- No content may become unavailable if JavaScript fails.
- No intentionally empty full-screen spacers or oversized informational min-heights.
- Touch targets should aim for at least 44×44 CSS px on touch layouts.
- Maintain native document scrolling.
- Validate 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, and 320×568.
- Git commits are intentionally deferred because the user wants GitHub migration only after local V2.13 Lite acceptance. Each task ends with a local checkpoint copy/QA note instead.

---

## File Map

**Create**
- `css/experience-intro.css` — Hero signal field, convergence states, responsive/reduced-motion intro rules.
- `js/experience-intro.js` — one-shot intro state machine, GSAP choreography, skip/Escape/fallback logic.
- `tests/validate_v213.py` — static regression checks for forbidden patterns, required controls, fragment integrity and local assets.
- `V2.13_LITE_QA.md` — final release checklist/results.

**Modify**
- `index.html` — semantic intro markup, skip control, local line motifs, Mi Sistema project-reference output, closing copy.
- `css/design-system.css` — only canonical tokens needed by V2.13 Lite.
- `css/motion-system.css` — shared reveal/line primitives and reduced-motion contracts.
- `css/interactive.css` — selected-node/project-reference states and interaction affordances.
- `css/stability.css` — breakpoint hardening and overflow/spacing protections.
- `js/app.js` — small integration hooks only; keep intro orchestration out of this file.
- `js/motion-system.js` — reusable case-specific reveal triggers where existing primitives are insufficient.
- `README.md`, `MOTION_SYSTEM.md` — owner-facing run/maintenance notes and motion vocabulary.

---

### Task 1: Add a Static Regression Harness Before Changing the Experience

**Files:**
- Create: `tests/validate_v213.py`
- Modify: none

**Interfaces:**
- Consumes: project root path.
- Produces: CLI validator returning exit code 0 on pass, non-zero on regression.

- [ ] **Step 1: Write the validator with checks that fail against the not-yet-implemented V2.13 requirements**

Include assertions for:

```python
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "css").glob("*.css"))
JS = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "js").glob("*.js"))

assert 'data-experience-intro' in HTML, "missing V2.13 intro root"
assert 'data-intro-skip' in HTML, "missing intro skip control"
assert 'transition: all' not in CSS
assert 'pin: true' not in JS and 'pin:true' not in JS
assert 'scrub:' not in JS
assert 'wheel' not in JS.lower() or 'preventdefault' not in JS.lower()
assert 'touchmove' not in JS.lower() or 'preventdefault' not in JS.lower()
assert 'three' not in JS.lower(), "Three.js is outside V2.13 Lite scope"
```

Also parse `href="#..."` values and verify every fragment target exists, and verify each local `src`/`href` asset path exists.

- [ ] **Step 2: Run the validator and verify it fails for the missing intro contract**

Run:

```bash
python3 tests/validate_v213.py
```

Expected: FAIL with `missing V2.13 intro root` or `missing intro skip control`.

- [ ] **Step 3: Record baseline output in `V2.13_LITE_QA.md`**

Create the document with a section `Baseline before implementation` and paste the failing requirement names, not raw stack traces.

- [ ] **Step 4: Save local checkpoint**

Copy the untouched V2.12.1 directory to a sibling backup named `luis-sabrera-portfolio-v2.12.1-pre-v213-lite` if it does not already exist.

---

### Task 2: Build the Semantic Hero Intro Markup and Resolved Fallback State

**Files:**
- Create: `css/experience-intro.css`
- Modify: `index.html`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: existing Hero markup and design-system tokens.
- Produces: `[data-experience-intro]`, `[data-intro-skip]`, `[data-intro-signal]`, `[data-intro-line]`, and a fully readable resolved Hero without JavaScript.

- [ ] **Step 1: Extend the validator to require a semantic skip button and non-empty Hero headline**

Add checks equivalent to:

```python
assert re.search(r'<button[^>]+data-intro-skip[^>]*>.*?OMITIR', HTML, re.S | re.I)
assert 'HAGO ENTENDIBLE' in HTML and 'LO COMPLEJO' in HTML
```

- [ ] **Step 2: Run the validator and confirm failure**

Run `python3 tests/validate_v213.py`.

Expected: FAIL on intro markup requirements.

- [ ] **Step 3: Add the intro layer inside the existing Hero without replacing the real content**

Use semantic structure similar to:

```html
<div class="experience-intro" data-experience-intro aria-hidden="true">
  <div class="experience-intro__signals">
    <span data-intro-signal>UX</span>
    <span data-intro-signal>PRODUCTO</span>
    <span data-intro-signal>DATOS</span>
    <span data-intro-signal>CRM</span>
    <span data-intro-signal>SISTEMAS</span>
    <span data-intro-signal>COMUNICACIÓN</span>
    <span data-intro-signal>53.8%</span>
    <span data-intro-signal>01—04</span>
  </div>
  <div class="experience-intro__lines" aria-hidden="true">
    <i data-intro-line></i>
    <i data-intro-line></i>
    <i data-intro-line></i>
    <i data-intro-line></i>
  </div>
</div>
<button class="experience-intro__skip" type="button" data-intro-skip>OMITIR ↗</button>
```

The existing Hero headline remains real DOM content and visible by default. Intro CSS may only transform/overlay decorative layers after JavaScript adds an initializing class to `<html>`.

- [ ] **Step 4: Add baseline CSS with zero-JS safe defaults**

`css/experience-intro.css` must default to:

```css
.experience-intro,
.experience-intro__skip {
  display: none;
}

html.has-experience-intro .experience-intro,
html.has-experience-intro .experience-intro__skip {
  display: block;
}
```

Use `position: absolute` only inside the Hero, `pointer-events: none` for decorative fragments, and retain native layout for the headline/content.

- [ ] **Step 5: Load `css/experience-intro.css` after design-system/motion layers and before final stability overrides**

Do not reorder unrelated stylesheets.

- [ ] **Step 6: Run static validator**

Expected: markup-related checks PASS; missing JS module checks may still fail if added later.

- [ ] **Step 7: Save local checkpoint**

Duplicate current project to a sibling checkpoint directory ending `-task2-hero-markup`.

---

### Task 3: Implement the One-Shot “Complejidad → Claridad” Hero Choreography

**Files:**
- Create: `js/experience-intro.js`
- Modify: `index.html`, `css/experience-intro.css`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: `window.gsap` when available; intro data attributes from Task 2.
- Produces: `window.PortfolioIntro.init()` and `window.PortfolioIntro.resolve(reason)`; resolved DOM class `html.intro-resolved`.

- [ ] **Step 1: Extend validator for module inclusion, Escape/skip hooks and forbidden continuous loops**

Require `js/experience-intro.js` in `index.html`, require references to `data-intro-skip`, `Escape`, `prefers-reduced-motion`, and forbid bare permanent `requestAnimationFrame(` loops in that module.

- [ ] **Step 2: Run validator and confirm failure**

Expected: FAIL because module does not exist/is not loaded.

- [ ] **Step 3: Implement intro state machine with an immediate fallback**

Module shape:

```javascript
(() => {
  const root = document.documentElement;
  const intro = document.querySelector('[data-experience-intro]');
  const skip = document.querySelector('[data-intro-skip]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let resolved = false;
  let timeline = null;

  function resolve(reason = 'complete') {
    if (resolved) return;
    resolved = true;
    timeline?.kill();
    root.classList.remove('intro-running');
    root.classList.add('intro-resolved');
    intro?.setAttribute('aria-hidden', 'true');
    if (skip) skip.hidden = true;
    document.dispatchEvent(new CustomEvent('portfolio:intro-resolved', { detail: { reason } }));
  }

  function init() {
    if (!intro || !skip || reduceMotion || !window.gsap) {
      resolve(reduceMotion ? 'reduced-motion' : 'fallback');
      return;
    }
    root.classList.add('has-experience-intro', 'intro-running');
    // GSAP timeline added in Step 4.
  }

  skip?.addEventListener('click', () => resolve('skip'));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !resolved) resolve('escape');
  });

  window.PortfolioIntro = { init, resolve };
  init();
})();
```

- [ ] **Step 4: Add bounded GSAP choreography totaling ~3.1 s**

Use one timeline only:

```javascript
const signals = gsap.utils.toArray('[data-intro-signal]');
const lines = gsap.utils.toArray('[data-intro-line]');

timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => resolve('complete') });

timeline
  .fromTo(signals,
    { autoAlpha: 0, x: () => gsap.utils.random(-55, 55), y: () => gsap.utils.random(-38, 38), rotate: () => gsap.utils.random(-5, 5) },
    { autoAlpha: 1, x: 0, y: 0, rotate: 0, duration: .72, stagger: .045 })
  .fromTo(lines,
    { scaleX: 0, transformOrigin: 'left center' },
    { scaleX: 1, duration: .6, stagger: .07 }, '-=.35')
  .to(signals, { x: 0, y: 0, duration: .62, stagger: .025, ease: 'power2.inOut' }, '+=.15')
  .to('[data-hero-title]', { autoAlpha: 1, y: 0, duration: .7 }, '-=.25')
  .to([signals, lines], { autoAlpha: 0, duration: .35 }, '-=.15');
```

If the existing headline lacks `data-hero-title`, add the attribute without changing its semantic heading.

- [ ] **Step 5: Add optional pointer proximity only while intro is running and only for fine pointers**

Use one `pointermove` listener that updates CSS custom properties or GSAP quick setters. Remove the listener inside `resolve()`. Do not create a persistent animation loop.

- [ ] **Step 6: Add responsive/reduced-motion intro CSS**

Desktop: full signal set. Tablet: hide 2–3 low-priority fragments. Mobile: show only 4–5 fragments and shorten travel distances. Reduced motion: intro layer stays hidden and Hero resolved.

- [ ] **Step 7: Run validator and `node --check js/experience-intro.js`**

Expected: both PASS.

- [ ] **Step 8: Save local checkpoint**

Create sibling checkpoint ending `-task3-hero-intro`.

---

### Task 4: Extend the Continuous Line Motif Across the Four Chapters

**Files:**
- Modify: `index.html`, `css/motion-system.css`, `js/motion-system.js`, `css/stability.css`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: existing line-trace observer/motion primitives.
- Produces: local `[data-story-line]` elements/section classes that draw once when contextual content enters view.

- [ ] **Step 1: Add validator checks for one line motif per experience and no page-spanning SVG/canvas**

Require local story-line hooks inside `#case-tkoh`, `#case-amp`, `#case-20prod`, `#case-visual`; forbid `<canvas` and a global SVG with fixed/full-page positioning.

- [ ] **Step 2: Run validator and confirm failure**

Expected: missing story-line hooks.

- [ ] **Step 3: Add local motifs matching each case vocabulary**

Implement:

```html
<div class="story-line story-line--architecture" data-story-line aria-hidden="true"></div>
```

for TKOH, a five-step normal-flow relationship line in Amazon using text plus arrows/shape, editorial divider lines for 20 Prod., and lighter documentary dividers in SUNAFIL.

- [ ] **Step 4: Extend the existing IntersectionObserver in `js/motion-system.js`**

On first intersection, add `.is-traced` to each `[data-story-line]`, then unobserve it. Do not tie line progress to scroll position.

- [ ] **Step 5: Implement CSS draw behavior using transforms**

Use pseudo-elements or inner spans with `scaleX(0) → scaleX(1)` or `scaleY(0) → scaleY(1)`, with durations from motion tokens. Preserve the underlying structural divider so content never depends on animation.

- [ ] **Step 6: Add mobile simplification**

At <= 760 px, convert vertical motifs to horizontal dividers or hide purely decorative branches. Ensure no line creates horizontal page overflow.

- [ ] **Step 7: Run validator and JS syntax checks**

Expected: PASS.

- [ ] **Step 8: Save local checkpoint**

Create sibling checkpoint ending `-task4-story-lines`.

---

### Task 5: Give Each Case a Distinct but Related Reveal Vocabulary

**Files:**
- Modify: `css/motion-system.css`, `js/motion-system.js`, `css/stability.css`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: current `.reveal-card`, metric animation, chapter DOM.
- Produces: case-specific classes/states without new dependencies.

- [ ] **Step 1: Add static checks for `transition: all`, oversized fixed viewport stages, and forbidden sticky/pin regressions**

Search all CSS/JS and fail on `transition: all`, `min-height: 100vh` inside informational case blocks, `position: sticky` on case storytelling blocks, `pin:` or `scrub:`.

- [ ] **Step 2: Run validator and fix only newly exposed V2.13 regressions, not unrelated historical CSS unless it violates the current contract**

Expected: baseline should stay clean before adding new motion.

- [ ] **Step 3: TKOH — add image clip reveal and annotation trace**

Use `clip-path: inset(0 0 0 0)` from a small bounded inset and opacity. Keep screenshot dimensions constant to avoid CLS.

- [ ] **Step 4: Amazon — refine metrics and operational line**

Keep existing numeric animation; use tabular numbers and a transform-based proportional rule. Run once per metric group.

- [ ] **Step 5: 20 Prod. — add editorial mask/stagger**

Reveal rows with short 40–60 ms stagger and no artificial empty stage/min-height.

- [ ] **Step 6: SUNAFIL — quiet photo/caption split reveal**

Images use slower opacity/scale `1.01 → 1`; captions enter separately with shorter vertical travel. No blue technological overlay is added to photographs.

- [ ] **Step 7: Add reduced-motion equivalents**

All content visible; keep opacity/state changes only where useful.

- [ ] **Step 8: Run validator and syntax checks**

Expected: PASS.

- [ ] **Step 9: Save local checkpoint**

Create sibling checkpoint ending `-task5-case-motion`.

---

### Task 6: Make “Mi Sistema” the Accessible 2D Climax

**Files:**
- Modify: `index.html`, `css/interactive.css`, `js/app.js`, `css/stability.css`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: existing `[data-system-node]` nodes and core state messaging.
- Produces: node selection state plus project relevance list for each node.

- [ ] **Step 1: Extend validator to require keyboard-operable system controls and project-reference region**

Require each system node to be a native `button` or contain a native button, and require a region such as `[data-system-projects]` with accessible label.

- [ ] **Step 2: Run validator and confirm failure if nodes are still generic articles**

Expected: FAIL until semantic controls are added.

- [ ] **Step 3: Convert the four node interaction surfaces to native buttons while preserving layout**

Keep visible text exactly: Señales, Estructura, Interfaz, Aprender. Use `aria-pressed="true|false"` for selected state.

- [ ] **Step 4: Add project relevance data in HTML/JS**

Use a small static object:

```javascript
const SYSTEM_PROJECTS = {
  signals: [
    ['Amazon Magic Park', 'strong'],
    ['SUNAFIL', 'strong'],
    ['TKOH', 'medium'],
    ['20 Prod.', 'contextual']
  ],
  structure: [
    ['TKOH', 'strong'],
    ['Amazon Magic Park', 'strong'],
    ['20 Prod.', 'medium'],
    ['SUNAFIL', 'contextual']
  ],
  interface: [
    ['TKOH', 'strong'],
    ['20 Prod.', 'medium'],
    ['Amazon Magic Park', 'contextual'],
    ['SUNAFIL', 'contextual']
  ],
  learn: [
    ['Amazon Magic Park', 'strong'],
    ['TKOH', 'strong'],
    ['SUNAFIL', 'medium'],
    ['20 Prod.', 'medium']
  ]
};
```

Render strength using text (`FUERTE`, `MEDIA`, `CONTEXTUAL`) plus a small shape, not color alone.

- [ ] **Step 5: Preserve click/tap/focus/Enter/Space and stable arrow-key navigation if currently present**

Selection updates core copy, `aria-pressed`, highlighted local connection line and project list. No drag or hover-only essential data.

- [ ] **Step 6: Add responsive layout**

Desktop may keep radial composition. Tablet/mobile must reflow controls and project list without overlap or fixed-height clipping.

- [ ] **Step 7: Run validator, `node --check js/app.js`, and keyboard-focused manual check**

Expected: PASS.

- [ ] **Step 8: Save local checkpoint**

Create sibling checkpoint ending `-task6-system-climax`.

---

### Task 7: Resolve the Narrative in Contact and Run the Final Density/Responsive Pass

**Files:**
- Modify: `index.html`, `css/style.css`, `css/stability.css`, `css/interactive.css`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: existing contact details and four-experience visited state.
- Produces: final closing message that works regardless of progress state.

- [ ] **Step 1: Add validator checks for final narrative copy and required contact methods**

Require:

```text
YA VISTE CÓMO PIENSO.
Ahora cuéntame qué necesitas hacer más claro.
luis.sabrera@studios-tkoh.online
```

and retain CV link + Lima, Perú.

- [ ] **Step 2: Run validator and confirm failure on old contact headline**

- [ ] **Step 3: Replace only the primary closing headline/subheadline**

Do not remove direct email, mailto, CV or location. Completion state may add a visual accent/class but must not change access to the CTA.

- [ ] **Step 4: Run a density audit at each contractual viewport**

Check for: accidental full-screen blank areas, oversized `min-height`, overlapping headings, clipped fixed/floating UI, and horizontal overflow.

- [ ] **Step 5: Fix density with local spacing/min-height changes only**

Do not add blanket global negative margins. Preserve V2.11.2 compact profile/contact corrections.

- [ ] **Step 6: Validate focus order and 44×44 touch targets on 390/430 widths**

Ensure skip, system buttons, project rows, email/CV actions are comfortably tappable.

- [ ] **Step 7: Run validator**

Expected: PASS.

- [ ] **Step 8: Save local checkpoint**

Create sibling checkpoint ending `-task7-narrative-close`.

---

### Task 8: Final Local QA, Documentation and Release Packaging

**Files:**
- Modify: `README.md`, `MOTION_SYSTEM.md`, `FINAL_QA.md`, `INTERACTION_QA.md`
- Create/Modify: `V2.13_LITE_QA.md`
- Test: `tests/validate_v213.py`

**Interfaces:**
- Consumes: finished V2.13 Lite project.
- Produces: locally accepted release candidate ZIP ready for later GitHub migration.

- [ ] **Step 1: Run all static checks**

```bash
python3 tests/validate_v213.py
node --check js/app.js
node --check js/motion-system.js
node --check js/experience-intro.js
```

Expected: all PASS.

- [ ] **Step 2: Parse CSS for fatal syntax errors**

Use the existing CSS parser approach from prior QA and record zero fatal parse errors.

- [ ] **Step 3: Render/inspect the eight contractual viewport sizes**

Record each viewport in `V2.13_LITE_QA.md` with checks for overflow, overlap, unintended empty space, Hero resolved state, line motifs, Mi Sistema and Contact.

- [ ] **Step 4: Validate reduced motion**

Force `prefers-reduced-motion: reduce`; confirm intro is skipped, final Hero is visible, system remains usable and no required state depends on animation.

- [ ] **Step 5: Validate intro interruption**

Check: OMITIR button, Escape, GSAP-unavailable fallback, and return-to-top after resolution.

- [ ] **Step 6: Update owner-facing README**

Document simple local usage, file responsibilities, what not to change casually, and that GitHub migration/deployment is the next phase after acceptance.

- [ ] **Step 7: Update motion documentation**

Describe the three motion classes: microinteraction, reveal and editorial sequence, with duration ranges and reduced-motion behavior.

- [ ] **Step 8: Package release candidate**

Create:

```text
luis-sabrera-portfolio-v2.13.0-lite-rc1.zip
```

Verify ZIP integrity with `unzip -t`.

- [ ] **Step 9: Final self-review against the spec**

Confirm all 10 acceptance criteria from the design spec have a recorded PASS or a clearly stated deployment-only validation item (LCP/INP/CLS).

---

## Plan Self-Review

### Spec coverage

- Hero complexity→clarity: Task 2–3.
- Skip/Escape/reduced-motion/fallback: Task 3 + Task 8.
- Motion governance: Task 3–5 + docs Task 8.
- Continuous line motif: Task 4.
- Case-specific motion: Task 5.
- Mi Sistema 2D climax: Task 6.
- Selected Work preview remains removed / no scroll hijacking: global validator + Task 4–5.
- Density and contact closure: Task 7.
- Accessibility/responsive/performance constraints: Tasks 3, 6, 7, 8.
- Static/local QA before GitHub: Task 8.

### Placeholder scan

No `TBD`, `TODO`, “implement later”, or unspecified testing steps remain.

### Interface consistency

- Intro contract is consistently `[data-experience-intro]`, `[data-intro-skip]`, `PortfolioIntro.init()` and `PortfolioIntro.resolve(reason)`.
- Story line contract is consistently `[data-story-line]` + `.is-traced`.
- Mi Sistema project region is consistently `[data-system-projects]`.
- Git commits are deliberately replaced with local checkpoints until the user authorizes GitHub migration.
