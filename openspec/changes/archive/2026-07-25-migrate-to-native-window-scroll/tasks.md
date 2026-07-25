## 1. Configurar Scroll Snap Global

- [x] 1.1 Agregar las clases de scroll-snap nativo a `html`/`body` en `src/index.css` para Desktop (`md:snap-y md:snap-mandatory`)

## 2. Refactorizar Index.tsx y ScrollContext

- [x] 2.1 Remover `h-[100svh] md:h-screen overflow-y-scroll md:snap-y md:snap-mandatory` del contenedor principal en `src/pages/Index.tsx`
- [x] 2.2 Migrar el event listener de `handleScroll` a `window` usando `window.scrollY` para el estado `showDiscount`
- [x] 2.3 Ajustar `scrollToSection` en `src/contexts/ScrollContext.tsx` para trabajar directamente con el viewport nativo del documento

## 3. Verificación & Auditoría de UX (Protocolo Mladen)

- [x] 3.1 Ejecutar `npm run build` / compilación TypeScript limpia
- [x] 3.2 Verificar manualmente el funcionamiento de Scroll Snapping en Desktop sección por sección
- [x] 3.3 Verificar la fluidez inercial y visibilidad del botón de descuento
- [x] 3.4 Verificar la restauración de sección guardada al retornar desde la vista de detalle
