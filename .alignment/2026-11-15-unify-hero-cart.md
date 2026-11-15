# Alineación Validada: Unificar diseño, tamaño e integración del carrito del Hero en toda la tienda

- **Fecha:** 2026-11-15
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta / Aplicación)

## 1. Intención y Objetivo (El Qué y el Porqué)
Unificar el icono y el estado del carrito en toda la tienda usando el diseño `/bag.svg` del Hero conectado a `ShopifyContext`, asegurando que:
1. El carrito del Hero y el de las colecciones compartan estado (`cart?.totalQuantity` y `openCart`).
2. En la vista de **Resumen de Compra** (`CartDrawer`), no aparezcan los botones flotantes `-10%` ni `HABLEMOS`, ni tampoco el icono del carrito arriba a la derecha (ya que el usuario ya está viendo el resumen de compra).
3. El icono `/bag.svg` en las vistas de colecciones tenga el mismo tamaño y presencia visual que en el Hero, y en **mobile (celular)** sea aún más grande y con un área táctil amplia para que se vea claramente y sea muy fácil de tocar.

## 2. Contexto del Proyecto
- `src/pages/Index.tsx` y `src/components/CartDrawer.tsx`: `DiscountButton` y `WhatsAppButton` tienen `z-50`, igual que `CartDrawer`, por lo que se superponen cuando el carrito se abre desde el Home.
- `src/components/CartDrawer.tsx`: Renderiza un botón de carrito redundante en la esquina superior derecha del header del Resumen de Compra.
- `src/styles/wachi-collection.css` y `src/components/Navigation.tsx`: `/bag.svg` tiene un `viewBox="0 0 1024 1024"` donde el dibujo real ocupa ~33% del lienzo; en colecciones y en mobile requiere dimensiones mayores (`~58px–64px`) y un área de toque generosa (`min-width/min-height >= 48px`) para verse con la misma jerarquía que en el Hero y ser cómodo de pulsar en pantallas móviles.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Conectar el carrito del Hero (`Navigation.tsx`, desktop y mobile) a `useShopify()` (`openCart`, `cart?.totalQuantity`).
- Unificar `/bag.svg` en `Navigation.tsx`, `CollectionShowcase.tsx` y `WachiCollection.tsx`.
- Eliminar el icono/botón de carrito de la esquina superior derecha en `CartDrawer.tsx`.
- Ocultar `DiscountButton` (`-10%`) y `WhatsAppButton` (`HABLEMOS`) cuando `isCartOpen` es `true`, y subir `CartDrawer` a `z-[100]`.
- Aumentar el tamaño visual de `/bag.svg` en las vistas de colecciones (desktop y mobile) y en el Hero mobile para garantizar visibilidad y facilidad de clic/tap en celular.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Modificar la lógica de negocio de Shopify o el flujo de checkout.
- Alterar el comportamiento de `DiscountButton` o `WhatsAppButton` cuando el carrito está cerrado.

## 4. Decisiones y Supuestos Aprobados
- **Sin icono de bolsa en Resumen de Compra (`CartDrawer`):** Se elimina el botón superior derecho en `CartDrawer`, conservando la flecha izquierda (`<`) para cerrar/volver.
- **Tamaño y ergonomía táctil en Desktop y Mobile:**
  - En colecciones (`wachi-collection.css`), `.wachi-collection__bag-img` sube a `58px` en desktop y `64px` en mobile (`<= 767px`), con área de clic mínima de `48x48px`.
  - En el Hero (`Navigation.tsx`), el icono en mobile sube a `w-16 h-16` (`64px`) dentro de un botón con área táctil amplia para que sea muy visible y fácil de presionar.
