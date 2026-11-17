## Why

En la colección **COSMOS** (`/coleccion/cosmos`), cuando existe un único producto (actualmente el **Anillo Cosmos**), la vista móvil deja un gran espacio vacío en la mitad inferior de la pantalla porque la grilla limita la pieza a un ancho máximo de `260px` y una altura de imagen de `42vw` (~160px) sin centrado vertical en el viewport. Además, las reglas actuales de `accessories-collection.css` asumen exactamente 3 productos en móvil mediante `:last-child`, lo cual desalinearía la grilla si **COSMOS** pasa a tener 2 o 4+ piezas en el futuro.

## What Changes

- Adaptar la grilla de colecciones compartidas (`CollectionShowcase` / `accessories-collection`) en función de la cantidad de productos (`1`, `2`, `3`, `4+`) mediante un atributo o modificador explícito de conteo en el contenedor de la grilla.
- En móvil con **1 producto**: aumentar el protagonismo visual de la pieza (imagen y columna más amplias) y centrar verticalmente el contenido dentro del viewport disponible para eliminar el espacio vacío inferior.
- En móvil con **2 productos**: distribuir ambas piezas de forma equilibrada y centrada verticalmente sin que la segunda pieza ocupe fila completa.
- En móvil con **3 productos** (como **CUORO** / `AccessoriesCollection`): preservar el layout actual de 2 columnas arriba + 1 pieza centrada abajo.
- En móvil con **4+ productos**: usar grilla uniforme de 2 columnas sin forzar el centrado de fila completa en el último elemento cuando la cantidad es par.
- Mantener intactos el layout de 4 piezas de **WACHI**, la vista *stage* de detalle y la estética editorial minimalista (sin tarjetas con bordes ni precios en la grilla).

## Capabilities

### New Capabilities
- `collection-count-adaptive-grid`: Reglas de layout y escala responsiva basadas en la cantidad de piezas (`1`, `2`, `3`, `4+`) en `CollectionShowcase` y sus hojas de estilo asociadas.

### Modified Capabilities
- `cosmos-jewelry-collection`: Se extiende el comportamiento de la grilla de **COSMOS** (y colecciones compartidas con `accessories-collection`) para adaptar tamaño, centrado vertical y distribución de columnas según el número de productos en móvil y escritorio.

## Impact

- `src/components/CollectionShowcase.tsx` (exposición del conteo o modificadores de cantidad en la grilla/contenido)
- `src/styles/accessories-collection.css` (reglas responsivas por cantidad para colecciones tipo `accessories-collection` / `cosmos-collection`)
- `src/styles/wachi-collection.css` (ajustes puntuales de centrado vertical en móvil cuando corresponda sin alterar `WACHI`)
- Pruebas unitarias/DOM existentes en `src/pages/CosmosCollection.test.tsx` o nuevas aserciones de clase/atributo de conteo.
