## Context

El proyecto actual es una aplicación Vite React (Single Page Application) para Bruto Atelier Showcase. No tiene analítica configurada. Se requiere agregar seguimiento de visitas (pageviews) manteniendo el enfoque minimalista y cookieless del proyecto para evitar molestar a los usuarios con banners de cookies. Vercel Analytics se adapta perfectamente a este caso de uso.

## Goals / Non-Goals

**Goals:**
- Registrar el tráfico general (vistas de página, visitantes únicos) en el dashboard de Vercel.
- Mantener la privacidad de los usuarios (cookieless tracking).

**Non-Goals:**
- Rastrear eventos personalizados (ej. clics en botones, adiciones al carrito).
- Implementar Google Analytics u otras herramientas invasivas.
- Mostrar un banner de cookies (innecesario gracias a Vercel Analytics).

## Decisions

- **Ubicación del Componente:** Se inyectará el componente `<Analytics />` en `src/main.tsx`, justo debajo de `<App />`, envolviendo la aplicación o paralelo a ella, pero dentro de los providers. Esto asegura que el script se cargue globalmente en la SPA.
- **Librería de React:** Dado que es una aplicación Vite React (no Next.js), se instalará el paquete genérico `@vercel/analytics` y se importará desde `@vercel/analytics/react`.

## Risks / Trade-offs

- **Bloqueadores de Anuncios:** Algunos usuarios con bloqueadores de anuncios estrictos (ej. uBlock Origin o navegadores como Brave) pueden bloquear la carga del script de Vercel Analytics. *Mitigación:* Aceptamos este margen de error, ya que priorizamos una métrica orientativa sin sacrificar la privacidad de los usuarios o la estética premium del sitio.
