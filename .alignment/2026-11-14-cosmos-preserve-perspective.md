# Alineación Validada: Mantener Perspectiva Activa al Cambiar de Color en Anillo Cosmos

- **Fecha:** 2026-11-14
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta / Implementación)

## 1. Intención y Objetivo (El Qué y el Porqué)
Mantener exactamente la misma perspectiva (ángulo) activa cuando el usuario cambia entre **Blanco** y **Negro** en el selector de color del **Anillo Cosmos**, de modo que si está viendo la perspectiva 2 (frontal macro) o 3 (perfil) en negro y presiona el círculo blanco, cambie inmediatamente a esa misma perspectiva en blanco (y viceversa).

## 2. Contexto del Proyecto
- En `src/components/CollectionShowcase.tsx`, el handler `onClick` de cada círculo de color (`.wachi-stage__color-swatch`) actualmente ejecuta `setPerspectiveIndex(0)`, reseteando siempre la galería del *stage* a la primera imagen.
- En `src/pages/CosmosCollection.tsx`, tanto la variante `Blanco` como la variante `Negro` tienen 3 perspectivas ordenadas 1:1 (vista 3/4, vista frontal macro y vista de perfil).

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Conservar el `perspectiveIndex` actual al cambiar de color en `CollectionShowcase.tsx`, usando `Math.min(perspectiveIndex, Math.max(0, color.perspectives.length - 1))` como resguardo por si un producto futuro tiene distinta cantidad de perspectivas por color.
- Agregar cobertura en `src/pages/CosmosCollection.test.tsx` verificando que cambiar de color desde la perspectiva 2 o 3 mantiene esa misma perspectiva en el nuevo color.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Modificaciones visuales al selector, estilos o imágenes existentes.

## 4. Decisiones y Supuestos Aprobados
- **Clamping seguro:** Si un color tuviera menos perspectivas que el índice activo, se ajusta al último índice disponible; cuando ambos tienen 3 perspectivas (como **Anillo Cosmos**), el índice se conserva 1:1.

## 5. Notas para la Etapa de Propuesta
- Cambio puntual de bajo riesgo en `src/components/CollectionShowcase.tsx` y `src/pages/CosmosCollection.test.tsx`.
