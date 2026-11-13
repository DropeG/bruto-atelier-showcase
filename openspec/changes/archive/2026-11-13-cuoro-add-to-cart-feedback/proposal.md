## Why

En la sección CUORO (`AccessoriesCollection.tsx`), al presionar el botón `+` de cualquier producto se ejecuta `addToCart`, lo cual abre inmediatamente el `CartDrawer` (vista de bolsa/checkout) mediante `setIsCartOpen(true)` en `ShopifyContext.tsx`. Esto interrumpe la exploración del catálogo cada vez que el usuario agrega una pieza; en su lugar, el comportamiento estándar en tiendas de lujo es sumar el ítem silenciosamente al carrito, mantener al usuario en la vista del producto y ofrecer una confirmación visual clara y perceptible de que la pieza fue añadida.

## What Changes

- Desactivar la apertura automática del `CartDrawer` al ejecutar `addToCart` (ya sea haciendo que `addToCart` no fuerce `setIsCartOpen(true)` o mediante una opción explícita que por defecto mantenga al usuario en la vista actual).
- Mantener la navegación del usuario en la vista de detalle del producto en CUORO después de presionar `+`.
- Incorporar una secuencia de feedback visual notoria y editorial al agregar al carrito:
  1. Estado de transición en el botón `+` (micro-feedback de carga durante la mutación y transición clara a un estado confirmado con ícono check / pulso visual y texto o indicador sutil durante ~1.4s antes de volver a `+`).
  2. Animación perceptible en el ícono de bolsa y su contador (`cart.totalQuantity`) en el header (ej. resalte/pop con spring en el número y pulso en el ícono de la bolsa) para dirigir la atención del usuario hacia donde se sumó la unidad.
  3. Anuncio accesible (`aria-live="polite"`) o manejo de estado de error si la mutación falla.

## Capabilities

### New Capabilities
- `cuoro-add-to-cart-feedback`: Flujo no intrusivo de "Agregar al carrito" en la colección CUORO con incremento inmediato del contador de bolsa y animación de confirmación claramente perceptible, sin redirección ni apertura automática del drawer de checkout.

### Modified Capabilities
<!-- No existing spec requirements are changing. -->

## Impact

- `src/contexts/ShopifyContext.tsx`: Comportamiento de `addToCart` respecto a `setIsCartOpen(true)`.
- `src/pages/AccessoriesCollection.tsx`: Estado de confirmación visual en el botón `+` (`wachi-stage__add`), animación del badge/ícono de bolsa en el header y región accesible `aria-live`.
- `src/styles/wachi-collection.css`: Estilos y keyframes/transiciones para los estados del botón `+` (loading, confirmed) y la animación del contador/bolsa.
