## Context

En `src/components/CollectionShowcase.tsx`, el selector de color de `.wachi-stage__color-swatch` ejecuta actualmente `setPerspectiveIndex(0)` al cambiar `selectedColorId`. Dado que `CosmosCollection.tsx` define 3 perspectivas ordenadas 1:1 para ambos colores (`Blanco` y `Negro`), reiniciar el índice a `0` rompe la continuidad visual al comparar ambos colores en la perspectiva 2 (frontal macro) o 3 (perfil).

## Goals / Non-Goals

**Goals:**
- Preservar `perspectiveIndex` al cambiar entre opciones de color en `CollectionShowcase.tsx`.
- Garantizar seguridad si un producto futuro tuviera distinta cantidad de perspectivas por color mediante `Math.min(prev, Math.max(0, color.perspectives.length - 1))`.

**Non-Goals:**
- Modificar el diseño visual de los círculos de color, los controles de perspectiva o las imágenes.

## Decisions

1. **Preservación con acotamiento (`clamp`):**
   - En el `onClick` de cada `.wachi-stage__color-swatch`, reemplazar `setPerspectiveIndex(0)` por `setPerspectiveIndex((prev) => Math.min(prev, Math.max(0, color.perspectives.length - 1)))`.
   - *Racional:* Mantiene exactamente la misma perspectiva cuando los colores tienen igual cantidad de fotos (3 y 3 en Anillo Cosmos) y evita índices inválidos si en el futuro se agrega un color con menos fotos.

## Risks / Trade-offs

- **[Risk] Ninguno significativo** → El cambio es de una línea en la transición de estado de color y queda cubierto por pruebas unitarias.
