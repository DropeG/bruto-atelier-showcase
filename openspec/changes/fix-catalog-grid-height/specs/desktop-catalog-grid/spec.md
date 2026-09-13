## MODIFIED Requirements

### Requirement: Layout Asimétrico Principal (Desktop)
El sistema SHALL mostrar un layout tipo grilla asimétrica en pantallas grandes (Desktop). La vista MUST estar dividida en dos filas principales (Hero y Secundaria) cuyas alturas proporcionales sumen exactamente el 100% de la altura visible en pantalla, permitiendo un comportamiento óptimo del scroll-snapping vertical.

#### Scenario: Visualización del bloque superior (Hero)
- **WHEN** el usuario navega a la vista de catálogo en un dispositivo Desktop
- **THEN** la primera fila ocupa exactamente el 60% de la altura del contenedor principal
- **THEN** la mitad izquierda muestra una imagen de producto principal
- **THEN** la mitad derecha muestra un bloque de color sólido con el nombre del producto, materiales, precio y un enlace para ver más.

#### Scenario: Visualización del bloque inferior (Secundaria)
- **WHEN** el usuario hace scroll o ve la parte inferior de la grilla
- **THEN** la segunda fila ocupa exactamente el 40% de la altura del contenedor principal
- **THEN** se muestran dos módulos de imagen equitativos (50% de ancho cada uno)
- **THEN** cada imagen tiene texto sobrepuesto en la esquina inferior izquierda indicando el nombre del producto.
