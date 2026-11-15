# Alineación Validada: Menú Móvil Accesorios → Submenú CUORO

- **Fecha:** 2026-11-15
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta)

## 1. Intención y Objetivo (El Qué y el Porqué)
Corregir el comportamiento del menú móvil cuando el usuario toca **Accesorios**, para que despliegue el submenú acordeón con **CUORO** (tal como ocurre en Desktop y con **Joyería → COSMOS**), en lugar de abrir la pantalla intermedia de "Coming Soon" con la imagen del tarjetero.

## 2. Contexto del Proyecto
- En [Navigation.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/components/Navigation.tsx#L918-L964) el submenú acordeón móvil para **Accesorios → CUORO** ya está implementado.
- Sin embargo, en [Navigation.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/components/Navigation.tsx#L646), la vista móvil evalúa `activePanel && comingSoonCategories[activePanel]` antes de renderizar la lista acordeón.
- En [ComingSoon.ts](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/data/ComingSoon.ts#L32-L38), `accesorios` aún permanece registrado dentro de `comingSoonCategories` (a diferencia de `joyeria`, que fue removido cuando se activó COSMOS).
- En Desktop ([Navigation.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/components/Navigation.tsx#L409) y [Navigation.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/components/Navigation.tsx#L505)), `"accesorios"` se evalúa explícitamente antes de `comingSoonCategories`, por lo que Desktop ya funciona correctamente.

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Hacer que **Accesorios** en móvil despliegue el submenú **CUORO** sin ser interceptado por `comingSoonCategories`.
- Mantener paridad total de comportamiento entre **Accesorios → CUORO** y **Joyería → COSMOS** tanto en móvil como en Desktop.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Rediseñar el menú móvil o Desktop.
- Modificar la página `/coleccion/accesorios` ni sus productos.
- Alterar las categorías que sí continúan en estado "Coming Soon" (`iluminacion`, `esenciales`, `vestuario`).

## 4. Decisiones y Supuestos Aprobados
- Tratar `accesorios` igual que `joyeria`, removiéndolo de `comingSoonCategories` ya que la colección **CUORO** está activa.
- Mantener intacto el resto de las categorías y rutas activas.

## 5. Notas para la Etapa de Propuesta
- Verificar si `accesorios` en `comingSoonCategories` se referencia en otros archivos (por ejemplo, `Category.tsx` o `blur-placeholders.ts`) antes de removerlo, para evitar regresiones en rutas legacy como `/accesorios` o `/showcase/accesorios`.
