## Why

Para presentar las 4 opciones de exhibición de video en móviles al cliente sin distracciones, necesitamos generar demos en video MP4 limpios. Actualmente, los modales emergentes (como NewsletterModal) se activan automáticamente durante la navegación, bloqueando la pantalla e impidiendo una vista clara de las opciones de diseño.

## What Changes

- **Demo Mode Override (`?demoMode=true`)**: Agregar soporte en la aplicación para silenciar modales emergentes (*NewsletterModal*, *NosotrosModal*) y alertas flotantes cuando se activa el parámetro de URL `?demoMode=true`.
- **Grabaciones de Video Limpias de 4 Opciones**: Generar 4 videos MP4 en `public/demos/` sin obstrucción alguna:
  1. `demo_opcion1.mp4`: Carrusel Swipeable Horizontal con indicador de diapositiva.
  2. `demo_opcion2.mp4`: Intercalado entre filas con IntersectionObserver (Fix iOS).
  3. `demo_opcion3.mp4`: Reels / Shorts Vertical en pantalla completa (100svh).
  4. `demo_opcion4.mp4`: Grid compacto 1 + 2 (tira de videos).

## Capabilities

### New Capabilities
- `mobile-video-presentation`: Capacidad para presentar videos en dispositivos móviles con múltiples formatos de layout y grabación libre de modales.

### Modified Capabilities

## Impact

- `src/pages/Index.tsx`: Soporte para deshabilitar modales emergentes cuando `?demoMode=true` está presente.
- `src/components/NewsletterModal.tsx`: Control de apertura condicional.
- `scripts/record-demo.mjs`: Actualización del script de grabación Playwright para navegar con `http://localhost:8080/?demoMode=true`.
- `public/demos/*.mp4`: Generación de los 4 videos finales limpios.
