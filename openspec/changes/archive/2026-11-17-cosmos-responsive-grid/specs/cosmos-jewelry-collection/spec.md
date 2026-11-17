## MODIFIED Requirements

### Requirement: Ruta y vista de colección COSMOS
El sistema SHALL exponer la ruta `/coleccion/cosmos` renderizando la colección **COSMOS** de Joyería mediante un componente compartido reutilizable con **CUORO**, mostrando el encabezado editorial (`Colección` / `COSMOS`), la grilla de piezas adaptada responsivamente según la cantidad de productos (`1`, `2`, `3`, `4+`) y el visor *stage* interactivo con 3 perspectivas, precio en CLP y botón de agregar a la bolsa.

#### Scenario: Navegación a `/coleccion/cosmos` y apertura del anillo
- **WHEN** el usuario navega a `/coleccion/cosmos`
- **THEN** visualiza el título `Colección` / `COSMOS` y la pieza inicial del anillo en su grilla (dimensionada y centrada verticalmente para 1 pieza en móvil), y al seleccionarla se abre el visor *stage* con sus 3 perspectivas navegables por flechas, indicadores y teclado (`ArrowLeft`, `ArrowRight`, `Escape`)

#### Scenario: Extensibilidad para futuras piezas de joyería
- **WHEN** se agreguen nuevas piezas al arreglo de productos de `CosmosCollection`
- **THEN** la grilla adapta automáticamente su distribución de columnas, centrado y escala según el nuevo total de piezas, y el visor *stage* las renderiza sin duplicar lógica de layout, animaciones ni carrito
