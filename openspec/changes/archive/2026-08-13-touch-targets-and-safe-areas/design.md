## Context

Actualmente en la aplicación Bruto Atelier Showcase, dos componentes principales presentan oportunidades de mejora ergonómica para pantallas táctiles (iOS / iPadOS / Android):

1. `Navigation.tsx`: Los enlaces de navegación del menú lateral usan `px-2 py-1 -mx-2`, lo que genera una zona interactiva de aproximadamente 28px de altura. En dispositivos táctiles, esto incumple las recomendaciones del WCAG 2.2 AA (44px) y Apple HIG, provocando pulsaciones fallidas.
2. `ShowcaseViewer.tsx`: El botón "Volver" y los indicadores (dots) del carrusel están posicionados fixed/absolute con `top-8` (32px), quedando vulnerables a colisionar con la barra de estado de iPadOS o el notch en iPad Pro/iPhones.

## Goals / Non-Goals

**Goals:**
- Garantizar una altura táctil de mínimo 44px para todos los ítems navegables del menú desplegable y subpaneles (`Navigation.tsx`).
- Incorporar soportes dinámicos de Safe Area Top (`env(safe-area-inset-top)`) en los controles superiores de `ShowcaseViewer.tsx`.
- Ampliar la hit-area táctil de los dots de carrusel en `ShowcaseViewer.tsx` sin comprometer su delicado aspecto visual minimalista.

**Non-Goals:**
- Rediseñar la estructura o arquitectura del menú desplegable o la navegación general.
- Alterar la lógica de animación de Framer Motion ni los handlers de estado.

## Decisions

### Decisión 1: Ajuste de Padding y Espaciado de Enlaces (`Navigation.tsx`)
- **Enfoque Seleccionado:** Cambiar la clase de los botones del menú a `block w-full text-left py-3 px-4 -mx-4 rounded-sm transition-colors hover:bg-[#EAD0B9]/30 min-h-[44px] flex items-center` y reducir la brecha global del contenedor `flex flex-col gap-3` a `gap-1`.
- **Justificación:** Al pasar de `py-1` a `py-3`, la altura total calculada alcanza 44px-48px. Reducir el `gap-3` a `gap-1` mantiene la altura total del menú en proporciones equilibradas sin deformar el panel marrón (`#9C7B66`).
- **Alternativa Considerada:** Usar únicamente `min-h-[44px]` sin modificar padding. Descartado porque el texto se mantendría muy pegado verticalmente y la respuesta táctil visual (hover/active background) se vería reducida.

### Decisión 2: Posicionamiento Adaptativo Safe Area (`ShowcaseViewer.tsx`)
- **Enfoque Seleccionado:** Aplicar cálculo de margen superior con la función CSS `max()` combinada con `env(safe-area-inset-top)`:
  ```tsx
  style={{ top: "max(2rem, calc(1rem + env(safe-area-inset-top, 0px)))" }}
  ```
- **Justificación:** Garantiza que en navegadores o escritorios donde `env(safe-area-inset-top)` es 0px, se mantenga un margen superior cómodo de `2rem` (32px). En dispositivos iPadOS o iPhone con barra/notch, el inset añadirá automáticamente el espacio necesario.
- **Alternativa Considerada:** Usar utilidades puras de Tailwind como `pt-safe`. Descartado porque requiere plugins adicionales o variables globales CSS no estandarizadas en Tailwind v3 básico.

### Decisión 3: Hit Targets Invisibles para Dots del Carrusel (`ShowcaseViewer.tsx`)
- **Enfoque Seleccionado:** Envolver los indicadores visuals (los dots `h-2 w-2` / `w-6`) dentro de un `<button>` contenedor flex con padding `p-2 min-w-[32px] min-h-[44px] flex items-center justify-center`.
- **Justificación:** Mantiene los puntos visuales pequeños y delicados (minimalismo de lujo), mientras que el área táctil invisible capturará toques de pulgar imprecisos con total solidez.

## Risks / Trade-offs

- **[Riesgo: Menú más largo en pantallas pequeñas]** → Al aumentar el padding vertical de cada ítem, el listado de 10 ítems requiere mayor altura.
  * *Mitigación:* Reducir el `gap` vertical entre ítems de `gap-3` a `gap-1` e incluir `overflow-y-auto max-h-[80vh]` en el contenedor del menú para asegurar scroll si la pantalla es muy corta.
