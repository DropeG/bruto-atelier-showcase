# Alineación Validada: Flujo de Agregar al Carrito en CUORO

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Que al presionar el botón `+` en cualquier producto de la sección **CUORO**, la pieza se agregue al carrito (`+1` en el contador de la bolsa) sin abrir automáticamente la vista de carrito/checkout (`CartDrawer`), permitiendo al usuario continuar navegando y sumando piezas. Además, la confirmación visual al agregar debe ser claramente perceptible para que el usuario tenga certeza inmediata de que el producto fue añadido.

## 2. Contexto del Proyecto
- En `src/pages/AccessoriesCollection.tsx` (sección CUORO), el botón `+` (`wachi-stage__add`) invoca `addToCart(activeVariantId, 1)` de `src/contexts/ShopifyContext.tsx`.
- Actualmente `ShopifyContext.tsx` ejecuta `if (saved.ok) setIsCartOpen(true)`, abriendo `CartDrawer` automáticamente en cada clic de `+`.
- El header de `AccessoriesCollection.tsx` ya cuenta con un botón de bolsa (`onClick={openCart}`) y el contador `cart.totalQuantity` (`wachi-collection__bag-count`).

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Evitar que `addToCart` abra automáticamente `CartDrawer` al agregar desde CUORO.
- Mantener al usuario en la vista del producto tras presionar `+`.
- Actualizar el contador de la bolsa en el header (`+1`) y presentar una animación/feedback visual claramente perceptible en el botón y/o ícono de bolsa al confirmar la adición.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Rediseñar `CartDrawer` o el flujo de checkout en Shopify.
- Modificar otras colecciones como WACHI.

## 4. Decisiones y Supuestos Aprobados
- El usuario abrirá el carrito manualmente tocando el ícono de la bolsa en el header cuando desee revisar o pagar.
- El feedback visual al agregar debe ser notorio (ej. estado de confirmación en el botón `+` + pulso/animación en el ícono y contador de la bolsa) sin interrumpir la navegación ni romper la estética minimalista cálida de Bruto Atelier.

## 5. Notas para la Etapa de Propuesta
- Respetar el sistema de diseño existente (tokens/estilos en `src/styles/wachi-collection.css`, Framer Motion).
- Considerar accesibilidad (`aria-live`, estados disabled/loading durante la mutación, manejo de errores si falla Shopify).
