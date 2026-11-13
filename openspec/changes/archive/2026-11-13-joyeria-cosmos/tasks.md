## 1. Assets y Registro de Imágenes

- [x] 1.1 Optimizar la foto ambiental original del anillo a `public/images/shopify-demo/joyeria/cosmos-hero.webp` para usarla como portada en `ShoppableGallery`.
- [x] 1.2 Registrar `cosmos` en `COLLECTION_REGISTRY` (`src/lib/collection-images.ts`) apuntando a `/images/shopify-demo/joyeria/anillo-fondo-blanco.webp` y agregar las entradas de joyería en `src/data/catalog-images.json` (o variantes responsivas si aplica).

## 2. Componente Reutilizable de Colección y Página COSMOS

- [x] 2.1 Extraer el componente compartido `src/components/CollectionShowcase.tsx` desde `src/pages/AccessoriesCollection.tsx` (header, grilla con `useCollectionGridReady`, *stage* con 3 perspectivas, controles de teclado/flechas/dots y feedback de `addToCart`).
- [x] 2.2 Refactorizar `src/pages/AccessoriesCollection.tsx` para usar `CollectionShowcase` sin alterar su comportamiento ni estilos (`CUORO`).
- [x] 2.3 Crear `src/pages/CosmosCollection.tsx` usando `CollectionShowcase` con la pieza inicial del anillo (`anillo-fondo-blanco.webp`, `anillo-perspectiva-2.webp`, `anillo-perspectiva-3.webp`) y layout centrado limpio para 1 pieza, extensible a más productos.
- [x] 2.4 Agregar la colección `cosmos` y el producto inicial en `src/lib/shopify/mockData.ts` como respaldo local/demo.

## 3. Enrutamiento y Retiro de "Próximamente"

- [x] 3.1 Registrar `/coleccion/cosmos` en `src/App.tsx` y redirigir `/joyeria` hacia `/coleccion/cosmos`.
- [x] 3.2 Remover `joyeria` de `src/data/ComingSoon.ts` y de `NEXT_SEASON_ITEMS` en `src/components/NextSeasonDepthCarousel.tsx`.

## 4. Portada (`ShoppableGallery`) Desktop 60/40 y Celular

- [x] 4.1 Actualizar `src/hooks/useHomepageProducts.ts` (`PREFERRED_HANDLES = ["wachi", "cuoro", "cosmos"]`, `COLLECTION_LIMIT = 3`, completando con `MOCK_COLLECTIONS` si Shopify aún no tiene `cosmos` publicada).
- [x] 4.2 Actualizar `src/components/ShoppableGallery.tsx` para renderizar `WACHI` arriba (`position="hero"`) y `CUORO` (izquierda) + `COSMOS` (derecha) dentro de `.shoppable-gallery__bottom` (`position="tile"`), mapeando `collectionIdForHandle` y `localHeroFallback` para `cosmos`.
- [x] 4.3 Ajustar `src/styles/shoppable-gallery.css` para que en Desktop (`min-width: 851px`) las tarjetas `.catalog-piece--tile` oculten el bloque café `.catalog-piece__information`, muestren el texto superpuesto `.catalog-piece__tile-label` sin tapar ni el tarjetero ni el anillo, y en celular (`max-width: 600px`) mantengan el formato vertical `100svh` con la sección café inferior.

## 5. Verificación

- [x] 5.1 Ejecutar `npm run build` y `npm test` para validar compilación TypeScript y tests existentes sin errores.
- [x] 5.2 Verificar visualmente en Desktop y Celular (`/` y `/coleccion/cosmos`) que las 3 colecciones en portada y el visor del anillo funcionen correctamente.
