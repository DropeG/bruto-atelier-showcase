## Context

En `src/pages/Category.tsx`, al navegar por el menú a **Mobiliario → Colección WACHI**, se renderiza el contenedor `.wachi-collection-flow` con dos secciones consecutivas con `scroll-snap-type: y mandatory`:
1. `.wachi-collection-flow__story`, que envuelve `<ShowcaseViewer />`.
2. `.wachi-collection-flow__grid`, que envuelve `<WachiCollection />`.

Actualmente, en `src/styles/wachi-collection.css`, `.wachi-collection-flow__story` fija `height: 100dvh;` pero carece de `overflow: hidden` y de un contexto de apilamiento propio. Al mismo tiempo, `src/components/ShowcaseViewer.tsx` usa `relative w-full min-h-screen h-screen` (`100vh`). En navegadores móviles con barras de interfaz dinámicas (como Safari iOS), `100vh` equivale al viewport máximo (`100lvh`) y mide ~50–80px más que `100dvh`. Por ese excedente, `<ShowcaseViewer />` se sale por la parte inferior de `.wachi-collection-flow__story` y, al estar posicionado (`position: relative`) frente a un `<main className="wachi-collection">` estático (`position: static`), se pinta por encima del fondo `#fff` de la segunda sección, dejando ver la foto detrás de `.wachi-collection__header`.

## Goals / Non-Goals

**Goals:**
- Garantizar que al bajar en Mobile hacia la grilla de productos de la Colección WACHI toda la pantalla (incluida la franja superior detrás del header) se vea 100% blanca, igual que en Desktop.
- Mantener intacto el comportamiento de `scroll-snap` vertical para bajar a la colección y volver a subir hacia la portada editorial.
- Limitar el alcance de los estilos a `.wachi-collection-flow` y `.wachi-collection` sin alterar el comportamiento de `ShowcaseViewer` en otras disciplinas.

**Non-Goals:**
- No rediseñar la grilla de piezas, tipografías ni la barra superior de `WachiCollection`.
- No eliminar el `scroll-snap` entre la foto de portada y la colección.
- No modificar el JSX o la lógica de `ShowcaseViewer.tsx` ni de `Category.tsx`.

## Decisions

### 1. Recorte y altura `100lvh` dentro de `.wachi-collection-flow__story`
- **Decisión:** Configurar `.wachi-collection-flow__story` con `position: relative; z-index: 0; height: 100vh; height: 100lvh; overflow: hidden;` y anular el alto en su hijo directo mediante `.wachi-collection-flow__story > div { height: 100%; min-height: 100%; max-height: 100%; }`.
- **Por qué:** En Safari iOS (iOS 26), `100dvh` se detiene arriba de la píldora inferior flotante (~119px antes del borde físico inferior), dejando ver el fondo blanco y el ícono de bolsa de la sección siguiente en `scrollY = 0`. Usar `100lvh` con `overflow: hidden` hace que la portada cubra hasta el borde inferior físico y no filtre la grilla debajo.

### 2. Capa superior blanca explícita y compensación del status bar en Mobile
- **Decisión:** Aplicar `position: relative; z-index: 1; min-height: 100vh; min-height: 100lvh; background: #fff;` en `.wachi-collection-flow__grid` y `.wachi-collection`. En `@media (max-width: 850px)`, añadir `padding-top: 88px; scroll-snap-align: none; scroll-snap-stop: normal;` a `.wachi-collection-flow > .wachi-collection-flow__grid` y mover `scroll-snap-align: start; scroll-snap-stop: always;` a `.wachi-collection-flow .wachi-collection`.
- **Por qué:** En Safari iOS, `scroll-snap-align: start` alinea el borde del elemento justo debajo de la barra de estado (~58px), por lo que la franja superior detrás de la hora muestra los 58px del documento inmediatamente anteriores al punto de snap. El `padding-top: 88px` blanco en `.wachi-collection-flow__grid` queda oculto fuera de pantalla en `scrollY = 0` y, al hacer snap sobre `.wachi-collection`, cubre toda la barra de estado con blanco puro.

### 3. Reinicio de scroll y supresión de snap al entrar/salir del flujo WACHI (`data-entering="true"`)
- **Decisión:** Añadir en `src/pages/Category.tsx` un `useLayoutEffect` con referencia `flowRef` sobre `.wachi-collection-flow` que aplica `data-entering="true"`, remueve `menu-open` de `body` y `html`, y fuerza `scrollTop = 0` / `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` durante dos frames de `requestAnimationFrame` antes de reactivar `scroll-snap-type` mediante CSS (`html:has(.wachi-collection-flow[data-entering="true"])`). Complementariamente, limpiar `menu-open` y resetear el scroll del documento al navegar desde `Navigation.tsx` y al volver desde `WachiCollection.tsx`.
- **Por qué:** Al bajar a la grilla de productos y volver al Home con la flecha `←`, el scroll del documento (`window.scrollY`) podía quedar desplazado o ser re-anclado por `scroll-snap-type: y mandatory` antes de terminar el montaje/cierre del menú, haciendo que una segunda entrada desde **Mobiliario → Colección WACHI** aterrizara directamente en la grilla.

## Risks / Trade-offs

- **[Riesgo] Afectar el layout de `<ShowcaseViewer />` en otras rutas o disciplinas** → **Mitigación:** La anulación de altura (`height: 100%; min-height: 100%; max-height: 100%;`) se aplica exclusivamente mediante el selector descendiente `.wachi-collection-flow__story > div`, por lo que ninguna otra ruta que renderice `<ShowcaseViewer />` se ve afectada.
- **[Riesgo] Cambio dinámico de altura al mostrarse/ocultarse las barras de Safari en Mobile** → **Mitigación:** Usar `100lvh` en `.wachi-collection-flow__story` junto con `overflow: hidden`, `padding-top: 88px` blanco en `.wachi-collection-flow__grid` en `@media (max-width: 850px)` y snap en `.wachi-collection` evita tanto la filtración inferior en `scrollY = 0` como la franja superior de la foto al hacer scroll hacia abajo.
