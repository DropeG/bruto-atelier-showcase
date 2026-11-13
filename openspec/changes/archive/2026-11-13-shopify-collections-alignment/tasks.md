## 1. Ordenamiento del Catálogo en Shopify Admin

- [x] 1.1 Crear la colección `WACHI` (`handle: "wachi"`, descripción `"En Lenga, a medida."`) con sus 4 productos reales (`Set`, `Mesa`, `Silla`, `Banqueta`) e imagen de portada (`wachi-hero-horizontal.png`) y publicarla en el canal `BRUTO Atelier`.
- [x] 1.2 Actualizar la colección `CUORO` (`handle: "cuoro"`) con descripción `"Nuestra expresión en pelle."`, imagen de portada (`accesorios-tarjetero.jpeg`) y publicación confirmada en el canal `BRUTO Atelier`, asegurando que no exista ningún `silla-coleccion` ni `homepage-featured` en Shopify.

## 2. Conexión del Home a Colecciones Reales de Shopify

- [x] 2.1 Agregar `GET_COLLECTIONS_QUERY` en `src/lib/shopify/queries.ts` y `getHomepageCollections` en `src/lib/shopify/client.ts` para leer colecciones reales publicadas en Shopify Storefront API.
- [x] 2.2 Definir `MOCK_COLLECTIONS` (`wachi` y `cuoro`) en `src/lib/shopify/mockData.ts` y actualizar `src/hooks/useHomepageProducts.ts` para obtener colecciones reales en lugar de `homepage-featured` / `silla-coleccion` / `accesorios-cuero`.
- [x] 2.3 Actualizar `src/components/ShoppableGallery.tsx` para renderizar `ShopifyCollection` (`wachi` → `/coleccion/wachi`, `cuoro` → `/coleccion/accesorios`, extensible a futuras colecciones), manteniendo la precarga de grilla (`preloadCollectionGrid`), el recorte móvil de WACHI y la restauración de scroll.

## 3. Verificación y Pruebas

- [x] 3.1 Verificar contra la Storefront API en vivo que `collections` devuelve `wachi` y `cuoro` publicados, y ejecutar `npx tsc --noEmit`, `npm run test` y `npm run build` sin errores.
