## Context

Actualmente, `LazyImage.tsx` y `HoverableImage.tsx` intentan implementar un desenfoque usando la API imperativa `new Image()`. Al establecer `img.src = src` dentro de `useEffect` en el montaje del componente, se cancela la optimización nativa del motor del navegador HTML5, obligando a descargar todas las imágenes simultáneamente.

## Goals / Non-Goals

**Goals:**
- Permitir que el motor de renderizado del navegador (Blink, WebKit, Gecko) gestione de manera transparente y óptima qué imágenes descargar según la cercanía al viewport.
- Conservar la transición estética de desenfoque (`blur`) mediante la captura del evento `onLoad` nativo en el elemento `<img />`.
- Reemplazar las referencias imperativas `document.currentScript` en `HoverableImage.tsx`.

**Non-Goals:**
- Cambiar la estructura de `blur-placeholders.ts`.
- Alterar los props existentes de `LazyImage` o `HoverableImage`.

## Decisions

- **Decision 1: Rendimiento basado en el evento `onLoad` de la etiqueta `<img />`**
  - *Rationale*: Pasar `src={src}` directamente a la etiqueta `<img />` con `loading="lazy"` permite que el navegador controle cuándo se descarga. `onLoad={() => setIsLoaded(true)}` actualiza el estado solo cuando la imagen termina de descargarse verdaderamente.

- **Decision 2: Uso de `backgroundImage` para el placeholder de desenfoque**
  - *Rationale*: Establecer `backgroundImage: blurDataUrl ? url(${blurDataUrl}) : undefined` en el contenedor o imagen asegura que el usuario vea la vista previa de baja resolución mientras el navegador carga el archivo HD nativamente.

- **Decision 3: Sustitución de `document.currentScript` por `e.currentTarget`**
  - *Rationale*: `document.currentScript` siempre retorna `null` en módulos ESM (`type="module"` en Vite). Usar `e.currentTarget.closest(...)` es la forma estándar e idiomática en React.

## Risks / Trade-offs

- Ninguno identificado. Mejora el rendimiento de red sin alterar la experiencia visual.
