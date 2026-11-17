## Context

`CollectionShowcase` (`src/components/CollectionShowcase.tsx`) renderiza tanto **CUORO** (`AccessoriesCollection.tsx`) como **COSMOS** (`CosmosCollection.tsx`) compartiendo `src/styles/wachi-collection.css` y `src/styles/accessories-collection.css`.
Actualmente:
- `CollectionShowcase` solo distingue `pieces.length === 1` mediante `.wachi-collection__grid--single`.
- En móvil (`<= 850px` / `<= 700px` / `<= 450px`):
  - `.wachi-collection__content` tiene `min-height: auto; padding-top: 2rem;` en `wachi-collection.css`, dejando el contenido pegado arriba.
  - `.accessories-collection .wachi-collection__grid--single` restringe el ancho a `260px` y `.wachi-collection__image` a `min(42vw, 260px)` (y `42vw` en `<= 450px`), lo que hace que 1 pieza se vea pequeña con gran espacio vacío debajo.
  - `.accessories-collection .wachi-collection__piece:last-child` aplica `grid-column: 1 / -1; width: calc(50% - .75rem); justify-self: center;` sin considerar si el total de piezas es par o impar, lo cual rompería grillas de 2 o 4 piezas.

## Goals / Non-Goals

**Goals:**
- Exponer el conteo de piezas en el DOM (`data-piece-count={pieces.length}` y/o modificadores por paridad/cantidad en `CollectionShowcase`) para que el CSS adapte el layout automáticamente al agregar o quitar productos.
- En `.accessories-collection` (móvil):
  - **1 pieza (`data-piece-count="1"`):** centrar verticalmente `.wachi-collection__content` en el viewport (`min-height` calculado con `100dvh` descontando el header), ampliar la columna única (ej. `minmax(0, min(84vw, 380px))`) y la altura de `.wachi-collection__image` (ej. `clamp(260px, 44dvh, 380px)`) para que la pieza sea protagonista sin desbordar ni dejar la mitad inferior vacía.
  - **2 piezas (`data-piece-count="2"`):** centrar verticalmente el contenido en el viewport, mostrar 2 columnas equilibradas (o 1 columna vertical / 2 columnas amplias según espacio) con altura de imagen generosa y sin que `:last-child` salte a fila completa.
  - **3 piezas (`data-piece-count="3"`):** mantener el comportamiento actual de 2 piezas arriba y la 3ª centrada abajo.
  - **4+ piezas:** grilla de 2 columnas uniforme; si el total es impar (`5`, `7`, ...), centrar únicamente la última pieza huérfana en `grid-column: 1 / -1`, y si es par (`4`, `6`, ...), mantener todas las filas simétricas de 2 columnas.
- En desktop (`> 700px`):
  - **1 pieza:** mantener centrado y proporción amplia.
  - **2 piezas:** usar `repeat(2, minmax(0, 420px))` centrado (`justify-content: center`) en lugar de 3 columnas con una columna vacía.
  - **3+ piezas:** mantener `repeat(3, minmax(0, 1fr))` con `max-width: 1260px`.

**Non-Goals:**
- Modificar `WachiCollection` (4 piezas) ni su scroll-snap en móvil.
- Alterar la vista *stage* de detalle de producto ni el selector de color de **COSMOS**.
- Introducir tarjetas con bordes, sombras o precios visibles en la grilla.

## Decisions

1. **Atributo `data-piece-count` en `.wachi-collection__grid` (y opcionalmente en `.wachi-collection__content`) en lugar de múltiples clases condicionales ad-hoc:**
   - *Por qué:* Permite selectores CSS explícitos para `1`, `2`, `3` y paridad (`data-piece-parity="odd" | "even"`) sin acoplar `CosmosCollection.tsx` ni `AccessoriesCollection.tsx` a estilos específicos por colección. Al agregar un segundo producto a `CosmosCollection.tsx`, el layout cambia automáticamente sin tocar CSS ni JSX.
   - *Alternativa descartada:* Clases específicas en `CosmosCollection.tsx` (ej. `.cosmos-collection--one`), porque requeriría editar código al sumar productos y no resolvería el caso genérico de 2 o 4+ piezas.

2. **Acotar el centrado vertical móvil y la escala por cantidad a `.accessories-collection`:**
   - *Por qué:* `WachiCollection` tiene 4 piezas fijas y reglas propias de `wachi-collection-flow` / `scroll-snap` en móvil. Acotar estos ajustes a `.accessories-collection` evita regresiones en `WACHI`.
   - *Alternativa descartada:* Cambiar `.wachi-collection__content` globalmente en `wachi-collection.css`, lo que afectaría el espaciado superior de `WACHI` en móvil.

3. **Ajuste de `.cosmos-stage__img--anillo` en grilla vs stage:**
   - *Por qué:* Hoy `.cosmos-stage__img--anillo { transform: scale(0.86); }` aplica en el stage, pero en la grilla la imagen ya tiene márgenes internos del WebP. Asegurar que la imagen en grilla use `width: 100%; height: 100%; object-fit: contain;` aprovecha todo el slot asignado.

## Risks / Trade-offs

- **[Risk] En pantallas móviles muy bajas (ej. iPhone SE `667px` de alto) con 1 o 2 piezas, un `min-height` fijo de `100dvh` o una imagen muy alta podría provocar scroll innecesario.** → **Mitigation:** Usar `clamp()` en la altura de imagen (`clamp(230px, 40dvh, 360px)`) y `min-height: calc(100dvh - 5.5rem)` con `padding-block: 1.5rem 2.5rem` para que quepa holgadamente en viewports pequeños y se centre en viewports altos.
- **[Risk] Regresión en `AccessoriesCollection` (CUORO, 3 piezas).** → **Mitigation:** Preservar explícitamente la regla de 2 arriba + 1 centrada abajo para `[data-piece-count="3"]` y verificar visualmente o mediante tests DOM que `CUORO` no cambie su comportamiento.
