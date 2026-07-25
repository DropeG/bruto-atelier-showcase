## Context

El proyecto requiere máxima fluidez sin alterar el diseño visual ultra-premium ni la experiencia de navegación por secciones en Desktop. Al pasar del scroll dentro de un sub-div al scroll nativo del `window`, la aceleración por hardware GPU y la inercia del sistema operativo quedan habilitadas completamente.

## Goals / Non-Goals

**Goals:**
- Desatar el scroll del contenedor `div` a favor de `window` para lograr máxima fluidez y aceleración por GPU.
- Preservar el comportamiento exacto de Scroll Snapping en Desktop (Hero -> Video -> Filas de fotos -> Footer).
- Permitir que las barras de interfaz móvil (Safari/Chrome) colapsen de forma nativa al desplazar hacia abajo.
- Mantener la funcionalidad de restauración de sección en `ScrollContext` y el comportamiento del botón de descuento.

**Non-Goals:**
- Alterar la disposición visual, paddings, imágenes, fuentes o diseño general de las secciones.
- Eliminar el Scroll Snapping en Desktop.

## Decisions

- **Decision 1: Scroll Snap Nativo en `html`/`body` para Desktop**
  - *Rationale*: Definir `md:snap-y md:snap-mandatory` en `html`/`body` permite que el navegador realice el snapping por sección utilizando el motor de composición nativo del SO, conservando la experiencia fija sin latencia de JavaScript.

- **Decision 2: Escuchar `window.scrollY` para controles de UI flotante**
  - *Rationale*: En lugar de `container.scrollTop`, evaluar `window.scrollY` garantiza una sincronización de baja latencia para la visibilidad del botón de descuento y botones flotantes.

- **Decision 3: `ScrollContext` agnóstico de contenedor**
  - *Rationale*: `scrollToSection` usará `document.getElementById(sectionId)?.scrollIntoView()` directamente sobre el viewport global.

## Verification Plan (Mladen Client Persona UX Audit)

1. **Desktop Snap Check**: Verificar salto exacto sección por sección con trackpad y rueda de mouse sin desfases.
2. **Mobile Viewport Check**: Confirmar la respuesta inercial y colapso de UI en navegadores móviles.
3. **UI Sync Check**: Confirmar aparición/desaparición del botón de descuento a los 50px de scroll.
4. **Section Restoration Check**: Verificar retorno a la sección guardada desde las galerías/páginas secundarias.
