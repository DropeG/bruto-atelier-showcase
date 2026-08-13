## Why

Tras revisar el feedback directo del cliente (Mladen), se requiere corregir el concepto y comportamiento de las categorías sin catálogo activo:
1. La etiqueta correcta es estrictamente **Next Season** (nunca "Coming Soon").
2. Los ítems del menú SÍ deben ser clickeables y desplegar una pestaña lateral in-situ (*activePanel*) idéntica en contenedor y estilo visual al panel de "Nosotros" (`bg-[#9C7B66] text-white p-6 font-serif`).
3. El contenido debe ser minimalista: título, 1 sola imagen limpia de previsualización (marco 4:5) y estado `Disponible Próximamente · 2026`, sin subtítulos, bloques pesados de datos ni galerías recargadas.

## What Changes

- **Insignia y Wording**: Actualizar la etiqueta del menú en Desktop y Móvil de "Coming Soon" a **Next Season**.
- **Interactividad Clickeable**: Habilitar el evento `onClick` en la lista de navegación para que al hacer clic en cualquiera de las categorías no activas (`iluminacion`, `esenciales`, `joyeria`, `vestuario`, `accesorios`), se active su correspondiente panel in-situ desplegable.
- **Pestaña Lateral Desplegable (Estilo "Nosotros")**: Renderizar la pestaña desplegable en `Navigation.tsx` compartiendo el mismo contenedor (`bg-[#9C7B66]`), tipografía y estructura minimalista con 1 foto única de preview.

## Capabilities

### New Capabilities
- `next-season-navigation-panels`: Pestañas desplegables in-situ "Next Season" con estilo unificado "Nosotros" y 1 imagen de preview limpia para categorías no activas.

### Modified Capabilities
- None

## Impact

- `src/components/Navigation.tsx`: Reactivación de clic e integración del renderizado dinámico de la pestaña "Next Season" (contenedor estilo Nosotros).
