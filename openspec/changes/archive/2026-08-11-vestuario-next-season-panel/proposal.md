## Why

El flujo actual para la categoría no activa "Vestuario" redirige al usuario a una página independiente (`/showcase/vestuario` que renderiza `ComingSoonView.tsx`). Esta vista genera una precarga intensiva de 4 imágenes pesadas en alta resolución, crea problemas de respuesta en dispositivos móviles debido a restricciones de alto de viewport (`100svh`), y genera un exceso de datos que rompe la estética minimalista, sobria y ligera de Bruto Atelier.

Convertir la interacción de "Vestuario" (y la gestión de futuras colecciones inactivas) en una pestaña desplegable in-situ ("Next Season") directamente dentro del menú de navegación resuelve los problemas de performance, evita redirecciones pesadas y ofrece una experiencia editorial fluida y de lujo.

## What Changes

- **Modificación en Navegación (`Navigation.tsx`)**: Al hacer clic en "Vestuario" (y opcionalmente en categorías sin catálogo activo), no se navegará a una ruta externa. En su lugar, se activará un panel desplegable in-situ (`activePanel === "vestuario"`) dentro del menú de navegación.
- **Creación de Panel "Next Season"**: Se diseñará una pestaña desplegable elegante en desktop y móvil con el distintivo `NEXT SEASON`, texto editorial conciso en tipografía minimalista y carga de datos ligera sin scripts de precarga ni múltiples imágenes.
- **Optimización de Ruta Fallback / Redirección (`ComingSoonView.tsx` / `Category.tsx`)**: Simplificación de `ComingSoonView.tsx` para eliminar la precarga en bucle de múltiples imágenes, el lookbook de miniaturas y la sobrecarga móvil, garantizando que si se accede por URL directa a `/showcase/vestuario`, cargue instantáneamente como una tarjeta editorial limpia.

## Capabilities

### New Capabilities
- `next-season-panel`: Pestaña/panel desplegable ligero in-situ dentro del menú de navegación para categorías de colecciones futuras (Next Season / Próximamente).

### Modified Capabilities
- None

## Impact

- `src/components/Navigation.tsx`: Integración del estado y panel desplegable "vestuario" (Next Season) en desktop y móvil.
- `src/components/ComingSoonView.tsx`: Reducción dramática del footprint de datos, eliminación de la precarga pesada y mejora de layout responsive.
- `src/data/ComingSoon.ts`: Simplificación de la estructura de datos para categorías inactivas.
