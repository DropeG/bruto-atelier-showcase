## Context

`src/components/CollectionShowcase.tsx` es el componente compartido por las colecciones `CUORO` y `COSMOS`. En el visor *stage* actual, al hacer clic en el botón `+` se ejecuta inmediatamente `handleAddToCart()`. En cambio, `WachiCollection.tsx` implementa el patrón inspirado en Yeezy donde el título del producto se reemplaza por un encabezado de selección con un botón `X` (`.wachi-stage__title-row` y `.wachi-stage__close-sizes`) y se oculta la descripción editorial mientras el selector está abierto.

Para el **Anillo Cosmos**, el usuario requiere este mismo patrón de Yeezy pero adaptado a **selección de color**: al presionar `+`, el título cambia a `SELECCIONAR COLOR` (con `×` a la derecha para cerrar), se oculta la descripción y debajo del precio aparecen dos círculos (`Blanco` y `Negro`). Al hacer clic en cada círculo, la imagen del anillo en el escenario cambia automáticamente al anillo del color seleccionado, y el botón `+` agrega la variante correspondiente a la bolsa.

## Goals / Non-Goals

**Goals:**
- Incorporar `public/images/shopify-demo/joyeria/anillo-negro-fondo-blanco.webp` (`896x896`) y generar sus variantes responsivas en `public/images/catalog-optimized/` y `src/data/catalog-images.json`.
- Extender `CollectionPiece` con una propiedad opcional `colors?: readonly CollectionColorOption[]` que defina cada color (`id`, `label`, `swatch`, `variantTitle`, `description?`, `perspectives`).
- Cuando una pieza define `colors`, hacer que el primer clic en `+` abra el selector de color estilo Yeezy (`SELECCIONAR COLOR` + botón `×` + círculos de color debajo del precio).
- Actualizar en vivo las perspectivas del *stage* al hacer clic en cualquiera de los círculos de color, pre-cargando todas las imágenes de color al abrir la pieza para evitar parpadeos.
- Resolver la variante de Shopify (`activeVariant`) según el color seleccionado para que al confirmar con `+` se agregue la variante correcta (`Blanco` o `Negro`) con su foto correspondiente en la bolsa.

**Non-Goals:**
- Selector de tallas numéricas o guía de tallas (`?`).
- Alterar el comportamiento de `CUORO` (donde las piezas no tienen `colors` y el clic en `+` sigue agregando directamente a la bolsa) ni el flujo de `WACHI`.

## Decisions

1. **Modelo de `CollectionColorOption` en `CollectionShowcase.tsx`:**
   - Cada opción de color tendrá `{ id: string; label: string; swatch: string; variantTitle?: string; description?: string; perspectives: readonly CollectionPerspective[] }`.
   - *Racional:* Permite que cada color tenga su propio conjunto de perspectivas (3 perspectivas para el anillo blanco, 1 perspectiva en fondo blanco para el anillo negro) y se vincule limpiamente con la variante de Shopify por `variantTitle` o índice.
2. **Interacción del botón `+` y los círculos de color (Patrón Yeezy):**
   - Estado inicial del *stage*: muestra título (`Anillo Cosmos`), descripción, precio y botón `+`.
   - Al presionar `+` cuando `isColorPickerOpen === false`: se abre el selector (`setIsColorPickerOpen(true)`). La fila superior muestra `SELECCIONAR COLOR` centrado y el botón `×` (`.wachi-stage__close-sizes`) a la derecha; se oculta la descripción; debajo del precio aparecen los dos círculos (`.wachi-stage__color-swatches`) y debajo el botón `+` para confirmar y agregar a la bolsa.
   - Al hacer clic en el círculo blanco o en el círculo negro: cambia `selectedColorId` inmediatamente, actualizando la imagen del anillo en `.wachi-stage__media` y reiniciando `perspectiveIndex` a `0` si el índice actual excede las perspectivas del nuevo color.
   - Al presionar `+` con `isColorPickerOpen === true`: agrega a la bolsa la variante del color actualmente seleccionado (`handleAddToCart()`).
3. ** Contraste visual de los círculos sobre fondo blanco:**
   - El círculo blanco (`#ffffff`) tendrá un borde sutil (`1px solid #c8c5be`) y el negro (`#171715`) borde `#171715`. El color activo mostrará un anillo exterior de selección (`outline` o `box-shadow` con separación blanca de `2px` y borde `#171715`) para que el usuario distinga claramente cuál está activo sin importar si es blanco o negro.

## Risks / Trade-offs

- **[Risk] Parpadeo al cambiar entre el anillo blanco y el anillo negro por primera vez** → **Mitigation:** `preloadPiecePerspectives` e `isGridReady` incluirán todas las perspectivas de todas las opciones en `piece.colors`, garantizando que `anillo-negro-fondo-blanco.webp` ya esté decodificado en caché antes de que el usuario toque el círculo negro.
- **[Risk] El nuevo color tiene menos perspectivas que el índice activo actual** → **Mitigation:** Al cambiar de color, ajustar `perspectiveIndex` a `0` para mostrar siempre la vista principal del nuevo color.
