## Why

Actualmente `LazyImage.tsx` y `HoverableImage.tsx` instancian objetos imperativos `new Image()` dentro de un efecto `useEffect` al montarse. Esto provoca que el navegador inicie solicitudes HTTP GET de alta resolución para todas las imágenes de la página al mismo tiempo en los primeros 2 segundos, destruyendo la efectividad de la propiedad nativa `loading="lazy"`.

## What Changes

- Eliminar la precarga programática imperativa con `new Image()` dentro de `useEffect` en `LazyImage.tsx` y `HoverableImage.tsx`.
- Usar la etiqueta DOM nativa `<img src={src} loading="lazy" decoding="async">` con eventos `onLoad` y `onError` directos sobre el elemento DOM.
- Mantener la transición de desenfoque (`blur`) utilizando la imagen Base64 como fondo de contenedor o estilo mientras se completa la descarga nativa.
- Corregir en `HoverableImage.tsx` las búsquedas frágiles del DOM basadas en `document.currentScript` (que retorna `null` en módulos ESM de Vite) reemplazándolas por eventos sintéticos con `e.currentTarget.closest('[id^="section-"]')`.

## Capabilities

### New Capabilities
- `native-lazy-image-loading`: Carga diferida de imágenes basada puramente en los estándares nativos del navegador HTML5 con transiciones de desenfoque suaves y manejo directo del DOM en React.

### Modified Capabilities

## Impact

- `src/components/LazyImage.tsx`: Reducción de código y eliminación de `new Image()` en `useEffect`.
- `src/components/HoverableImage.tsx`: Reducción de código, eliminación de `new Image()` en `useEffect`, y eliminación de `document.currentScript`.
