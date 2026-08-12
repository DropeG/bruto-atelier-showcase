## Why

Actualmente, solo la categoría "Vestuario" cuenta con el panel in-situ "Coming Soon" integrado en la navegación. Las demás categorías inactivas (Iluminación, Esenciales, Joyería, Accesorios) aún redirigen a una página completa independiente (`/showcase/...` con `ComingSoonView.tsx`), manteniendo una experiencia inconsistente y menos fluida.

Unificar todas las categorías no activas para que abran un panel in-situ desplegable directo dentro del menú de navegación (con insignia `Coming Soon`, foto editorial única de 4:5 y bajada sutil) resolverá las inconsistencias UX/UI y mejorará la velocidad global de navegación.

## What Changes

- **Unificación de Navegación (`Navigation.tsx`)**: Configuración genérica para que el clic en cualquiera de las 5 categorías inactivas (`iluminacion`, `esenciales`, `joyeria`, `vestuario`, `accesorios`) abra su respectivo panel in-situ `activePanel` en menú Desktop y Móvil con insignia `Coming Soon`.
- **Limpieza de Datos (`ComingSoon.ts`)**: Estandarización de la estructura para todas las categorías inactivas, removiendo arreglos sobrantes de múltiples imágenes en `joyeria`.

## Capabilities

### New Capabilities
- `unified-coming-soon-panels`: Sistema unificado de paneles in-situ "Coming Soon" en la navegación para todas las categorías sin catálogo activo.

### Modified Capabilities
- None

## Impact

- `src/components/Navigation.tsx`: Renderizado unificado y dinámico de paneles laterales y móviles para categorías inactivas.
- `src/data/ComingSoon.ts`: Limpieza y estandarización de metadatos de imágenes.
