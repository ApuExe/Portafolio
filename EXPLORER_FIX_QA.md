# V2.13 Lite RC3 — Explorer Fix QA

## Incidencias corregidas

1. **Contador detenido en 3/4**
   - Causa: el observador medía secciones completas con `threshold: 0.18` y márgenes de root negativos.
   - TKOH supera los 4.7k px de alto, por lo que nunca podía alcanzar el porcentaje visible requerido en varios viewports.
   - Corrección: el descubrimiento observa ahora el `.exp-head` compacto de cada experiencia y registra el caso al entrar en la zona activa.

2. **Acción final del explorador sin destino útil**
   - El antiguo botón abría un modal de mapa, una capa adicional que no llevaba a contenido real del CV.
   - Corrección: `VER PERFIL COMPLETO` es ahora un enlace a `#about` y conserva el cierre automático del panel.

3. **Estado antiguo 3/4**
   - Se versionó la clave de `sessionStorage` a `ls-portfolio-discovered-v213` para que estados defectuosos de builds anteriores no sobrevivan a la actualización.

## Verificación

- Test de regresión del explorador: `tests/test_cv_explorer.py`
- Test espacial de Mi Sistema: `tests/test_system_layout.py`
- Validador V2.13: `tests/validate_v213.py`
- Viewports dinámicos revisados: 1920×1080, 1366×768, 390×844 y 320×568.
- Resultado esperado en todos: `4/4` y `0px` de overflow horizontal.
