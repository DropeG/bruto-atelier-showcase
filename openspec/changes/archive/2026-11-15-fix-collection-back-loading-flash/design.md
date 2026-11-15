## Context

En el flujo actual de navegación:
1. Desde la pantalla de Colecciones del Home (`ShoppableGallery` en `/`), al entrar a **WACHI** (`/coleccion/wachi`), **CUORO** (`/coleccion/accesorios`) o **COSMOS** (`/coleccion/cosmos`), `ScrollContext` guarda en `sessionStorage` `lastSectionId` y `lastScrollTop`.
2. Al pulsar la flecha de retorno (`<ArrowLeft>`) en `WachiCollection` o `CollectionShowcase`, React Router desmonta la página de colección y vuelve a montar `Index` (`/`), restaurando `container.scrollTop` sobre `#coleccion`.
3. Si `cachedCollections` en `useHomepageProducts.ts` es `null` (por ejemplo, tras una recarga dentro de la colección, entrada directa por URL o revalidación inicial de `ShopifyContext`), `ShoppableGallery` recibe `isLoading: true` y `collections: []`, renderizando `.shoppable-gallery--loading` (gradiente 60% `#d9d2cb` / 40% `#81644f`). Como el scroll queda posicionado justo sobre esa sección de `100svh`, el usuario ve una pantalla partida en claro y café antes de que aparezca la galería real.
4. Adicionalmente, al remontarse `Index`, las etiquetas `<img>` de `.catalog-piece__media` se pintan sobre `#d9d2cb` plano sin placeholder visual mientras el navegador decodifica los assets locales.

## Goals / Non-Goals

**Goals:**
- Eliminar la aparición de la pantalla vacía `.shoppable-gallery--loading` (claro/café) al volver desde `WACHI`, `CUORO` o `COSMOS` hacia `/`.
- Mantener la restauración exacta de scroll en `#coleccion` sin saltos visuales.
- Mostrar inmediatamente el contenido de las tarjetas (`WACHI`, `CUORO`, `COSMOS`) y reducir a cero el parpadeo de decodificación de sus portadas mediante placeholders Base64 y precarga anticipada.

**Non-Goals:**
- Mantener `Index` montado en memoria oculto detrás de todas las rutas (agregaría complejidad innecesaria al `scroll-snap` y al ciclo de vida de los videos del Home).
- Modificar el esquema de productos o colecciones en Shopify Storefront API.

## Decisions

### 1. Caché de sesión + hidratación inmediata en `useHomepageCollections`
- **Decisión**: Persistir `selected` en `sessionStorage` (bajo una clave versionada, ej. `bruto_homepage_collections_v1`) y, si no hay caché válida en memoria ni en `sessionStorage`, inicializar `collections` con `selectHomepageCollections(MOCK_COLLECTIONS)` como estado optimista inicial mientras Shopify responde en segundo plano (`stale-while-revalidate`).
- **Por qué**: Las 3 colecciones principales (`wachi`, `cuoro`, `cosmos`), sus rutas y sus imágenes locales de portada ya están disponibles en el bundle (`MOCK_COLLECTIONS` + `localHeroFallback`). Mostrar ese estado desde el primer frame evita que `collections.length === 0` dispare `.shoppable-gallery--loading`. Cuando llega la respuesta real de Shopify, los textos/datos se actualizan silenciosamente y se guarda en `sessionStorage`.
- **Alternativa descartada**: Esperar a `ShopifyContext` mostrando un spinner o skeleton. Fue la causa directa del bug reportado.

### 2. Placeholder visual y precarga de portadas de `ShoppableGallery`
- **Decisión**:
  1. Agregar fondos blur Base64 en `blur-placeholders.ts` para las portadas de `ShoppableGallery` (o aplicar el estilo `backgroundImage` + `backgroundSize: 'cover'` en `.catalog-piece__media`) como respaldo mientras la `<img>` termina de pintarse.
  2. Precargar las portadas de `ShoppableGallery` (`wachi-hero-horizontal.png`, `wachi-mobile-left.webp`, `accesorios-tarjetero.jpeg`, `cosmos-hero.webp`) en idle cuando el usuario está dentro de una página de colección, o al hacer hover/focus sobre la flecha de retorno (`<ArrowLeft>`).
- **Por qué**: Incluso con los datos de colecciones ya presentes, desmontar y remontar `Index` obliga a repintar las `<img>`. Si las imágenes ya están decodificadas en caché o respaldadas por su blur Base64, desaparece el flash de `#d9d2cb`.

### 3. Paridad en el botón de retorno de `CollectionShowcase`
- **Decisión**: Replicar en el `<Link to={galleryUrl}>` de `CollectionShowcase.tsx` el reseteo preventivo de scroll de `window`/`document` antes de navegar (igual que `handleExitToGallery` en `WachiCollection.tsx`).
- **Por qué**: Evita que un desplazamiento residual en `window` interfiera al montar `Index` desde `CUORO` o `COSMOS`.

## Risks / Trade-offs

- **[Caché desactualizada en `sessionStorage`]** → La caché de sesión se revalida en segundo plano con Shopify en cada montaje de `useHomepageCollections` y vive solo durante la sesión de la pestaña.
- **[Diferencia mínima de copy si Shopify cambia título/descripción]** → El swap silencioso al resolverse la promesa actualiza los textos en milisegundos sin desmontar la galería ni alterar el layout de `100svh`.
