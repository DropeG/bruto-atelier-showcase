## 1. Exposición de conteo y paridad en CollectionShowcase

- [x] 1.1 Agregar `data-piece-count={pieces.length}` y `data-piece-parity={pieces.length % 2 === 0 ? 'even' : 'odd'}` al contenedor `.wachi-collection__content` y `.wachi-collection__grid` en `src/components/CollectionShowcase.tsx`.

## 2. Estilos responsivos adaptativos por cantidad en accessories-collection.css

- [x] 2.1 En `src/styles/accessories-collection.css` (desktop `> 700px`), agregar regla para `.wachi-collection__grid[data-piece-count="2"]` con `grid-template-columns: repeat(2, minmax(0, 420px))` y `justify-content: center`.
- [x] 2.2 En `src/styles/accessories-collection.css` (móvil `<= 700px`), centrar verticalmente `.accessories-collection .wachi-collection__content` cuando `data-piece-count="1"` o `data-piece-count="2"` usando `min-height: calc(100dvh - 5.5rem)` y `justify-content: center` con padding seguro.
- [x] 2.3 En `src/styles/accessories-collection.css` (móvil `<= 700px`), ajustar `.wachi-collection__grid[data-piece-count="1"]` para ampliar la columna única (`minmax(0, min(84vw, 380px))`) y aumentar `.wachi-collection__image` (`clamp(250px, 42dvh, 380px)`), asegurando que la imagen de grilla de Anillo Cosmos no quede encogida innecesariamente.
- [x] 2.4 En `src/styles/accessories-collection.css` (móvil `<= 700px`), ajustar `.wachi-collection__grid[data-piece-count="2"]` para distribuir 2 piezas equilibradas (2 columnas amplias con altura `clamp(190px, 34dvh, 280px)`) sin aplicar el salto de fila completa a `:last-child`.
- [x] 2.5 Reemplazar la regla genérica `.wachi-collection__piece:last-child` en móvil por `.wachi-collection__grid[data-piece-parity="odd"]:not([data-piece-count="1"]) .wachi-collection__piece:last-child` para que solo las grillas impares de 3, 5, ... piezas centren la última pieza en una fila aparte, dejando las grillas pares (`2`, `4`, `6`, ...) simétricas.

## 3. Verificación y pruebas

- [x] 3.1 Actualizar o agregar pruebas en `src/pages/CosmosCollection.test.tsx` verificando los atributos `data-piece-count` y `data-piece-parity` para 1 pieza (y simulando múltiples piezas en `CollectionShowcase` si aplica).
- [x] 3.2 Ejecutar la suite de tests (`npm test` / `vitest`) y confirmar que `CosmosCollection.test.tsx` y `CollectionVerticalScroll.test.tsx` pasan sin regresiones.
