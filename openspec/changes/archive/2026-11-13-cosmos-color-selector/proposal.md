## Why

El **Anillo Cosmos** en `/coleccion/cosmos` cuenta ahora con dos variantes de piedra mineral (**Blanco** y **Negro**). Para mantener la estética minimalista inspirada en **Yeezy**, cuando el usuario presiona el botón `+` en la vista detallada (*stage*), en lugar de agregar directamente o mostrar tallas numéricas, debe desplegarse un selector de color con el encabezado `SELECCIONAR COLOR` y dos círculos cromáticos (blanco y negro) que actualicen en vivo la imagen del anillo en pantalla y permitan agregar la variante elegida a la bolsa.

## What Changes

- Incorporar la imagen optimizada del anillo negro en fondo blanco (`public/images/shopify-demo/joyeria/anillo-negro-fondo-blanco.webp`) y sus variantes responsivas (`480w`, `800w`, `896w`) en `public/images/catalog-optimized/` y `src/data/catalog-images.json`.
- Extender `CollectionPiece` en `src/components/CollectionShowcase.tsx` para admitir opciones de color (`colors`), donde cada opción define su identificador, nombre, color del círculo (`swatch`), título de variante en Shopify y perspectivas de imagen.
- Actualizar el *stage* de `CollectionShowcase.tsx` y sus estilos en `src/styles/wachi-collection.css` y `src/styles/accessories-collection.css` para que, cuando la pieza tenga `colors`:
  - Presionar `+` con el selector cerrado abra el modo `SELECCIONAR COLOR` (reemplazando el título de la pieza por `SELECCIONAR COLOR` con el botón `×` a la derecha y ocultando la descripción editorial).
  - Debajo del precio aparezcan los círculos de color (**Blanco** y **Negro**) al estilo Yeezy.
  - Hacer clic en el círculo blanco o negro cambie inmediatamente la imagen del anillo en el escenario (*stage*) a la variante seleccionada.
  - Con el selector abierto, presionar `+` agregue a la bolsa la variante del color activo (Blanco o Negro) y `×` (o `Escape`) cierre el selector.
- Actualizar `src/pages/CosmosCollection.tsx`, `src/lib/collection-images.ts` y `src/lib/shopify/mockData.ts` para registrar las variantes **Blanco** y **Negro** de `anillo-cosmos` con sus imágenes correspondientes.

## Capabilities

### New Capabilities

### Modified Capabilities
- `cosmos-jewelry-collection`: Agrega el requisito del selector de color estilo Yeezy (`SELECCIONAR COLOR` + círculos blanco y negro con cambio de imagen en vivo y selección de variante para el carrito) en el visor *stage* del Anillo Cosmos.

## Impact

- `public/images/shopify-demo/joyeria/anillo-negro-fondo-blanco.webp` y `public/images/catalog-optimized/`
- `scripts/generate-catalog-images.mjs` y `src/data/catalog-images.json`
- `src/components/CollectionShowcase.tsx`
- `src/pages/CosmosCollection.tsx`
- `src/lib/collection-images.ts`
- `src/lib/shopify/mockData.ts`
- `src/styles/wachi-collection.css` y `src/styles/accessories-collection.css`
