## MODIFIED Requirements

### Requirement: Selector de color estilo Yeezy en el visor stage de Anillo Cosmos
El visor *stage* de la pieza **Anillo Cosmos** en `/coleccion/cosmos` SHALL presentar un selector de color minimalista inspirado en Yeezy cuando el usuario presiona el botón `+`. Al abrirse el selector, el título de la pieza SHALL reemplazarse por `SELECCIONAR COLOR` acompañado de un botón de cierre (`×`) a la derecha, la descripción editorial SHALL ocultarse y debajo del precio SHALL mostrarse dos círculos de color (**Blanco** y **Negro**). Al cambiar de color, el visor *stage* SHALL conservar la misma perspectiva activa en el nuevo color (acotada al número de perspectivas disponibles).

#### Scenario: Apertura del selector de color al presionar el botón más
- **WHEN** el usuario está viendo el **Anillo Cosmos** en el visor *stage* y presiona el botón `+` con el selector cerrado
- **THEN** el encabezado cambia a `SELECCIONAR COLOR` junto con el botón `×` de cierre, se oculta la descripción de la pieza y aparecen debajo del precio dos círculos de selección de color (uno blanco y otro negro)

#### Scenario: Cambio automático de la imagen del anillo conservando la perspectiva activa
- **WHEN** el usuario está en la perspectiva 2 o 3 del anillo negro y hace clic en el círculo blanco
- **THEN** el visor *stage* muestra inmediatamente la misma perspectiva (2 o 3) del anillo blanco sin reiniciar a la perspectiva 1
- **WHEN** el usuario está en la perspectiva 2 o 3 del anillo blanco y hace clic en el círculo negro
- **THEN** el visor *stage* muestra inmediatamente la misma perspectiva (2 o 3) del anillo negro sin reiniciar a la perspectiva 1

#### Scenario: Agregar a la bolsa la variante del color seleccionado y cierre del selector
- **WHEN** el selector de color está abierto y el usuario presiona el botón `+`
- **THEN** se agrega a la bolsa de compras la variante correspondiente al color activo (**Blanco** o **Negro**) con su imagen y título de variante respectivos
- **WHEN** el usuario presiona el botón `×` o la tecla `Escape` mientras el selector de color está abierto
- **THEN** se cierra el selector de color y vuelve a mostrarse el nombre de la pieza y su descripción
