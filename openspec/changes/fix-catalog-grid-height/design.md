## Context

El componente `DesktopCatalogGrid` actual interfiere con el scroll-snapping vertical del contenedor principal en `Index.tsx`. La causa raíz es que `DesktopCatalogGrid` utiliza clases absolutas `min-h-[500px]` y `min-h-[350px]` que, al sumar 850px, superan el alto del viewport en pantallas pequeñas (donde 100vh < 850px).

## Goals / Non-Goals

**Goals:**
- Ajustar la arquitectura de CSS del componente para depender únicamente de unidades relativas al viewport.
- Mantener la estética visual asimétrica de la grilla (60% arriba, 40% abajo).

**Non-Goals:**
- Modificar componentes de otras disciplinas o cambiar el diseño responsivo en móvil.

## Decisions

- **Remover Heights Absolutos**: Eliminar `min-h-screen`, `min-h-[500px]` y `min-h-[350px]`.
- **Fijar Height Padre**: Asegurar que el contenedor padre de `DesktopCatalogGrid` use la clase `h-full` para absorber los `100svh` que le hereda la clase padre del snap-scrolling. 
- **Distribución en Porcentaje**: Reemplazar `h-[60vh]` y `h-[40vh]` por `h-[60%]` y `h-[40%]` (o dejarlos en vh, pero el porcentaje respeta mejor cualquier borde de contenedor si este cambiara a futuro). 

## Risks / Trade-offs

- **Risk**: En monitores extremadamente anchos y poco altos (super ultrawide chatos), el bloque superior de 60% puede no dejar espacio vertical suficiente para el texto.
- **Mitigation**: Dado que se está usando Tailwind flexbox (flex-col y justify-center), los items se agrupan en el centro del 40% derecho. Se probará visualmente. En un caso muy extremo se le puede añadir un `overflow-hidden`.
