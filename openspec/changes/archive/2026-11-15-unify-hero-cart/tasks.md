## 1. Conectar el carrito del Hero (`Navigation.tsx`) y optimizar tamaño en Mobile

- [x] 1.1 Importar `useShopify` en `src/components/Navigation.tsx` y obtener `cart` y `openCart`.
- [x] 1.2 Conectar el botón del carrito en Desktop y Mobile a `onClick={openCart}`, actualizar el `aria-label` dinámico (`Abrir bolsa, X piezas`) y mostrar el contador `cart.totalQuantity` junto a `/bag.svg` cuando `totalQuantity > 0`.
- [x] 1.3 Aumentar el tamaño visual y área táctil del botón de carrito en `Navigation.tsx` (`w-14 h-14` en desktop, `w-16 h-16` con `min-w-[52px] min-h-[52px]` en mobile) para que en celular sea grande y fácil de tocar.

## 2. Unificar y escalar el icono (`/bag.svg`) en colecciones y limpiar Resumen de Compra

- [x] 2.1 Reemplazar `<ShoppingBag />` de `lucide-react` por `<img src="/bag.svg" ... />` en `src/components/CollectionShowcase.tsx`, conservando el contador y la animación de pulso al agregar productos.
- [x] 2.2 Reemplazar `<ShoppingBag />` de `lucide-react` por `<img src="/bag.svg" ... />` en `src/pages/WachiCollection.tsx`.
- [x] 2.3 Eliminar el botón/icono de carrito de la esquina superior derecha en `src/components/CartDrawer.tsx` y elevar el contenedor de `CartDrawer` a `z-[100]`.
- [x] 2.4 Ocultar `DiscountButton` (`-10%`) y `WhatsAppButton` (`HABLEMOS`) en `src/pages/Index.tsx` cuando `isCartOpen` sea `true`.
- [x] 2.5 Ajustar `.wachi-collection__bag` y `.wachi-collection__bag-img` en `src/styles/wachi-collection.css` (`58px` en desktop y `64px` en mobile con `height: auto` y `min-height: 48px`) para igualar el tamaño del Hero y mejorar el tap en mobile.

## 3. Verificación y Tests

- [x] 3.1 Actualizar y ejecutar la suite de tests (`CartDrawer.test.tsx`, `CosmosCollection.test.tsx`) verificando que `CartDrawer` no muestre el icono de bolsa redundante y que los botones de Hero y colecciones usen `/bag.svg` y estén sincronizados.
