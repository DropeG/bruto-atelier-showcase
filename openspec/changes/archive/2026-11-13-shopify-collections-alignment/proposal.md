## Why

Actualmente el Home (`ShoppableGallery.tsx` + `useHomepageProducts.ts`) busca en Shopify una colección llamada `homepage-featured` con dos productos ficticios heredados del prototipo inicial (`silla-coleccion` y `accesorios-cuero`). En el Shopify real del cliente solo existen productos reales de **CUORO** (`tabaquera`, `sleeve`, `tarjetero`) dentro de la colección `cuoro`, por lo que en producción (`bruto-atelier.com` sin `?demoMode=true`) la sección del Home desaparece al devolver `0` resultados. Además, mantener handles falsos como `silla-coleccion` dificulta que el cliente administre y cree colecciones reales en el futuro desde su Shopify Admin.

## What Changes

- **Catálogo real de colecciones en Shopify Admin (vía Admin API)**:
  - Crear la colección **`WACHI`** (`handle: "wachi"`, título `"WACHI"`, descripción `"En Lenga, a medida."`, imagen de portada `wachi-hero-horizontal.png`) publicada en el canal **`BRUTO Atelier`**, junto con las 4 piezas reales de WACHI (`Set`, `Mesa`, `Silla`, `Banqueta`).
  - Actualizar la colección **`CUORO`** (`handle: "cuoro"`) con descripción `"Nuestra expresión en pelle."`, imagen de portada `accesorios-tarjetero.jpeg`, publicada en el canal **`BRUTO Atelier`**, asociando sus 3 productos existentes (`Tabaquera`, `Sleeve`, `Tarjetero`).
  - Eliminar cualquier referencia o necesidad de `silla-coleccion`, `accesorios-cuero` y `homepage-featured` en Shopify.
- **Conexión directa del Home a Colecciones reales de Shopify (`src/lib/shopify/queries.ts`, `src/lib/shopify/client.ts`, `src/hooks/useHomepageProducts.ts`, `src/components/ShoppableGallery.tsx`, `src/lib/shopify/mockData.ts`)**:
  - Consultar las colecciones publicadas (`collections`) desde la Storefront API (`wachi`, `cuoro`, y extensible a futuras colecciones).
  - Renderizar en `ShoppableGallery` tarjetas basadas en `ShopifyCollection` (título, descripción e imagen de portada de la colección) enlazando por `handle` (`wachi` → `/coleccion/wachi`, `cuoro` → `/coleccion/accesorios`, y futuras colecciones → `/coleccion/${handle}`), eliminando el uso de `silla-coleccion`, `accesorios-cuero` y `homepage-featured`.
  - Mantener respaldo editorial local (`MOCK_COLLECTIONS`) únicamente en modo demo (`?demoMode=true`) o si Shopify no está configurado/disponible, garantizando que en producción se muestren las colecciones reales publicadas en `BRUTO Atelier`.

## Capabilities

### New Capabilities
- `shopify-collections-alignment`: Sincronización limpia entre las colecciones reales de Shopify (`WACHI`, `CUORO` y futuras colecciones publicadas en el canal `BRUTO Atelier`) y la galería editorial del Home (`ShoppableGallery`), eliminando productos ficticios (`silla-coleccion`, `accesorios-cuero`) y colecciones puente (`homepage-featured`).

### Modified Capabilities
<!-- Ninguna capacidad existente en openspec/specs/ cambia sus requisitos -->

## Impact

- Shopify Admin (`bruto-atelier-spzrd2zq.myshopify.com`): colección `wachi` + 4 piezas WACHI, actualización de colección `cuoro`, publicación en canal `BRUTO Atelier`.
- `src/lib/shopify/queries.ts`, `src/lib/shopify/client.ts`
- `src/lib/shopify/mockData.ts`
- `src/hooks/useHomepageProducts.ts` (o su evolución a colecciones del Home)
- `src/components/ShoppableGallery.tsx`
