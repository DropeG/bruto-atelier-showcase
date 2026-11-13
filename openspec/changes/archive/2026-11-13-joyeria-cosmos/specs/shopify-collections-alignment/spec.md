## MODIFIED Requirements

### Requirement: Colecciones reales WACHI y CUORO publicadas en Shopify
El catálogo en Shopify SHALL soportar las colecciones activas `wachi` (`WACHI`), `cuoro` (`CUORO`) y `cosmos` (`COSMOS`) con título, descripción e imagen de portada configuradas, publicadas en el canal de ventas `BRUTO Atelier`, sin depender de productos ficticios (`silla-coleccion`, `accesorios-cuero`) ni de la colección puente `homepage-featured`.

#### Scenario: Consulta de colecciones publicadas desde producción
- **WHEN** la aplicación en producción consulta la Storefront API de Shopify
- **THEN** recibe las colecciones activas disponibles entre `wachi`, `cuoro` y `cosmos` publicadas en el canal `BRUTO Atelier` con su título, descripción e imagen de portada

### Requirement: Home enlazado directamente a Colecciones reales de Shopify
La galería editorial del Home (`ShoppableGallery` + `useHomepageProducts`) SHALL consultar y renderizar hasta 3 colecciones (`wachi`, `cuoro`, `cosmos`), enlazando `wachi` a `/coleccion/wachi`, `cuoro` a `/coleccion/accesorios` y `cosmos` a `/coleccion/cosmos`.

#### Scenario: Composición en Desktop (`min-width: 851px`)
- **WHEN** el usuario visualiza `ShoppableGallery` en Desktop
- **THEN** **WACHI** ocupa la fila superior horizontal (60% de alto, foto a la izquierda y panel café a la derecha) y la fila inferior (40% de alto) se divide en 2 columnas con **CUORO** a la izquierda y **COSMOS** a la derecha mostrando el texto sobre la fotografía sin obstruir el producto

#### Scenario: Composición en Celular (`max-width: 600px`)
- **WHEN** el usuario visualiza `ShoppableGallery` en celular
- **THEN** **WACHI**, **CUORO** y **COSMOS** se muestran apiladas verticalmente en bloques `100svh` con scroll snap, cada una con la fotografía arriba y su bloque café inferior con título, descripción y acción `Ver →`

#### Scenario: Eliminación de referencias heredadas `silla-coleccion` y `homepage-featured`
- **WHEN** se inspecciona la lógica de carga del Home en `useHomepageProducts.ts` y `ShoppableGallery.tsx`
- **THEN** no depende de los handles `silla-coleccion`, `accesorios-cuero` ni `homepage-featured` para mostrar las colecciones activas

### Requirement: Respaldo local en modo demo o sin credenciales
En `?demoMode=true` o cuando Shopify no esté configurado en desarrollo local, el Home SHALL renderizar las colecciones equivalentes (`wachi`, `cuoro` y `cosmos`) desde los datos de respaldo locales.

#### Scenario: Vista en modo demo (`?demoMode=true`)
- **WHEN** el usuario abre `/?demoMode=true`
- **THEN** `ShoppableGallery` renderiza las colecciones `WACHI`, `CUORO` y `COSMOS` con sus enlaces preservando `?demoMode=true`
