## Why

Al navegar desde el Home hacia **Colección CUORO** (`/coleccion/accesorios`) —y en menor medida hacia **Colección WACHI** (`/coleccion/wachi`)—, las imágenes de la grilla de productos presentan un "tintineo" o aparición a destiempo (*image pop-in / decode jitter*). Esto ocurre por tres causas combinadas:
1. Las 9 imágenes de CUORO (`shopify-demo/accesorios/*.webp`) no están incluidas en `scripts/generate-catalog-images.mjs` ni en `src/data/catalog-images.json`, por lo que se sirven en resolución completa (`1290×1219` a `1668×943`, 58–137 KB por archivo) en lugar de variantes responsivas livianas (`480w`/`800w` de ~8–15 KB).
2. `src/components/ShoppableGallery.tsx` no precarga ni decodifica en memoria (`img.decode()`) las imágenes de la grilla antes de que el usuario haga clic en "Ver".
3. El contenedor de la grilla inicia su fade-in de `220 ms` sin esperar a que las imágenes principales estén decodificadas, mientras un temporizador de `120 ms` lanza en paralelo la descarga y decodificación de todas las perspectivas secundarias (9 imágenes en CUORO, 12 en WACHI), compitiendo por ancho de banda y decodificador de imágenes.

## What Changes

- **Pipeline de variantes responsivas (`scripts/generate-catalog-images.mjs`, `src/data/catalog-images.json`, `public/images/catalog-optimized/`)**:
  - Incluir las 9 imágenes de `public/images/shopify-demo/accesorios/` (CUORO) y todas las perspectivas de `public/images/shopify-demo/coleccion/` (WACHI) en el generador y el manifiesto `catalog-images.json` (`480w`, `800w`, `1200w`, `1600w`).
- **Módulo compartido y extensible para colecciones (`src/lib/collection-images.ts`)**:
  - Registro declarativo de colecciones (`COLLECTION_REGISTRY`: `wachi`, `cuoro`, extensible a futuras categorías) con sus imágenes de grilla y atributo `sizes` correspondiente.
  - Precarga especulativa y decodificación en RAM (`preloadCollectionGrid(collectionId)`) usando caché en memoria compartida con las mismas variantes `srcSet` y `sizes` que renderizará la grilla.
  - Hook reutilizable `useCollectionGridReady` que coordina un gate de decodificación de hasta `160 ms` (resolviendo en `0 ms` cuando ya está en caché desde el Home) para revelar todas las piezas juntas en el mismo frame, y difiere la precarga de las perspectivas secundarias (`requestIdleCallback`) hasta después de que la grilla principal esté decodificada.
- **Precarga especulativa por visibilidad e intención en el Home (`src/components/ShoppableGallery.tsx`)**:
  - Disparar `preloadCollectionGrid` cuando la tarjeta de una colección (`WACHI`, `CUORO` o futuras colecciones) se acerque al viewport (`IntersectionObserver`) o reciba `onMouseEnter` / `onFocus` / `onTouchStart`.
- **Adopción unificada en CUORO y WACHI (`src/pages/AccessoriesCollection.tsx`, `src/pages/WachiCollection.tsx`, `src/styles/wachi-collection.css`)**:
  - Servir todas las imágenes de CUORO mediante `catalogImageProps`, marcar todas las imágenes de grilla en ambas colecciones con `loading="eager"` y `fetchPriority="high"`, sincronizar el pintado inicial con `useCollectionGridReady`, estabilizar títulos en CUORO durante la entrada inicial y posponer la precarga de perspectivas secundarias hasta completar la grilla.

## Capabilities

### New Capabilities
- `collection-grid-image-loading`: Carga optimizada con `srcSet`, precarga especulativa con decodificación en RAM, gate de pintado sincronizado para grillas de colección y cola diferida de perspectivas secundarias para WACHI, CUORO y futuras colecciones.

### Modified Capabilities
<!-- Ninguna capacidad existente en openspec/specs/ cambia sus requisitos -->

## Impact

- `scripts/generate-catalog-images.mjs`, `src/data/catalog-images.json`, `public/images/catalog-optimized/*`
- `src/lib/collection-images.ts` (nuevo módulo reutilizable)
- `src/components/ShoppableGallery.tsx`
- `src/pages/AccessoriesCollection.tsx`
- `src/pages/WachiCollection.tsx`
- `src/styles/wachi-collection.css`
