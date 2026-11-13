## Why

La vista de checkout de la bolsa (`CartDrawer`) tiene espaciados verticales amplios que empujan el botón **FINALIZAR COMPRA** fuera de la pantalla en computadores estándar (~768px–900px de alto), obligando al usuario a hacer scroll para completar su compra. Ajustar su densidad vertical permite ver el formulario completo, el resumen y la acción principal en un solo vistazo sin perder la estética minimalista de Bruto Atelier.

## What Changes

- Compactar el layout vertical de `CartDrawer` en pantallas de computador (desktop/laptop) para que el header, las secciones **INFORMACIÓN DE CONTACTO** y **DIRECCIÓN DE DESPACHO**, **RESUMEN DE COMPRA** y el botón **FINALIZAR COMPRA** quepan completos dentro de `100dvh` sin scroll vertical cuando el carrito tiene 1 o pocos ítems.
- Mantener el fallback con scroll cuando la altura del viewport sea muy reducida o cuando la lista de ítems en el resumen crezca.
- Preservar sin regresiones el layout de `WachiRequestDrawer` (que comparte clases `.wachi-checkout`) y el comportamiento responsive en móvil.

## Capabilities

### New Capabilities
- `cart-checkout-single-screen`: Disposición de la vista de checkout de la bolsa en una sola pantalla (`100dvh`) en viewports de computador estándar, manteniendo visibilidad completa del formulario, resumen y botón de finalizar compra.

### Modified Capabilities
<!-- Ninguna capacidad existente cambia sus requisitos a nivel de especificación. -->

## Impact

- `src/components/CartDrawer.tsx`: Posible clase modificadora para diferenciar la densidad compacta del checkout de la bolsa frente a `WachiRequestDrawer`.
- `src/styles/wachi-collection.css`: Ajustes de espaciado, alturas de campos/botón, paddings y manejo de overflow en `.wachi-checkout` para desktop/laptop.
- `src/components/WachiRequestDrawer.tsx`: Sin cambios funcionales; se verifica que no sufra regresiones visuales al compartir `.wachi-checkout`.
