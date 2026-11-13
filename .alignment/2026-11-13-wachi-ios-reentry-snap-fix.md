# Alineación Validada: Inicio Siempre en Foto Superior al Reingresar a Colección WACHI en iOS Safari

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Garantizar que en iOS Safari (iPhone), cada vez que el usuario entre a **Mobiliario → Colección WACHI** desde el menú (`/showcase/mobiliario/coleccion`), la vista abra **siempre arriba en la foto editorial** (`.wachi-collection-flow__story`), incluso después de haber bajado hasta la grilla blanca de productos, haber vuelto atrás tocando la flecha `←` del header de `WachiCollection`, y haber vuelto a entrar desde el menú.

## 2. Contexto del Proyecto
- En desktop WebKit (`playwright`), el flujo actual ya mantiene `scrollY = 0` en el segundo ingreso, pero en iOS Safari real el usuario sigue aterrizando directamente en la grilla de productos al reingresar.
- La causa probable en iOS Safari es que `data-entering="true"` se retira tras solo 2 `requestAnimationFrame` (~32 ms), antes de que termine la animación de cierre del menú móvil (250 ms) y la estabilización del viewport/imágenes de `ShowcaseViewer`, permitiendo que `scroll-snap-type: y mandatory` o la restauración de scroll del navegador re-anclen la página a `.wachi-collection`.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Mantener desactivado el `scroll-snap` en `.wachi-collection-flow` al entrar hasta que la transición de menú/montaje haya finalizado por completo o el usuario inicie interacción táctil/scroll.
- Garantizar el reinicio efectivo del scroll a `0` al salir tocando la flecha `←` de `WachiCollection` y al montar `Category.tsx`, evitando también la restauración automática de scroll del navegador (`history.scrollRestoration`).

### ❌ No Entra (Non-Goals / Anti-Goals)
- El enlace directo `"Ver"` desde el Home (`/coleccion/wachi`), que debe seguir abriendo la grilla directamente.
- El segundo problema mencionado por el usuario (se abordará después de validar este).

## 4. Decisiones y Supuestos Aprobados
- El usuario confirmó explícitamente que "volver hacia atrás" significa tocar la flecha `←` arriba a la izquierda en la grilla blanca de `WachiCollection`.
- No habilitar `scroll-snap-type: y mandatory` hasta que sea seguro (tras asentarse la entrada o al detectar intención de scroll del usuario).
