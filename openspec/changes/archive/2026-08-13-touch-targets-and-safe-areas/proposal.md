## Why

En dispositivos táctiles (smartphones y especialmente iPadOS/iPad Pro), las áreas de pulsación en el menú lateral (`Navigation.tsx`) resultan estrechas (~28px de alto), dificultando la navegación rápida. Asimismo, los controles superiores del visor de galería (`ShowcaseViewer.tsx`) carecen de insets de zona segura (`env(safe-area-inset-top)`), lo que provoca superposiciones con la barra de estado de iPadOS o el notch en dispositivos táctiles.

## What Changes

- **Menú Lateral (`Navigation.tsx`)**: Elevar el padding vertical de los enlaces del menú desplegable de `py-1`/`py-1.5` a `py-3 px-4`, garantizando una altura táctil mínima de 44px (estándar Apple HIG / WCAG 2.2 AA).
- **Subpaneles del Menú**: Ajustar los ítems de subcategorías (Mobiliario: *Colección*, *Serie*, *Piezas*) para cumplir con el estándar de 44px de altura táctil.
- **Controles de Galería (`ShowcaseViewer.tsx`)**: Integrar insets dinámicos de Safe Area (`env(safe-area-inset-top)`) en la posición absoluta de la flecha de volver y los indicadores (dots) del carrusel.
- **Área Táctil de Indicadores**: Ampliar el target táctil transparente de los dots del carrusel en `ShowcaseViewer.tsx` a un mínimo de 32px × 44px por dot para facilitar el salto directo de imágenes en tablets.

## Capabilities

### New Capabilities
- `navigation-touch-targets`: Especificaciones de área táctil mínima (44px × 44px) y padding holgado para ítems de navegación lateral en desktop y mobile.
- `viewer-safe-areas`: Especificaciones para posicionamiento adaptativo de controles con Safe Area Insets (`env(safe-area-inset-top)`) y hit targets mínimos en visores de pantalla completa.

### Modified Capabilities
<!-- N/A -->

## Impact

- `src/components/Navigation.tsx`: Modificación de clases de Tailwind en enlaces del menú lateral y sub-menús.
- `src/components/ShowcaseViewer.tsx`: Modificación del posicionamiento de botón de volver y dots de carrusel con safe area calculation inline/Tailwind.
- Ninguna API ni dependencia externa afectada. Preserva la estética visual ultra-premium y la fluidez de interacción.
