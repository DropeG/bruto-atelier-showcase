## Context

Actualmente, las páginas de colección de productos (`src/pages/WachiCollection.tsx` y `src/pages/AccessoriesCollection.tsx`) presentan una asimetría en cómo cargan y pintan sus grillas:
- **WACHI** usa `catalogImageProps` (`src/lib/catalog-images.ts`), cuyas miniaturas principales ya existen en `src/data/catalog-images.json` (3.6–16 KB), pero solo la primera pieza (`ensemble`) tiene `fetchPriority="high"` mientras las otras 3 tienen `loading="lazy"`, no se precargan desde el Home (`ShoppableGallery.tsx`), y a los `120 ms` de montar se lanza la decodificación de 12 perspectivas en paralelo.
- **CUORO** (`AccessoriesCollection.tsx`) no tiene sus 9 imágenes en `catalog-images.json`, por lo que sirve los archivos `.webp` originales de `58–137 KB` (`1290–1668 px`) con `decoding="async"`. El contenedor `<motion.section key="cuoro-grid">` pasa de `opacity: 0` a `opacity: 1` en `220 ms` sin esperar a `img.decode()`, mientras a los `120 ms` compiten las 9 perspectivas en segundo plano y `useShopify().products` puede actualizar títulos durante el montaje sobre elementos con `layoutId`.

El resultado visible para el usuario al entrar desde el Home a **Colección CUORO** es que la página y los títulos aparecen primero y las 3 fotos "tintinean" al pintarse en frames distintos.

## Goals / Non-Goals

**Goals:**
- Servir todas las imágenes de CUORO y WACHI (grilla y perspectivas) con variantes responsivas optimizadas desde `catalog-images.json`.
- Precargar y decodificar en RAM las imágenes principales de la grilla desde `ShoppableGallery` antes del clic (al entrar cerca del viewport o en hover/focus/touch).
- Sincronizar el pintado inicial de la grilla mediante un gate de `img.decode()` (con timeout máximo de `160 ms`) para que todas las piezas entren juntas en el mismo frame.
- Encapsular esta estrategia en un módulo único (`src/lib/collection-images.ts`) extensible a cualquier colección futura mediante registro declarativo.

**Non-Goals:**
- No alterar el diseño visual, las proporciones de la grilla, los estilos tipográficos ni la física `yeezySpring` del escenario de producto individual.
- No intervenir las páginas *Coming Soon* ni el visor editorial `ShowcaseViewer`.

## Decisions

### 1. Unificación del pipeline de imágenes en `scripts/generate-catalog-images.mjs` y `src/data/catalog-images.json`
- **Decisión:** Agregar al arreglo `sources` de `scripts/generate-catalog-images.mjs` las 9 imágenes de `public/images/shopify-demo/accesorios/` (CUORO) y todas las perspectivas (`-perspectiva-2`, `-perspectiva-3`) de `public/images/shopify-demo/coleccion/` (WACHI), generando sus variantes `480w`, `800w`, `1200w`, `1600w` en `public/images/catalog-optimized/` y actualizando `src/data/catalog-images.json`.
- **Alternativa descartada:** Comprimir manualmente los `.webp` de `accesorios/` in-place. No escala a futuras categorías ni adapta el ancho al dispositivo móvil/escritorio mediante `srcSet`.

### 2. Módulo centralizado y extensible `src/lib/collection-images.ts`
- **Decisión:** Crear `src/lib/collection-images.ts` con:
  - **Caché de decodificación responsiva (`preloadResponsiveImage`)**: Crea un `HTMLImageElement`, asigna `sizes`, `srcSet` y `src` desde `catalogImageProps`, ejecuta `img.decode()` y almacena la promesa en un `Map` en memoria para evitar descargas o decodificaciones duplicadas y garantizar que el navegador use exactamente la misma variante de `srcSet` que renderizará el DOM.
  - **Registro declarativo (`COLLECTION_REGISTRY`)**: Mapa indexado por identificador de colección (`'wachi'`, `'cuoro'`, extensible a futuras categorías) con `{ gridSizes, gridSources }` para que `ShoppableGallery` (o un futuro menú) pueda precargar cualquier colección sin acoplarse al código de cada página.
  - **Hook `useCollectionGridReady`**: Recibe `{ gridSources, gridSizes, perspectiveSources, perspectiveSizes, maxWaitMs = 160 }`. Retorna `isGridReady` (`true` inmediato si todas las imágenes ya están decodificadas en caché, o al resolver `Promise.all` / cumplirse el timeout de `160 ms`) y agenda la precarga de `perspectiveSources` en `requestIdleCallback` (con fallback a `setTimeout(..., 0)`) únicamente después de que `isGridReady` pasa a `true`.
- **Alternativa descartada:** Duplicar `useEffect` y cachés en `WachiCollection.tsx` y `AccessoriesCollection.tsx`. Replicaría bugs y obligaría a reimplementar el patrón en cada nueva colección.

### 3. Integración en `ShoppableGallery.tsx`, `AccessoriesCollection.tsx` y `WachiCollection.tsx`
- **Decisión:**
  - En `ShoppableGallery.tsx`: Observar la entrada de cada tarjeta de colección con `IntersectionObserver` (`rootMargin: '200px'`) y agregar handlers `onMouseEnter`, `onFocus`, `onTouchStart` que invoquen `preloadCollectionGrid(collectionId)` cuando corresponda (`wachi` o `cuoro`).
  - En `AccessoriesCollection.tsx` y `WachiCollection.tsx`: Usar `catalogImageProps` en grilla y escenario; fijar `loading="eager"` y `fetchPriority="high"` en todas las imágenes de la grilla (son solo 3 o 4 miniaturas livianas); controlar el estado `animate` del `<motion.section>` de la grilla con `isGridReady` (sin bloqueo si ya está en RAM); y mantener estabilizado el render de títulos durante la entrada inicial en CUORO para evitar recálculos de `layoutId`.

## Risks / Trade-offs

- **[Riesgo] En entrada directa por URL con red lenta (>160 ms), las imágenes aún no terminan de bajar al expirar el gate** → **Mitigación:** El tope de `160 ms` evita dejar la pantalla en blanco indefinidamente, y como las variantes `480w`/`800w` pesan ~8–15 KB (y tienen `fetchPriority="high"`), en la gran mayoría de conexiones terminan dentro de la ventana; además, se aplica una transición suave de opacidad por `<img>` en caso de carga tardía para evitar saltos bruscos.
- **[Riesgo] Precargar colecciones desde el Home consume ancho de banda innecesario si el usuario no hace clic** → **Mitigación:** Solo se precargan las 3–4 miniaturas de la grilla (~30–50 KB totales en `480w`/`800w`), nunca las perspectivas secundarias, y se dispara solo cuando la tarjeta se aproxima al viewport o recibe intención de interacción.
