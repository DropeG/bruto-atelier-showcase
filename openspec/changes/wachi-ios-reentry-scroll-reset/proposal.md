## Why

En iOS Safari (iPhone), cuando el usuario entra a **Mobiliario → Colección WACHI** (`/showcase/mobiliario/coleccion`), baja hasta la grilla blanca de productos, toca la flecha de retorno (`←`) para volver al inicio y luego vuelve a abrir **Mobiliario → Colección WACHI** desde el menú, la página aterriza directamente en la grilla inferior en lugar de comenzar arriba en la foto editorial superior. Aunque en escritorio WebKit el `scrollY` ya se reinicia a `0`, en iOS Safari el `scroll-snap-type: y mandatory` y el estado del scroll al cerrar el menú provocan que la vista vuelva a engancharse en la grilla.

## What Changes

- Diferir la activación de `scroll-snap-type: y mandatory` en `.wachi-collection-flow` hasta que la entrada haya terminado de estabilizarse (cierre del menú y primera interacción/desplazamiento del usuario), evitando que iOS Safari auto-ancle a la grilla durante el montaje.
- Desactivar temporalmente `history.scrollRestoration` (`'manual'`) durante el flujo de `.wachi-collection-flow` y reforzar el reinicio síncrono y diferido del scroll a `0` al salir con la flecha `←` de `WachiCollection` y al montar `Category.tsx`.
- Mantener intacto el acceso directo `"Ver"` del Home (`/coleccion/wachi`).

## Capabilities

### New Capabilities
- `wachi-ios-reentry-snap`: Control determinista del `scroll-snap` y reinicio de scroll en iOS Safari para garantizar que todo reingreso a **Mobiliario → Colección WACHI** desde el menú comience arriba en la foto editorial superior tras salir con la flecha `←`.

### Modified Capabilities
- *(Ninguna — capacidad nueva enfocada en el reingreso en iOS Safari).*

## Impact

- `src/pages/Category.tsx`: Gestión de estado `data-entering` / `data-snap-ready` e interacción inicial antes de activar `scroll-snap-type`, más `history.scrollRestoration = 'manual'`.
- `src/styles/wachi-collection.css`: Activación condicional de `scroll-snap-type: y mandatory` solo cuando `.wachi-collection-flow[data-snap-ready="true"]` está presente (en lugar de activarlo inmediatamente al montar).
- `src/pages/WachiCollection.tsx` y `src/components/Navigation.tsx`: Refuerzo de limpieza de `menu-open` y reset de scroll antes y después de navegar.
