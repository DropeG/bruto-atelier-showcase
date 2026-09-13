## Context

El proyecto es un catálogo de mobiliario de alta gama ("bruto-atelier"). Actualmente, las vistas de productos dependen del tipo (ej. `CarouselView` para mobiliario, `SingleView` para otros). Para validar el look & feel en escritorio (Desktop), se desea un layout estilo "editorial", asimétrico y altamente visual, siguiendo el estilo de marcas como Zara Home o Audo Copenhagen (colores neutros/cálidos, minimalismo, fotografía de alta calidad).

## Goals / Non-Goals

**Goals:**
- Implementar un componente `DesktopCatalogGrid` o similar que replique el layout asimétrico propuesto.
- La grilla debe incluir:
  - Fila superior: Imagen destacada a la izquierda (aprox 60%) y bloque de color sólido cálido a la derecha (aprox 40%) con información de producto (título, materiales, precio, link).
  - Fila inferior: Dividida al 50/50, con dos imágenes full-bleed y títulos de productos superpuestos en la esquina inferior izquierda.
- Aplicar tipografía elegante (serif para títulos, sans-serif para detalles) y colores acordes al manual de marca (tonos tierra, neutros cálidos).
- Uso de Tailwind CSS para el layout y los estilos.

**Non-Goals:**
- Integración real con la API de Shopify en esta etapa (se pueden usar datos y URLs de imágenes mock para visualizar el diseño rápidamente).
- Lógica de carrito o navegación profunda; el enfoque es puramente estético y de maquetación (Showcase).
- Responsive para móviles (esta vista es explícitamente para Desktop; en móvil se mantendrá otra vista o se ocultará temporalmente).

## Decisions

- **Componente**: Se creará un componente `DesktopCatalogGrid.tsx` en `src/components/`.
- **Layout con CSS Grid/Flexbox**: 
  - Fila superior (Hero): Flexbox o Grid con `grid-cols-12` (col-span-7 e col-span-5) o porcentajes.
  - Fila inferior: Grid de 2 columnas iguales.
- **Tipografía y Color**: Se utilizarán colores estáticos o variables de Tailwind basadas en la imagen (fondo café/terracota claro, texto blanco/crema).
- **Integración**: Se añadirá una ruta de test o se inyectará temporalmente en la vista de catálogo actual (dependiendo de la arquitectura existente) para que el usuario pueda visualizarlo.

## Risks / Trade-offs

- **Risk**: Las imágenes reales del catálogo pueden no tener las proporciones adecuadas para encajar perfectamente en la grilla asimétrica (portrait vs landscape).
  - **Mitigation**: Usar `object-cover` y alturas fijas/relativas (`h-[60vh]`, `h-[40vh]`) para forzar el encuadre sin deformar las imágenes.
- **Trade-off**: Al codificar en duro la grilla para un número específico de productos (3 en el diseño), escalar este layout para 10+ productos requerirá un algoritmo de teselado (masonry o un patrón repetitivo). Por ahora, nos limitamos al patrón de la maqueta (1 bloque principal, 2 secundarios).
