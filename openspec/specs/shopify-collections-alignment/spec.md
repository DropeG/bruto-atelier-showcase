## ADDED Requirements

### Requirement: Colecciones reales WACHI y CUORO publicadas en Shopify
El catálogo en Shopify SHALL contener las colecciones reales `wachi` (`WACHI`) y `cuoro` (`CUORO`) con título, descripción e imagen de portada configuradas, publicadas en el canal de ventas `BRUTO Atelier`, sin depender de productos ficticios (`silla-coleccion`, `accesorios-cuero`) ni de la colección puente `homepage-featured`.

#### Scenario: Consulta de colecciones publicadas desde producción
- **WHEN** la aplicación en producción consulta la Storefront API de Shopify
- **THEN** recibe las colecciones activas `wachi` y `cuoro` publicadas en el canal `BRUTO Atelier` con su título, descripción e imagen de portada

### Requirement: Home enlazado directamente a Colecciones reales de Shopify
La galería editorial del Home (`ShoppableGallery` + `useHomepageProducts`) SHALL consultar y renderizar las colecciones reales (`ShopifyCollection`) por su `handle` (`wachi`, `cuoro` y futuras colecciones), enlazando `wachi` a `/coleccion/wachi` y `cuoro` a `/coleccion/accesorios`.

#### Scenario: Renderizado en producción (`bruto-atelier.com`) sin `?demoMode=true`
- **WHEN** el usuario visita `bruto-atelier.com` sin parámetros de query y hace scroll hacia abajo desde el Hero
- **THEN** la sección `ShoppableGallery` muestra las tarjetas editoriales de **WACHI** y **CUORO** con los datos e imágenes reales de Shopify y navega a `/coleccion/wachi` y `/coleccion/accesorios` al hacer clic en **Ver**

#### Scenario: Eliminación de referencias heredadas `silla-coleccion` y `homepage-featured`
- **WHEN** se inspecciona la lógica de carga del Home en `useHomepageProducts.ts` y `ShoppableGallery.tsx`
- **THEN** no depende de los handles `silla-coleccion`, `accesorios-cuero` ni `homepage-featured` para mostrar las colecciones activas

### Requirement: Respaldo local en modo demo o sin credenciales
En `?demoMode=true` o cuando Shopify no esté configurado en desarrollo local, el Home SHALL renderizar las colecciones equivalentes (`wachi` y `cuoro`) desde los datos de respaldo locales.

#### Scenario: Vista en modo demo (`?demoMode=true`)
- **WHEN** el usuario abre `/?demoMode=true`
- **THEN** `ShoppableGallery` renderiza las colecciones `WACHI` y `CUORO` con sus enlaces preservando `?demoMode=true`
