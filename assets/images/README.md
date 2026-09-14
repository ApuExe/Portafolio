# Imágenes reales del portafolio

La dirección visual no cambia. Este directorio está preparado para incorporar capturas reales de CR Master y Amazon Magic Park sin penalizar rendimiento.

## Formato recomendado

Mantener un original de trabajo fuera del sitio y publicar:

- AVIF cuando sea viable.
- WebP como formato principal y fallback.
- PNG solo cuando sea realmente necesario.

## Tamaños sugeridos por captura

- 640 px
- 1200 px
- 1800 px

Ejemplo:

```text
crmaster-dashboard-640.webp
crmaster-dashboard-1200.webp
crmaster-dashboard-1800.webp
```

## HTML recomendado

```html
<picture class="portfolio-media-frame">
  <source
    type="image/avif"
    srcset="
      assets/images/crmaster-dashboard-640.avif 640w,
      assets/images/crmaster-dashboard-1200.avif 1200w,
      assets/images/crmaster-dashboard-1800.avif 1800w
    "
    sizes="(max-width: 780px) 100vw, 90vw"
  />

  <img
    class="portfolio-media"
    src="assets/images/crmaster-dashboard-1200.webp"
    srcset="
      assets/images/crmaster-dashboard-640.webp 640w,
      assets/images/crmaster-dashboard-1200.webp 1200w,
      assets/images/crmaster-dashboard-1800.webp 1800w
    "
    sizes="(max-width: 780px) 100vw, 90vw"
    width="1800"
    height="1100"
    loading="lazy"
    decoding="async"
    alt="Dashboard principal de CR Master"
  />
</picture>
```

## Regla para el Hero

Si se incorpora una imagen que se convierte en el LCP:
- no usar `loading="lazy"`;
- mantener `width` y `height`;
- optimizar agresivamente el peso;
- medir antes de añadir `fetchpriority="high"`.

## Privacidad

Antes de publicar capturas reales:
- ocultar nombres;
- teléfonos;
- correos;
- leads;
- IDs;
- métricas privadas;
- información interna no autorizada.
