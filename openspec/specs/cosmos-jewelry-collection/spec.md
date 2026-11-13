## ADDED Requirements

### Requirement: Ruta y vista de colección COSMOS
El sistema SHALL exponer la ruta `/coleccion/cosmos` renderizando la colección **COSMOS** de Joyería mediante un componente compartido reutilizable con **CUORO**, mostrando el encabezado editorial (`Colección` / `COSMOS`), la grilla de piezas y el visor *stage* interactivo con 3 perspectivas, precio en CLP y botón de agregar a la bolsa.

#### Scenario: Navegación a `/coleccion/cosmos` y apertura del anillo
- **WHEN** el usuario navega a `/coleccion/cosmos`
- **THEN** visualiza el título `Colección` / `COSMOS` y la pieza inicial del anillo en su grilla, y al seleccionarla se abre el visor *stage* con sus 3 perspectivas navegables por flechas, indicadores y teclado (`ArrowLeft`, `ArrowRight`, `Escape`)

#### Scenario: Extensibilidad para futuras piezas de joyería
- **WHEN** se agreguen nuevas piezas al arreglo de productos de `CosmosCollection`
- **THEN** la grilla y el visor *stage* las renderizan automáticamente sin duplicar lógica de layout, animaciones ni carrito

### Requirement: Redirección desde `/joyeria` y retiro de Próximamente
La categoría Joyería SHALL dejar de mostrarse como "Próximamente" y cualquier acceso a `/joyeria` SHALL redirigir a `/coleccion/cosmos`.

#### Scenario: Acceso a ruta heredada `/joyeria`
- **WHEN** el usuario navega a `/joyeria`
- **THEN** es redirigido a `/coleccion/cosmos` en lugar de ver `ComingSoonView`

#### Scenario: Exclusión de Joyería en Next Season
- **WHEN** el usuario abre el carrusel de `Next Season` en el menú
- **THEN** `JOYERÍA` ya no aparece como categoría futura junto a `VESTUARIO`, `ILUMINACIÓN` y `ESENCIALES`
