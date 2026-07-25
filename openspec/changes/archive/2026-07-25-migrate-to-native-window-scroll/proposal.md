## Why

Actualmente `Index.tsx` encapsula todas las secciones de la página dentro de un contenedor `<div className="h-[100svh] md:h-screen overflow-y-scroll md:snap-y md:snap-mandatory">`. Este "scroll atrapado" dentro de un div interno genera rigidez en la inercia del scroll, evita la aceleración directa por GPU nativa en el hilo del navegador y bloquea el colapso de las barras de navegación en dispositivos móviles (Safari/Chrome).

## What Changes

- Remover `h-[100svh] md:h-screen overflow-y-scroll` de `Index.tsx` para migrar al scroll nativo del `window`.
- Configurar el Scroll Snapping en el nivel raíz del documento (`html` / `body` en `index.css`) con `md:snap-y md:snap-mandatory` para que el comportamiento de salto por sección en Desktop se mantenga 100% idéntico.
- Actualizar la lógica de `handleScroll` en `Index.tsx` para escuchar eventos sobre `window.addEventListener("scroll")` y evaluar `window.scrollY < 50` para la visibilidad del `DiscountButton`.
- Actualizar `ScrollContext.tsx` y la función `scrollToSection` para scroll directo en el viewport del documento.

## Capabilities

### New Capabilities
- `native-window-scroll-fluidity`: Scroll ultra-fluido a nivel de ventana nativa con aceleración GPU, inercia orgánicamente integrada con el SO y colapso nativo de la UI en navegador móvil.

### Modified Capabilities
- `scroll-snapping-desktop`: Scroll snapping sección por sección mantenido idénticamente en Desktop, pero ejecutado sobre la ventana raíz nativa.

## Impact

- `src/pages/Index.tsx`: Eliminación de clases de overflow/height en el contenedor principal y cambio a `window.scrollY`.
- `src/index.css`: Declaración de `scroll-snap-type` en `html`/`body` para Desktop.
- `src/contexts/ScrollContext.tsx`: Ajustes a `scrollToSection` para operar sobre `window` / `document`.
