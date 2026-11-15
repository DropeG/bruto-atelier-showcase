# Alineación Validada: Navegación Circular por Scroll Vertical en Stage de Colecciones (Estilo Yeezy — Solo Imagen Desliza + Bloqueo de Scroll Móvil)

- **Fecha:** 2026-11-15
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Permitir que el usuario, al encontrarse en la vista detallada (*Stage*) de un producto dentro de una colección, pueda pasar al siguiente o anterior producto de esa misma colección haciendo scroll vertical (rueda del mouse, trackpad, swipe vertical o flechas arriba/abajo) en bucle infinito (ej. en `WACHI`: `Set → Mesa → Silla → Banqueta → Set`).
1. **Solo la foto del producto (`.wachi-stage__media`) se desliza verticalmente**, mientras que todo el resto de la interfaz del *Stage* (flechas `<` `>`, puntos de perspectiva, título, descripción, precio y botón de acción) permanece fijo y anclado en su lugar.
2. **Bloqueo total de scroll de fondo en móvil:** Al hacer swipe vertical en celular dentro del *Stage* de un producto, la página/fondo queda 100% fija como una app nativa (sin mover el scroll del documento ni hacer rebote elástico detrás), cambiando únicamente el producto.

## 2. Contexto del Proyecto
- `src/hooks/use-stage-vertical-nav.ts`: Escuchaba `touchstart` y `touchend` en modo pasivo sin interceptar `touchmove` con `{ passive: false }`, lo que permitía que el navegador móvil desplazara el documento al arrastrar el dedo.
- `src/styles/wachi-collection.css`: `.wachi-stage` tenía `min-height: calc(100dvh - ...)` pero sin `touch-action: none` ni bloqueo de `overflow: hidden` / alto fijo de viewport cuando el *Stage* de pieza está activo en móvil.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Mantener estático el contenedor `.wachi-stage`, las flechas `<` `>`, los puntos y el bloque `.wachi-stage__info` al cambiar de pieza por scroll.
- Aislar el `AnimatePresence` con la animación de deslizamiento vertical (`y`) exclusivamente al contenedor de la imagen del producto (`.wachi-stage__media`) dentro del viewport.
- Bloquear el scroll nativo de la página en móvil mientras un producto está abierto en el *Stage* (`touch-action: none` en `.wachi-stage`, contenedor ajustado a `100dvh` sin desborde vertical y `event.preventDefault()` en `touchmove` no pasivo).

### ❌ No Entra (Non-Goals / Anti-Goals)
- No bloquear el scroll en la vista de grilla de la colección (cuando no hay un producto abierto, la grilla móvil sigue scrolleando normal).
- No bloquear el scroll dentro del drawer de solicitud de WACHI (`WachiRequestDrawer`) ni dentro del carrito de compras (`CartDrawer`) cuando estén abiertos.

## 4. Decisiones y Supuestos Aprobados
- **Bloqueo también en colecciones de 1 pieza (`COSMOS`):** En móvil, mientras el *Stage* de un producto está abierto, la vista ocupa exactamente el alto de pantalla (`100dvh`) y queda fija sin rebote elástico (*rubber-banding*), volviendo a liberar el scroll apenas cierras el producto hacia la grilla.
- **Reset de posición de scroll al abrir una pieza:** Si en móvil el usuario hizo scroll hacia abajo en la grilla antes de tocar un producto (ej. el 3er o 4to producto), al abrir el *Stage* el contenedor queda encuadrado en el viewport sin dejar scroll residual detrás.
