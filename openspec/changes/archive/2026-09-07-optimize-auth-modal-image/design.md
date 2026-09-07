## Context

El modal de autenticación (`NewsletterModal.tsx`, re-exportado como `AuthModal.tsx`) muestra una fotografía editorial a pantalla dividida en escritorio (`hidden md:block`). Dicha imagen (`newsLetter.webp`) sufre actualmente de demoras en su aparición porque fue declarada con `loading="lazy"` dentro de un `<dialog>` cerrado, no está precalentada en memoria y su resolución física original (1435 × 1861 px, 123 kB) es superior a las necesidades de la retícula.

## Goals / Non-Goals

**Goals:**
- Despliegue visual instantáneo (0 ms perceptibles) de la fotografía al abrir el modal de Selectos/Login en desktop.
- Reducción del tamaño de transferencia de `newsLetter.webp` en más de un 40% (a ~75 kB o menos) preservando nitidez en pantallas Retina y 4K.
- Integración de blur placeholder Base64 (< 120 bytes) en `blur-placeholders.ts` para eliminar flashes de fondo plano café.
- Garantía de consumo de datos cero en dispositivos móviles (`< 768px`) para esta imagen.

**Non-Goals:**
- Modificar el flujo de autenticación GraphQL con Shopify Storefront.
- Cambiar la composición fotográfica o la estética de la imagen editorial de Bruto Atelier.

## Decisions

1. **Redimensionamiento y optimización con Sharp a Retina 2x (880 × 1160 px)**:
   * *Decisión*: Reemplazar el asset original de 1435 × 1861 px por una versión optimizada en WebP a 880 × 1160 px con calidad ~82.
   * *Razón*: El contenedor en el modal mide 440 px de ancho en pantallas grandes. En pantallas Retina 2x (MacBook, iMac 4K/5K), 880 px de ancho provee nitidez 1:1 pixel-perfect. Bajar de 123 kB a ~75 kB acelera drásticamente el tiempo de decodificación y transferencia.
   * *Alternativas descartadas*: Mantener la imagen original (desperdicio de ancho de banda).

2. **Mecanismo de Pre-warmup en `requestIdleCallback`**:
   * *Decisión*: Ejecutar un preload en JavaScript (`const img = new Image(); img.src = ...`) dentro de un `useEffect` en tiempo ocioso, condicionado a `window.innerWidth >= 768`.
   * *Razón*: Al no bloquear la carga inicial de los recursos críticos de la Home, aprovecha los momentos de inactividad de la CPU y la red para descargar y cachear la imagen del modal de forma silenciosa.
   * *Alternativas descartadas*: `<link rel="preload">` incondicional en `index.html` (descargaría la imagen innecesariamente en conexiones móviles lentas).

3. **Estrategia en el elemento `<img>` (`loading="eager"`, `decoding="async"`)**:
   * *Decisión*: Remover `loading="lazy"` para que la imagen responda inmediatamente al montarse/mostrarse sin esperar intersección de scroll, y añadir `decoding="async"` para evitar jank en el hilo principal durante la animación de apertura.

4. **Blur Placeholder Base64 Inline**:
   * *Decisión*: Generar una miniatura Base64 de 10 × 10 px de `newsLetter.webp` y registrarla en `blur-placeholders.ts` (`newsletterModal`). Aplicarla como estilo de fondo del contenedor o capa de transición suave.
   * *Razón*: Mantiene la coherencia con el resto de la galería de Bruto Atelier, donde ninguna imagen aparece en crudo.

## Risks / Trade-offs

- **[Riesgo] Descarga innecesaria de ~75 kB si el usuario nunca abre el modal en desktop.**
  * *Mitigación*: Se ejecuta únicamente en tiempo ocioso (`requestIdleCallback` tras 2.5s de interacción) y exclusivamente en pantallas de escritorio, donde el ancho de banda es más holgado y el impacto en UX al abrir el modal supera con creces el pequeño payload.
- **[Riesgo] Pérdida de calidad en pantallas ultra-grandes.**
  * *Mitigación*: Con 880 px de ancho para una columna que tiene como tope estricto 440 px (`max-w-[55rem]`), la densidad de píxeles es de exactamente 2.0x, superando el umbral de discriminación visual humana.
