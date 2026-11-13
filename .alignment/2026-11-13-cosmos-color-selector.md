# Alineación Validada: Selector de Color Estilo Yeezy en Anillo Cosmos

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Replicar el patrón de interacción minimalista de **Yeezy** en la vista detallada (*stage*) del **Anillo Cosmos** (`/coleccion/cosmos`): cuando el usuario hace clic en el botón `+`, en lugar de agregar directamente o mostrar un selector de tallas numéricas, el bloque inferior se transforma para mostrar el título `SELECCIONAR COLOR` (junto al botón `×` de cierre) y dos círculos de color (**Blanco** y **Negro**) debajo del precio. Al seleccionar cualquiera de los dos círculos, la imagen principal del anillo en el escenario cambia automáticamente al color elegido.

## 2. Contexto del Proyecto
- `src/components/CollectionShowcase.tsx` renderiza la vista de colección y el *stage* de producto para `CUORO` y `COSMOS`. Actualmente el botón `+` dispara `handleAddToCart()` directamente.
- `src/pages/WachiCollection.tsx` y `src/styles/wachi-collection.css` ya cuentan con `.wachi-stage__title-row` y `.wachi-stage__close-sizes` para alternar el título de la pieza por el encabezado del selector con un botón `X` a la derecha y ocultar la descripción mientras el selector está abierto.
- La imagen del anillo blanco (`public/images/shopify-demo/joyeria/anillo-fondo-blanco.webp`) y sus variantes responsivas ya están en el catálogo; la imagen optimizada del anillo negro (`896x896`, `.webp`) ya fue generada en `/Users/pedro/.gemini/antigravity/brain/c9c89dca-0001-415d-94ce-1a9fbc9a3743/anillo-negro-fondo-blanco.webp` y debe copiarse a `public/images/shopify-demo/joyeria/anillo-negro-fondo-blanco.webp` e indexarse en `scripts/generate-catalog-images.mjs` y `src/data/catalog-images.json`.
- `src/lib/shopify/mockData.ts` define el producto `anillo-cosmos`, donde deben existir las dos variantes de color (`Blanco` y `Negro`) con sus respectivas imágenes para que el carrito refleje la variante seleccionada.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Copiar `anillo-negro-fondo-blanco.webp` a `public/images/shopify-demo/joyeria/` y generar sus variantes optimizadas (`480w`, `800w`, `896w`) en `public/images/catalog-optimized/` y `src/data/catalog-images.json`.
- Extender `CollectionPiece` en `src/components/CollectionShowcase.tsx` para soportar opciones de color opcionales (`colors`), donde cada color define su clave/etiqueta, código visual (blanco/negro), variante y perspectivas de imagen.
- En el *stage* de `CollectionShowcase`:
  - Cuando la pieza tiene `colors` y el usuario presiona `+` con el selector cerrado, abrir el selector de color: cambiar el título a `SELECCIONAR COLOR`, mostrar el botón `×` a la derecha para cerrar, ocultar la descripción editorial y mostrar los dos círculos (`Blanco` y `Negro`) debajo del precio.
  - Al hacer clic en el círculo blanco o en el círculo negro, cambiar inmediatamente la imagen activa del *stage* al anillo correspondiente (reseteando o ajustando las perspectivas e indicadores de esa variante).
  - Permitir agregar a la bolsa la variante del color seleccionado (manteniendo el botón `+` de confirmación o acción de compra con el feedback visual de bolsa) y cerrar el selector con `×` o `Escape`.
- Configurar `CosmosCollection.tsx` y `mockData.ts` con las dos variantes de color (`Blanco` y `Negro`) para `anillo-cosmos`.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Selector de tallas numéricas de anillo ni botón de ayuda `?`.
- Modificar el comportamiento actual de las piezas de `CUORO` (que no definen `colors` y siguen agregando directo con `+`) ni de `WACHI`.

## 4. Decisiones y Supuestos Aprobados
- **Cambio de imagen en vivo:** Al hacer clic en cada círculo de color, el anillo en pantalla cambia instantáneamente entre el anillo blanco y el anillo negro sin cerrar el selector, permitiendo comparar ambos colores libremente.
- **Acción de agregar al carrito:** Con el selector de color abierto, el botón `+` debajo de los círculos confirma y agrega a la bolsa la variante del color activo (Blanco o Negro), mostrando el check y actualizando el contador e imagen del carrito.
- **Perspectivas por color:** El color Blanco conserva sus 3 perspectivas y el color Negro utiliza `anillo-negro-fondo-blanco.webp` como vista de estudio en fondo blanco.

## 5. Notas para la Etapa de Propuesta
- Asegurar que el círculo blanco tenga un borde sutil (`1px solid`) para distinguirse claramente sobre el fondo blanco `#fff`, y un anillo/indicador claro de estado seleccionado (`aria-checked="true"`) tanto para el círculo blanco como para el negro.
- Pre-cargar las imágenes de ambos colores al abrir la pieza para que el cambio entre blanco y negro sea instantáneo y sin parpadeos.
