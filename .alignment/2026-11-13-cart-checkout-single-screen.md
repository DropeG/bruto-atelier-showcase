# Alineación Validada: Checkout de Bolsa en Una Sola Pantalla (Sin Scroll en Desktop)

- **Fecha:** 2026-11-13
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Compactar la vista de checkout de la bolsa de compra (`CartDrawer`) para que todo el formulario (información de contacto, dirección de despacho, resumen de compra y el botón **FINALIZAR COMPRA**) quepa completo dentro de una sola pantalla de computador (`100dvh`), evitando que el usuario tenga que hacer scroll vertical.

## 2. Contexto del Proyecto
- `src/components/CartDrawer.tsx` se muestra en pantalla completa al hacer clic en el ícono de la bolsa desde `WachiCollection.tsx` o `AccessoriesCollection.tsx`.
- Utiliza las clases `.wachi-checkout` definidas en `src/styles/wachi-collection.css`, compartidas parcialmente con `src/components/WachiRequestDrawer.tsx`.
- Los espaciados verticales actuales (header, paddings, `gap` entre secciones e inputs de `44px`) empujan el botón **FINALIZAR COMPRA** hacia abajo en pantallas de notebook estándar (~768px–900px de alto).

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Ajustar proporciones, espaciados y distribución vertical en desktop/notebook para que toda la vista de checkout quepa en `100dvh` sin scroll cuando hay 1 o pocos ítems, manteniendo la estética minimalista actual.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Eliminar campos del formulario.
- Cambiar la lógica de Shopify o el flujo de checkout.
- Rediseñar el flujo móvil (donde el scroll natural sigue siendo necesario por ancho de pantalla).

## 4. Decisiones y Supuestos Aprobados
- **Viewport objetivo:** Optimizar para pantallas de computador desde `768px` de alto (notebooks estándar), manteniendo scroll como respaldo en pantallas muy bajas o cuando el carrito tenga muchos productos distintos.
- **Botón siempre visible:** Mantener **FINALIZAR COMPRA** dentro del bloque visible inicial, priorizando compactar `padding`, `gap` y alturas de `input`/botón antes que ocultar etiquetas o sobrecargar filas.
- **Alcance de estilos:** Aplicar el ajuste principalmente a `CartDrawer.tsx` sin romper `WachiRequestDrawer.tsx`.

## 5. Notas para la Etapa de Propuesta
- Respetar el diseño minimalista cálido/editorial de Bruto Atelier (`#171715`, tipografías Georgia/Inter, bordes rectos).
- Verificar tanto en viewport de laptop estándar (ej. 1280×768 / 1440×900) como en móvil para asegurar que no haya regresiones.
