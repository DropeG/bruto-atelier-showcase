# Alineación Validada: Carga Fluida y Sincronizada de Grillas de Colecciones (CUORO, WACHI y Futuras Categorías)

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Eliminar por completo el "tintineo" (*image pop-in / decode jitter*) al navegar hacia las grillas de productos de **Colección CUORO** (`/coleccion/accesorios`) y **Colección WACHI** (`/coleccion/wachi`), dejando además una arquitectura estándar reutilizable para cualquier colección o categoría futura. Todas las imágenes principales de la grilla deben presentarse optimizadas (`srcSet`), precargadas/decodificadas en RAM antes de navegar desde el Home, y sincronizadas para pintarse en el mismo frame sin saltos visuales ni competencia con las perspectivas secundarias.

## 2. Contexto del Proyecto
- `scripts/generate-catalog-images.mjs` y `src/data/catalog-images.json` generan variantes `480w / 800w / 1200w / 1600w` para las piezas de WACHI, pero no incluyen las 9 imágenes de `public/images/shopify-demo/accesorios/*.webp` (CUORO) ni las perspectivas 2 y 3 de WACHI en el script fuente.
- `src/pages/AccessoriesCollection.tsx` carga los `.webp` originales a resolución completa (`1326×1187`, `1668×943`, `1290×1219`, 58–137 KB cada uno) sin `catalogImageProps` (`srcSet`), con `decoding="async"`, haciendo que se decodifiquen a destiempo después del fade-in de `0.22s`.
- Tanto `AccessoriesCollection.tsx` como `WachiCollection.tsx` ejecutan un `setTimeout(..., 120)` al montar que descarga y decodifica todas las perspectivas secundarias (9 en CUORO, 12 en WACHI) en paralelo, compitiendo por red y CPU con las imágenes principales de la grilla.
- `src/components/ShoppableGallery.tsx` navega a `/coleccion/wachi` y `/coleccion/accesorios` sin precargar ni decodificar antes las fotos de la grilla cuando la tarjeta entra en viewport o recibe hover/touch.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Incluir todas las fotos de `shopify-demo/accesorios/` (CUORO) y perspectivas de `shopify-demo/coleccion/` (WACHI) en `scripts/generate-catalog-images.mjs` y actualizar `src/data/catalog-images.json` + `public/images/catalog-optimized/`.
- Crear un módulo centralizado y reutilizable (`src/lib/collection-images.ts`) para registrar colecciones (`wachi`, `cuoro`, y futuras categorías), precargar/decodificar en RAM las imágenes de grilla (`preloadCollectionGrid`), gestionar un gate de decodificación con timeout de seguridad de `160 ms` (`useCollectionGridReady`), y encolar la precarga de perspectivas secundarias en segundo plano (`requestIdleCallback`) solo después de que la grilla principal esté lista.
- Integrar el sistema en `src/components/ShoppableGallery.tsx` (precarga por visibilidad/hover/focus/touch), `src/pages/AccessoriesCollection.tsx` (uso de `catalogImageProps`, `loading="eager"`, `decoding="sync"` y `useCollectionGridReady`), y `src/pages/WachiCollection.tsx` (mismo contrato unificado).

### ❌ No Entra (Non-Goals / Anti-Goals)
- No alterar el diseño visual, tipografías, proporciones de grilla ni la animación `yeezySpring` al abrir una pieza individual.
- No modificar categorías que actualmente siguen en estado *Coming Soon* hasta que incorporen grillas de productos reales.

## 4. Decisiones y Supuestos Aprobados
- Tope de espera de `160 ms` en `useCollectionGridReady`: si las imágenes ya fueron precargadas desde el Home, la grilla entra en `0 ms`; si se accede por URL directa con caché fría, espera hasta `160 ms` a que `Promise.all` de `decode()` resuelva para pintar todas las piezas juntas en el mismo frame.
- Escalabilidad para futuras categorías: registrar cualquier nueva colección en `COLLECTION_REGISTRY` dentro de `src/lib/collection-images.ts` activará automáticamente la precarga en el Home/menú y el pintado sincronizado en la grilla.

## 5. Notas para la Etapa de Propuesta
- Respetar las reglas de proyecto en `.agents/AGENTS.md` y no ejecutar comandos de git (`git add`, `git commit`, `git push`).
