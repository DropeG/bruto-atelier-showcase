## Why

Actualmente `index.html` contiene etiquetas `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />` que obligan a todos los navegadores (Chrome, Safari, Firefox, Edge, etc.) a destruir la caché local y re-descargar megabytes de fotos HD y videos en cada navegación. Al mismo tiempo, las reglas de cabeceras en `vercel.json` asignan `immutable` a los archivos multimedia en `public/images/` y `public/videos/`, provocando que los navegadores sirvan versiones antiguas y mezcladas cuando se suben cambios con el mismo nombre de archivo.

## What Changes

- Eliminar las meta etiquetas HTTP `Cache-Control`, `Pragma` y `Expires` de `index.html`.
- Configurar encabezados HTTP estándares y universales (W3C / RFC 9111) en `vercel.json` compatibles con todos los navegadores modernos (Chrome, Safari, Firefox, Edge, Opera, móviles):
  - `index.html`: `public, max-age=0, must-revalidate` para permitir la revalidación instantánea de nuevos despliegues.
  - `/assets/(.*)`: `public, max-age=31536000, immutable` para código compilado con hashes de Vite.
  - Media (`/images/`, `/videos/`, `/fonts/`): `public, max-age=86400, stale-while-revalidate=604800` para permitir almacenamiento en caché ultrarrápido y revalidar actualizaciones en segundo plano.

## Capabilities

### New Capabilities
- `http-cache-management`: Define los requerimientos de almacenamiento en caché universal para HTML, assets compilados y archivos estáticos multimedia en despliegues Vercel.

### Modified Capabilities

## Impact

- `index.html`: Se eliminan las etiquetas meta de bloqueo de caché.
- `vercel.json`: Se reestructuran las reglas de cabeceras HTTP de Vercel bajo estándares RFC 9111.
