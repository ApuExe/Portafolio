# Luis Sabrera — Portfolio V1.1 · SIGNAL → CLARITY

Portafolio editorial e interactivo de Luis Sabrera. La identidad se mantiene: blanco/negro/neutros, azul de señal, Inter + DM Mono, líneas estructurales, tipografía grande y evidencia real.

## Estado actual

La V1.1 conserva la arquitectura y el contenido de V1, pero ya extiende el lenguaje de movimiento desde el Hero hacia los cuatro casos. RC7 parte de RC6 Navigation Framing y mantiene sus correcciones de móvil y encuadre.

## V1.1 — SIGNAL → CLARITY

- Hero **SIGNAL → CLARITY**: una apertura oscura de alto contraste convierte señales de Comunicación, Producto, Datos, CRM, UX y métricas en una retícula ordenada antes de revelar **HAGO ENTENDIBLE LO COMPLEJO.**
- Tres escalas visuales —palabras gigantes, etiquetas técnicas y líneas— construyen tensión sin agregar contenido estructural nuevo.
- Un corte horizontal de alta energía separa el caos del momento de claridad; el titular entra mediante máscaras verticales en lugar de un fade uniforme.
- Tras la intro, el Hero conserva una respuesta de profundidad de apenas 2–3 px al puntero; el resto del sitio no cambia.
- La intro es decorativa y segura: el contenido real ya existe en el DOM, se puede omitir con **OMITIR** o `Escape`, y `prefers-reduced-motion` muestra directamente el Hero resuelto.
- La intro compleja corre una sola vez durante la sesión; al volver arriba el Hero permanece resuelto.
- Cada caso tiene un motivo de línea propio: arquitectura en TKOH, operación en Amazon, retícula editorial en 20 Prod. y lectura documental en SUNAFIL.
- Motion específico por caso, sin `pin`, `scrub`, scroll hijacking ni Three.js.
- **Mi Sistema** usa cuatro botones nativos y conecta cada etapa con proyectos reales mediante fuerza textual: FUERTE / MEDIA / CONTEXTUAL.
- Cierre narrativo: **“YA VISTE CÓMO PIENSO. Ahora cuéntame qué necesitas hacer más claro.”**
- El explorador flotante se elimina visualmente en móvil para no tapar contenido; la entrada `EXPLORA MI PERFIL` del Hero sigue abriendo el panel.
- Nuevo icono optimizado: favicon real 64×64 y WebP liviano para el header.

## Cómo abrirlo

La forma más estable para alguien con poca experiencia técnica:

```bash
cd carpeta-del-portafolio
python -m http.server 8080
```

Luego abre `http://localhost:8080` en Chrome o Edge.

También puede funcionar abriendo `index.html` directamente, pero usar un servidor local evita diferencias de seguridad entre navegadores.

## Archivos que normalmente NO necesitas tocar

- `css/style.css`: dirección visual histórica.
- `css/stability.css`: responsive, densidad y hardening.
- `css/design-system.css`: tokens y contratos visuales.
- `css/motion-system.css`: líneas, métricas y motion compartido.
- `css/experience-intro.css`: Hero Complejidad → Claridad.
- `css/case-choreography.css`: cuatro dialectos de movimiento y handoffs entre casos.
- `css/interactive.css`: Explore y Mi Sistema.
- `js/app.js`: navegación, estados e interacciones principales.
- `js/motion-system.js`: activaciones por viewport.
- `js/experience-intro.js`: intro one-shot y fallback.
- `js/case-choreography.js`: secuencias TKOH / Amazon / 20 Prod. / SUNAFIL y continuidad narrativa.

Para cambiar textos, el archivo principal es `index.html`.

## Reglas de mantenimiento

- No usar `transition: all`.
- No reintroducir `pin`, `scrub`, ScrollSmoother ni interceptación de wheel/touch.
- No convertir bloques informativos en pantallas vacías de `100vh`.
- No ocultar información esencial detrás de hover.
- Mantener `width` y `height` en imágenes.
- Mantener los targets táctiles alrededor de 44×44 px.
- Si se agrega motion, debe tener propósito y respetar reduced motion.

## Stack

HTML5, CSS Grid/Flex, JavaScript vanilla, IntersectionObserver y Web Animations API. La ruta crítica de motion no depende de GSAP, ScrollTrigger ni Three.js.

## Validación local

Ejecutar:

```bash
python3 tests/validate_v213.py
node --check js/app.js
node --check js/motion-system.js
node --check js/experience-intro.js
```

La QA de esta release está documentada en `V2.13_LITE_QA.md`.

## V1.1 RC2 — SIGNAL → CLARITY + Global Life

- Intro desktop ampliada a ~5.35 s y móvil a ~3.9 s, con SIGNAL → SATURATION → ORDER → VISUAL SILENCE → CUT → CLARITY.
- Prepaint síncrono antes de CSS/JS diferido para evitar el flash del Hero normal antes de la intro.
- Fallback fail-open: si las dependencias tardan demasiado, la intro se aborta en lugar de aparecer tarde y reiniciar visualmente la página.
- Para revisar la intro repetidamente: añade `?intro=replay` a la URL local.
- El Hero conserva respuesta al puntero después del reveal.
- Nueva capa de vida global: Selected Work, casos, Mi Sistema, Perfil y Contacto responden suavemente a proximidad/hover.
- Los assets ambientales tienen un recorrido un poco más visible, pero siguen siendo lentos y no dependen del scroll.
- Se mantiene scroll nativo, `prefers-reduced-motion`, navegación por teclado y los fallbacks existentes.

## Siguiente fase

Validar visualmente la RC2 en navegador real. Si el impacto ya está en el nivel correcto, la siguiente iteración debe centrarse en dirección de arte por caso, no en acumular más efectos globales.

**Contacto:** luis.sabrera@studios-tkoh.online  
**Ubicación:** Lima, Perú

## V2.13 Lite RC3 — Explorer Fix
- Descubrimiento 4/4 basado en encabezados de caso, robusto ante experiencias de gran altura.
- El CTA final del explorador ahora lleva al Perfil real (`#about`) en lugar de abrir una capa aislada.
- Estado de sesión versionado para invalidar progresos 3/4 defectuosos de builds anteriores.

## V2.13 Lite RC4 — anchor framing
- Experience links now frame the case's primary headline block instead of the padded outer section boundary.
- Public `#case-*` hashes are preserved.
- Added regression coverage for all four work-experience anchors at 1584×692.

## V1.1 RC3 — SIGNAL → CLARITY (offline-safe)

The cinematic Hero is now independent from external animation CDNs. Its critical path uses the native Web Animations API, fixes the stacking bug that could cover the animation with a black scrim, and includes a native reveal layer for the rest of the portfolio. Use `?intro=replay` while reviewing the opening sequence.

## V1.1 RC4 — Light Blend Transition

- El cierre de SIGNAL → CLARITY ya no corta de negro a blanco.
- La salida recorre cuatro tonos: negro, grafito, gris frío y blanco del Hero.
- El Hero empieza a revelarse mientras la capa cinematográfica todavía se está aclarando, creando una transición continua entre intro y landing.
- El scrim raíz pierde opacidad durante ~880 ms en lugar de desaparecer al resolver la intro.
- La clave de sesión fue versionada a RC4 para que esta nueva entrada se reproduzca aunque ya se haya visto RC3.
- Se mantienen `?intro=replay`, reduced motion, Escape/OMITIR y el comportamiento offline-safe.

---

## V1.1 RC5 — Mobile Integrity + Case Choreography

La candidata RC5 conserva la estructura y contenido de V1, pero amplía el lenguaje de movimiento después del Hero:

- auditoría responsive en 320 / 360 / 390 / 430 px;
- correcciones del Mapa del perfil, Contacto y cierre de intro en móvil;
- cuatro dialectos de motion para TKOH, Amazon, 20 Prod. y SUNAFIL;
- continuidad narrativa mediante case bridges;
- Web Animations API + IntersectionObserver, sin scroll hijacking;
- soporte de `prefers-reduced-motion`.

Ver detalle técnico en `V1.1_RC5_MOBILE_AND_CHOREOGRAPHY_QA.md`.


## V1.1 RC7 — Four Motion Dialects

- **TKOH / BUILD THE SYSTEM:** marco arquitectónico, wipe geométrico, anotaciones secuenciadas y profundidad mínima al puntero.
- **Amazon / FOLLOW THE SIGNAL:** señal operativa que recorre el flujo, pasos secuenciales y foco contextual.
- **20 Prod. / EDITORIAL COMPOSITION:** índice editorial interactivo y piezas visuales que se ordenan como tablero.
- **SUNAFIL / HUMAN CONTEXT:** cadencia documental, foco fotográfico y jerarquía más humana.
- Handoffs narrativos: PRODUCTO → MARKETING / DATOS → COMUNICACIÓN VISUAL → CONTEXTO / PERSONAS → MI SISTEMA / SÍNTESIS.
- Verificación responsive: 320 / 360 / 390 / 430 px más desktop.
- Detalle técnico: `V1.1_RC7_FOUR_DIALECTS_QA.md`.

## V1.1 RC8 — Mi Sistema / Central Safe Zone

- El núcleo **CLARIDAD** reduce su escala en desktop y deja una zona de seguridad real alrededor de la órbita.
- Las cuatro tarjetas se desplazan hacia la periferia y reducen ancho/escala tipográfica para no competir con el centro.
- Los estados inactivos conservan lectura (~44% de opacidad) y solo el activo alcanza protagonismo completo.
- El estado activo ya no escala hacia el centro: se limita a un lift de 2 px.
- Tablet y móvil mantienen la composición apilada, sin órbita, para preservar legibilidad y tactilidad.
- Regresión específica: `tests/test_system_safe_zone.py`.

## V1.1 RC9 — Profile & Closing Experience

- **Perfil:** Comunicación → Producto → Datos ahora se leen como un sistema conectado, con una línea narrativa común, entradas editoriales y estados de foco sin cambiar el contenido.
- **Contacto:** cierre narrativo más fuerte con campo de luz sutil, reveal escalonado, CTA con mayor presencia y movimiento ambiental controlado.
- Motion crítico implementado con Web Animations API + IntersectionObserver; no depende de GSAP para funcionar.
- Fine-pointer motion limitado a pocos píxeles; touch y `prefers-reduced-motion` usan estados simplificados/finales.
- Se conservan los fixes de navegación RC6, la coreografía RC7 y la zona segura de Mi Sistema RC8.
- QA: `V1.1_RC9_PROFILE_CLOSING_QA.md`.
