# Alineación Validada: Proporción 50/50 y Encuadre de Productos en ShoppableGallery

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario

## 1. Intención y Objetivo (El Qué y el Porqué)
Ajustar la proporción vertical de `ShoppableGallery` en Desktop de `60% / 40%` a `50% / 50%` (mitad y mitad), asegurando que los tres productos (**WACHI**, **CUORO** y **COSMOS**) se visualicen íntegros, centrados y sin obstrucciones de texto.

## 2. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Cambiar `grid-template-rows: 60% 40%` a `50% 50%` en `src/styles/shoppable-gallery.css`.
- Ajustar `transform` y `object-position` de `.catalog-piece--collection` (WACHI), `.catalog-piece--accessories` (CUORO) y `.catalog-piece--cosmos` (COSMOS) para que cada producto respire sin recortes en Desktop.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Cambios en la vista móvil (`<= 600px`) ni en las páginas internas de colección.
- Cambios en el botón flotante `HABLEMOS`.
