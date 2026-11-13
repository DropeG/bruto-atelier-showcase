## Context

En la colección **CUORO** (`src/pages/AccessoriesCollection.tsx`), cada producto se visualiza en una vista de detalle (`wachi-stage`) con un botón `+` (`wachi-stage__add`) que llama a `addToCart(activeVariantId, 1)` provisto por `ShopifyContext.tsx`.

Actualmente, `ShopifyContext.tsx` ejecuta `if (saved.ok) setIsCartOpen(true)` al finalizar `addToCart`, lo que abre automáticamente el `CartDrawer` (bolsa y formulario de checkout). Esto rompe el flujo de exploración del usuario, quien espera que `+` sume 1 unidad al carrito silenciosamente y le dé una confirmación visual clara sin sacarlo de la ficha del producto.

## Goals / Non-Goals

**Goals:**
- Evitar que `addToCart` abra el `CartDrawer` automáticamente al agregar un producto desde CUORO.
- Mantener al usuario en la vista de detalle del producto tras presionar `+`, actualizando `cart.totalQuantity` en el header.
- Proveer una animación de confirmación claramente perceptible en dos puntos sincronizados (botón `+` → ícono/contador de bolsa en el header), siguiendo estándares profesionales de e-commerce editorial.
- Manejar correctamente estados de carga (`mutating`), clics repetidos, errores de red/API y `prefers-reduced-motion`.

**Non-Goals:**
- Modificar el diseño interno o comportamiento de checkout dentro de `CartDrawer.tsx`.
- Implementar una animación de "imagen volando hacia el carrito" (fly-to-cart), ya que la fotografía ocupa gran parte del viewport y un vuelo de imagen resulta invasivo en estética minimalista.
- Cambiar otras colecciones como WACHI (que no invocan `addToCart`).

## Decisions

1. **Parámetro opcional `openDrawer` en `addToCart` (default `false`)**
   - *Decisión:* Cambiar la firma en `ShopifyContext.tsx` a `addToCart(merchandiseId: string, quantity = 1, options?: { openDrawer?: boolean })` y solo llamar `setIsCartOpen(true)` si `options?.openDrawer` es `true`.
   - *Alternativa considerada:* Crear una segunda función `addToCartSilent`. Se descartó para no duplicar lógica de cola de mutaciones y recuperación de `CART_EXPIRED`; además `AccessoriesCollection.tsx` es actualmente el único consumidor de `addToCart` en toda la app.

2. **Feedback sincronizado en dos puntos (Botón `+` + Bolsa del Header)**
   - *Decisión:* Combinar dos micro-interacciones coordinadas con Framer Motion y CSS:
     1. **En el botón (`wachi-stage__add`)**: Durante la petición a Shopify entra en estado de carga (`adding`, bloqueando doble envío accidental). Al resolverse con `result.ok`, transiciona con `AnimatePresence` a un estado confirmado (`added`) mostrando el ícono `<Check />` dentro de un pulso circular sutil (`#171715`) durante ~1.4s antes de regresar a `<Plus />`.
     2. **En la bolsa del header (`wachi-collection__bag`)**: Al incrementarse `cart.totalQuantity`, el ícono `<ShoppingBag />` realiza un ligero rebote vertical (`y: [0, -3, 0]`), el contador `wachi-collection__bag-count` hace un *pop* con spring (`scale: [1, 1.35, 1]`) y un halo sutil (`box-shadow` / ring fade-out) llama la atención hacia la esquina superior derecha.
   - *Alternativa considerada:* Mostrar un toast flotante genérico en la esquina inferior. Se descartó porque los toasts compiten con la tipografía limpia de la ficha y no dirigen la mirada hacia el contador de la bolsa.

3. **Protección ante errores y accesibilidad**
   - *Decisión:* Solo disparar la animación de confirmación cuando `addToCart` retorne `{ ok: true }`. Si falla, mostrar un mensaje breve y discreto bajo el botón y mantener el contador intacto. Añadir un contenedor `aria-live="polite"` para lectores de pantalla y respetar `prefers-reduced-motion`.

## Risks / Trade-offs

- **Latencia de red con Shopify Storefront API** → *Mitigación:* Mostrar estado visual inmediato de carga (`adding`) en el botón `+` apenas se presiona, para que el usuario perciba respuesta instantánea incluso antes de que responda la API (generalmente 200–500ms).
- **Clics rápidos consecutivos para agregar múltiples unidades** → *Mitigación:* `ShopifyContext` ya serializa mutaciones con `mutationQueue`. Deshabilitar el botón brevemente solo mientras `isAdding` está activo (no durante los 1.4s de animación `added`), o permitir que un nuevo clic durante `added` reinicie el ciclo y sume otra unidad. Se optará por bloquear solo durante la petición en vuelo y permitir volver a sumar apenas termine.
