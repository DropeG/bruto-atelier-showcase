## Why

Bruto Atelier está activando la categoría **Joyería** con el lanzamiento de su nueva colección **COSMOS**, comenzando con una primera pieza (el anillo) lista para exhibirse y venderse desde la tienda. Actualmente Joyería figura como "Próximamente" y la portada (`ShoppableGallery`) solo muestra 2 colecciones (`WACHI` y `CUORO`), por lo que se necesita habilitar `/coleccion/cosmos` e integrar su acceso directo en la página principal.

## What Changes

- Se activa la ruta `/coleccion/cosmos` reutilizando el patrón compartido de grilla, visor *stage* interactivo con 3 perspectivas y conexión al carrito Shopify ya implementado en **WACHI** y **CUORO**, iniciando con el anillo Cosmos y preparada para sumar más piezas a futuro.
- Se redirige `/joyeria` (y `/showcase/joyeria`) a `/coleccion/cosmos`, y se retira Joyería de los listados de "Próximamente" (`ComingSoon` y `NextSeasonDepthCarousel`).
- Se actualiza `ShoppableGallery` y `useHomepageProducts` para mostrar 3 colecciones en el Home:
  - **Desktop:** `WACHI` en la mitad superior horizontal (60% alto, foto izquierda + panel café derecha); `CUORO` abajo a la izquierda y `COSMOS` abajo a la derecha (40% alto en 2 columnas), con texto superpuesto sobre las fotos en zonas que no obstruyan el producto.
  - **Celular:** `COSMOS` debajo de `CUORO` con el mismo formato vertical `100svh` de `WACHI` y `CUORO` (foto arriba + sección café inferior).
- Se registra `cosmos` en `collection-images.ts` para precarga especulativa y en `mockData.ts` como fallback/demo con la foto ambiental del anillo en portada y las 3 vistas de estudio en fondo blanco dentro de la colección.

## Capabilities

### New Capabilities
- `cosmos-jewelry-collection`: Página de colección `/coleccion/cosmos` con grilla y visor *stage* interactivo reutilizando la arquitectura compartida de colecciones, iniciando con el anillo Cosmos y lista para futuras piezas.

### Modified Capabilities
- `shopify-collections-alignment`: Ampliación de `ShoppableGallery` y `useHomepageCollections` de 2 a 3 colecciones (`wachi`, `cuoro`, `cosmos`) con layout Desktop 60/40 (2 columnas abajo con texto sobre foto) y apilado vertical en móvil.
- `collection-grid-image-loading`: Registro de la colección `cosmos` en `COLLECTION_REGISTRY` para precarga de grilla desde portada y transición sincronizada.

## Impact

- **Páginas y rutas:** `src/App.tsx`, nueva vista/componente reutilizable de colección y `src/pages/CosmosCollection.tsx` (o componente compartido entre `AccessoriesCollection` y `CosmosCollection`).
- **Home / Galería comprable:** `src/components/ShoppableGallery.tsx`, `src/styles/shoppable-gallery.css`, `src/hooks/useHomepageProducts.ts`.
- **Datos, precarga y Next Season:** `src/lib/collection-images.ts`, `src/lib/shopify/mockData.ts`, `src/data/ComingSoon.ts`, `src/components/NextSeasonDepthCarousel.tsx`.
- **Assets:** `public/images/shopify-demo/joyeria/` (3 vistas en fondo blanco ya generadas + foto ambiental de portada optimizada a `.webp`).
