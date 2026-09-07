## 1. Optimización del Asset Fotográfico

- [x] 1.1 Redimensionar y recomprimir `public/images/newsLetterModal/newsLetter.webp` a 880 × 1160 px con calidad ~82 usando Sharp, reduciendo el peso a < 85 kB.
- [x] 1.2 Generar la miniatura Base64 (10 × 10 px) de la imagen e integrarla en `src/lib/blur-placeholders.ts` como `newsletterModal`.

## 2. Implementación de Preload y Renderizado en Modal

- [x] 2.1 Implementar pre-warmup en segundo plano (`requestIdleCallback` o timer en inactividad) para descargar la imagen a caché de memoria en pantallas `>= 768px`.
- [x] 2.2 Actualizar el elemento `<img>` en `NewsletterModal.tsx` reemplazando `loading="lazy"` por `loading="eager"` y añadiendo `decoding="async"`.
- [x] 2.3 Aplicar el blur placeholder Base64 como fondo en el contenedor de la imagen con transición suave de opacidad (`transition-opacity duration-500`) al completar la carga.

## 3. Verificación de Rendimiento

- [x] 3.1 Validar que la compilación de producción (`npm run build`) se ejecute sin errores.
- [x] 3.2 Comprobar en emulación de red que en desktop la imagen se presenta en 0 ms desde caché y que en dispositivos móviles no se realiza descarga.
