# Luis Sabrera — Portfolio V2.13 Lite RC1

Portafolio editorial e interactivo de Luis Sabrera. La identidad se mantiene: blanco/negro/neutros, azul de señal, Inter + DM Mono, líneas estructurales, tipografía grande y evidencia real.

## Qué aporta V2.13 Lite

- Hero **Complejidad → Claridad**: señales de Comunicación, Producto, Datos, CRM, UX y métricas convergen antes de revelar el mensaje principal.
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
- `css/interactive.css`: Explore y Mi Sistema.
- `js/app.js`: navegación, estados e interacciones principales.
- `js/motion-system.js`: activaciones por viewport.
- `js/experience-intro.js`: intro one-shot y fallback.

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

HTML5, CSS Grid/Flex, JavaScript vanilla, IntersectionObserver, GSAP + ScrollTrigger para motion editorial sin controlar el scroll. Three.js queda deliberadamente fuera de V2.13 Lite.

## Validación local

Ejecutar:

```bash
python3 tests/validate_v213.py
node --check js/app.js
node --check js/motion-system.js
node --check js/experience-intro.js
```

La QA de esta release está documentada en `V2.13_LITE_QA.md`.

## Siguiente fase

Después de aprobar visualmente esta RC1: migración a GitHub, CI y despliegue público; recién en la URL real se miden Lighthouse, Axe y Core Web Vitals.

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
