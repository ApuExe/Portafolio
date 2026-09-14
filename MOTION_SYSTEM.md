# V2.13 Lite — Motion System

## Regla principal

El movimiento debe explicar estructura, estado o transición. No se anima una pieza solo para hacerla “más dinámica”.

## Tres niveles

### 1. Microinteracción

- 120–220 ms.
- Hover, focus, press, cambio de lente y estados frecuentes.
- CSS transitions sobre propiedades explícitas.

### 2. Reveal

- 280–520 ms.
- Evidencia, filas, captions y métricas al entrar en contexto.
- IntersectionObserver o ScrollTrigger únicamente como detector de viewport.
- Nunca ligado continuamente a la posición del scroll.

### 3. Secuencia editorial

- 520–760 ms por movimiento principal.
- Hero Complejidad → Claridad y momentos narrativos puntuales.
- GSAP timeline acotada.
- La intro completa dura aproximadamente 3.1 s y no vuelve a ejecutarse al regresar al inicio durante la misma sesión.

## Hero V2.13

La intro usa señales reales del perfil: Comunicación, Producto, Datos, CRM, Sistemas, UX, 53.8% y 01—04. El sistema pasa de dispersión a convergencia y después revela el Hero real.

La intro:

- no cambia el layout;
- se puede omitir;
- acepta `Escape`;
- tiene fallback si GSAP no está disponible;
- se omite con reduced motion;
- no deja loops de requestAnimationFrame activos.

## Lenguaje de líneas

- TKOH: Problema → Estructura → Interfaz.
- Amazon: Campaña → Lead → CRM → Asesor → Decisión.
- 20 Prod.: Audiencia → Mensaje → Sistema visual.
- SUNAFIL: Personas → Contexto → Comprensión.

Cada motivo se dibuja una sola vez y conserva un divisor estructural estático como fallback.

## Casos

- **TKOH:** clip reveal corto y anotaciones de interfaz.
- **Amazon:** métricas tabulares, count-up acotado y regla proporcional.
- **20 Prod.:** ritmo editorial con stagger corto.
- **SUNAFIL:** fotografía más calmada, scale 1.01 → 1 y caption separado.
- **Mi Sistema:** clímax 2D interactivo con nodos y conexiones a proyectos.

## Reduced motion

La información se mantiene. Se elimina o reduce el desplazamiento espacial; color, texto, estados y estructura permanecen disponibles.
