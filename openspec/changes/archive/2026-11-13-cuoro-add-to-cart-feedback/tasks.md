## 1. Desacoplar apertura automática del CartDrawer en ShopifyContext

- [x] 1.1 Actualizar la firma de `addToCart` en `src/contexts/ShopifyContext.tsx` para aceptar `options?: { openDrawer?: boolean }` (por defecto `false`) y solo ejecutar `setIsCartOpen(true)` cuando `options?.openDrawer` sea `true`.

## 2. Feedback visual sincronizado en CUORO (`AccessoriesCollection.tsx`)

- [x] 2.1 Agregar estado local de feedback en `src/pages/AccessoriesCollection.tsx` (`addStatus: 'idle' | 'adding' | 'added' | 'error'` y `bagPulseKey: number`) con limpieza segura del timeout al desmontar o cambiar de pieza.
- [x] 2.2 Actualizar el manejador de clic del botón `+` (`wachi-stage__add`) para esperar el resultado de `addToCart(activeVariantId, 1)`, pasar a `added` e incrementar `bagPulseKey` solo si `result.ok`, o mostrar estado `error` breve si falla.
- [x] 2.3 Implementar la transición animada del botón `+` con Framer Motion (`<Plus />` → indicador de carga sutil → `<Check />` con pulso visual) manteniendo el botón utilizable para agregar más unidades tras la confirmación.
- [x] 2.4 Animar el ícono de la bolsa y el contador (`wachi-collection__bag` y `wachi-collection__bag-count`) en el header usando `bagPulseKey` para generar un pulso/pop claramente perceptible cuando sube el contador.
- [x] 2.5 Añadir una región `aria-live="polite"` para anunciar el producto agregado y el total en la bolsa, más feedback discreto en caso de error.

## 3. Estilos y accesibilidad de movimiento (`wachi-collection.css`)

- [x] 3.1 Añadir estilos en `src/styles/wachi-collection.css` para los estados `.wachi-stage__add--adding`, `.wachi-stage__add--added`, el halo/pulso en `.wachi-collection__bag` y el mensaje de error discreto bajo el botón.
- [x] 3.2 Respetar `@media (prefers-reduced-motion: reduce)` en las nuevas animaciones CSS.

## 4. Verificación

- [x] 4.1 Ejecutar build/typecheck del proyecto (`npm run build` o equivalente) y verificar manualmente en `/cuoro` que al presionar `+`: (a) no se abre `CartDrawer`, (b) el contador sube `+1`, (c) la animación de botón y bolsa se percibe claramente, y (d) el clic en la bolsa abre `CartDrawer` con los productos acumulados.
