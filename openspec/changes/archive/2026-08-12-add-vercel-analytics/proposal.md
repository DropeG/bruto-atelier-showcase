## Why

Se requiere integrar analítica base para monitorear el tráfico y las páginas vistas en el Bruto Atelier Showcase. Al utilizar Vercel Analytics, obtenemos una solución nativa de Vercel, cookieless y privacy-friendly, ideal para mantener la experiencia limpia y sin banners molestos.

## What Changes

- Se añadirá el paquete `@vercel/analytics`.
- Se inyectará el componente `<Analytics />` en la raíz de la aplicación Vite React (`src/main.tsx`).
- Solo se implementará la analítica base (pageviews), sin rastreo de eventos custom por el momento.

## Capabilities

### New Capabilities

- `analytics`: Configuración de analítica base y medición de tráfico sin cookies usando Vercel Analytics.

### Modified Capabilities

- Ninguna.

## Impact

- Afecta al archivo `package.json` por la nueva dependencia.
- Afecta a `src/main.tsx` al añadir el Provider/Componente de Analytics al árbol de renderizado principal.
