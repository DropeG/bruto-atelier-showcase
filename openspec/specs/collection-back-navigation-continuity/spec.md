## ADDED Requirements

### Requirement: Retorno sin pantalla vacía desde colecciones al Home
Al navegar hacia atrás desde las páginas de colección (`WACHI`, `CUORO` o `COSMOS`) hacia `/`, `ShoppableGallery` SHALL renderizar inmediatamente las tarjetas de colecciones sin mostrar el estado vacío `.shoppable-gallery--loading` (gradiente claro/café), incluso tras recargar la página dentro de una colección o ingresar directamente por URL.

#### Scenario: Retorno tras recarga dentro de una colección
- **WHEN** el usuario recarga la página en `/coleccion/wachi`, `/coleccion/accesorios` o `/coleccion/cosmos` y luego presiona la flecha de retorno hacia `/`
- **THEN** `useHomepageCollections` entrega colecciones iniciales inmediatas (desde `sessionStorage` o respaldo local) mientras revalida con Shopify en segundo plano, evitando que `ShoppableGallery` renderice `.shoppable-gallery--loading`

#### Scenario: Actualización silenciosa desde Shopify
- **WHEN** `useHomepageCollections` recibe la respuesta de la Storefront API en segundo plano
- **THEN** actualiza las colecciones mostradas y persiste el resultado en `sessionStorage` sin provocar saltos de scroll ni desmontar la galería

### Requirement: Continuidad visual de portadas al remontar la galería
Al volver a montar `ShoppableGallery` desde una colección, las portadas de `WACHI`, `CUORO` y `COSMOS` SHALL contar con respaldo visual inmediato (blur placeholder o imagen precargada) para evitar el parpadeo del fondo plano `#d9d2cb`.

#### Scenario: Precarga e imagen lista al volver
- **WHEN** el usuario navega dentro de una colección y presiona la flecha para volver a `/`
- **THEN** las portadas de `ShoppableGallery` se muestran con su placeholder difuminado o imagen ya decodificada sin mostrar bloques vacíos beige/café

### Requirement: Paridad de salida entre WACHI, CUORO y COSMOS
El botón de retorno a `/` en `CollectionShowcase` (`CUORO` y `COSMOS`) SHALL ejecutar la misma limpieza de scroll previa a la navegación que `WachiCollection`.

#### Scenario: Salida desde CUORO o COSMOS
- **WHEN** el usuario presiona la flecha de retorno en `CUORO` o `COSMOS`
- **THEN** se resetea cualquier scroll residual del documento antes de navegar a `/`, permitiendo que `Index` restaure exactamente la posición guardada en `#coleccion`
