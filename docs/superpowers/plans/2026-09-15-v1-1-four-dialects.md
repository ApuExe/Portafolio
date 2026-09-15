# V1.1 Four Motion Dialects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Upgrade the existing RC6 case choreography into four clearly differentiated motion dialects with narrative handoffs while preserving mobile integrity and navigation framing.

**Architecture:** Extend the existing `case-choreography.css/js` layer rather than altering the content architecture. JavaScript owns semantic state, one-time orchestration, low-amplitude pointer variables, and decorative handoff injection; CSS owns visual dialects and responsive/reduced-motion contracts.

**Tech Stack:** Static HTML/CSS/JavaScript, Web Animations API, IntersectionObserver, Playwright/Pytest regression tests.

**Spec:** `docs/superpowers/specs/2026-09-15-v1-1-four-dialects-design.md`

## Global Constraints
- Preserve all copy and section ordering.
- Native scrolling only; no ScrollTrigger, scrub, pinning, wheel interception, or remote motion dependency.
- Preserve RC6 main-nav framing behavior.
- No horizontal overflow at 320, 360, 390, 430px.
- `prefers-reduced-motion` must expose final states without animation.

---

### Task 1: Shared story sequencing and chapter handoffs

**Files:**
- Modify: `js/case-choreography.js`
- Modify: `css/case-choreography.css`
- Test: `tests/test_case_choreography_phase2.py`

**Interfaces:**
- Produces: `.case-handoff`, `.is-story-step-active`, `data-case-dialect`, `data-case-next-domain`.

- [x] Write static/runtime tests that require sequential story state, four dialect identifiers, and 4 handoff definitions.
- [x] Run tests and confirm RED because the new state/classes do not exist.
- [x] Extend `caseMeta`, inject decorative handoff markup, and orchestrate story steps using IntersectionObserver/timeouts with reduced-motion immediate completion.
- [x] Add visual handoff and story-step CSS with compact mobile behavior.
- [x] Run focused tests and confirm GREEN.

### Task 2: TKOH architectural assembly

**Files:**
- Modify: `js/case-choreography.js`
- Modify: `css/case-choreography.css`
- Test: `tests/test_case_choreography_phase2.py`

**Interfaces:**
- Produces: `.tkoh-build-frame`, `.is-build-active`, `--tkoh-depth-x`, `--tkoh-depth-y`.

- [x] Add a failing test requiring an injected four-edge frame and a desktop pointer-depth contract.
- [x] Verify RED.
- [x] Inject the architectural frame, sequence stage/image/annotations, and add fine-pointer depth with pointer-leave reset.
- [x] Add CSS for frame drawing, geometric wipe, annotation resolution, and mobile/reduced-motion final states.
- [x] Verify focused tests GREEN.

### Task 3: Amazon signal journey

**Files:**
- Modify: `js/case-choreography.js`
- Modify: `css/case-choreography.css`
- Test: `tests/test_case_choreography_phase2.py`

**Interfaces:**
- Produces: `.amp-signal-runner`, `.is-signal-step`, `.has-signal-focus`, `.is-signal-focus`.

- [x] Add a failing test requiring a signal runner and sequential step classes.
- [x] Verify RED.
- [x] Inject the runner, activate journey steps in sequence, and implement hover/focus emphasis with sibling de-emphasis.
- [x] Add CSS for one-shot travel, active nodes, focus states, and compact mobile simplification.
- [x] Verify focused tests GREEN.

### Task 4: 20 Prod. editorial board and SUNAFIL documentary focus

**Files:**
- Modify: `js/case-choreography.js`
- Modify: `css/case-choreography.css`
- Test: `tests/test_case_choreography_phase2.py`

**Interfaces:**
- Produces: `--editorial-x/y` image variables and `.has-documentary-focus/.is-documentary-focus` states.

- [x] Add failing tests requiring editorial pointer variables and documentary focus behavior.
- [x] Verify RED.
- [x] Implement low-amplitude editorial board pointer response/reset and keyboard/mouse documentary focus state.
- [x] Add CSS for settled rotations, index-row focus, documentary quieting, and final-state mobile/reduced-motion behavior.
- [x] Verify focused tests GREEN.

### Task 5: Responsive and regression verification

**Files:**
- Modify: `tests/test_case_choreography_runtime.py`
- Create: `V1.1_RC7_FOUR_DIALECTS_QA.md`

**Interfaces:**
- Consumes all Phase 2 states.

- [x] Extend runtime QA to 1440x900, 430x932, 390x844, 360x800, and 320x740.
- [x] Verify section activation, handoff/story final state, no page errors, and `scrollWidth == innerWidth`.
- [x] Run full `pytest -q`, `node --check` on JS, CSS parse, project validator, and ZIP integrity.
- [x] Record actual evidence in QA note.
