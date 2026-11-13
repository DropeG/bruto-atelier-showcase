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

### Requirement: Selector de color estilo Yeezy en el visor stage de Anillo Cosmos
El visor *stage* de la pieza **Anillo Cosmos** en `/coleccion/cosmos` SHALL presentar un selector de color minimalista inspirado en Yeezy cuando el usuario presiona el botón `+`. Al abrirse el selector, el título de la pieza SHALL reemplazarse por `SELECCIONAR COLOR` acompañado de un botón de cierre (`×`) a la derecha, la descripción editorial SHALL ocultarse y debajo del precio SHALL mostrarse dos círculos de color (**Blanco** y **Negro**).

#### Scenario: Apertura del selector de color al presionar el botón más
- **WHEN** el usuario está viendo el **Anillo Cosmos** en el visor *stage* y presiona el botón `+` con el selector cerrado
- **THEN** el encabezado cambia a `SELECCIONAR COLOR` junto con el botón `×` de cierre, se oculta la descripción de la pieza y aparecen debajo del precio dos círculos de selección de color (uno blanco y otro negro)

#### Scenario: Cambio automático de la imagen del anillo al seleccionar cada círculo de color
- **WHEN** el usuario hace clic en el círculo negro dentro del selector de color
- **THEN** el visor *stage* muestra inmediatamente la imagen del anillo negro en fondo blanco (`anillo-negro-fondo-blanco.webp`)
- **WHEN** el usuario hace clic en el círculo blanco dentro del selector de color
- **THEN** el visor *stage* muestra inmediatamente la imagen del anillo blanco en fondo blanco (`anillo-fondo-blanco.webp`)

#### Scenario: Agregar a la bolsa la variante del color seleccionado y cierre del selector
- **WHEN** el selector de color está abierto y el usuario presiona el botón `+`
- **THEN** se agrega a la bolsa de compras la variante correspondiente al color activo (**Blanco** o **Negro**) con su imagen y título de variante respectivos
- **WHEN** el usuario presiona el botón `×` o la tecla `Escape` mientras el selector de color está abierto
- **THEN** se cierra el selector de color y vuelve a mostrarse el nombre de la pieza y su descripción
