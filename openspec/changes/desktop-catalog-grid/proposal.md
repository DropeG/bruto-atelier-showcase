## Why

Actualmente se está trabajando en una galería comprable (Catálogo). Para la vista de escritorio (Desktop), se requiere implementar una disposición en formato de grilla irregular y estética editorial, inspirada en marcas de lujo, para exhibir los productos de forma altamente atractiva y asimétrica. El objetivo es visualizar la maqueta en la aplicación para validar el look & feel del catálogo en pantallas grandes.

## What Changes

- Implementación de un nuevo layout tipo grilla (Grid View) asimétrica exclusivo para resolución Desktop.
- La grilla consta de una fila superior dividida (imagen destacada vs bloque de color sólido con información del producto y precio) y una fila inferior dividida equitativamente para exhibir otros productos con imágenes full-bleed y texto superpuesto.
- Esta vista es únicamente de demostración visual (Showcase/Mockup) para validar el diseño, por lo que los productos mostrados pueden ser estáticos o mockups por el momento.

## Capabilities

### New Capabilities
- `desktop-catalog-grid`: Vista de grilla asimétrica y editorial para el catálogo de productos en Desktop.

### Modified Capabilities

## Impact

- **Frontend/UI**: Se creará un nuevo componente para la grilla o se añadirá a la vista de catálogo actual para Desktop.
- No afecta lógica de negocio profunda ni APIs de Shopify por el momento, ya que la meta principal es el layout visual.
