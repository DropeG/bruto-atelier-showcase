# Compuerta de Alineación: Inicio Siempre en Foto Superior al Entrar a Colección WACHI desde el Menú

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario

## 1. Objetivo Principal
Garantizar que cada vez que el usuario entre a **Mobiliario → Colección WACHI** desde el menú (`/showcase/mobiliario/coleccion` o `/coleccion`), la vista comience siempre arriba del todo en la foto editorial superior (`.wachi-collection-flow__story`), incluso después de haber bajado a la grilla de productos y haber salido con la flecha de volver (`←`).

## 2. Alcance (In-Scope vs. Out-of-Scope)
- **In-Scope:**
  - Resetear la posición de scroll del documento (`window` / `document.documentElement` / `document.body`) a `0` de forma instantánea al montar y desmontar `Category.tsx` (`wachi-collection-flow`), suprimiendo temporalmente `scroll-snap-type` y `scroll-behavior: smooth` mediante `data-entering="true"` durante los primeros frames de montaje.
  - Resetear el scroll del documento a `0` al pulsar la flecha de volver (`←`) o el logo en `WachiCollection.tsx`.
  - Limpiar sincrónicamente la clase `menu-open` y el scroll al navegar hacia `/showcase/mobiliario/coleccion` desde `Navigation.tsx`.
- **Out-of-Scope:**
  - El botón directo `"Ver"` dentro del bloque WACHI del Home (`ShoppableGallery.tsx`), que apunta a `/coleccion/wachi` y abre directamente la grilla de productos.

## 3. Decisiones Asumidas
- Se preserva intacta la restauración de scroll del contenedor interno `#coleccion` en `Index.tsx` (`sessionStorage.getItem("lastScrollTop")`).
