## ADDED Requirements

### Requirement: Variantes responsivas optimizadas para todas las colecciones
Todas las imágenes de grilla y perspectivas de las colecciones activas (`WACHI`, `CUORO` y futuras colecciones registradas) SHALL contar con variantes optimizadas (`480w`, `800w`, `1200w`, `1600w`) en `src/data/catalog-images.json` y servirse mediante `catalogImageProps`.

#### Scenario: Renderizado de la grilla de CUORO con `srcSet` optimizado
- **WHEN** el usuario navega a `/coleccion/accesorios` (Colección CUORO)
- **THEN** cada pieza de la grilla (`Tabaquera`, `Sleeve`, `Tarjetero`) y sus perspectivas en el escenario detallado se renderizan usando `catalogImageProps`, entregando variantes responsivas livianas en lugar del archivo maestro sin redimensionar

### Requirement: Precarga especulativa y decodificación en RAM antes de navegar
Cuando una tarjeta de colección en `ShoppableGallery` se aproxime al viewport o reciba interacción (`mouseenter`, `focus`, `touchstart`), el sistema SHALL descargar y ejecutar `img.decode()` de las imágenes principales de la grilla de esa colección utilizando las mismas reglas de `srcSet` y `sizes` que usará la vista de destino.

#### Scenario: Navegación desde el Home hacia Colección CUORO o WACHI sin parpadeo
- **WHEN** la tarjeta de `CUORO` o `WACHI` entra cerca del viewport en `ShoppableGallery` (o recibe hover/focus/touch) y luego el usuario hace clic en **Ver**
- **THEN** las imágenes principales de la grilla ya se encuentran decodificadas en RAM y aparecen simultáneamente al entrar en la colección, sin tintineo ni recorte por decodificación tardía

### Requirement: Pintado sincronizado de la grilla y cola diferida de perspectivas
Al montar una página de colección, el sistema SHALL priorizar exclusivamente las imágenes principales de la grilla (`loading="eager"`, `fetchPriority="high"`), esperar a que estén decodificadas (con un tope máximo de `160 ms` en caché fría) antes de revelar la grilla, y postergar la precarga de las perspectivas secundarias (`perspectives`) hasta después de que las imágenes principales estén listas.

#### Scenario: Entrada directa por URL con caché fría a `/coleccion/accesorios` o `/coleccion/wachi`
- **WHEN** el usuario abre directamente `/coleccion/accesorios` o `/coleccion/wachi` sin haber pasado por el Home
- **THEN** la grilla espera a que sus imágenes principales terminen `img.decode()` (hasta un máximo de `160 ms`) antes de iniciar el fade-in y revelar todas las piezas juntas en el mismo frame

#### Scenario: Precarga de perspectivas secundarias sin competir con la grilla inicial
- **WHEN** la grilla de la colección está cargando sus imágenes principales
- **THEN** ninguna perspectiva secundaria (`perspectives[1..n]`) se descarga ni decodifica hasta que las imágenes principales de la grilla hayan resuelto su carga o superado el gate inicial y el hilo principal entre en reposo (`requestIdleCallback`)

### Requirement: Arquitectura extensible para futuras categorías de colección
El sistema SHALL proveer un registro y hook reutilizables (`src/lib/collection-images.ts`) para que cualquier nueva categoría o colección pueda declarar sus imágenes de grilla y perspectivas obteniendo automáticamente precarga especulativa y pintado sincronizado.

#### Scenario: Registro de una nueva colección en el futuro
- **WHEN** se agrega una nueva colección al mapa central `COLLECTION_REGISTRY` y su página usa `useCollectionGridReady` junto con `catalogImageProps`
- **THEN** `ShoppableGallery` precarga automáticamente sus imágenes de grilla al entrar en pantalla/hover y su vista de colección aplica el mismo gate sincronizado y cola diferida de perspectivas sin duplicar lógica
