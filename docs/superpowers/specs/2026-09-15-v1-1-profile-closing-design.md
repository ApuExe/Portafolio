# V1.1 Phase 3 — Profile & Closing Experience Design

## Goal
Bring the Profile and Contact chapters up to the visual/motion quality established by SIGNAL → CLARITY, the four case dialects, and Mi Sistema, without changing base copy or page architecture.

## Profile — Human Editorial Layer
- Preserve all existing Profile copy and information architecture.
- Treat the three professional lenses as one connected system: Comunicación → Producto → Datos.
- Draw a restrained connective thread behind/through the three lens cards when the group enters the viewport.
- Give each lens a readable active/focus state; inactive siblings may recede slightly but must remain legible.
- Use native browser motion (IntersectionObserver + Web Animations API/CSS) so the section remains alive without GSAP.
- Give the large Profile heading and current-work rows a more editorial entrance with clip/reveal rather than a generic fade.
- Keep pointer response small (single-digit pixels), fine-pointer only, and remove it for reduced motion/touch.

## Contact — Narrative Closing
- Preserve “YA VISTE CÓMO PIENSO.” and the existing contact copy/CTAs.
- Make Contact feel like the end of the same story, not a footer: dark field, controlled light response, prominent type, staged reveal, stronger CTA hierarchy.
- Use a soft radial light field that follows pointer on desktop only.
- Animate the bottom capability signal slowly only while Contact is in view; it must not create overflow on mobile.
- Contact cards and links should react to focus/hover while preserving keyboard and touch behavior.
- The monogram remains decorative and outside normal flow.

## Shared Motion Rules
- Native scroll only. No scroll hijacking, pinning or scrub-driven movement.
- No Three.js, particles, cursor replacement or audio.
- Motion must use transform/opacity/filter where practical.
- `prefers-reduced-motion: reduce` must show final states immediately and stop decorative continuous motion.
- Mobile widths 320, 360, 390 and 430 px must have no horizontal overflow.
- Existing RC6 navigation framing and RC8 system safe-zone behavior must remain intact.
