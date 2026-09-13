## ADDED Requirements

### Requirement: Layout Asimétrico Principal (Desktop)
El sistema SHALL mostrar un layout tipo grilla asimétrica en pantallas grandes (Desktop). La vista MUST estar dividida en dos filas principales (Hero y Secundaria).

#### Scenario: Visualización del bloque superior (Hero)
- **WHEN** el usuario navega a la vista de catálogo en un dispositivo Desktop
- **THEN** la primera fila ocupa la mayor parte de la pantalla
- **THEN** la mitad izquierda muestra una imagen de producto principal
- **THEN** la mitad derecha muestra un bloque de color sólido con el nombre del producto, materiales, precio y un enlace para ver más.

#### Scenario: Visualización del bloque inferior (Secundaria)
- **WHEN** el usuario hace scroll o ve la parte inferior de la grilla
- **THEN** se muestran dos módulos de imagen equitativos (50% de ancho cada uno)
- **THEN** cada imagen tiene texto sobrepuesto en la esquina inferior izquierda indicando el nombre del producto.

### Requirement: Estilo Editorial Premium
El componente SHALL adherirse a las directrices de estilo premium (colores cálidos/neutros, tipografía serif para títulos y sans-serif para meta-datos).

#### Scenario: Colores y tipografías
- **WHEN** la grilla es renderizada
- **THEN** el bloque de texto superior derecho utiliza un color de fondo cálido (ej. marrón claro / arena)
- **THEN** el texto utiliza colores contrastantes (blanco/crema) para asegurar legibilidad manteniendo un look sofisticado.
