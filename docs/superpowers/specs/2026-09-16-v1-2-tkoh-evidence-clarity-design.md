# V1.2 · TKOH Evidence & Clarity — Design Spec

## Status
Design approved for implementation planning. Baseline: `v1.1.0` / RC13.

## Goal
Rebuild the Studios TKOH / CR Master section as the master Product Design case for V1.2 without changing the portfolio identity, the `SIGNAL → CLARITY` concept, or TKOH's existing `Build the System` motion dialect.

The case must make four things easy to verify:

1. what problem the product is solving;
2. what Luis contributes to that work;
3. which design decisions structure the interface;
4. what evidence exists that those decisions form a reusable system.

The case should become shorter in perceived reading time even though it communicates more professional reasoning.

## Non-goals

- No redesign of the global portfolio.
- No new visual identity, palette, typography, 3D layer, or animation system.
- No invented user research, metrics, conversion impact, adoption data, usability results, business outcomes, engineering ownership, or team process.
- No claim that Luis independently owns all of CR Master.
- No forced before/after comparison unless real historical evidence is available.
- No new screenshots required for the first implementation pass.
- Do not change Amazon, 20 Prod. or SUNAFIL in this phase except regression-safe handoff behavior if required.

## Evidence policy

Every statement in the case must belong to one of these classes:

### A. Confirmed project context
Facts already represented in the stable portfolio, such as:
- CR Master is a CRM SaaS in active iteration;
- Luis participates in its evolution at Studios TKOH;
- his work connects Product Design, UX/UI and communication/marketing;
- Figma is part of the design workflow;
- existing product evidence includes Prospectos V2, Cliente 360, Resumen, Mi Trabajo, Empresas, Actividades and the Commercial Manual.

### B. Design rationale visible in the artifact
Reasoning that can be directly supported by the interface itself, such as:
- prioritizing actionable information;
- retaining commercial context;
- reinforcing state meaning through text, position and form;
- repeating interaction/visual patterns across modules.

### C. Design intent / current objective
Claims about what the system is intended to achieve. These must be phrased as objectives, principles or current work, not as measured results.

Example: `El objetivo es que más módulos no impliquen más reaprendizaje.`

### D. Measured outcome
Only allowed when a real source, period and measurement are available. V1.2 TKOH does not require this category to ship.

## Narrative spine

The case changes from a screen gallery into an evidence spine:

`CONTEXTO → PROBLEMA → RESPONSABILIDAD → CRITERIOS → DECISIONES → SISTEMA → EVIDENCIA / APRENDIZAJE`

This remains compatible with the existing decorative story line:

`PROBLEMA → ESTRUCTURA → INTERFAZ`

## Section architecture

### 0. Existing case header — preserve
Keep:
- `EXPERIENCIA / 001`
- `STUDIOS TKOH`
- `MAR 2026 — ACTUALIDAD`
- back link to Selected Work
- dark case art direction
- existing `Build the System` motion language

### 1. Hero — sharpen, do not replace
Keep headline:

> Diseñar sistemas que sigan siendo claros cuando crecen.

Replace the supporting paragraph with a more explicit product-design framing:

> En Studios TKOH participo en la evolución de CR Master, un CRM SaaS en iteración activa. Mi trabajo se concentra en ordenar jerarquías, flujos y patrones de interfaz para que el producto pueda crecer sin perder contexto ni consistencia.

Facts block becomes:

- `ROL / APORTE` → `Diseño de Producto · UX/UI · estructura visual`
- `PRODUCTO` → `CRM SaaS · CR Master`
- `ESTADO` → `Iteración activa`

Do not frame Figma as a primary fact in the hero. Tooling is secondary to the product contribution.

### 2. Problem + responsibility block — NEW
Add one compact split section before the first screenshot.

#### Problem
Kicker: `01 / PROBLEMA`

Headline:

> Cuando un producto suma módulos, la complejidad puede convertirse en ruido.

Body:

> CR Master reúne distintos momentos del trabajo comercial. El reto de diseño es mantener una lógica reconocible entre vistas con objetivos diferentes: prospectar, revisar contexto, priorizar tareas, leer cuentas y registrar actividad.

#### Responsibility
Kicker: `MI PARTICIPACIÓN`

Use three concise items:

- `JERARQUÍA` — ordenar qué información debe leerse primero;
- `PATRONES` — mantener decisiones visuales e interactivas reconocibles entre módulos;
- `CONTEXTO` — evitar que cada acción obligue al usuario a reconstruir dónde está o qué está viendo.

Guardrail: these are contributions/criteria, not claims of sole ownership.

### 3. Criteria layer — NEW
Add a compact editorial strip:

`SEÑALES → ESTRUCTURA → INTERFAZ`

Three principles:

1. **Lo accionable primero**  
   La interfaz debe revelar prioridad antes que volumen.

2. **Contexto sin saltos innecesarios**  
   La información relacionada debe poder leerse sin fragmentar el flujo.

3. **Patrones que sobreviven al módulo**  
   Componentes, estados y jerarquías deben seguir siendo reconocibles cuando cambia la tarea.

This is the conceptual bridge between `SIGNAL → CLARITY` and the real product evidence.

### 4. Decision 01 — Prospectos V2 — PRIMARY EVIDENCE
Keep `crmaster-prospectos-light-real.webp` as the dominant product image.

Rename stage from generic `CORE WORKSPACE / PROSPECTOS V2` to:

`02 / DECISIÓN PRINCIPAL · PROSPECTOS V2`

Headline:

> Diseñar la vista alrededor de la siguiente acción.

Keep/refine the three existing annotations:

- **Jerarquía operacional** — la lectura empieza por lo que requiere acción.
- **Contexto sin salir** — la vista rápida reduce saltos innecesarios.
- **Estados legibles** — texto, posición y forma refuerzan el significado.

Add one short interpretation line beneath annotations:

> La pantalla funciona como evidencia del criterio, no como una pieza aislada: prioridad, contexto y estado deben poder leerse al mismo tiempo.

### 5. Decisions 02–03 — Cliente 360 + Resumen — SUPPORTING EVIDENCE
Keep both existing screenshots but frame them explicitly as two different decisions.

#### Cliente 360
Label: `03 / CONTEXTO`

Headline:

> Reunir información comercial sin perder continuidad.

Evidence sentence:

> Cliente 360 concentra datos, actividad y oportunidades para que la lectura de una cuenta no dependa de reconstruir información entre vistas separadas.

Avoid claiming measured task-time reduction unless measured evidence exists.

#### Resumen
Label: `04 / LECTURA`

Headline:

> Entender el estado general antes de entrar al detalle.

Evidence sentence:

> El resumen cambia la escala de lectura: primero permite reconocer señales generales y después decidir dónde profundizar.

### 6. System scale — Mi Trabajo / Empresas / Actividades — COMPACT
These three modules must stop behaving like three independent hero screenshots.

New section label:

`05 / EL SISTEMA ESCALA`

Headline:

> Una decisión de diseño vale más cuando sigue funcionando fuera de la pantalla donde nació.

Supporting copy:

> Mi Trabajo, Empresas y Actividades cambian de objetivo, pero conservan una lógica común de jerarquía, estados y contexto. La evidencia aquí no es la cantidad de módulos: es la continuidad entre ellos.

Presentation contract:
- desktop: three compact visual cards/frames in one composed sequence;
- tablet: 2 + 1 or compact stack, preserving legibility;
- mobile: one-column sequence with reduced image height/crop behavior that never hides essential interface context;
- no additional body copy per screenshot beyond module name + one functional line;
- preserve current real images.

Module captions:
- `MI TRABAJO` — prioridades, agenda y seguimiento diario;
- `EMPRESAS` — cartera, cuentas y lectura comercial;
- `ACTIVIDADES` — tareas y reuniones dentro del mismo contexto.

### 7. Evidence / current learning — replace `LO QUE ESTOY RESOLVIENDO`
Do not present design intent as a proven outcome.

New label:

`06 / EVIDENCIA ACTUAL`

Headline:

> El producto ya permite observar una lógica común entre módulos; la validación continúa con el crecimiento del sistema.

Body:

> La evidencia disponible es estructural: patrones visuales reutilizados, jerarquías consistentes y continuidad entre vistas con tareas distintas. El producto sigue en iteración, por lo que esta etapa documenta criterio aplicado y aprendizaje, no un resultado final cerrado.

This explicitly distinguishes current evidence from future measured outcomes.

### 8. Complementary artifact — Commercial Manual
Keep the PDF resource, but reposition its role.

Label:

`ARTEFACTO COMPLEMENTARIO`

Title:

`Manual comercial CR Master`

Supporting line:

> Documenta el producto desde la comunicación comercial y muestra cómo el sistema también necesita mantenerse entendible fuera de la interfaz.

Keep preview/open actions and existing accessible modal behavior.

## Visual hierarchy contract

TKOH remains a dark, architectural case.

Do not change:
- global black/white/neutral system;
- signal blue;
- typography families;
- case background identity;
- large product imagery;
- current chapter framing;
- `Build the System` motion principle.

Change only hierarchy:
- one dominant image: Prospectos V2;
- two medium evidence images: Cliente 360 / Resumen;
- three compact system-scale images: Mi Trabajo / Empresas / Actividades;
- new text sections remain short and structural, not essay-like.

Target: reduce the visual height of the final three-module sequence by at least ~30% relative to V1.1 while improving its explanatory value.

## Motion contract

Preserve V1.1 `Build the System` behavior:
- architectural frame/reveal for primary evidence;
- restrained entrances;
- no scroll hijacking, pinning or scrub;
- equivalent keyboard emphasis where hover is meaningful;
- `prefers-reduced-motion` resolves immediately.

New narrative blocks should use existing entrance primitives instead of introducing a new motion subsystem.

## Responsive contract

Required QA widths:
- 320
- 360
- 390
- 430
- 768
- 1024
- 1366/1440

Requirements:
- no horizontal overflow;
- labels stay legible without dropping below the existing practical mobile baseline;
- Decision blocks preserve reading order before imagery;
- system-scale cards can stack without restoring the excessive V1.1 vertical rhythm;
- no new interaction is required to reveal essential case content.

## Accessibility contract

- Semantic headings must preserve logical order.
- Images keep meaningful alt text already present, refined only when the narrative changes their role.
- New labels are not the only source of meaning.
- No evidence is hidden behind hover-only interaction.
- Existing PDF modal keyboard/focus behavior must regress cleanly.
- `prefers-reduced-motion` remains supported.

## Content integrity rules

Do not use these phrases unless evidence is supplied later:
- `aumentó la conversión`;
- `redujo tiempos`;
- `mejoró la productividad`;
- `validado con usuarios`;
- `resultado probado`;
- `diseñé todo el CRM`;
- `lideré el producto completo`.

Prefer:
- `mi participación se concentra en…`;
- `el objetivo de diseño es…`;
- `la interfaz muestra…`;
- `la evidencia disponible es…`;
- `el producto continúa en iteración`.

## Acceptance criteria

A reviewer who reads only the TKOH case should be able to answer, without inference:

1. What is CR Master?
2. Why is product growth a design problem here?
3. What does Luis contribute?
4. Which three design principles guide the work?
5. Which screenshots prove each decision?
6. How do those decisions extend across modules?
7. Which claims are evidence and which are current design intent?

The case should feel like Product Design reasoning supported by UI evidence, not a UI gallery with explanatory captions.

## Follow-on rule

TKOH becomes the master evidence template for V1.2, but the exact structure must **not** be copied mechanically to the other projects.

- Amazon should inherit the evidence discipline but remain operational/data-led.
- 20 Prod. and SUNAFIL should later become compressed supporting chapters rather than full Product Design cases.
