## Context

En despliegues en Vercel, las cabeceras HTTP de respuesta enviadas por el servidor son interpretadas por todos los navegadores web modernos (Chrome, Safari, Firefox, Edge, Opera, Samsung Internet, etc.) bajo el estándar universal HTTP RFC 9111. 

Anteriormente, las reglas en `vercel.json` asignaban `immutable` a las rutas de `/images/*` y `/videos/*` de manera estática, mientras que `index.html` incluía meta tags destructivos que obligaban a re-descargar todo en cada carga en cualquier navegador.

## Goals / Non-Goals

**Goals:**
- Implementar una estrategia de caché HTTP **100% universal y estándar** compatible con todos los navegadores móviles y de escritorio.
- Permitir la validación instantánea de `index.html` en Vercel (`max-age=0, must-revalidate`).
- Garantizar que las fotos y videos se almacenen localmente en el navegador para carga instantánea, revalidando en segundo plano si Vercel tiene un archivo actualizado (`stale-while-revalidate`).
- Garantizar que los assets compilados con hash (`/assets/*`) se almacenen de forma inmutable por 1 año.

**Non-Goals:**
- Cambiar la lógica de renderizado React de imágenes o videos.
- Modificar el sistema de compilación de Vite.

## Decisions

- **Decision 1: Quitar Meta Tags HTTP de `index.html`**
  - *Rationale*: Los meta tags en el HTML no sustituyen el estándar HTTP de servidor y confunden el comportamiento de caché en Chrome, Firefox y Safari por igual.

- **Decision 2: Estándar RFC 9111 con `stale-while-revalidate` para `/images/(.*)` y `/videos/(.*)` en `vercel.json`**
  - *Rationale*: Este encabezado es soportado nativamente por Chrome, Edge, Firefox y Safari. Permite servir la copia guardada en caché inmediatamente y verificar en segundo plano si existe una nueva versión en el servidor.

## Risks / Trade-offs

- **[Risk]** Si un usuario en cualquier navegador mantiene un video en caché por 24 horas y se actualiza el archivo con el mismo nombre exacto. → *Mitigation*: Si se reemplaza un recurso multimedia específico en producción manteniendo el mismo nombre de archivo, se puede añadir un parámetro de versión (`?v=2`) en el código.
