# V1.1 Profile & Closing Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a connected editorial Profile motion layer and a stronger narrative Contact closing while preserving RC8 structure, copy, mobile integrity, and accessibility.

**Architecture:** Add one focused stylesheet and one focused JavaScript module. Existing `app.js` and historical CSS stay untouched except for index references, minimizing regression risk. Native IntersectionObserver/Web Animations API and CSS custom properties drive the experience.

**Tech Stack:** Static HTML/CSS/JavaScript, IntersectionObserver, Web Animations API, Playwright + pytest for regression QA.

**Spec:** `docs/superpowers/specs/2026-09-15-v1-1-profile-closing-design.md`

## Global Constraints
- Preserve all existing Profile and Contact base copy.
- Native scroll only; no pin/scrub/scroll hijacking.
- No Three.js, particles, cursor replacement, or audio.
- Respect `prefers-reduced-motion` and touch devices.
- No horizontal overflow at 320/360/390/430 px.
- Preserve RC6 navigation framing and RC8 system safe-zone behavior.

---

### Task 1: Phase 3 contract and mobile regression
**Files:**
- Create: `tests/test_profile_closing_phase3.py`

- [ ] Assert `profile-closing.css` and `profile-closing.js` are loaded.
- [ ] Assert Profile exposes a connected-thread state and Contact exposes a closing-live state.
- [ ] Runtime-check desktop and 320/390/430 widths for active states, pointer variables, and no overflow.
- [ ] Run test and verify RED before implementation.

### Task 2: Profile editorial motion
**Files:**
- Create: `css/profile-closing.css`
- Create: `js/profile-closing.js`
- Modify: `index.html`

- [ ] Add stylesheet/script references only; keep copy and section structure unchanged.
- [ ] Implement Profile thread progress, staged lens activation, and subtle pointer response.
- [ ] Implement final-state behavior for reduced motion/touch.
- [ ] Run Phase 3 test to GREEN.

### Task 3: Contact closing motion
**Files:**
- Modify: `css/profile-closing.css`
- Modify: `js/profile-closing.js`

- [ ] Add staged native reveal for headline, resolution, actions and capability cards.
- [ ] Add fine-pointer radial light response through CSS variables.
- [ ] Add in-view-only slow signal drift and focus/hover hierarchy.
- [ ] Ensure mobile signal remains contained and reduced motion disables continuous movement.
- [ ] Run Phase 3 and mobile integrity tests.

### Task 4: Full regression and packaging
**Files:**
- Create: `V1.1_RC9_PROFILE_CLOSING_QA.md`
- Modify: `README.md`

- [ ] Run syntax checks, CSS parsing, validators and focused browser regressions.
- [ ] Capture Profile and Contact desktop/mobile screenshots for visual review.
- [ ] Zip RC9 and test archive integrity.
