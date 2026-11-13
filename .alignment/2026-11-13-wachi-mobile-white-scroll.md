# Alineación Validada: Fondo Blanco Completo al Bajar a Colección WACHI en Mobile

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Cuando el usuario abre el submenú en celular, entra a **Mobiliario → Colección WACHI** y hace scroll hacia abajo desde la foto inicial (story) hacia la grilla de productos de la Colección WACHI, en la parte superior de la pantalla móvil se sigue viendo una franja de la foto de arriba detrás del header (`←`, `BRUTO Atelier`, ícono de bolsa).
El objetivo es que al bajar a la Colección WACHI en Mobile, **toda la pantalla (incluyendo la zona superior del header) se vea 100% blanca**, exactamente como sucede en Desktop.

## 2. Contexto del Proyecto
- En `src/pages/Category.tsx` (líneas 86–97), la ruta de menú de Colección WACHI renderiza `.wachi-collection-flow` con dos secciones:
  1. `.wachi-collection-flow__story` (que contiene `<ShowcaseViewer />`)
  2. `.wachi-collection-flow__grid` (que contiene `<WachiCollection />`)
- En `src/styles/wachi-collection.css` (líneas 8–22), `.wachi-collection-flow__story` define `height: 100dvh;` sin `overflow: hidden` ni aislamiento de apilamiento (`z-index`).
- En `src/components/ShowcaseViewer.tsx` (línea 67), el contenedor raíz usa `relative w-full min-h-screen h-screen` (`100vh`). En navegadores móviles (como Safari iOS con barra de navegación visible), `100vh` (`100lvh`) es ~50–80px más alto que `100dvh`. Por ello, `<ShowcaseViewer />` se desborda fuera de `.wachi-collection-flow__story` e invade la parte superior de `.wachi-collection-flow__grid`.
- Además, como `<ShowcaseViewer />` tiene `position: relative` y `<main className="wachi-collection">` tiene `position: static`, las reglas de pintado CSS dibujan la foto desbordada por encima del `background: #fff` de `.wachi-collection`, mientras que `.wachi-collection__header` (`position: relative; z-index: 1`) dibuja las flechas y textos sobre esa franja de foto.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Contener estrictamente la altura y el recorte (`overflow: hidden`) de `.wachi-collection-flow__story` y su hijo `<ShowcaseViewer />` a `100dvh` / `100%`.
- Asegurar el orden de apilamiento (`position: relative; z-index: 1; background: #fff`) en `.wachi-collection-flow__grid` y `.wachi-collection` para que el lienzo blanco cubra el 100% del viewport en Mobile al bajar a la colección.

### ❌ No Entra (Non-Goals / Anti-Goals)
- No modificar el diseño de la grilla de productos de WACHI ni sus interacciones.
- No eliminar el scroll-snap vertical entre la portada y la grilla de WACHI.
- No alterar el comportamiento de `ShowcaseViewer` en otras disciplinas ni en Desktop.

## 4. Decisiones y Supuestos Aprobados
- **Scroll bidireccional intacto:** Al hacer scroll hacia arriba desde la grilla en Mobile, el usuario sigue pudiendo volver a la foto de portada normalmente.
- **Compatibilidad con barras dinámicas en iOS/Android:** La contención en `.wachi-collection-flow__story` y el apilamiento de `.wachi-collection-flow__grid` evitarán que el cambio de tamaño de la barra de Safari deje asomar la foto detrás del header blanco.

## 5. Notas para la Etapa de Propuesta
- Los cambios deben concentrarse en `src/styles/wachi-collection.css` (acotados al flujo `.wachi-collection-flow`, `.wachi-collection-flow__story`, `.wachi-collection-flow__grid` y `.wachi-collection`) sin romper `ShowcaseViewer` cuando se usa de forma independiente en otras rutas.
