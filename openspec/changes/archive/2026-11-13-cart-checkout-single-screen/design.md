## Context

La vista de checkout de la bolsa (`src/components/CartDrawer.tsx`) reutiliza las clases `.wachi-checkout` de `src/styles/wachi-collection.css`, compartidas con `src/components/WachiRequestDrawer.tsx`. En pantallas de computador estándar (notebooks con altura útil de navegador entre `700px` y `850px`), la suma de la altura del header (`clamp(4.5rem, 9vh, 6rem)`), los paddings de `.wachi-checkout`, los `gap` entre secciones (`2.1rem`) y campos (`1.05rem`), y la altura de los inputs (`44px`) supera el viewport, empujando el botón **FINALIZAR COMPRA** fuera del área visible inicial y obligando a hacer scroll.

## Goals / Non-Goals

**Goals:**
- Lograr que en viewports desktop (`min-width: 901px` y altura útil desde `700px`) toda la vista de `CartDrawer` (header, formulario completo, resumen de compra con 1–3 ítems y botón **FINALIZAR COMPRA**) quepa dentro de `100dvh` sin scroll vertical.
- Mantener intacta la estética minimalista de Bruto Atelier (`#171715`, tipografías Georgia/Inter, bordes rectos de 1px y jerarquía visual clara).
- Evitar regresiones visuales en `WachiRequestDrawer.tsx` y en el flujo móvil (`max-width: 900px`).

**Non-Goals:**
- Eliminar o agrupar excesivamente campos del formulario actual (se conservan los mismos campos y etiquetas).
- Modificar la lógica de Shopify, `buildPrefilledCheckoutUrl` o el estado del carrito.
- Rediseñar la experiencia móvil, donde el layout en una columna requiere scroll natural.

## Decisions

1. **Modificador CSS específico para `CartDrawer` (`.wachi-checkout--compact`) en lugar de alterar globalmente `.wachi-checkout`**
   - *Decisión:* Agregar la clase modificadora `wachi-checkout--compact` en `CartDrawer.tsx` (y opcionalmente un modificador en su `<header>` dentro del overlay) para aplicar la densidad vertical compacta en desktop (`@media (min-width: 901px)`), dejando intactos los estilos base usados por `WachiRequestDrawer.tsx`.
   - *Alternativa considerada:* Cambiar `.wachi-checkout` directamente. Descartada porque `WachiRequestDrawer.tsx` tiene campos distintos (selector de perfil y textarea de notas) y su propio ritmo vertical ya validado.

2. **Escala vertical fluida con `clamp()` orientada a `vh` + reducción moderada de alturas de input/botón**
   - *Decisión:* Reducir en desktop el header del drawer a `clamp(3.25rem, 6vh, 4.25rem)`, los paddings superior/inferior de `.wachi-checkout--compact`, los `gap` de `.wachi-checkout__form` (~`1rem`–`1.35rem`) y `.wachi-checkout__section` (~`0.55rem`–`0.75rem`), y ajustar la altura de `.wachi-checkout__input` a `38px` (y `.wachi-checkout__submit` a `42px`). Con esto la columna del formulario ronda los `~590px`–`630px` totales, cabiendo con holgura en notebooks de `768px` de pantalla (~`700px` de viewport útil).
   - *Alternativa considerada:* Poner `Correo electrónico` y `Teléfono` en 2 columnas. Descartada por ahora para respetar la decisión de alineación de priorizar espaciados antes que reordenar filas, aunque queda como opción trivial si en el futuro se agregan más campos.

3. **Contención del resumen de compra cuando hay múltiples ítems**
   - *Decisión:* En desktop (`min-width: 901px`), limitar `.wachi-checkout--compact .wachi-checkout__items` con `max-height` relativo al viewport (ej. `calc(100dvh - 18rem)`) y `overflow-y: auto` para que, si el usuario agrega muchos productos distintos, el scroll ocurra dentro de la lista de ítems y no empuje la página completa ni oculte el total.
   - *Alternativa considerada:* Dejar crecer el resumen libremente. Descartada porque rompería el objetivo de una sola pantalla en pedidos multi-ítem.

## Risks / Trade-offs

- **Riesgo:** En pantallas desktop extremadamente bajas (ej. `< 640px` de alto con DevTools abiertos o zoom alto), el formulario podría seguir necesitando scroll.
  → **Mitigación:** Mantener `overflow-y-auto` en el contenedor raíz del overlay de `CartDrawer.tsx` como red de seguridad; simplemente no aparecerá scrollbar cuando todo quepa en el viewport.
- **Riesgo:** Inputs de `38px` podrían sentirse ligeramente más compactos al tacto en pantallas táctiles pequeñas.
  → **Mitigación:** Aplicar el modo compacto solo en `@media (min-width: 901px)`, manteniendo `44px` en móvil/tablet.
