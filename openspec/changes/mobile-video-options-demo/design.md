## Context

El cliente necesita evaluar 4 formatos distintos de presentación de video en teléfonos móviles. Durante los primeros intentos de grabación, el `NewsletterModal` emergió sobre la pantalla tapando los videos.

## Goals / Non-Goals

**Goals:**
- Implementar un parámetro de URL `demoMode=true` en React que desactive modales emergentes.
- Grabar automáticamente las 4 opciones limpias en video MP4 usando Playwright con `demoMode=true`.
- Proporcionar acceso directo a los 4 archivos MP4 en `/public/demos/`.

**Non-Goals:**
- Alterar la lógica permanente de NewsletterModal para usuarios reales en producción (solo se inhíbe en `demoMode`).

## Decisions

- **URL SearchParam Check**: `new URLSearchParams(window.location.search).get('demoMode') === 'true'`.
- **Playwright Auto-scroll with Navigation**: Navegar a `http://localhost:8080/?demoMode=true` en el viewport `iPhone 14 Pro`.

## Risks / Trade-offs

- [Risk] El modal puede abrirse si el parámetro no se evalúa antes del render inicial. → Mitigación: Evaluar `demoMode` directamente en la inicialización de `NewsletterModal`.
