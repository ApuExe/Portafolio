# V2.13 Experience Layer — Design Specification

**Date:** 2026-09-14  
**Base:** Luis Sabrera Portfolio V2.12.1 Motion Stack  
**Status:** Design approved in chat; awaiting written-spec approval before implementation.

## 1. Objective

Turn the portfolio from a sequence of animated sections into one continuous experience with a clear narrative arc:

**Ruido → Orden → Evidencia → Sistema → Identidad → Contacto**

The experience must preserve the current editorial/product identity, native scrolling, accessibility, responsive behavior, density improvements, design-system baseline, and the existing project content. Interactions should reveal meaning rather than add decorative spectacle.

The V2.13 opening must provide a memorable visual hook that dramatizes the core proposition:

> **HAGO ENTENDIBLE LO COMPLEJO.**

The selected direction is **B — Complejidad → Claridad**.

---

## 2. Non-negotiable product constraints

1. **Native scrolling only.** No wheel/touch hijacking, `ScrollSmoother`, scroll-jacking, `pin`, or `scrub` for the main document.
2. **Content remains available without animation.** If JavaScript fails, the user sees the resolved hero and normal portfolio.
3. **No hover-only information.** Every interactive behavior must also work via tap/click and keyboard where it conveys information.
4. **Reduced motion is a first-class state.** It shows the resolved composition immediately or uses opacity-only transitions where useful.
5. **The opening is a narrative transition, not a loader.** Real content exists from the first frame and is never gated by a fake progress screen.
6. **No visual regression into generic SaaS/Awwwards tropes.** No neon, glassmorphism, bloom, particles everywhere, custom cursor, noisy 3D, or gratuitous parallax.
7. **Current identity remains:** white/black/neutrals + signal blue, Inter + DM Mono, strong indices, rules/lines, editorial composition, current icon, large typography and sparse technical graphics.
8. **Section personalities remain distinct:** TKOH technical/product, Amazon operational/data-driven, 20 Prod editorial/brand, SUNAFIL documentary/human.
9. **Motion must have a stated purpose:** feedback, spatial continuity, state, explanation, transition, or rare delight.
10. **The portfolio should feel lighter after the opening, not heavier.** The most complex motion budget is spent at the beginning and at the system climax.

---

## 3. Experience architecture

### 3.1 Opening / Hero — “Complejidad → Claridad”

The current hero remains the semantic and visual destination. A transient `experience-intro` layer lives inside the hero and resolves into the existing layout instead of replacing it with a separate splash page.

#### Source material for the chaotic state

The opening uses fragments that are authentic to Luis’s profile and the portfolio:

- `UX`
- `PRODUCTO`
- `DATOS`
- `CRM`
- `SISTEMAS`
- `COMUNICACIÓN`
- `2026`
- `01–04`
- representative metrics such as `53.8%`
- short structural lines, node dots and coordinate-like marks

These are not random particles. Every visible signal is meaningful and belongs to the portfolio vocabulary.

#### Timing target

Total duration: **2.8–3.4 seconds** on normal motion-capable desktop.

**Phase A — Signal arrival (0.00–0.85 s)**  
Fragments, partial rules and nodes appear from restrained offsets. The composition should feel complex but not unreadable.

**Phase B — Responsive instability (0.55–1.85 s)**  
Pointer proximity creates small deviations in nearby fragments. Motion is bounded and damped. No continuous physics simulation.

**Phase C — Convergence (1.65–2.65 s)**  
The chaotic signals align to the site’s grid. Rules lengthen, fragments converge, and the current icon is suggested/assembled using simple DOM/SVG geometry.

**Phase D — Resolution (2.45–3.40 s)**  
The temporary elements become visually subordinate or merge into existing hero lines/ambient structures while the real heading resolves:

- HAGO
- ENTENDIBLE
- LO COMPLEJO.

The user should perceive one transformation, not an intro disappearing followed by a page appearing.

#### Skip / interruption

- Visible `OMITIR ↗` control during the sequence.
- `Escape` skips immediately.
- Any skip resolves directly to the final hero state without half-complete transforms.
- Returning to `#top` during the same page lifetime does not replay the full intro.
- `prefers-reduced-motion: reduce` bypasses the sequence and starts at the resolved hero.
- Mobile gets a simplified composition with fewer fragments and reduced pointer/touch-dependent behavior.

#### Technical implementation

- Existing semantic hero remains in the DOM.
- Intro layer is `aria-hidden="true"` except the real skip control.
- GSAP timeline orchestrates the one-off sequence.
- CSS handles static layout and microstates.
- Pointer response uses lightweight transforms and a throttled/RAF-bound handler while the intro is active only.
- No Three.js in the hero.
- No layout measurement loop; only initial geometry reads if required.

---

### 3.2 Narrative continuity — the line as a visual grammar

The current motion-line system evolves from a generic reveal into a recurring narrative device.

The same grammar is allowed to change function by section:

- **Hero:** disorder aligning into a grid.
- **Selected Work:** lines indicate entry points and visited state.
- **TKOH:** lines behave as architecture and hierarchy.
- **Amazon:** lines express campaign → CRM → commercial decision flow.
- **20 Prod:** lines become editorial grid/rhythm.
- **SUNAFIL:** rules become quieter documentary dividers and captions.
- **Mi Sistema:** prior visual lines conceptually converge into the system model.
- **Contact:** the line resolves the narrative rather than introducing another interaction concept.

This is not one literal DOM line traveling through the entire page. It is one consistent visual language implemented with section-local primitives, avoiding brittle cross-document geometry.

---

## 4. Chapter behavior

### 4.1 Selected Work

Retain the compact no-preview layout from V2.11.2+.

Enhancements:

- Project rows react through line, typography, metadata and subtle structural shifts.
- Visited state stays visible in-document.
- No floating previews or overlay cards.
- The current professional lens may influence emphasis, but the section remains understandable with no lens selected.
- Any row expansion added later must occur within document flow and preserve spatial continuity.

### 4.2 TKOH — technical/product chapter

Goal: demonstrate product judgment rather than merely show screenshots.

- Existing CRM evidence remains central.
- Motion language: alignment, framing, hierarchy, restrained callouts.
- Screenshots may gain a future inspect layer, but V2.13 foundation only prepares hooks; it does not force a hotspot system into every image.
- No fake dashboard chrome around the screenshots.

### 4.3 Amazon Magic Park — data/operations chapter

Goal: make operational thinking visible.

- Current metrics animation remains brief and one-shot.
- Flow language can visually connect campaign, lead, CRM, advisor/follow-up and decision using local section lines.
- No horizontal pinned timeline.
- Numbers use tabular alignment.
- Animation demonstrates causality and sequence, not decoration.

### 4.4 20 Prod. — editorial/brand chapter

Goal: preserve a more graphic, archive-like cadence.

- Motion language: masks, crop reveals, grid shifts and editorial sequencing.
- Avoid technical node visuals here.
- Do not turn every artifact into a card.

### 4.5 SUNAFIL — documentary/human chapter

Goal: contrast the more technical chapters with context and people.

- Motion is quieter and slower in amplitude, not necessarily longer in duration.
- Photography and captions lead.
- Rules act as documentary separators.
- No tech HUD overlays or node-network metaphors.
- Existing whitespace reductions remain; the chapter must not reintroduce giant empty areas.

---

## 5. Mi Sistema — experience climax

Mi Sistema remains the conceptual climax and retains the approved four-stage model:

1. Señales
2. Estructura
3. Interfaz
4. Aprender

### V2.13 behavior

- Current HTML model remains the accessible baseline.
- Nodes respond to pointer, click/tap, focus, Enter/Space and arrow navigation.
- Activating a node changes the central explanation and highlights real project connections.
- Previously visited project state can subtly influence which connections appear as already-known evidence.

### Three.js policy

Three.js is **optional and isolated** to this section only.

A prototype is allowed only if it adds spatial understanding beyond the HTML model. It must satisfy all of the following before shipping:

- no meaningful information exists only in WebGL;
- the HTML fallback remains fully functional;
- mobile/low-power/reduced-motion can use the fallback;
- bounded camera movement;
- raycasting only against interactive meshes;
- no large GLTF assets, bloom, postprocessing or physics;
- no persistent render loop when the section is offscreen if avoidable;
- performance remains acceptable on mid-range mobile hardware.

If these conditions are not met, V2.13 ships without Three.js.

---

## 6. Profile / identity resolution

The existing Comunicación / Producto / Datos framing remains, but the visitor should experience it as a conclusion rather than another dashboard.

The section visually resolves the chapters into three professional lenses:

- **Comunicación → Entender**
- **Producto → Estructurar**
- **Datos → Decidir**

Visited chapters can subtly influence which relationships appear emphasized. No explicit game language such as “achievement unlocked”.

---

## 7. Contact / narrative closure

The opening statement:

> **HAGO ENTENDIBLE LO COMPLEJO.**

must resolve at the end into:

> **YA VISTE CÓMO PIENSO.**  
> Ahora cuéntame qué necesitas hacer más claro.

Primary action remains direct email to `luis.sabrera@studios-tkoh.online`.

The close may adapt its supporting microcopy based on locally observed exploration state, but the main message and CTA remain stable and understandable with JavaScript disabled.

---

## 8. Motion governance

Use the existing V2.12.1 motion tokens and evolve them only when necessary.

### Tool ownership

- **CSS transitions:** hover, focus, press, simple state changes.
- **CSS keyframes:** deterministic local effects that do not require runtime orchestration.
- **IntersectionObserver:** contextual activation and one-shot reveals.
- **GSAP:** opening choreography and genuinely multi-stage editorial sequences.
- **Three.js:** optional Mi Sistema spatial prototype only.

### Rules

- No `transition: all`.
- Prefer `transform`, `opacity`, and limited `clip-path` where justified.
- Frequent interactions stay under roughly 300 ms.
- Major editorial moments may use the existing 520–760 ms budget inside larger timelines.
- Staggers remain short and intentional.
- Animations must be interruptible where users can trigger them repeatedly.
- Entry and exit preserve spatial logic.
- Reduced motion removes large displacement while retaining enough state change to explain what happened.

---

## 9. Accessibility and web behavior

- 320 CSS px minimum supported without page-level horizontal scrolling.
- Interactive targets approximately 44×44 px where applicable.
- All meaningful controls are native `button`/`a` elements.
- Visible focus state remains unobstructed.
- State is not indicated by color alone.
- Skip intro is keyboard reachable immediately.
- `Escape` skip works while intro is active.
- No hidden focusable elements under overlays.
- Dynamic completion/state copy uses `aria-live` only when it materially benefits non-visual users; decorative intro animation remains hidden from assistive tech.
- Anchor targets preserve `scroll-margin-top`.
- Back/Forward behavior remains coherent for lens URL state.

---

## 10. State model

V2.13 uses lightweight in-page state only:

```text
introResolved: boolean
activeLens: all | producto | comunicacion | datos
visitedExperiences: Set<case-id>
activeSystemNode: 0..3
```

The lens can remain URL-addressable with `?lens=` as implemented in V2.12.1.

The intro does not require cookies, localStorage or a backend. “Once per visit” means once during the current page lifetime; returning to the top does not replay it. A full reload may replay it.

---

## 11. File boundaries

The existing separation is retained and extended rather than returning to one monolithic stylesheet/script.

```text
index.html
css/
  style.css             historical/art direction
  stability.css         responsive and hardening
  design-system.css     tokens/contracts
  interactive.css       existing experience state/UI
  motion-system.css     shared line/motion grammar
  experience-layer.css V2.13 opening + chapter-specific experience rules
js/
  app.js                existing product/state behavior
  motion-system.js      shared traces/metrics
  experience-layer.js  V2.13 intro orchestration + narrative state hooks
```

If a Three.js prototype is accepted later:

```text
js/system-spatial.js
```

It must remain separately removable.

---

## 12. Failure and fallback behavior

### JavaScript unavailable

- resolved hero visible;
- all content and navigation usable;
- no intro layer blocks interaction;
- metrics show final values;
- Mi Sistema remains readable HTML.

### GSAP unavailable

- intro layer is not activated;
- site starts in resolved state;
- CSS microinteractions continue.

### Three.js unavailable

- HTML Mi Sistema remains the canonical experience.

### Interrupted intro

Skip, Escape, tab visibility change or unexpected runtime interruption must call a single idempotent `resolveIntro()` path that:

- kills intro timeline/listeners;
- removes temporary transforms;
- hides intro-only visual fragments;
- exposes the final hero state;
- restores normal interaction;
- marks the intro resolved for the current page lifetime.

---

## 13. Testing strategy

### Structural

- HTML parser / duplicate ID scan.
- CSS parse.
- `node --check` for all local JS.
- local asset references.
- no broken internal fragments.

### Motion regression

- verify `pin: true = 0`.
- verify `scrub = 0` for page storytelling.
- verify no `wheel`/`touchmove` prevention.
- verify no `transition: all`.
- repeated skip does not break state.
- returning to top does not replay intro.
- lens switching during/after intro remains coherent.

### Viewports

At minimum:

- 320×~700
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1366×768
- 1440×900
- 1920×1080

### Accessibility

- keyboard-only navigation;
- intro skip and Escape;
- focus visibility;
- reduced motion;
- no color-only state;
- semantics of buttons/links;
- Axe on deployed URL.

### Performance after deployment

- Lighthouse / PageSpeed / WebPageTest.
- target Core Web Vitals remain goals, not claims until measured:
  - LCP ≤ 2.5 s
  - INP ≤ 200 ms
  - CLS ≤ 0.1
- measure intro cost separately from post-resolution interaction cost.

---

## 14. Acceptance criteria

V2.13 is complete when:

1. The first visit produces a memorable but understandable **Complejidad → Claridad** transformation.
2. The intro resolves into the real hero rather than behaving like a detached splash screen.
3. Skip, Escape, reduced motion and JS-failure states are correct.
4. Returning to the top does not replay the full intro during the same page lifetime.
5. The rest of the portfolio feels like chapters of one experience, not unrelated animation demos.
6. Each case keeps its own visual personality.
7. Mi Sistema remains the conceptual climax.
8. No preview overlay returns.
9. No large empty-space regressions return.
10. Native scrolling remains untouched.
11. Keyboard, touch and responsive layouts remain first-class.
12. The close resolves the initial thesis with **“YA VISTE CÓMO PIENSO.”**
13. All static and interaction QA passes before a final package is delivered.
14. Real Lighthouse/Axe validation is performed only after public deployment and reported as measured results, not assumed success.

---

## 15. Explicitly out of scope for this implementation cycle

- sound design;
- custom cursor;
- site-wide WebGL;
- physics engine;
- persistent user accounts/state;
- backend analytics product;
- redesigning case-study content from scratch;
- replacing the current design identity;
- forcing Three.js into production if the prototype does not improve understanding.
