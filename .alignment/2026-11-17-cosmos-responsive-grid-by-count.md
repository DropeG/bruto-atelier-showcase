# Alineación Validada: Grilla responsiva adaptativa por cantidad de productos (COSMOS y colecciones compartidas)

- **Fecha:** 2026-11-17
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Hacer que la vista de grilla de colecciones (empezando por **COSMOS** en dispositivo móvil) adapte su tamaño, proporción y distribución según la cantidad de productos existentes (`1`, `2`, `3`, `4+`). Con esto se elimina el exceso de espacio vacío debajo del Anillo Cosmos cuando hay una sola pieza y se garantiza que, al agregar un segundo, tercer o más productos en el futuro, el espacio siga aprovechándose de forma equilibrada.

## 2. Contexto del Proyecto
- `src/pages/CosmosCollection.tsx` renderiza `CollectionShowcase` (`src/components/CollectionShowcase.tsx`) con `className="accessories-collection cosmos-collection"`.
- Actualmente en móvil (`@media (max-width: 850px)` y `<= 700px` en `src/styles/wachi-collection.css` y `src/styles/accessories-collection.css`):
  - `.wachi-collection__content` pierde el centrado vertical (`min-height: auto; padding-top: 2rem;`).
  - `.wachi-collection__grid--single` limita el ancho a `minmax(0, 260px)` y la imagen queda en `42vw` (~160px), dejando la mitad inferior de la pantalla vacía.
  - `.accessories-collection .wachi-collection__piece:last-child` fuerza `grid-column: 1 / -1; width: calc(50% - .75rem); justify-self: center;` pensado únicamente para 3 ítems, lo que descuadra grillas de 2 o 4 ítems.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Ajuste responsivo por cantidad de piezas (`1`, `2`, `3`, `4+`) en la grilla de `CollectionShowcase` / `COSMOS`.
- En móvil con 1 pieza: mayor presencia visual (imagen más grande/protagónica) y mejor aprovechamiento vertical en la pantalla.
- Con 2, 3 o 4+ piezas: distribución limpia y proporcional sin romper `AccessoriesCollection` (3 piezas) ni `WACHI` (4 piezas).

### ❌ No Entra (Non-Goals / Anti-Goals)
- Rediseñar la vista de detalle del producto (stage al hacer clic en una pieza).
- Modificar el header, wordmark o carrito/bolsa.
- Cambiar el catálogo o integración con Shopify.

## 4. Decisiones y Supuestos Aprobados
- Mantener la estética minimalista editorial (espacio limpio, sin tarjetas con bordes ni precios en la grilla), escalando únicamente la presencia visual de las piezas y su centrado vertical según el conteo (`1`, `2`, `3`, `4+`).
- Aplicar la lógica basada en cantidad de ítems de forma reutilizable para colecciones tipo `accessories-collection` / `cosmos` sin alterar el layout actual de 4 piezas de `WACHI`.

## 5. Notas para la Etapa de Propuesta
- Respetar el layout de 4 piezas de `WachiCollection` y el de 3 piezas de `AccessoriesCollection`.
- Considerar la regla global de control de versiones: no ejecutar `git add`, `git commit` ni `git push`.
