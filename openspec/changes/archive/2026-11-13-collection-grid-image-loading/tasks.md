## 1. Pipeline de Imágenes Optimizadas

- [x] 1.1 Actualizar `scripts/generate-catalog-images.mjs` para incluir las 9 imágenes de `public/images/shopify-demo/accesorios/` (CUORO) y todas las perspectivas de `public/images/shopify-demo/coleccion/` (WACHI), y ejecutar el script para generar las variantes WebP en `public/images/catalog-optimized/` y actualizar `src/data/catalog-images.json`.

## 2. Módulo Reutilizable de Carga de Colecciones

- [x] 2.1 Crear `src/lib/collection-images.ts` con el registro declarativo de colecciones (`COLLECTION_REGISTRY`), la caché de decodificación responsiva (`preloadResponsiveImage`, `preloadCollectionGrid`), la precarga de perspectivas y el hook `useCollectionGridReady` (con gate de decodificación de hasta `160 ms` y precarga diferida en `requestIdleCallback` de perspectivas secundarias).

## 3. Precarga Especulativa en Home y Sincronización en CUORO y WACHI

- [x] 3.1 Actualizar `src/components/ShoppableGallery.tsx` para disparar `preloadCollectionGrid` cuando las tarjetas de colección (WACHI, CUORO o futuras colecciones) entren cerca del viewport (`IntersectionObserver`) o reciban `onMouseEnter`, `onFocus` o `onTouchStart`.
- [x] 3.2 Actualizar `src/pages/AccessoriesCollection.tsx` para renderizar las imágenes de grilla y perspectivas con `catalogImageProps`, aplicar `loading="eager"` y `fetchPriority="high"` en las 3 piezas de la grilla, y sincronizar el pintado inicial y la precarga diferida de perspectivas mediante `useCollectionGridReady`.
- [x] 3.3 Actualizar `src/pages/WachiCollection.tsx` y `src/styles/wachi-collection.css` para usar `useCollectionGridReady` con el mismo flujo sincronizado de grilla, carga `eager` + `fetchPriority="high"` en las 4 piezas y precarga diferida de perspectivas.

## 4. Verificación y Pruebas

- [x] 4.1 Ejecutar `npx tsc --noEmit`, `npm run test` y `npm run build` para confirmar que no existan errores de compilación, tipos ni regresiones.
