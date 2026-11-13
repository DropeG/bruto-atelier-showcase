## 1. Optimización y Registro de Activos del Anillo Negro

- [x] 1.1 Copiar la imagen optimizada `anillo-negro-fondo-blanco.webp` (`896x896`) a `public/images/shopify-demo/joyeria/anillo-negro-fondo-blanco.webp`.
- [x] 1.2 Agregar `anillo-negro-fondo-blanco` a `scripts/generate-catalog-images.mjs` y ejecutar el script para generar las variantes responsivas (`480w`, `800w`, `896w`) en `public/images/catalog-optimized/` y actualizar `src/data/catalog-images.json`.
- [x] 1.3 Actualizar `src/lib/shopify/mockData.ts` en `anillo-cosmos` para definir `optionName: 'Color'` y las dos variantes (`Blanco` y `Negro`) vinculadas a sus imágenes respectivas en fondo blanco.

## 2. Selector de Color Estilo Yeezy en `CollectionShowcase` y `CosmosCollection`

- [x] 2.1 Extender `CollectionPiece` en `src/components/CollectionShowcase.tsx` con `colors?: readonly CollectionColorOption[]` y soportar el estado de selector de color (`isColorPickerOpen`, `selectedColorId`), precargando todas las perspectivas de cada color.
- [x] 2.2 Implementar en `src/components/CollectionShowcase.tsx` la transición al hacer clic en `+`: abrir `SELECCIONAR COLOR` con el botón `×` de cierre a la derecha (`.wachi-stage__title-row`), ocultar la descripción editorial y renderizar los dos círculos de color (**Blanco** y **Negro**) debajo del precio con cambio de imagen en vivo y confirmación de compra con `+`.
- [x] 2.3 Agregar los estilos de `.wachi-stage__colors` y `.wachi-stage__color-swatch` en `src/styles/wachi-collection.css` (círculos minimalistas con borde contrastado para el blanco, anillo de selección activo y transiciones suaves).
- [x] 2.4 Configurar las opciones `Blanco` y `Negro` en `src/pages/CosmosCollection.tsx` con sus perspectivas e imágenes en fondo blanco.

## 3. Verificación y Pruebas

- [x] 3.1 Añadir pruebas unitarias/integración verificando que en `/coleccion/cosmos` al hacer clic en `+` se despliegue `SELECCIONAR COLOR` con los círculos blanco y negro, que al pulsar cada círculo cambie la imagen del anillo en el *stage*, y que `npm test` y `npm run build` pasen sin errores.
