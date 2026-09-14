# V2.13 Lite — Experience Layer Design

**Date:** 2026-09-14  
**Source baseline:** V2.12.1 Motion Stack  
**Status:** Design approved in chat; awaiting written-spec review before implementation.

## 1. Goal

Transform the current portfolio from a polished animated CV into a cohesive browsing experience without introducing high-complexity 3D, scroll hijacking, or fragile state machinery.

The experience must feel more entertaining, responsive and memorable while remaining understandable and maintainable by an owner with minimal frontend experience.

## 2. Core Narrative

The entire experience follows one arc:

**Complexity → Order → Evidence → System → Identity → Contact**

The visual language begins in the Hero as dispersed signals and gradually resolves into the existing editorial system. The same line language continues through the case studies and culminates in Mi Sistema.

The experience opens with:

> HAGO ENTENDIBLE LO COMPLEJO.

and closes with:

> YA VISTE CÓMO PIENSO.  
> Ahora cuéntame qué necesitas hacer más claro.

## 3. Scope

### 3.1 Hero — “Complejidad → Claridad”

The Hero receives one complex but bounded 2D entrance sequence implemented with CSS and GSAP.

The opening composition uses only real portfolio concepts:

- UX
- PRODUCTO
- DATOS
- CRM
- SISTEMAS
- COMUNICACIÓN
- 01–04 chapter numbers
- selected real metrics
- structural lines and nodes

The sequence lasts approximately **2.8–3.4 seconds** on capable desktop devices.

#### Sequence

1. **Signal field** — fragmented labels, lines and data appear in controlled disorder.
2. **Response** — subtle pointer proximity may offset only decorative fragments; this is non-essential.
3. **Convergence** — fragments align into the portfolio grid and visual system.
4. **Resolution** — the user’s icon is briefly implied/assembled from the same pieces and the final Hero headline becomes dominant.
5. **Normal state** — the animation becomes the actual page rather than disappearing into a separate loader screen.

#### Constraints

- No canvas or Three.js.
- No fake loading screen.
- No animation that prevents reading the Hero after the sequence.
- No layout shift caused by the intro.
- Intro may run once per page load/session only; subsequent return-to-top shows the resolved Hero.
- A visible **OMITIR** control is available while the opening sequence is active.
- `Escape` also skips the sequence.
- `prefers-reduced-motion: reduce` renders the resolved Hero immediately.
- If GSAP fails, the resolved Hero remains fully visible and usable.

### 3.2 Motion Language

Motion is divided by purpose, not by section.

#### Microinteraction

Use CSS for:

- hover
- press
- focus
- lens/state emphasis
- border/line response

Target duration: **120–220 ms**.

#### Reveal

Use CSS or lightweight JS for:

- text masks
- captions
- image clipping
- metric activation

Target duration: **220–360 ms**.

#### Editorial sequence

Use GSAP only when timing between multiple elements materially improves understanding.

Target duration: **420–760 ms** per local sequence.

#### Global rules

- No `transition: all`.
- Prefer `transform`, `opacity`, and bounded `clip-path` use.
- No animation of width/height for decorative motion where transform can express the same result.
- All fast repeated interactions must be interruptible.
- No infinite pulsing as a reward state.
- Reduced-motion keeps state and opacity cues while removing unnecessary spatial motion.

## 4. Continuous Line Motif

The existing line system becomes the primary visual continuity device.

The line must never become a single literal SVG spanning the whole page. Instead, each section uses local line primitives that feel visually continuous.

### Hero

Disordered line fragments converge into the page grid.

### Selected Work / TKOH

Lines become architectural guides, evidence boundaries and interface hierarchy.

### Amazon Magic Park

Lines express operational relationship:

`CAMPAÑA → LEAD → CRM → ASESOR → DECISIÓN`

This is a normal-flow visual motif, not a pinned timeline.

### 20 Prod.

Lines become editorial grid structure and image alignment.

### SUNAFIL

Geometry recedes. Lines become lighter documentary dividers so photography and context remain primary.

### Mi Sistema

Local line primitives visually converge on the system core.

## 5. Case Study Motion

Each case receives a distinct but related reveal vocabulary.

### TKOH

- image/evidence clip reveal
- subtle annotation-line trace
- hierarchy-first motion
- no floating preview

### Amazon Magic Park

- metric count/reveal already present, refined but not replaced
- thin proportional progress line
- operational relationship line draws once when entering viewport
- no horizontal scroll sequence

### 20 Prod.

- editorial mask reveal
- image rows appear with short stagger
- no large empty stages

### SUNAFIL

- photograph reveal is slower and quieter than technical cases
- captions enter separately from images
- no technological visual treatment imposed on documentary evidence

## 6. Mi Sistema — 2D Climax

Mi Sistema remains HTML/CSS/JS, not Three.js.

The existing four nodes remain:

1. Señales
2. Estructura
3. Interfaz
4. Aprender

### Interaction

- Hover on pointer-capable desktop may preview a node.
- Click/tap selects a node.
- Keyboard focus + Enter/Space selects a node.
- Arrow-key navigation may remain if already stable.
- The center/core updates its explanatory state.
- Local connection lines visually emphasize the selected node and the projects where that mode of thinking appears.

### Project Connections

The section may show simple compact project references rather than complex diagrams.

Example:

**ESTRUCTURA**

- TKOH — strong
- Amazon Magic Park — strong
- 20 Prod. — medium
- SUNAFIL — contextual

The connection system must use text/shape in addition to color.

### Constraints

- No canvas.
- No WebGL.
- No drag requirement.
- No camera controls.
- No pinning or scrub.

## 7. Selected Work and Navigation

The floating preview remains removed.

Project rows must feel interactive through the row itself:

- typography
- line response
- metadata
- visited indicator

The whole appropriate hit area should be interactive.

No large overlay cards are introduced.

The experience navigator may remain compact on desktop and hidden on smaller screens if it does not improve readability.

## 8. Visual Polish

The visual identity remains:

- editorial
- technical
- product-oriented
- communication-aware

Do not introduce:

- glassmorphism
- generic SaaS card grids
- gradients as decoration
- metallic effects
- neon glow
- custom cursor
- 3D decoration
- excessive rounded cards

### Density

The V2.11.2 density corrections remain contractual:

- no intentionally empty full-screen spacer sections
- no oversized min-heights for informational rows
- no decorative cards without a grouping purpose
- desktop and laptop vertical rhythm must remain compact enough to keep content continuity

## 9. Contact Closure

The closing message becomes the narrative resolution:

> YA VISTE CÓMO PIENSO.

> Ahora cuéntame qué necesitas hacer más claro.

Keep:

- direct email address
- mailto action
- location
- CV link

The contact section may react visually when the visitor has seen all four experiences, but the text and CTA must not depend on completion state.

## 10. Interaction State

Keep state intentionally simple.

Allowed state:

- intro complete / skipped
- experience visited flags
- current Mi Sistema node
- existing professional lens if retained

Do not add:

- persistent user profiles
- backend state
- authentication
- complex progress engine
- mandatory gamification

Session-only state may use in-memory JavaScript. No localStorage is required for V2.13 Lite.

## 11. Accessibility

- All essential information works without hover.
- Interactive targets aim for at least 44×44 CSS px on touch layouts.
- Focus styles remain visible.
- Selected states use text/shape plus color.
- Intro has skip button and Escape support.
- `prefers-reduced-motion` bypasses intro motion and reduces spatial reveals.
- No content is permanently hidden when JS is unavailable.
- Native buttons and links are preferred over clickable generic containers.
- Dynamic text updates in Mi Sistema must remain understandable to assistive technology.

## 12. Responsive Behavior

### Desktop ≥ 1180 px

Full Hero choreography and complete local line system.

### Tablet 760–1179 px

Same visual idea with fewer simultaneous fragments and reduced travel distance.

### Mobile 320–759 px

- simplified Hero sequence
- no pointer-proximity behavior
- fewer decorative fragments
- no horizontal page overflow
- content order remains semantic
- interaction works by tap

The mobile version is the same experience reduced in complexity, not a different visual language.

## 13. Performance Constraints

- Keep the opening sequence DOM-based.
- Avoid continuously running requestAnimationFrame loops after the intro resolves.
- Existing images remain optimized/lazy loaded where appropriate.
- Decorative intro nodes are removed or disabled after completion if no longer needed.
- No new large runtime dependency beyond libraries already present.
- No Three.js in V2.13 Lite.

Target after deployment:

- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1

These are validation targets, not claims before public deployment.

## 14. Technical Boundaries

Existing responsibility split remains:

- `css/style.css` — historical/main visual composition
- `css/stability.css` — responsive and production hardening
- `css/design-system.css` — canonical tokens/contracts
- `css/motion-system.css` — motion primitives
- `css/interactive.css` — interaction-specific states
- `js/app.js` — product behavior and existing GSAP orchestration
- `js/motion-system.js` — reusable motion primitives

V2.13 Lite may introduce a focused Hero module if needed, e.g. `js/experience-intro.js`, rather than adding the entire sequence to `app.js`.

Do not perform unrelated repository restructuring.

## 15. Explicit Non-Goals

V2.13 Lite does **not** include:

- Three.js
- WebGL
- scroll hijacking
- ScrollSmoother
- `pin: true`
- scrub-driven narrative
- custom cursor
- audio
- mandatory game mechanics
- floating work previews
- modal case-study navigation
- backend/API work

## 16. QA Matrix

Validate at minimum:

- 1920×1080
- 1440×900
- 1366×768
- 1024×768
- 768×1024
- 430×932
- 390×844
- 320×568

### Required checks

- no horizontal page overflow
- no text overlap
- no large unintended empty spaces
- no layout shift when intro completes
- skip control works
- Escape skips intro
- keyboard navigation works
- reduced-motion produces stable resolved state
- intro runs without blocking content
- Mi Sistema works with click/tap/keyboard
- no `transition: all`
- no `pin`
- no `scrub`
- no wheel/touchmove hijacking
- no missing local assets
- no duplicate IDs
- no broken fragment links
- JS syntax valid
- CSS parses without fatal errors

## 17. Acceptance Criteria

V2.13 Lite is complete when:

1. The opening experience clearly communicates **complexity becoming clarity** without feeling like a loader.
2. The opening can be skipped and never prevents access to content.
3. Motion vocabulary is visibly more coherent across all cases.
4. Each case preserves its own personality.
5. The line motif creates continuity without becoming decorative noise.
6. Mi Sistema is the strongest interactive section after the Hero while remaining 2D and accessible.
7. No regression reintroduces the empty-space, overlap or scroll problems fixed in earlier versions.
8. The project remains understandable enough that a low-experience owner can run and deploy it as a static site.
9. Static/local QA passes before GitHub migration.
10. GitHub/deployment happens after V2.13 Lite is accepted locally.
