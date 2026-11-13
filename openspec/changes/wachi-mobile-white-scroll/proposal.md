## Why

En Mobile (especialmente Safari iOS con barra de navegación visible), al entrar desde el submenú a **Mobiliario → Colección WACHI** y hacer scroll hacia abajo desde la foto inicial (`.wachi-collection-flow__story`) hacia la grilla de productos (`.wachi-collection-flow__grid`), queda visible una franja de la foto superior detrás del encabezado blanco (`←`, `BRUTO Atelier`, bolsa). Esto ocurre porque `<ShowcaseViewer />` define `min-h-screen h-screen` (`100vh` / `100lvh`), que supera los `100dvh` de `.wachi-collection-flow__story` y desborda sobre la siguiente sección; además, al tener `<ShowcaseViewer />` `position: relative` y `.wachi-collection` `position: static`, CSS pinta la foto desbordada por encima del fondo blanco de la grilla.

## What Changes

- **Contención estricta de la portada en `.wachi-collection-flow__story` (`src/styles/wachi-collection.css`)**:
  - Definir `position: relative; z-index: 0; height: 100dvh; overflow: hidden;` en `.wachi-collection-flow__story` para recortar cualquier desborde del visor editorial.
  - Ajustar el hijo directo `.wachi-collection-flow__story > div` a `height: 100%; min-height: 100%; max-height: 100%;` para que `<ShowcaseViewer />` se adapte exactamente a los `100dvh` de su contenedor en lugar de excederlos con `100vh`.
- **Contexto de apilamiento y fondo blanco garantizado en la grilla WACHI (`src/styles/wachi-collection.css`)**:
  - Asignar `position: relative; z-index: 1; background: #fff;` a `.wachi-collection-flow__grid` y `.wachi-collection` para asegurar que, al bajar hacia la Colección WACHI en Mobile, el lienzo blanco cubra el 100% del viewport de borde a borde, igual que en Desktop.

## Capabilities

### New Capabilities
- `wachi-mobile-scroll-containment`: Contención de altura, recorte de desborde y orden de apilamiento entre la historia editorial y la grilla blanca de la Colección WACHI en Mobile.

### Modified Capabilities
<!-- Ninguna capacidad existente en openspec/specs/ cambia sus requisitos -->

## Impact

- `src/styles/wachi-collection.css`: Reglas CSS acotadas al flujo `.wachi-collection-flow`, `.wachi-collection-flow__story`, `.wachi-collection-flow__grid` y `.wachi-collection`, sin modificar `ShowcaseViewer` ni otras vistas o disciplinas.
