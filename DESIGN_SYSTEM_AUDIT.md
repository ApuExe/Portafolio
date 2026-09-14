# Design System Audit — Portfolio Luis Sabrera

## Objetivo
Consolidar el lenguaje visual aprobado sin homogeneizar la dirección artística propia de TKOH, Amazon Magic Park, 20 Prod. y SUNAFIL.

## Hallazgos verificados

### 1. Color drift — corregido con tokens canónicos
Se encontraron varias generaciones de azul de señal (`#1665ff`, `#0f5ff5`, `#205cff`, `#86a0ff`, `#8da0ff`).

**Resolución:** `design-system.css` define roles canónicos (`--ds-signal`, `--ds-signal-on-dark`, `--ds-signal-soft`) y conecta los aliases históricos (`--signal`, `--signal-soft`) sin reescribir los casos.

### 2. Layout drift — corregido por contrato
Existían distintas redefiniciones históricas de `--page` y gutters.

**Resolución:** una sola fórmula canónica basada en `--ds-gutter` + `--ds-page-max`, con breakpoints 820/560.

### 3. Motion drift — alineado
Había duraciones históricas y tokens repetidos.

**Resolución:** escala de motion compartida (`micro`, `hover`, `ui`, `editorial`, `major`) y dos curvas principales (`--ease-out`, `--ease-inout`). No se cambia el motion narrativo específico de los casos.

### 4. Typography primitives — connected
Labels como `section-kicker`, `profile-label`, `exp-kicker` y metadatos de interacción repetían contratos similares.

**Resolución:** se conectan a los mismos tokens de mono, tamaño y tracking.

### 5. Interactive controls — connected
Explorador, filtros, contacto y navegación tenían alturas/tiempos diferentes.

**Resolución:** target mínimo común de 44 px, mismo focus contract y timing común para interacciones cortas.

### 6. Case art direction — deliberately preserved
SUNAFIL documental, 20 Prod. editorial y TKOH técnico no se convierten en variantes de una misma Card.

**Decisión:** preservar composición específica. El sistema solo gobierna primitivos compartidos.

## Clasificación de reconciliación
- **already-connected:** fuentes base, estructura de navegación, contraste/focus, retícula principal.
- **bind-tokens:** colores de señal, gutters, spacing, motion, labels, focus.
- **align-variant:** controles de exploración, links de contacto, estados activos.
- **compose-from-primitives:** próximas interacciones Inspect / Connect / Reward.
- **blocked:** Three.js como capa productiva hasta validar coste/performance y fallback HTML.

## Regla para siguientes iteraciones
Toda nueva UI debe usar los tokens y primitives de `design-system.css`. No introducir nuevos hex, gutters, radii, timings o z-index sin justificar un nuevo rol del sistema.
