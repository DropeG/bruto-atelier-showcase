## Context

Actualmente, `Category.tsx` renderiza `.wachi-collection-flow` para `/showcase/mobiliario/coleccion` con un `useLayoutEffect` que coloca `data-entering="true"` durante únicamente 2 `requestAnimationFrame` (~32 ms) mientras `wachi-collection.css` tiene `html:has(.wachi-collection-flow) { scroll-snap-type: y mandatory; }` activo por defecto.

En Safari de iOS real:
1. La animación de salida del menú móvil en `Navigation.tsx` (`AnimatePresence` de `0.25s`) y la eliminación de `menu-open` (`overflow: hidden !important`) ocurren después de los primeros ~32 ms, generando un reajuste de layout y viewport cuando `scroll-snap-type: y mandatory` ya volvió a estar activo.
2. Mientras `html` o `body` tuvieron `overflow: hidden` por el menú abierto o durante una transición rápida entre `/` y `/showcase/mobiliario/coleccion`, iOS Safari puede ignorar o diferir `window.scrollTo(0, 0)` hasta después del cambio de ruta, o restaurar la posición previa al re-evaluar los puntos de snap de `.wachi-collection`.

## Goals / Non-Goals

**Goals:**
- Garantizar en iOS Safari que al entrar o reingresar a `/showcase/mobiliario/coleccion` desde el menú (tras haber bajado a la grilla y vuelto con `←`), la vista comience siempre en `scrollY = 0` mostrando la foto editorial superior (`.wachi-collection-flow__story`).
- Impedir que `scroll-snap-type: y mandatory` se active antes de que el usuario comience a deslizar/scrollear o antes de que termine la transición de cierre del menú y estabilización del viewport.

**Non-Goals:**
- No alterar la ruta directa `/coleccion/wachi` desde el botón `"Ver"` del Home.
- No modificar la apariencia ni la lógica interna de `WachiCollection` (grilla, stage de pieza o drawer de solicitud).

## Decisions

### 1. Opt-in de `scroll-snap-type` mediante `data-snap-ready="true"`
- **Decisión:** Cambiar el selector CSS de `html:has(.wachi-collection-flow)` a `html:has(.wachi-collection-flow[data-snap-ready="true"]) { scroll-snap-type: y mandatory; }` y mantener `scroll-behavior: auto !important` mientras no esté listo.
- **Por qué:** En lugar de apagar el snap solo durante 2 `requestAnimationFrame` (lo cual es vulnerable a la animación de 250 ms del menú en iOS Safari), el snap queda **apagado al montar** y se activa únicamente cuando:
  1. Ya transcurrió un margen seguro tras el montaje/cierre del menú (~350 ms) con `scrollY === 0`, **y/o**
  2. El usuario realiza su primer gesto de interacción (`touchstart`, `wheel`, `keydown`).
- **Alternativa descartada:** Usar solo un `setTimeout` más largo manteniendo `scroll-snap-type: y mandatory` como estado base; si el usuario toca la pantalla o Safari reajusta barras durante el primer frame, seguiría habiendo ventana de race condition.

### 2. `history.scrollRestoration = 'manual'` y reinicio multi-etapa de scroll + `key` por visita
- **Decisión:**
  - En `Category.tsx`, durante el montaje de `.wachi-collection-flow`, guardar el valor previo de `window.history.scrollRestoration`, fijarlo en `'manual'` y restaurarlo al desmontar.
  - Reforzar el reset a `0` en `useLayoutEffect`, en los primeros frames y tras remover `menu-open` (cuando ya no hay `overflow: hidden` bloqueando `scrollTo` en iOS Safari).
  - Asignar `key={location.key}` al contenedor `.wachi-collection-flow` para asegurar un montaje completamente limpio de la vista y de sus refs en cada entrada desde el menú.

### 3. Limpieza sincrónica y diferida en `WachiCollection.tsx` y `Navigation.tsx`
- **Decisión:** Mantener el reset al pulsar `←` en `WachiCollection.tsx` y al pulsar `Colección WACHI` en `Navigation.tsx`, asegurando que `menu-open` se limpie antes de `navigate()` para que `window.scrollTo(0, 0)` no sea bloqueado por `overflow: hidden !important` en iOS Safari.

## Risks / Trade-offs

- **[Riesgo] El usuario empieza a deslizar hacia abajo en los primeros ~300 ms y aún no hay snap** → **Mitigación:** Activar `data-snap-ready="true"` de forma inmediata en el primer evento `touchstart` o `wheel` (una vez confirmado `scrollY === 0` al montar), de modo que el primer deslizamiento del usuario ya tenga `scroll-snap` activo sin esperar el temporizador.
- **[Riesgo] Afectar la restauración de scroll del Home (`Index.tsx`)** → **Mitigación:** `history.scrollRestoration = 'manual'` se aplica y restaura únicamente durante el ciclo de vida de `.wachi-collection-flow` en `Category.tsx`, y el Home usa el contenedor interno `#coleccion` con `sessionStorage`.
