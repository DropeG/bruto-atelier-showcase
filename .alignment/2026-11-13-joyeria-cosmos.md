# Alineación Validada: Categoría Joyería — Colección COSMOS

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Activar la categoría **Joyería** lanzando la colección **COSMOS** en `/coleccion/cosmos`, comenzando con una única pieza (el anillo) con posibilidad de escalar fácilmente a más productos a futuro, e integrarla en la portada (`ShoppableGallery`) para redirigir a los usuarios a `/coleccion/cosmos` con un layout diferenciado para Desktop y Celular.

## 2. Contexto del Proyecto
- `src/styles/shoppable-gallery.css` ya define la estructura Desktop de 2 filas (`60% / 40%`), la fila inferior de 2 columnas (`.shoppable-gallery__bottom`) y el estilo de tarjeta sobre imagen (`.catalog-piece--tile`), además del comportamiento móvil (`<= 600px`) de historias `100svh` con bloque inferior café (`#81644f`).
- `src/components/ShoppableGallery.tsx` y `src/hooks/useHomepageProducts.ts` actualmente están limitados a 2 colecciones (`wachi` y `cuoro`).
- Las colecciones existentes (`WachiCollection.tsx` y `AccessoriesCollection.tsx`) comparten los mismos estilos base (`wachi-collection.css`), animaciones (`Framer Motion` con `layoutId`), visor *stage* de 3 perspectivas y conexión a Shopify (`useShopify`, `addToCart`, `mockData.ts`).
- Ya se encuentran generadas las 3 imágenes de estudio con fondo blanco del anillo en `public/images/shopify-demo/joyeria/` (`anillo-fondo-blanco.webp`, `anillo-perspectiva-2.webp`, `anillo-perspectiva-3.webp`).

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Crear la vista `/coleccion/cosmos` reutilizando el patrón, componentes/estilos y flujo de **CUORO** y **WACHI** (grilla + visor *stage* con 3 perspectivas + carrito Shopify + fallback mock), preparada para iniciar con 1 pieza (el anillo) y crecer con más piezas a futuro.
- Actualizar `ShoppableGallery` y `useHomepageProducts` para mostrar 3 colecciones:
  - **Desktop:** `WACHI` ocupando la mitad superior horizontal (60% alto, foto izquierda + panel café derecha); `CUORO` abajo a la izquierda y `COSMOS` abajo a la derecha (40% alto dividido en 2 columnas), con texto superpuesto sobre las fotos en zonas que no obstruyan la visibilidad del producto.
  - **Celular:** `COSMOS` debajo de `CUORO` siguiendo exactamente el mismo formato vertical `100svh` de `WACHI` y `CUORO` (foto arriba + sección café abajo).
- Redirigir `/joyeria` hacia `/coleccion/cosmos` y retirar Joyería de "Próximamente" (`ComingSoon.ts` y `NextSeasonDepthCarousel.tsx`).
- Registrar `cosmos` en `collection-images.ts` y `mockData.ts` (incluyendo la foto ambiental original del anillo como imagen editorial de portada en Home).

### ❌ No Entra (Non-Goals / Anti-Goals)
- Selector de tallas o configurador complejo de anillos en esta fase (se mantiene el mismo flujo directo de compra que **CUORO**).
- Cambios en las demás categorías inactivas (*Iluminación, Esenciales, Vestuario*).

## 4. Decisiones y Supuestos Aprobados
- **Ruta de la colección:** `/coleccion/cosmos` (consistente con `/coleccion/wachi` y el `handle` `cosmos` de Shopify).
- **Reutilización:** Extraer/reutilizar la lógica y estilos compartidos de **CUORO** y **WACHI** para no duplicar código al implementar **COSMOS** ni futuras colecciones.
- **Imagen de portada en Home:** Foto original del anillo sobre metal oxidado (optimizada a `.webp`), manteniendo coherencia con **CUORO** (foto ambiental en Home → fondo blanco en la colección).
- **Datos del anillo inicial:** Título y precio referenciales editables hasta conectar/actualizar en Shopify, con arquitectura de lista de piezas lista para añadir más productos después.

## 5. Notas para la Etapa de Propuesta
- Verificar que en Desktop (`.shoppable-gallery__bottom`) el encuadre (`object-position`) y el degradado/posición de `.catalog-piece__tile-label` en **CUORO** y **COSMOS** no tapen ni el tarjetero azul ni el anillo.
- Verificar en móvil (`<= 600px`) que las 3 tarjetas (`WACHI`, `CUORO`, `COSMOS`) conserven el scroll snap vertical y el bloque café inferior intactos.
