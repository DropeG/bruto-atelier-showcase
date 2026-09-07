## Why

En producción, al abrir el modal de autenticación ("Selectos"), la imagen editorial de arquitectura tarda cientos de milisegundos en cargar, mostrando un recuadro café plano vacío. Esto ocurre porque la imagen tiene `loading="lazy"` dentro de un elemento `<dialog>` cerrado, la fotografía original está sobredimensionada (1435 × 1861 px, 123 kB para un contenedor de ~440 × 580 px) y no existe precarga en memoria ni placeholder visual. Esta optimización elimina la latencia visual y logra una aparición instantánea (0 ms) en desktop sin sobrecargar el consumo de datos móviles.

## What Changes

- **Optimización de resolución y compresión de imagen**: Redimensionar `newsLetter.webp` a resolución Retina 2x exacta (880 × 1160 px), reduciendo su peso de 123 kB a ~75 kB (ahorro de más del 40% en payload) sin pérdida perceptible en monitores 4K.
- **Pre-warmup inteligente en tiempo ocioso (Idle Preload)**: Precargar la imagen en segundo plano tras hidratar la página principal únicamente en viewports de escritorio (`window.innerWidth >= 768px`), garantizando que cuando el usuario pulse el botón de login/registro la imagen ya esté en memoria caché.
- **Eliminación de la trampa `loading="lazy"` en `<dialog>`**: Cambiar a `loading="eager"` y `decoding="async"` para que el navegador decodifique la imagen de forma asíncrona sin bloquear el hilo principal.
- **Placeholder Blur Base64 instantáneo**: Integrar una miniatura Base64 de 10 × 10 px (< 120 bytes) como fondo inicial mientras la imagen en alta resolución hace la transición suave.
- **Aislamiento móvil estricto**: Mantener la imagen completamente desactivada en dispositivos móviles (`< 768px`) para no incurrir en transferencias de red innecesarias.

## Capabilities

### New Capabilities
- `auth-modal-image-performance`: Estrategia de entrega de assets, precarga en segundo plano condicional por viewport y renderizado con blur placeholder para la imagen del modal de autenticación.

### Modified Capabilities
<!-- No requirement changes to existing specs -->

## Impact

- **Código afectado**:
  - `public/images/newsLetterModal/newsLetter.webp` (archivo de imagen optimizado).
  - `src/components/NewsletterModal.tsx` (carga eager, decodificación asíncrona, blur placeholder).
  - `src/lib/blur-placeholders.ts` (exportación de la miniatura Base64 `newsletterModal`).
- **Rendimiento**: Carga instantánea (0 ms perceptibles) de la fotografía al abrir el modal en desktop, con 0 bytes transferidos en conexiones móviles.
