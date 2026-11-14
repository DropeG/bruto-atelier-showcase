## Why

Actualmente, al cambiar entre los círculos de color (**Blanco** y **Negro**) en el selector del **Anillo Cosmos**, la galería de perspectivas se reinicia siempre a la primera foto (`perspectiveIndex = 0`). Si el usuario está inspeccionando la vista frontal macro (perspectiva 2) o la vista de perfil (perspectiva 3) en un color y cambia al otro color, pierde su ángulo actual en lugar de ver el mismo ángulo en el nuevo color.

## What Changes

- Conservar el `perspectiveIndex` activo al cambiar de color en `src/components/CollectionShowcase.tsx`, acotándolo (`clamp`) al rango de perspectivas disponibles en el color destino (`Math.min(perspectiveIndex, Math.max(0, color.perspectives.length - 1))`).
- Actualizar las pruebas en `src/pages/CosmosCollection.test.tsx` para verificar la preservación de la perspectiva al alternar entre los colores **Negro** y **Blanco** desde la perspectiva 2 o 3.

## Capabilities

### New Capabilities

### Modified Capabilities
- `cosmos-jewelry-collection`: Al cambiar de color en el selector del Anillo Cosmos, el visor *stage* conserva la perspectiva actualmente seleccionada (con resguardo de límites si un color tuviera menos perspectivas).

## Impact

- `src/components/CollectionShowcase.tsx`
- `src/pages/CosmosCollection.test.tsx`
