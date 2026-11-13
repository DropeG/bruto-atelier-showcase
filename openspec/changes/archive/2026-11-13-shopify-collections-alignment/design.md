## Context

Actualmente, la sección `ShoppableGallery` del Home (`src/components/ShoppableGallery.tsx`) se alimenta de `useHomepageProducts` (`src/hooks/useHomepageProducts.ts`), que consulta `getHomepageCollectionProducts('homepage-featured', 12)` en `src/lib/shopify/client.ts` y luego filtra productos por los handles `['silla-coleccion', 'accesorios-cuero']`.
En el Shopify real (`bruto-atelier-spzrd2zq.myshopify.com`) existen únicamente las colecciones reales (`cuoro` con los 3 productos `tabaquera`, `sleeve`, `tarjetero`), y no existen `homepage-featured` ni `silla-coleccion`. Esto provoca que en producción `ShoppableGallery` reciba `products: []` y oculte la sección completa entre el Hero y los Videos.

## Goals / Non-Goals

**Goals:**
- Alinear el catálogo de Shopify para que existan exclusivamente colecciones reales (`wachi` y `cuoro`, más sus productos reales), publicadas en el canal `BRUTO Atelier`.
- Conectar `ShoppableGallery` directamente a las **Colecciones** de la Storefront API (`ShopifyCollection`) en lugar de productos ficticios dentro de `homepage-featured`.
- Eliminar `silla-coleccion`, `accesorios-cuero` y `homepage-featured` del flujo principal del Home, manteniendo un diseño extensible para futuras colecciones que el cliente cree en Shopify.

**Non-Goals:**
- No alterar el diseño visual ni los estilos CSS actuales de `ShoppableGallery` (`.catalog-piece--hero`, `.catalog-piece--reverse`).
- No modificar el flujo de checkout de CUORO ni el de Pedidos Preliminares (`wachi-draft-order`) de WACHI.

## Decisions

### 1. Población y limpieza en Shopify Admin vía Admin GraphQL API
- **Decisión:** Ejecutar un script puntual (sin guardar secretos en el repo, leyendo `SHOPIFY_ADMIN_TOKEN` desde `.env.local`) para:
  1. Subir las imágenes de portada (`wachi-hero-horizontal.png`, `accesorios-tarjetero.jpeg`) y fotos de estudio de WACHI a Shopify Files/Product Media (`stagedUploadsCreate` / `fileCreate`).
  2. Crear los 4 productos reales de WACHI (`set-wachi`, `mesa-wachi`, `silla-wachi`, `banqueta-wachi`) con sus precios reales, crear la colección `WACHI` (`handle: "wachi"`) asociándolos, y publicar todo en `BRUTO Atelier`.
  3. Actualizar la colección `CUORO` (`handle: "cuoro"`) con descripción `"Nuestra expresión en pelle."`, su imagen de portada (`accesorios-tarjetero.jpeg`) y publicarla en `BRUTO Atelier`.
  4. Verificar que no exista ningún producto `silla-coleccion` ni colección `homepage-featured` en Shopify (si existiera, eliminarlo).

### 2. Consulta directa de Colecciones en Storefront API (`src/lib/shopify/queries.ts` y `client.ts`)
- **Decisión:** Agregar `GET_COLLECTIONS_QUERY` en `src/lib/shopify/queries.ts` y `getHomepageCollections()` en `src/lib/shopify/client.ts` para consultar `collections(first: 10)` (campos `id`, `handle`, `title`, `description`, `image { url altText width height }`).
- **Mapeo de orden y rutas:** Priorizar `['wachi', 'cuoro']` (y luego cualquier otra colección publicada que no sea `frontpage`), mapeando:
  - `wachi` → `/coleccion/wachi`
  - `cuoro` → `/coleccion/accesorios`
  - Cualquier otra colección futura → `/coleccion/${handle}`
- **Fallback en desarrollo / demo:** En `mockData.ts` definir `MOCK_COLLECTIONS` con `wachi` y `cuoro` usando las imágenes locales optimizadas (`wachi-hero-horizontal.png`, `wachi-mobile-left.webp`, `accesorios-tarjetero.jpeg`), y mantener `MOCK_PRODUCTS` compatible con las vistas de detalle sin `silla-coleccion`.

### 3. Precarga especulativa y preservación de `ShoppableGallery.tsx`
- **Decisión:** Mantener intactos los hooks de precarga de imágenes (`preloadCollectionGrid('wachi' | 'cuoro')` e `IntersectionObserver`), el `ScrollContext` (`saveSectionId`), y la vista móvil de WACHI (`wachi-mobile-left.webp` en `<source media="(max-width: 600px)">`). Si Shopify devuelve una imagen remota (`cdn.shopify.com`), `catalogImageProps` la devuelve intacta sin romper `srcSet`.

## Risks / Trade-offs

- **[Riesgo] Imágenes de portada alojadas en `cdn.shopify.com` vs variantes locales optimizadas** → **Mitigación:** Para `wachi` y `cuoro`, `catalogImageProps` ya soporta URLs remotas y se puede aprovechar parámetros de redimensionamiento de Shopify CDN o mantener la imagen optimizada cuando coincida con el manifiesto.
- **[Riesgo] Caché de navegador o Storefront API tras publicar en Shopify** → **Mitigación:** Verificar con una consulta directa a la Storefront API (`VITE_SHOPIFY_STOREFRONT_TOKEN`) que `collections` devuelve `wachi` y `cuoro` inmediatamente después de publicar en el canal `BRUTO Atelier`.
