## ADDED Requirements

### Requirement: Non-intrusive add to cart in CUORO
Al presionar el botón `+` en la vista de detalle de cualquier producto de CUORO, el sistema SHALL agregar 1 unidad de la variante activa al carrito de Shopify sin abrir automáticamente el `CartDrawer` ni redirigir al checkout.

#### Scenario: Adding a product keeps user on product stage
- **WHEN** el usuario está en la vista de detalle de un producto en CUORO y presiona el botón `+`
- **THEN** el sistema envía la mutación `addToCart` con cantidad `1`
- **AND** `isCartOpen` permanece en `false`
- **AND** el usuario permanece en la vista de detalle del mismo producto

#### Scenario: Bag counter increments on successful add
- **WHEN** `addToCart` finaliza exitosamente (`ok: true`)
- **THEN** el contador de la bolsa en el header (`cart.totalQuantity`) se incrementa en `1`
- **AND** si el carrito estaba vacío (`0`), el contador aparece mostrando `1`

#### Scenario: Opening cart remains manual
- **WHEN** el usuario desea revisar su bolsa o ir al checkout después de agregar productos
- **THEN** al hacer clic en el ícono de la bolsa en el header se abre el `CartDrawer` con los productos acumulados

### Requirement: Noticeable visual confirmation on add to cart
El sistema SHALL proveer una confirmación visual claramente perceptible tanto en el botón `+` como en el ícono/contador de la bolsa del header al agregar un producto exitosamente.

#### Scenario: Button transitions through adding and confirmed states
- **WHEN** el usuario presiona `+` y la mutación está en curso
- **THEN** el botón muestra un estado visual de carga y previene envíos duplicados simultáneos
- **WHEN** la mutación se completa con éxito
- **THEN** el botón transiciona con animación a un estado confirmado (`<Check />` con pulso visual) durante aproximadamente 1.4 segundos antes de volver a `+`

#### Scenario: Header bag animates when item is added
- **WHEN** el producto se agrega exitosamente al carrito
- **THEN** el ícono de la bolsa y el contador numérico en el header ejecutan una animación de énfasis perceptible (escala/pulso) para indicar visualmente dónde se sumó la unidad

#### Scenario: Failed add to cart does not show false confirmation
- **WHEN** `addToCart` falla (`ok: false`)
- **THEN** el sistema NO muestra la animación de confirmación ni incrementa el contador
- **AND** comunica brevemente que no se pudo agregar la pieza

#### Scenario: Accessible status announcement
- **WHEN** un producto se agrega exitosamente al carrito
- **THEN** una región `aria-live="polite"` anuncia la adición y la cantidad total en la bolsa
