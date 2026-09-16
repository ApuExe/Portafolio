# V1.2 TKOH Evidence & Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Studios TKOH / CR Master case into a concise Product Design evidence spine while preserving the V1.1 SIGNAL → CLARITY identity, existing real assets, and Build the System motion dialect.

**Architecture:** Keep the existing `#case-tkoh` section and reuse its product imagery, PDF modal, and choreography hooks. Add semantic narrative blocks and reframe the existing evidence hierarchy through new TKOH-scoped classes in `index.html` and `css/style.css`; extend existing choreography selectors rather than creating a new motion subsystem. Protect the change with structural, content-integrity, responsive, accessibility, and regression tests.

**Tech Stack:** HTML5, CSS Grid/Flex, Vanilla JavaScript, IntersectionObserver, Web Animations API, pytest.

**Spec:** `docs/superpowers/specs/2026-09-16-v1-2-tkoh-evidence-clarity-design.md`

## Global Constraints

- Baseline is `v1.1.0` / RC13.
- Preserve `SIGNAL → CLARITY`, global palette, typography, dark TKOH art direction, existing product screenshots, PDF modal behavior, and `Build the System` motion language.
- Do not change Amazon, 20 Prod. or SUNAFIL except regression-safe shared behavior if unavoidable.
- Do not invent research, metrics, measured outcomes, sole ownership, team process, or historical before/after evidence.
- Required QA widths: 320, 360, 390, 430, 768, 1024, 1366/1440.
- No essential content may depend on hover or animation.
- `prefers-reduced-motion` must continue resolving content immediately.
- The final three-module sequence must be materially more compact than V1.1 and target at least ~30% less visual height at desktop while preserving legibility.

---

### Task 1: Lock the TKOH narrative contract with tests

**Files:**
- Create: `tests/test_v12_tkoh_evidence_clarity.py`
- Read: `index.html`
- Read: `docs/superpowers/specs/2026-09-16-v1-2-tkoh-evidence-clarity-design.md`

**Interfaces:**
- Consumes: existing `#case-tkoh`, `.exp-stage-product`, `.exp-evidence-grid`, `.exp-sequence`, `.exp-proof`, `.exp-resource-line`.
- Produces: regression assertions for the exact V1.2 narrative spine and prohibited claims.

- [ ] **Step 1: Write failing structural/content tests**

Create tests that parse `index.html` and assert within `#case-tkoh`:

```python
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SOUP = BeautifulSoup(HTML, "html.parser")
TKOH = SOUP.select_one("#case-tkoh")


def text(node):
    return " ".join(node.stripped_strings)


def test_tkoh_has_evidence_spine_blocks():
    assert TKOH is not None
    assert TKOH.select_one("[data-tkoh-problem]")
    assert TKOH.select_one("[data-tkoh-responsibility]")
    assert TKOH.select_one("[data-tkoh-criteria]")
    assert TKOH.select_one("[data-tkoh-primary-decision]")
    assert TKOH.select_one("[data-tkoh-system-scale]")
    assert TKOH.select_one("[data-tkoh-current-evidence]")


def test_tkoh_hero_states_role_product_and_active_iteration():
    hero = TKOH.select_one(".exp-hero")
    copy = text(hero)
    assert "Diseño de Producto · UX/UI · estructura visual" in copy
    assert "CRM SaaS · CR Master" in copy
    assert "Iteración activa" in copy
    assert "Figma" not in copy


def test_tkoh_names_three_design_principles():
    criteria = text(TKOH.select_one("[data-tkoh-criteria]"))
    assert "Lo accionable primero" in criteria
    assert "Contexto sin saltos innecesarios" in criteria
    assert "Patrones que sobreviven al módulo" in criteria


def test_tkoh_does_not_claim_unverified_outcomes():
    copy = text(TKOH).lower()
    forbidden = [
        "aumentó la conversión",
        "redujo tiempos",
        "mejoró la productividad",
        "validado con usuarios",
        "resultado probado",
        "diseñé todo el crm",
        "lideré el producto completo",
    ]
    for phrase in forbidden:
        assert phrase not in copy
```

- [ ] **Step 2: Run the new tests and verify RED**

Run:

```bash
pytest -q tests/test_v12_tkoh_evidence_clarity.py
```

Expected: failures because the new V1.2 data attributes/content do not exist yet.

- [ ] **Step 3: Keep this task test-only**

Do not modify production HTML/CSS/JS in Task 1.

---

### Task 2: Rebuild TKOH HTML into the evidence spine

**Files:**
- Modify: `index.html` inside `#case-tkoh` only
- Test: `tests/test_v12_tkoh_evidence_clarity.py`

**Interfaces:**
- Consumes: tests from Task 1 and all existing CR Master images/PDF.
- Produces: semantic blocks using `data-tkoh-problem`, `data-tkoh-responsibility`, `data-tkoh-criteria`, `data-tkoh-primary-decision`, `data-tkoh-system-scale`, `data-tkoh-current-evidence`.

- [ ] **Step 1: Update the existing hero copy and facts**

Use exactly:

```html
<p>
  En Studios TKOH participo en la evolución de CR Master, un CRM SaaS en iteración activa.
  Mi trabajo se concentra en ordenar jerarquías, flujos y patrones de interfaz para que el
  producto pueda crecer sin perder contexto ni consistencia.
</p>
<dl class="exp-facts">
  <div><dt>ROL / APORTE</dt><dd>Diseño de Producto · UX/UI · estructura visual</dd></div>
  <div><dt>PRODUCTO</dt><dd>CRM SaaS · CR Master</dd></div>
  <div><dt>ESTADO</dt><dd>Iteración activa</dd></div>
</dl>
```

- [ ] **Step 2: Insert the problem/responsibility block before `.exp-stage-product`**

Use semantic wrapper `section.tkoh-context-grid` with `data-tkoh-problem` and `data-tkoh-responsibility`; include the exact problem copy and three contribution items from the approved spec.

- [ ] **Step 3: Insert the criteria strip**

Create `section.tkoh-criteria` with `data-tkoh-criteria`, heading `SEÑALES → ESTRUCTURA → INTERFAZ`, and the three named principles from the spec. Keep every principle visible in static HTML.

- [ ] **Step 4: Reframe Prospectos V2 as the primary decision**

Add `data-tkoh-primary-decision` to `.exp-stage-product`, change the label to `02 / DECISIÓN PRINCIPAL · PROSPECTOS V2`, add heading `Diseñar la vista alrededor de la siguiente acción.`, retain the screenshot and three annotations, and append the interpretation sentence from the spec.

- [ ] **Step 5: Reframe Cliente 360 and Resumen**

Keep `.exp-evidence-grid` and real images; use labels `03 / CONTEXTO` and `04 / LECTURA`, approved headlines, and one evidence sentence per card. No measured claims.

- [ ] **Step 6: Compact the system-scale HTML**

Mark `.exp-sequence` with `data-tkoh-system-scale`. Replace its current split text/images structure with three `.tkoh-scale-card` articles, each containing module label, functional line, and its existing image. Preserve images:

```text
crmaster-mi-trabajo-real.webp
crmaster-empresas-real.webp
crmaster-actividades-real.webp
```

- [ ] **Step 7: Replace the proof block with current evidence**

Mark `.exp-proof` with `data-tkoh-current-evidence`, label `06 / EVIDENCIA ACTUAL`, add heading and body from the spec, with language that explicitly states the product remains in iteration.

- [ ] **Step 8: Reposition the PDF as complementary evidence**

Keep the existing resource actions and modal. Change label to `ARTEFACTO COMPLEMENTARIO`, retain title `Manual comercial CR Master`, and add the approved supporting line before the actions.

- [ ] **Step 9: Run the narrative tests**

Run:

```bash
pytest -q tests/test_v12_tkoh_evidence_clarity.py
```

Expected: PASS for structural/content rules.

---

### Task 3: Add TKOH-scoped visual hierarchy and compact scale layout

**Files:**
- Modify: `css/style.css`
- Test: `tests/test_v12_tkoh_evidence_clarity.py`

**Interfaces:**
- Consumes: new TKOH data attributes/classes from Task 2.
- Produces: responsive editorial blocks and a compact three-card system-scale grid without changing global case styling.

- [ ] **Step 1: Add static CSS contract tests before styling**

Extend `tests/test_v12_tkoh_evidence_clarity.py` to assert CSS contains:

```python
CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")

def test_tkoh_v12_styles_are_scoped_and_responsive():
    assert "#case-tkoh .tkoh-context-grid" in CSS
    assert "#case-tkoh .tkoh-criteria" in CSS
    assert "#case-tkoh .tkoh-scale-grid" in CSS
    assert "@media (max-width: 768px)" in CSS
    assert "@media (max-width: 430px)" in CSS
```

Run and verify these assertions fail before adding CSS.

- [ ] **Step 2: Style problem/responsibility as a compact split block**

Add TKOH-scoped CSS using existing `--page`, `--signal`, mono font, current dark borders, and no new palette. Desktop uses two columns; ≤768px stacks in source order.

- [ ] **Step 3: Style the criteria strip as three equal editorial cells**

Use a 3-column grid with current border language. At ≤768px use a single column or 1+2 layout only if labels stay ≥12px practical mobile size. Do not hide copy.

- [ ] **Step 4: Strengthen the primary-decision hierarchy**

Style a new `.tkoh-decision-head` above the existing shot, keeping Prospectos V2 dominant. The new interpretation line must stay visually subordinate to annotations.

- [ ] **Step 5: Refine supporting evidence cards**

Ensure Cliente 360 and Resumen remain two medium cards at desktop, stack at mobile, and their evidence sentence is readable without hover.

- [ ] **Step 6: Implement compact `.tkoh-scale-grid`**

Desktop: 3 columns, each card combines text + image in one frame. Tablet: 2 + 1. Mobile: one column. Use CSS `aspect-ratio`/`object-fit` only if the full essential UI remains interpretable; otherwise keep intrinsic image ratio and reduce padding/gaps instead of cropping critical context.

- [ ] **Step 7: Reduce sequence vertical rhythm**

Target the new system-scale section with smaller top/bottom spacing than old `.exp-sequence-list + .exp-sequence-images`. The three modules must no longer each behave like independent hero evidence.

- [ ] **Step 8: Make evidence/proof copy structured rather than oversized**

For `#case-tkoh [data-tkoh-current-evidence]`, use a heading/body hierarchy instead of rendering the entire evidence statement at the previous `clamp(28px, 4.3vw, 68px)` proof scale.

- [ ] **Step 9: Run CSS/narrative tests**

Run:

```bash
pytest -q tests/test_v12_tkoh_evidence_clarity.py
```

Expected: PASS.

---

### Task 4: Preserve Build the System choreography with the new evidence DOM

**Files:**
- Modify: `js/case-choreography.js`
- Modify only if required: `css/case-choreography.css`
- Test: `tests/test_v12_tkoh_evidence_clarity.py`
- Regression: `tests/test_case_choreography.py`, `tests/test_case_choreography_phase2.py`, `tests/test_case_choreography_runtime.py`

**Interfaces:**
- Consumes: `.exp-stage-product`, `.exp-annotations`, `.exp-evidence`, `.tkoh-scale-card`, `.tkoh-context-grid`, `.tkoh-criteria`.
- Produces: existing frame/shot/annotation behavior plus restrained entrances for new narrative blocks and scale cards.

- [ ] **Step 1: Add choreography contract assertions**

Extend the V1.2 test to assert `js/case-choreography.js` references `.tkoh-context-grid`, `.tkoh-criteria`, and `.tkoh-scale-card`, while retaining `tkoh-build-frame`.

Run and verify RED.

- [ ] **Step 2: Extend the existing TKOH evidence selector**

Replace the old selector targeting `.exp-sequence-list article, .exp-sequence-images figure` with the new V1.2 nodes, e.g. narrative blocks, `.exp-evidence`, and `.tkoh-scale-card`, reusing `observeOnce()` and `animate()`.

- [ ] **Step 3: Keep the primary stage behavior unchanged**

Do not alter frame construction, pointer depth, annotation sequence, reduced-motion handling, scroll model, or animation subsystem.

- [ ] **Step 4: Update any TKOH-only hover selector that points to removed sequence figures**

If `.exp-sequence-images figure:hover` no longer exists, retarget it to `.tkoh-scale-card` with the same restrained maximum movement; no scale-up that harms readability.

- [ ] **Step 5: Run choreography tests**

Run:

```bash
pytest -q tests/test_v12_tkoh_evidence_clarity.py tests/test_case_choreography.py tests/test_case_choreography_phase2.py tests/test_case_choreography_runtime.py
```

Expected: PASS.

---

### Task 5: Responsive/accessibility regression and height-compression contract

**Files:**
- Modify: `tests/test_v12_tkoh_evidence_clarity.py`
- Modify only if failures require: `css/style.css`, `css/stability.css`

**Interfaces:**
- Consumes: final TKOH markup/styles.
- Produces: automated guardrails for source order, mobile styles, no interaction-gated evidence, and compact scale section.

- [ ] **Step 1: Add accessibility/source-order assertions**

Assert all new sections have headings in order, all six CR Master screenshots retain non-empty alt text, and there is no `hidden`, `aria-hidden=true`, or button required to reveal evidence copy.

- [ ] **Step 2: Add mobile contract assertions**

Assert media rules exist for ≤768 and ≤430, `.tkoh-scale-grid` becomes one column at mobile, and TKOH labels/copy do not introduce literal CSS font sizes below 12px for the new V1.2 classes.

- [ ] **Step 3: Add compactness assertion based on DOM/CSS contract**

Assert old split sequence markup `.exp-sequence-list` and `.exp-sequence-images` no longer exists inside TKOH, and `.tkoh-scale-grid` contains exactly three cards. This is the stable automated proxy for the intended ≥30% height reduction; visual height remains a QA check, not a fabricated pixel metric.

- [ ] **Step 4: Run focused V1.2 tests**

Run:

```bash
pytest -q tests/test_v12_tkoh_evidence_clarity.py
```

Expected: PASS.

---

### Task 6: Full regression, docs, and release candidate artifact

**Files:**
- Create: `V1.2_RC1_TKOH_EVIDENCE_CLARITY_QA.md`
- Modify: `README.md`
- Verify: all HTML/CSS/JS/tests

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: V1.2 RC1 baseline artifact and QA record.

- [ ] **Step 1: Run full pytest suite**

```bash
pytest -q
```

Expected: 0 failures.

- [ ] **Step 2: Run legacy validator**

```bash
python tests/validate_v213.py
```

Expected: PASS.

- [ ] **Step 3: Validate JavaScript syntax**

```bash
for f in js/*.js; do node --check "$f"; done
```

Expected: all files exit 0.

- [ ] **Step 4: Validate CSS parsing**

Use Python `tinycss2` to parse every `css/*.css` file and fail if parser errors are present.

- [ ] **Step 5: Document QA truthfully**

Create `V1.2_RC1_TKOH_EVIDENCE_CLARITY_QA.md` recording:
- changed narrative hierarchy;
- retained evidence/assets;
- automated test counts;
- validator/JS/CSS status;
- responsive widths required by spec;
- any browser/visual checks actually executed;
- explicit note if no live visual browser measurement was available.

- [ ] **Step 6: Update README baseline**

Set current development baseline to `V1.2 RC1 · TKOH Evidence & Clarity`, while preserving the published `v1.1.0` stable release reference.

- [ ] **Step 7: Package artifact**

Create `/mnt/data/luis-sabrera-portfolio-v1.2.0-rc1-tkoh-evidence-clarity.zip` and verify ZIP integrity with `unzip -t`.

## Self-review

- Spec coverage: hero, problem/responsibility, criteria, Prospectos primary evidence, Cliente 360/Resumen supporting evidence, compact system scale, current evidence, complementary artifact, motion, responsive, accessibility, evidence policy, and non-goals all map to Tasks 1–6.
- Placeholder scan: no TODO/TBD or unspecified implementation steps remain.
- Interface consistency: all selectors/data attributes introduced in Task 2 are the same selectors consumed by Tasks 3–5.
