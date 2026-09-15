# V1.1 Four Motion Dialects — Design Spec

## Goal
Increase perceived life and memorability across the four portfolio cases without changing copy, information architecture, native scrolling, mobile integrity, or the RC6 navigation framing fixes.

## Shared motion spine
All cases use the same interaction contract: one-time viewport entrances, low-amplitude pointer response on fine pointers, semantic chapter handoffs, reduced-motion fallbacks, and no scroll-scrubbing/pinning/hijacking. Transforms/opacity/clip-path are preferred to layout-changing animation.

Each case keeps its existing `data-experience` section and receives a dialect identifier through JS. Story lines reveal sequentially. A handoff marker at the bottom of each case names the next chapter so the four experiences read as one designed journey. The final SUNAFIL handoff leads into `MI SISTEMA / SÍNTESIS`.

## 01 / TKOH — Build the System
The CR Master case should feel assembled. The main product stage draws an architectural frame, then reveals the product image with a geometric wipe, then resolves annotations in sequence. Evidence/screens use small alternating offsets. On desktop, the main image receives 4–8px maximum pointer depth; it must reset smoothly on pointer leave. The effect communicates frame → interface → modules → annotations, not generic fade-ins.

## 02 / Amazon — Follow the Signal
Amazon is the most energetic case. Its story line must activate in order from CAMPAÑA to DECISIÓN. The operational journey receives a one-shot signal runner and each journey step becomes active sequentially. Hover/focus on desktop highlights the current step and lightly de-emphasizes siblings. Metrics/operation blocks remain readable and appear after the journey. Motion communicates action → tracking → information → decision.

## 03 / 20 Prod. — Editorial Composition
20 Prod. should feel like an editorial index and a composed visual board rather than a technical flow. Archive rows enter with alternating offsets, and hover/focus produces a restrained editorial shift while siblings remain legible. Social pieces settle from small rotations into an ordered board; fine-pointer movement gives the images low-amplitude depth without drag/drop behavior. Motion communicates composition → message → identity.

## 04 / SUNAFIL — Human Context
SUNAFIL remains calmer and more documentary. The main evidence image resolves with a slow depth/contrast transition, then the three verbs reveal in sequence, then the photo grid. Hover/focus should focus one documentary image while gently quieting the others instead of aggressive zoom. Motion communicates people → context → intervention → understanding.

## Chapter handoffs
Each case gets an unobtrusive handoff element below its final proof block:
- 01 PRODUCTO → 02 MARKETING / DATOS
- 02 MARKETING / DATOS → 03 COMUNICACIÓN VISUAL
- 03 COMUNICACIÓN VISUAL → 04 CONTEXTO / PERSONAS
- 04 CONTEXTO / PERSONAS → 05 MI SISTEMA / SÍNTESIS

The handoff uses a number, dot/line, and next-domain label. It is decorative (`aria-hidden=true`) and does not add a new navigation target.

## Mobile contract
At 320/360/390/430px there must be no horizontal overflow. Pointer/parallax effects are disabled. Sequential entrances use reduced amplitude and shorter delays. Amazon's vertical signal runner may simplify to a horizontal/inline pulse or be hidden if it risks crowding. Handoffs wrap/compact instead of clipping.

## Accessibility and performance
- Respect `prefers-reduced-motion: reduce` by presenting final states immediately.
- Native scrolling only; no wheel interception, `ScrollTrigger`, `scrub`, or pinning.
- No remote animation dependency.
- Keyboard focus must receive equivalent emphasis where hover is used.
- Keep visual changes on transform/opacity/clip-path/filter where practical.
- Existing RC6 navigation framing and mobile fixes are regression requirements.
