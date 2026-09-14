# V2.13 Experience Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the V2.12.1 portfolio into a continuous “Complejidad → Claridad” experience with a memorable opening, coherent chapter motion, a stronger system climax, and a narrative closing while preserving native scroll, accessibility, responsive behavior, and the current visual identity.

**Architecture:** Keep the current HTML content and design-system layers as canonical. Add one removable `experience-layer.css` and one focused `experience-layer.js`; the opening is a temporary visual layer inside the real hero, and chapter continuity is implemented through local section primitives rather than a single brittle cross-page canvas. The HTML experience remains fully usable with JavaScript or GSAP unavailable.

**Tech Stack:** HTML5, CSS custom properties/Grid/Flex, vanilla JavaScript, GSAP already used by the project, IntersectionObserver, requestAnimationFrame, Python stdlib validation script.

**Spec:** `docs/superpowers/specs/2026-09-14-v2-13-experience-layer-design.md`

## Global Constraints

- Native scrolling only: no `ScrollSmoother`, wheel/touch hijacking, `pin`, or `scrub` for page storytelling.
- No Three.js in the hero; Three.js remains optional and isolated to a later Mi Sistema prototype.
- Real hero content exists from the first frame; the intro is not a loader.
- Intro duration target on motion-capable desktop: 2.8–3.4 seconds.
- Visible `OMITIR ↗` control and `Escape` must resolve the intro immediately.
- `prefers-reduced-motion: reduce` starts in the resolved state.
- No hover-only information; all meaningful interaction must have click/tap/keyboard equivalence.
- Keep current identity: white/black/neutrals + signal blue, Inter + DM Mono, editorial grid, current icon, strong rules/lines.
- Keep chapter personalities distinct: TKOH technical/product, Amazon data/operations, 20 Prod editorial/brand, SUNAFIL documentary/human.
- No `transition: all`; motion prefers `transform`, `opacity`, and limited `clip-path`.
- No preview overlay, no large empty-space regression, no custom cursor, no site-wide WebGL.
- Main contact email remains `luis.sabrera@studios-tkoh.online`.
- Git commits are intentionally deferred because the user wants GitHub setup after V2.13; each task instead creates a locally testable milestone and the final package will be uploaded later.

---

## File Structure

**Create**
- `css/experience-layer.css` — V2.13 intro visuals, chapter-specific continuity, narrative close.
- `js/experience-layer.js` — intro orchestration, idempotent resolution, chapter context hooks, closure state.
- `tests/validate_v213.py` — deterministic structural regression checks runnable without external packages.
- `V2.13_QA.md` — final implementation/QA record.

**Modify**
- `index.html` — intro layer inside hero, chapter line hooks, system connection hooks, final contact copy, new stylesheet/script includes.
- `css/design-system.css` — only new semantic tokens if required by the V2.13 layer; no duplicate token families.
- `css/motion-system.css` — only shared line grammar additions used by more than one chapter.
- `css/stability.css` — responsive/reduced-motion hardening only when V2.13 requires it.
- `js/app.js` — minimal integration hooks only; V2.13 state remains owned by `experience-layer.js`.
- `README.md` — version, architecture, run instructions.
- `MOTION_SYSTEM.md` — ownership rules and V2.13 motion semantics.
- `FINAL_QA.md` / `INTERACTION_QA.md` — update release checks after implementation.

---

### Task 1: Add the V2.13 regression harness before feature code

**Files:**
- Create: `tests/validate_v213.py`
- Modify: none

**Interfaces:**
- Consumes: current project files under the repository root.
- Produces: a zero-exit-code validation command `python3 tests/validate_v213.py` that later tasks must keep green.

- [ ] **Step 1: Write the initial validation script with expectations that intentionally fail before V2.13 exists**

```python
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "css").glob("*.css"))
JS = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "js").glob("*.js"))

class Scan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.hrefs = []
        self.srcs = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if "id" in data: self.ids.append(data["id"])
        if "href" in data: self.hrefs.append(data["href"])
        if "src" in data: self.srcs.append(data["src"])
        if tag == "link" and "href" in data: self.links.append(data["href"])

scan = Scan(); scan.feed(HTML)
errors = []

def require(condition, message):
    if not condition: errors.append(message)

require(len(scan.ids) == len(set(scan.ids)), "duplicate HTML ids")
for href in scan.hrefs:
    if href.startswith("#") and len(href) > 1:
        require(href[1:] in set(scan.ids), f"broken fragment: {href}")
for ref in scan.srcs + scan.links:
    if ref.startswith(("http://", "https://", "mailto:", "#", "data:")):
        continue
    path = ref.split("?", 1)[0]
    require((ROOT / path).exists(), f"missing local asset: {path}")

# V2.13 contract — expected to fail before implementation.
require('class="experience-intro"' in HTML, "missing experience intro layer")
require('data-intro-skip' in HTML, "missing intro skip control")
require('css/experience-layer.css' in HTML, "missing experience stylesheet")
require('js/experience-layer.js' in HTML, "missing experience script")
require('YA VISTE CÓMO PIENSO.' in HTML, "missing narrative closing thesis")
require('transition: all' not in CSS, "transition: all is forbidden")
require('pin: true' not in JS and 'pin:true' not in JS, "ScrollTrigger pin is forbidden")
require(re.search(r'\bscrub\s*:', JS) is None, "ScrollTrigger scrub is forbidden")
require('addEventListener("wheel"' not in JS and "addEventListener('wheel'" not in JS, "wheel hijacking is forbidden")
require('addEventListener("touchmove"' not in JS and "addEventListener('touchmove'" not in JS, "touchmove hijacking is forbidden")

if errors:
    print("V2.13 validation FAILED")
    for error in errors: print(f"- {error}")
    sys.exit(1)
print("V2.13 validation PASS")
```

- [ ] **Step 2: Run the harness and confirm it fails only on the new V2.13 expectations**

Run:
```bash
python3 tests/validate_v213.py
```
Expected: non-zero exit with at least `missing experience intro layer`, `missing experience stylesheet`, `missing experience script`, and `missing narrative closing thesis`.

- [ ] **Step 3: Verify the existing JavaScript still parses before feature work begins**

Run:
```bash
node --check js/app.js && node --check js/motion-system.js
```
Expected: both commands exit 0.

- [ ] **Step 4: Record baseline output in the implementation notes**

Create the first section of `V2.13_QA.md` only when Task 2 begins; do not weaken failing expectations to make this task green.

---

### Task 2: Build the semantic hero intro layer with a no-JS resolved baseline

**Files:**
- Modify: `index.html` around `#top`
- Create: `css/experience-layer.css`
- Modify: `css/design-system.css` only if a semantic token is missing

**Interfaces:**
- Produces: `.experience-intro`, `[data-intro-skip]`, `[data-intro-signal]`, `[data-intro-rule]`, `[data-intro-mark]`.
- Contract: without the `html.is-experience-running` class, all real hero content is fully visible and the temporary intro visuals cannot block input.

- [ ] **Step 1: Add the intro markup inside the existing hero without replacing semantic hero content**

Use this structure immediately inside `<section class="hero" id="top">` before the ambient field:

```html
<div class="experience-intro" data-experience-intro aria-hidden="true">
  <div class="experience-intro-field">
    <span data-intro-signal data-x="10" data-y="18">UX</span>
    <span data-intro-signal data-x="67" data-y="14">53.8%</span>
    <span data-intro-signal data-x="77" data-y="34">PRODUCTO</span>
    <span data-intro-signal data-x="21" data-y="46">DATOS</span>
    <span data-intro-signal data-x="57" data-y="58">CRM</span>
    <span data-intro-signal data-x="13" data-y="73">COMUNICACIÓN</span>
    <span data-intro-signal data-x="81" data-y="76">2026</span>
    <span data-intro-signal data-x="45" data-y="24">SISTEMAS</span>
    <span data-intro-signal data-x="48" data-y="80">01—04</span>
    <i data-intro-rule data-axis="x"></i>
    <i data-intro-rule data-axis="y"></i>
    <i data-intro-rule data-axis="x"></i>
    <i data-intro-rule data-axis="y"></i>
    <div class="experience-intro-mark" data-intro-mark aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
  </div>
</div>
<button class="experience-intro-skip" data-intro-skip type="button">OMITIR <span aria-hidden="true">↗</span></button>
```

The intro field remains decorative; the real skip button must be outside the `aria-hidden` container.

- [ ] **Step 2: Add stylesheet/script references in deterministic order**

After `css/motion-system.css`:
```html
<link href="css/experience-layer.css" rel="stylesheet">
```

After `js/motion-system.js`:
```html
<script defer src="js/experience-layer.js"></script>
```

- [ ] **Step 3: Implement the resolved baseline CSS before any JavaScript animation exists**

Key rules in `css/experience-layer.css`:

```css
.experience-intro,
.experience-intro-skip {
  display: none;
}

html.is-experience-running .experience-intro {
  display: block;
  position: absolute;
  inset: 0;
  z-index: var(--z-experience, 12);
  pointer-events: none;
  overflow: clip;
}

html.is-experience-running .experience-intro-skip {
  display: inline-flex;
  position: absolute;
  top: clamp(76px, 7vw, 108px);
  right: var(--page-gutter);
  z-index: calc(var(--z-experience, 12) + 1);
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: var(--ink);
  font: 500 9px/1 var(--mono);
  letter-spacing: .08em;
  cursor: pointer;
}

.experience-intro-field {
  position: absolute;
  inset: 0;
}

[data-intro-signal] {
  position: absolute;
  left: calc(var(--signal-x, 50) * 1%);
  top: calc(var(--signal-y, 50) * 1%);
  font: 500 clamp(9px, .8vw, 12px)/1 var(--mono);
  letter-spacing: .08em;
  white-space: nowrap;
}
```

Use CSS custom properties populated in Task 3 from `data-x`/`data-y` rather than hardcoding nine nth-child selectors.

- [ ] **Step 4: Add reduced-motion and mobile rules now, before animation logic**

```css
@media (prefers-reduced-motion: reduce) {
  .experience-intro,
  .experience-intro-skip { display: none !important; }
}

@media (max-width: 760px) {
  html.is-experience-running [data-intro-signal]:nth-of-type(n+7),
  html.is-experience-running [data-intro-rule]:nth-of-type(n+3) {
    display: none;
  }
}
```

- [ ] **Step 5: Re-run validation**

Run:
```bash
python3 tests/validate_v213.py
```
Expected: failures for missing `js/experience-layer.js` and closing thesis remain; markup/CSS expectations pass.

---

### Task 3: Implement idempotent intro state and skip/fallback behavior before choreography

**Files:**
- Create: `js/experience-layer.js`
- Modify: `tests/validate_v213.py`

**Interfaces:**
- Produces `window.PortfolioExperience` with:
  - `startIntro(): void`
  - `resolveIntro(reason = "complete"): void`
  - `isIntroResolved(): boolean`
- Internal state: `introResolved`, `timeline`, `rafId`, `pointerActive`.
- `resolveIntro()` must be idempotent.

- [ ] **Step 1: Extend the validation script with static API/behavior checks**

Add:

```python
EXPERIENCE_JS = (ROOT / "js" / "experience-layer.js").read_text(encoding="utf-8") if (ROOT / "js" / "experience-layer.js").exists() else ""
require("resolveIntro" in EXPERIENCE_JS, "missing resolveIntro implementation")
require("data-intro-skip" in HTML, "missing skip hook")
require("prefers-reduced-motion" in EXPERIENCE_JS, "missing reduced-motion gate")
require("visibilitychange" in EXPERIENCE_JS, "missing visibility interruption handling")
```

- [ ] **Step 2: Run validation and confirm the new behavior checks fail**

Run:
```bash
python3 tests/validate_v213.py
```
Expected: fails on the newly-added experience JS checks.

- [ ] **Step 3: Implement the smallest state machine and immediate resolution path**

Start `js/experience-layer.js` with:

```javascript
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('#top');
  const intro = document.querySelector('[data-experience-intro]');
  const skip = document.querySelector('[data-intro-skip]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!hero || !intro || !skip) return;

  let introResolved = false;
  let timeline = null;
  let rafId = 0;

  const clearIntroTransforms = () => {
    intro.querySelectorAll('[data-intro-signal], [data-intro-rule], [data-intro-mark]').forEach((node) => {
      node.style.removeProperty('transform');
      node.style.removeProperty('opacity');
    });
  };

  const resolveIntro = (reason = 'complete') => {
    if (introResolved) return;
    introResolved = true;
    timeline?.kill?.();
    timeline = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    clearIntroTransforms();
    root.classList.remove('is-experience-running');
    root.classList.add('is-experience-resolved');
    skip.hidden = true;
    hero.dataset.introReason = reason;
  };

  const startIntro = () => {
    if (introResolved || reducedMotion.matches || !window.gsap) {
      resolveIntro(reducedMotion.matches ? 'reduced-motion' : 'fallback');
      return;
    }
    root.classList.add('is-experience-running');
    skip.hidden = false;
  };

  skip.addEventListener('click', () => resolveIntro('skip'));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !introResolved) resolveIntro('escape');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !introResolved) resolveIntro('hidden');
  });
  reducedMotion.addEventListener?.('change', (event) => {
    if (event.matches && !introResolved) resolveIntro('reduced-motion-change');
  });

  window.PortfolioExperience = { startIntro, resolveIntro, isIntroResolved: () => introResolved };
  startIntro();
})();
```

- [ ] **Step 4: Populate `--signal-x/--signal-y` from the semantic data attributes during startup**

Before `startIntro()`:

```javascript
intro.querySelectorAll('[data-intro-signal]').forEach((node) => {
  node.style.setProperty('--signal-x', node.dataset.x || '50');
  node.style.setProperty('--signal-y', node.dataset.y || '50');
});
```

- [ ] **Step 5: Run checks**

```bash
node --check js/experience-layer.js
python3 tests/validate_v213.py
```
Expected: only the narrative closing thesis expectation still fails.

---

### Task 4: Choreograph “Complejidad → Claridad” with bounded pointer response

**Files:**
- Modify: `js/experience-layer.js`
- Modify: `css/experience-layer.css`
- Modify: `MOTION_SYSTEM.md`

**Interfaces:**
- Consumes: `window.gsap`, intro DOM hooks, `resolveIntro()`.
- Produces: one-off 2.8–3.4s opening timeline and RAF-bounded pointer response active only while intro is running.

- [ ] **Step 1: Add CSS initial-state classes and mark geometry**

Implement a restrained icon suggestion using three spans and line primitives; keep all geometry in DOM/CSS, not canvas. Initial states should rely on opacity/transform only.

- [ ] **Step 2: Implement pointer response as a single RAF loop while intro is active**

Use pointer coordinates normalized to the hero and write only transforms on `[data-intro-signal]`. Bound translation to roughly ±8px; do not run physics or layout measurement loops.

- [ ] **Step 3: Build the GSAP timeline with four labeled phases**

```javascript
const buildTimeline = () => {
  const signals = [...intro.querySelectorAll('[data-intro-signal]')];
  const rules = [...intro.querySelectorAll('[data-intro-rule]')];
  const mark = intro.querySelector('[data-intro-mark]');
  const heroLines = [...hero.querySelectorAll('.hero-line > span')];

  gsap.set(signals, { autoAlpha: 0, x: 0, y: 16 });
  gsap.set(rules, { scaleX: 0, scaleY: 0, transformOrigin: '50% 50%' });
  gsap.set(mark, { autoAlpha: 0, scale: .96 });
  gsap.set(heroLines, { yPercent: 112 });

  timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => resolveIntro('complete')
  });

  timeline
    .addLabel('arrival', 0)
    .to(signals, { autoAlpha: 1, y: 0, duration: .46, stagger: .045 }, 'arrival')
    .to(rules, { scaleX: 1, scaleY: 1, duration: .62, stagger: .06 }, 'arrival+=.18')
    .addLabel('instability', .72)
    .to(signals, { x: (i) => ((i % 3) - 1) * 12, y: (i) => (i % 2 ? -8 : 8), duration: .72, ease: 'sine.inOut' }, 'instability')
    .addLabel('convergence', 1.62)
    .to(signals, { x: 0, y: 0, opacity: .28, duration: .72, stagger: .018, ease: 'power4.inOut' }, 'convergence')
    .to(mark, { autoAlpha: 1, scale: 1, duration: .62 }, 'convergence+=.12')
    .addLabel('resolution', 2.35)
    .to(intro, { autoAlpha: 0, duration: .62, ease: 'power2.inOut' }, 'resolution')
    .to(heroLines, { yPercent: 0, duration: .74, stagger: .075, ease: 'power4.out' }, 'resolution-=.08');

  return timeline;
};
```

Tune offsets only within the approved 2.8–3.4 second total target.

- [ ] **Step 4: Ensure `startIntro()` creates the timeline only after the running class is active**

Call `requestAnimationFrame(() => buildTimeline())` after `root.classList.add('is-experience-running')` so the CSS initial state is committed before GSAP reads it.

- [ ] **Step 5: Test interruption paths manually and structurally**

Manual checks:
- click `OMITIR ↗` at ~0.5 s;
- press Escape at ~1.5 s;
- switch tab while animation is active;
- scroll away and return to top after completion.

Expected: final hero is stable and intro never replays within the page lifetime.

Run:
```bash
node --check js/experience-layer.js
python3 tests/validate_v213.py
```
Expected: only closing thesis expectation may remain failing.

- [ ] **Step 6: Document motion ownership**

In `MOTION_SYSTEM.md`, add a V2.13 section stating:
- intro orchestration = GSAP;
- pointer deviation = RAF-bound transforms during intro only;
- chapter microinteractions = CSS/IntersectionObserver;
- no intro replay in the same page lifetime.

---

### Task 5: Turn the line system into chapter-specific narrative continuity

**Files:**
- Modify: `index.html`
- Modify: `css/experience-layer.css`
- Modify: `css/motion-system.css`
- Modify: `js/experience-layer.js`

**Interfaces:**
- Produces: `[data-chapter-line]`, `.chapter-line`, `.chapter-line--technical`, `--data`, `--editorial`, `--documentary`, and one-shot `.is-context-active` state.
- Does not create any cross-page absolute-position geometry.

- [ ] **Step 1: Add one semantic line hook to each case study**

Place one decorative `<div class="chapter-line ..." data-chapter-line aria-hidden="true"></div>` inside each case near its hero/evidence boundary:
- TKOH: `chapter-line--technical`
- Amazon: `chapter-line--data`
- 20 Prod: `chapter-line--editorial`
- SUNAFIL: `chapter-line--documentary`

- [ ] **Step 2: Implement shared base grammar and section variants**

Base line uses a pseudo-element whose transform origin is left and activates on `.is-context-active`. Variants change composition, not brand identity:
- technical: orthogonal segments / frame tick;
- data: connected nodes with labeled sequence fragments;
- editorial: paired rules / crop marks;
- documentary: one quiet rule and caption tick.

Do not add new cards or overlays.

- [ ] **Step 3: Activate chapter lines with IntersectionObserver**

In `experience-layer.js`, observe `[data-chapter-line]` with a root margin near `0px 0px -18% 0px`, add `.is-context-active` once, then unobserve.

- [ ] **Step 4: Add reduced-motion behavior**

All chapter lines render directly in their final visible state when reduced motion is active; no transform travel is required.

- [ ] **Step 5: Run static checks and inspect every chapter at desktop/tablet/mobile widths**

```bash
python3 tests/validate_v213.py
node --check js/experience-layer.js
```
Expected: no new structural failures.

Manual expectation: TKOH/Amazon/20 Prod/SUNAFIL remain visually distinct and no new empty zones are introduced.

---

### Task 6: Strengthen Mi Sistema as the climax using real project connections, without Three.js yet

**Files:**
- Modify: `index.html` around `#system`
- Modify: `css/experience-layer.css`
- Modify: `js/experience-layer.js`

**Interfaces:**
- Consumes: existing `[data-system-node]` interaction from `app.js` and visited experience DOM state.
- Produces: `data-projects` on each system node and a `.system-connections` HTML layer that can later be replaced/augmented by `system-spatial.js` without changing semantic controls.

- [ ] **Step 1: Add project mapping data to the four existing system nodes**

Use:
```text
Señales      -> case-amp case-visual
Estructura   -> case-tkoh case-amp case-20prod
Interfaz     -> case-tkoh case-20prod
Aprender     -> case-tkoh case-amp case-visual
```

Encode as `data-projects="case-tkoh case-amp"` etc.

- [ ] **Step 2: Add a semantic connection summary below the central core**

```html
<div class="system-connections" data-system-connections aria-live="polite">
  <span class="system-connections-label">SE CONECTA CON</span>
  <p data-system-projects>TKOH · AMAZON MAGIC PARK</p>
</div>
```

- [ ] **Step 3: Synchronize connection copy with active system node**

In `experience-layer.js`, listen for focus/click/keyboard-driven active changes by observing `.system-node.is-active` with a `MutationObserver`, or dispatch a custom event from `app.js` if a minimal hook is cleaner. Update `[data-system-projects]` using existing project display names.

Prefer one minimal custom event in `app.js`:
```javascript
node.dispatchEvent(new CustomEvent('systemnodechange', {
  bubbles: true,
  detail: { index, projects: node.dataset.projects || '' }
}));
```

- [ ] **Step 4: Visually distinguish already-visited connections without making them required for comprehension**

Visited project names may gain a check or stronger rule weight; all project names remain readable even if no case has been visited.

- [ ] **Step 5: Confirm keyboard interaction remains intact**

Test Tab, Enter, Space, Left/Right/Up/Down on the four nodes. The connection summary must update for each route and must not steal focus.

---

### Task 7: Resolve the narrative in Profile and Contact

**Files:**
- Modify: `index.html` in `#about` and `#contact`
- Modify: `css/experience-layer.css`
- Modify: `js/experience-layer.js`
- Modify: `tests/validate_v213.py`

**Interfaces:**
- Produces: stable contact thesis `YA VISTE CÓMO PIENSO.` and support copy `Ahora cuéntame qué necesitas hacer más claro.`
- May consume visited project state for optional supporting microcopy only; primary thesis and email remain static HTML.

- [ ] **Step 1: Replace the current contact headline with the approved resolved thesis**

Use semantic HTML:
```html
<h2 id="contact-title">
  <span class="contact-line"><span>YA VISTE</span></span>
  <span class="contact-line"><span>CÓMO PIENSO.</span></span>
</h2>
<p class="contact-resolution">Ahora cuéntame qué necesitas hacer más claro.</p>
```

Keep the existing direct email block and capability rows.

- [ ] **Step 2: Add a subtle profile-to-contact continuity line, not another widget**

Use a local `.experience-resolution-line` rule between the end of Profile and Contact, activated once via IntersectionObserver.

- [ ] **Step 3: Add optional visit-aware support text without changing the main CTA**

If all four case sections carry the existing visited class/state, set a small `[data-contact-context]` string such as `4 experiencias recorridas · Producto × Comunicación × Datos`; otherwise retain a neutral fallback already present in the HTML.

- [ ] **Step 4: Re-run the validator**

```bash
python3 tests/validate_v213.py
```
Expected: full PASS for all structural V2.13 expectations.

---

### Task 8: Responsive, reduced-motion, failure-mode and density hardening

**Files:**
- Modify: `css/stability.css`
- Modify: `css/experience-layer.css`
- Modify: `js/experience-layer.js`
- Modify: `V2.13_QA.md`

**Interfaces:**
- Produces: stable behavior from 320 CSS px to 1920 px; no page-level overflow; no large blank sections introduced by V2.13.

- [ ] **Step 1: Add responsive simplification rules for the intro and chapter grammar**

At `max-width: 760px`:
- fewer intro signals/rules;
- no pointer-proximity motion;
- hero title uses existing responsive typography;
- chapter lines simplify to one axis;
- no absolute decorative element may exceed the hero clipping boundary.

- [ ] **Step 2: Make reduced motion a complete resolved experience**

Ensure:
```css
@media (prefers-reduced-motion: reduce) {
  .experience-intro,
  .experience-intro-skip { display: none !important; }
  .chapter-line::before,
  .experience-resolution-line::before { transform: none !important; }
}
```

And verify JS calls `resolveIntro('reduced-motion')` before building any GSAP timeline.

- [ ] **Step 3: Test JS/GSAP failure by temporarily disabling the experience script and GSAP include**

Expected:
- hero fully visible;
- navigation works;
- content readable;
- Mi Sistema HTML works;
- metrics render final values through existing baseline behavior.

Restore files immediately after test.

- [ ] **Step 4: Check the viewport matrix**

Inspect at minimum:
```text
320×700
390×844
430×932
768×1024
1024×768
1366×768
1440×900
1920×1080
```

For each viewport record in `V2.13_QA.md`:
- horizontal overflow: yes/no;
- intro clipping: pass/fail;
- hero overlap: pass/fail;
- chapter blank-space regression: pass/fail;
- contact legibility: pass/fail.

- [ ] **Step 5: Run structural checks**

```bash
python3 tests/validate_v213.py
node --check js/app.js
node --check js/motion-system.js
node --check js/experience-layer.js
```
Expected: all PASS.

---

### Task 9: Final documentation, package integrity and handoff

**Files:**
- Modify: `README.md`
- Modify: `MOTION_SYSTEM.md`
- Modify: `FINAL_QA.md`
- Modify: `INTERACTION_QA.md`
- Complete: `V2.13_QA.md`
- Package: `/mnt/data/luis-sabrera-portfolio-v2.13.0-experience-layer.zip`

**Interfaces:**
- Produces: self-contained V2.13 project ready to upload to GitHub in the next phase.

- [ ] **Step 1: Update README version and architecture**

Document:
- V2.13 experience arc;
- file ownership;
- local run command `python3 -m http.server 8080`;
- intro skip/reduced-motion behavior;
- GitHub intentionally deferred until after this package is approved.

- [ ] **Step 2: Update QA documents with measured local facts only**

Do not claim Lighthouse/Core Web Vitals or Axe success before a public deployment. Explicitly list those as post-deploy checks.

- [ ] **Step 3: Final placeholder/drift scan**

Run:
```bash
grep -RniE 'T''BD|TO''DO|FIX''ME|transition:[[:space:]]*all|pin:[[:space:]]*true|scrub[[:space:]]*:' . \
  --exclude-dir=.git --exclude='*.pdf'
```
Expected: no implementation placeholders or forbidden motion patterns. If historical docs contain descriptive mentions, exclude docs from the second enforcement pass and verify source files are clean.

- [ ] **Step 4: Run final checks**

```bash
python3 tests/validate_v213.py
node --check js/app.js
node --check js/motion-system.js
node --check js/experience-layer.js
```
Expected: PASS.

- [ ] **Step 5: Create and test the ZIP**

```bash
cd /mnt/data
zip -qr luis-sabrera-portfolio-v2.13.0-experience-layer.zip luis-sabrera-portfolio-v2.13.0-experience-layer
unzip -t luis-sabrera-portfolio-v2.13.0-experience-layer.zip
```
Expected: `No errors detected in compressed data`.

---

## Self-Review

### Spec coverage
- Complejidad → Claridad hero: Tasks 2–4.
- Skip/Escape/reduced motion/failure state: Tasks 3, 4, 8.
- Native scroll / no pin/scrub: Global constraints + Tasks 1, 9.
- Chapter-specific continuity: Task 5.
- Distinct case personalities: Task 5 + visual QA Task 8.
- Mi Sistema climax and project connections: Task 6.
- Three.js optional/not forced: explicitly out of this implementation plan; semantic hooks preserved for later prototype.
- Profile/Contact narrative close: Task 7.
- Responsive/accessibility/performance safeguards: Tasks 8–9.
- No preview overlay / no blank-space regression: Global constraints + Task 8.
- GitHub after V2.13: global constraint + Task 9 handoff.

### Placeholder scan
The plan contains no unresolved placeholder markers or undefined interface placeholders. Three.js is intentionally excluded from this cycle by the approved spec unless a later prototype proves value.

### Interface consistency
- `window.PortfolioExperience` owns intro state throughout.
- `resolveIntro(reason)` is the single idempotent interruption/finalization path.
- `[data-chapter-line]` is the sole chapter continuity activation hook.
- existing `[data-system-node]` remains canonical for system accessibility; V2.13 only adds `data-projects` and a connection summary.
- contact thesis is static HTML, optional context is progressive enhancement.
