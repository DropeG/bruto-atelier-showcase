## 1. Activación Diferida del Scroll-Snap en Estilos

- [x] 1.1 Actualizar `src/styles/wachi-collection.css` para que `scroll-snap-type: y mandatory` solo se aplique cuando `.wachi-collection-flow[data-snap-ready="true"]` esté presente, manteniendo `scroll-snap-type: none !important; scroll-behavior: auto !important;` mientras no esté listo.

## 2. Control de Montaje, ScrollRestoration e Interacción en `Category.tsx`

- [x] 2.1 Actualizar `src/pages/Category.tsx` para asignar `key={location.key}` a `.wachi-collection-flow`, establecer `window.history.scrollRestoration = 'manual'` durante el flujo (restaurándolo al desmontar), limpiar `menu-open` y forzar `scrollTo(0, 0)` al montar.
- [x] 2.2 Activar `data-snap-ready="true"` en `.wachi-collection-flow` recién cuando transcurra el margen de cierre del menú/estabilización (~350 ms) con `scrollY === 0` o al detectar el primer evento `touchstart` / `wheel` / `keydown` del usuario.

## 3. Verificación

- [x] 3.1 Ejecutar `npx tsc --noEmit`, `npm run build` y `npx vitest run src/components/WachiRequestDrawer.test.tsx`.
- [x] 3.2 Verificar el flujo completo en WebKit móvil (entrar a Colección WACHI, bajar a la grilla, pulsar `←`, volver a abrir el menú y reingresar a Colección WACHI comprobando que inicia en `scrollY = 0` y permite bajar con snap al deslizar).
