## MODIFIED Requirements

### Requirement: Variantes responsivas optimizadas para todas las colecciones
Todas las imágenes de grilla y perspectivas de las colecciones activas (`WACHI`, `CUORO`, `COSMOS` y futuras colecciones registradas) SHALL contar con variantes optimizadas (`480w`, `800w`, `1200w`, `1600w`) en `src/data/catalog-images.json` y servirse mediante `catalogImageProps`.

#### Scenario: Renderizado de la grilla de COSMOS con `srcSet` optimizado
- **WHEN** el usuario navega a `/coleccion/cosmos` (Colección COSMOS)
- **THEN** la pieza del anillo y sus perspectivas en el escenario detallado se renderizan usando `catalogImageProps` o variantes `.webp` optimizadas sin penalizar la carga inicial

## ADDED Requirements

### Requirement: Registro de COSMOS en `COLLECTION_REGISTRY`
El sistema SHALL registrar `cosmos` en `COLLECTION_REGISTRY` (`src/lib/collection-images.ts`) para habilitar la precarga especulativa desde `ShoppableGallery` y el pintado sincronizado de la grilla en `/coleccion/cosmos`.

#### Scenario: Precarga especulativa de COSMOS desde el Home
- **WHEN** la tarjeta de `COSMOS` entra cerca del viewport en `ShoppableGallery` o recibe hover/focus/touch
- **THEN** el sistema precarga y decodifica la imagen principal de la grilla de `COSMOS` antes de navegar a `/coleccion/cosmos`
