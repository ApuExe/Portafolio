# V2.13 Lite RC5 — Layout QA

## Correcciones
- Mi Sistema: los cuatro nodos quedan dentro del escenario con gutter lateral y marco intencional; el estado activo ya no se corta por el `overflow` del stage.
- Los botones de Mi Sistema ya no heredan bordes del navegador; desktop usa marco completo y mobile conserva separadores editoriales.
- Contacto: `L/S` vuelve a ser decorativo y absoluto; ya no empuja el contenido cientos de píxeles hacia abajo.
- Contacto: se elimina el doble offset de anchor y se compacta la transición Perfil → Contacto.

## Pruebas de regresión
- `tests/test_system_cards_and_contact_anchor.py`
- `tests/test_system_layout.py`
- `tests/test_cv_explorer.py`
- `tests/test_case_anchor_framing.py`
- `tests/validate_v213.py`
