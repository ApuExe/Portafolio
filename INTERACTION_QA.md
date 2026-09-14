# Interaction QA — V2.13 Lite

## Hero

- `OMITIR` es botón nativo.
- `Escape` resuelve la intro.
- El Hero real existe siempre y no depende de JS para ser legible.
- Fallback sin GSAP: Hero resuelto inmediatamente.
- Reduced motion: Hero resuelto inmediatamente.
- La geometría del Hero no cambia al resolver la intro.

## Explore

- Lentes usan `aria-pressed` y señal visual adicional al color.
- Estado de lente puede compartirse mediante `?lens=producto`, `?lens=comunicacion` o `?lens=datos`.
- En móvil el trigger flotante se oculta para no cubrir contenido; el CTA del Hero abre el panel.

## Mi Sistema

- 4 controles nativos `<button>`.
- Click/tap/focus actualiza etapa.
- Enter/Espacio funcionan por comportamiento nativo y handler existente.
- Flechas mueven el foco entre nodos.
- `aria-pressed` comunica el estado seleccionado.
- La región de proyectos usa `aria-live="polite"`.
- La fuerza de relación usa texto + forma, no solo color.
- Existe contenido inicial incluso si JavaScript falla.

## Scroll

- Nativo.
- Sin `pin`.
- Sin `scrub`.
- Sin preventDefault en wheel/touchmove.
