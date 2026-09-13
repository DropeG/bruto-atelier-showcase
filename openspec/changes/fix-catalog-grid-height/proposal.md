## Why

El componente `DesktopCatalogGrid` actual interfiere con el sistema de `scroll-snapping` de la vista principal porque posee alturas mínimas absolutas (ej. `min-h-[500px]`, `min-h-[350px]`). Esto provoca que en pantallas con resolución menor a 850px de altura, el componente se desborde (`overflow`) y el snapping corte la parte inferior de la grilla. Es fundamental corregir esto para mantener la ilusión de un carrusel vertical de 100vh.

## What Changes

- Se eliminarán las clases `min-h-screen`, `min-h-[500px]` y `min-h-[350px]` del componente `DesktopCatalogGrid`.
- Se asegurará que la grilla utilice de forma estricta el 100% de la altura de la vista (`h-full` heredado o adaptado a `100vh` del contenedor padre) respetando las proporciones 60/40 en sus dos filas usando flex o grid proporcional (`h-[60%]`, `h-[40%]`).

## Capabilities

### New Capabilities

### Modified Capabilities
- `desktop-catalog-grid`: Corrección de requerimientos de layout para hacer la vista estrictamente dependiente de las proporciones relativas al viewport.

## Impact

- **Frontend/UI**: Modificación exclusiva de las clases CSS en `DesktopCatalogGrid.tsx`. No hay impacto funcional ni de integraciones.
