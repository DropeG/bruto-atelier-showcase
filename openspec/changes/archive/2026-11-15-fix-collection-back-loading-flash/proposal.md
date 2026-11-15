## Why

Al navegar hacia atrás desde las páginas de colección (**WACHI**, **CUORO** o **COSMOS**) hacia el Home (`/`), el usuario ve momentáneamente una pantalla vacía dividida en beige (`#d9d2cb`) y café (`#81644f`) antes de que aparezca la galería real. Esto ocurre porque `useHomepageCollections` inicia sin datos en memoria tras una recarga o entrada directa a una colección —activando el skeleton `.shoppable-gallery--loading`— y porque al remontar `ShoppableGallery` las imágenes de portada se decodifican sobre un fondo sólido sin placeholder previo.

## What Changes

- **Persistencia en `sessionStorage` y dato inicial inmediato en `useHomepageCollections`**: Guardar el resultado de colecciones seleccionadas en `sessionStorage` e inicializar el estado con la caché de sesión o con `selectHomepageCollections(MOCK_COLLECTIONS)` como respaldo inmediato mientras Shopify revalida en segundo plano, evitando que `ShoppableGallery` entre en estado vacío `--loading`.
- **Placeholders y precarga de portadas de `ShoppableGallery`**: Mostrar miniaturas `blurPlaceholders` (o fondo de transición suave) en `.catalog-piece__media` y precargar las imágenes de portada de la galería (`wachi`, `cuoro`, `cosmos`) cuando el usuario visita una página de colección, eliminando el flash de decodificación al pulsar la flecha de retorno.
- **Limpieza/unificación de salida en `CollectionShowcase`**: Asegurar que el botón de retorno a `/` en `CUORO` y `COSMOS` mantenga el mismo comportamiento limpio de salida que `WACHI`.

## Capabilities

### New Capabilities
- `collection-back-navigation-continuity`: Continuidad visual instantánea al volver desde cualquier colección (`WACHI`, `CUORO`, `COSMOS`) hacia la galería del Home (`ShoppableGallery`), sin skeleton vacío ni parpadeo de imágenes.

### Modified Capabilities
<!-- Ninguna capacidad existente cambia sus requisitos de contrato; la estructura y fuentes de datos de `shopify-collections-alignment` se mantienen intactas. -->

## Impact

- [src/hooks/useHomepageProducts.ts](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/hooks/useHomepageProducts.ts): Caché en `sessionStorage` + hidratación inicial inmediata para `useHomepageCollections`.
- [src/components/ShoppableGallery.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/components/ShoppableGallery.tsx) y [src/styles/shoppable-gallery.css](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/styles/shoppable-gallery.css): Soporte de placeholder visual inmediato en `.catalog-piece__media` mientras se decodifica la imagen.
- [src/lib/blur-placeholders.ts](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/lib/blur-placeholders.ts) / [src/lib/collection-images.ts](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/lib/collection-images.ts): Precarga de portadas de galería al estar en vistas de colección.
- [src/components/CollectionShowcase.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/components/CollectionShowcase.tsx): Alineación del retorno a `/` con `WachiCollection`.
