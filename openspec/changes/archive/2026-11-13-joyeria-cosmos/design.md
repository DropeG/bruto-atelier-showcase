## Context

Bruto Atelier actualmente tiene dos colecciones activas de e-commerce (`WACHI` en `/coleccion/wachi` y `CUORO` en `/coleccion/accesorios`) conectadas a Shopify Storefront API con respaldo en `src/lib/shopify/mockData.ts`. El resto de categorías del menú (`Iluminación`, `Esenciales`, `Joyería`, `Vestuario`) muestran `ComingSoonView` y aparecen en `NextSeasonDepthCarousel`.

El usuario desea activar **Joyería** lanzando la colección **COSMOS** en `/coleccion/cosmos`, comenzando con una única pieza (el anillo de plata y piedra blanca con constelación de engastes, cuyas 3 vistas de estudio sobre fondo blanco ya están en `public/images/shopify-demo/joyeria/`), reutilizando el patrón y código existente de **CUORO** y **WACHI**, e integrándola en la portada (`ShoppableGallery`) con un layout específico para Desktop y Celular.

## Goals / Non-Goals

**Goals:**
- Reutilizar la arquitectura de grilla + *stage* interactivo (`Framer Motion` `layoutId`, 3 perspectivas, feedback de carrito Shopify y precarga `useCollectionGridReady`) sin duplicar el código de `AccessoriesCollection.tsx` / `WachiCollection.tsx`.
- Habilitar `/coleccion/cosmos` iniciando con 1 pieza (el anillo) con diseño equilibrado para una sola tarjeta y lista de piezas extensible para agregar más productos de joyería en el futuro.
- Actualizar `ShoppableGallery` para mostrar 3 colecciones:
  - **Desktop:** `WACHI` arriba (60% alto, foto izquierda + panel café derecha); `CUORO` abajo a la izquierda y `COSMOS` abajo a la derecha (40% alto dividido en 2 columnas) usando tarjetas `.catalog-piece--tile` con texto superpuesto sobre las fotos sin obstruir el tarjetero ni el anillo.
  - **Celular:** `COSMOS` debajo de `CUORO` manteniendo el mismo formato de tarjeta vertical `100svh` (foto arriba + sección café inferior).
- Redirigir `/joyeria` y `/showcase/joyeria` a `/coleccion/cosmos` y retirar Joyería de `ComingSoon.ts` y `NextSeasonDepthCarousel.tsx`.

**Non-Goals:**
- Selector de tallas, grabados o personalización de anillo en esta fase.
- Cambios en las categorías inactivas restantes (`Iluminación`, `Esenciales`, `Vestuario`).

## Decisions

### 1. Extracción de componente reutilizable de colección (`CollectionPageTemplate` o `StandardCollectionView`)
- **Decisión:** Extraer un componente/hook compartido (p. ej. `src/components/CollectionShowcase.tsx`) que encapsule el header (`ArrowLeft` / wordmark / `ShoppingBag` con pulso de carrito), la grilla con `useCollectionGridReady`, y el *stage* de 3 perspectivas con `AnimatePresence`, `LayoutGroup`, controles de teclado/flechas/dots y `addToCart`. Tanto `AccessoriesCollection.tsx` (`CUORO`) como `CosmosCollection.tsx` (`COSMOS`) consumirán este componente compartido pasando su configuración (`collectionId`, `title`, `pieces`, `stageSizes`, `className`).
- **Alternativa considerada:** Copiar `AccessoriesCollection.tsx` completo a `CosmosCollection.tsx` (~618 líneas). Se descartó porque el usuario pidió explícitamente reutilizar el código existente y evitar duplicación. `WachiCollection.tsx` conserva sus particularidades (como `WachiRequestDrawer` para piezas a medida), aunque comparte estilos CSS de `wachi-collection.css`.

### 2. Layout de `ShoppableGallery` para 3 colecciones (Desktop 60/40 vs Celular apilado)
- **Decisión:**
  - En `useHomepageProducts.ts`, actualizar `PREFERRED_HANDLES = ["wachi", "cuoro", "cosmos"]` y `COLLECTION_LIMIT = 3`.
  - En `ShoppableGallery.tsx`, renderizar `featured` (`WACHI`, `position="hero"`) en la fila superior, y envolver `[second, third]` (`CUORO` y `COSMOS`) dentro de `<div className="shoppable-gallery__bottom">` usando `position="tile"` en Desktop.
  - En `shoppable-gallery.css`, ya existen `.shoppable-gallery` (`grid-template-rows: 60% 40%`), `.shoppable-gallery__bottom` (`grid-template-columns: repeat(2, minmax(0, 1fr))`) y `.catalog-piece--tile` (con `.catalog-piece__tile-label` y gradiente inferior). Se ajustará únicamente:
    - Ocultar `.catalog-piece--tile .catalog-piece__information` en Desktop (`min-width: 851px`) para que solo se vea el texto sobre la foto (`.catalog-piece__tile-label`), mientras que en móvil (`<= 600px`) se muestra `.catalog-piece__information` (bloque café inferior) y se oculta `.catalog-piece__tile-label` igual que en `WACHI` y `CUORO`.
    - Ajustar `object-position` y posicionamiento de etiqueta en `CUORO` y `COSMOS` para que el texto sobre la foto quede en una zona limpia que no tape el tarjetero azul ni el anillo.

### 3. Portada de COSMOS y optimización de assets
- **Decisión:** Copiar/convertir la foto original del anillo sobre metal oxidado a `public/images/shopify-demo/joyeria/cosmos-hero.webp` para usarla como portada editorial en el Home (fallback local cuando Shopify aún no tenga la imagen de colección `cosmos` o en `?demoMode=true`), mientras que dentro de `/coleccion/cosmos` se usan las 3 vistas de estudio sobre fondo blanco (`anillo-fondo-blanco.webp`, `anillo-perspectiva-2.webp`, `anillo-perspectiva-3.webp`).
- **Alternativa considerada:** Usar la foto de fondo blanco también en el Home. Se descartó para mantener coherencia visual con `CUORO` (foto ambiental en Home → fondo blanco en colección).

### 4. Redirección de `/joyeria` y limpieza de "Next Season"
- **Decisión:** En `src/App.tsx`, redirigir `/joyeria` (y en `Category.tsx` si llega `/showcase/joyeria`) hacia `/coleccion/cosmos` con `<Navigate to="/coleccion/cosmos" replace />`. Remover `joyeria` de `comingSoonCategories` en `src/data/ComingSoon.ts` y de `NEXT_SEASON_ITEMS` en `src/components/NextSeasonDepthCarousel.tsx`.

## Risks / Trade-offs

- **[Risk] Shopify Storefront API en producción aún no tiene publicada la colección `cosmos` ni el producto del anillo** → **Mitigation:** En `useHomepageCollections`, si Shopify devuelve solo `wachi` y `cuoro` (2 colecciones), podemos completar con el fallback de `cosmos` de `MOCK_COLLECTIONS` solo mientras no exista en Shopify (o documentar que en cuanto se publique la colección `cosmos` en Shopify se toma automáticamente la real), y en `CosmosCollection` mostrar el anillo con su precio referencial aunque `activeVariantId` aún no exista en Shopify (deshabilitando el botón `+` hasta que el handle coincida, igual que en `CUORO`).
- **[Risk] Texto superpuesto sobre la foto en Desktop podría tapar el tarjetero o el anillo en ciertos aspect ratios** → **Mitigation:** Usar `.catalog-piece__tile-label` en la esquina inferior izquierda con degradado sutil en la base y calibrar `object-position` de `cuoro` y `cosmos` en `shoppable-gallery.css` para mantener el sujeto centrado-alto lejos del borde inferior.
