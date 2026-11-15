## Context

En `src/components/Navigation.tsx`, el menú de navegación comparte el estado `activePanel` tanto en Desktop como en móvil (`< 768px`).
- En **Desktop** (`Navigation.tsx:409` y `505`), la condición evalúa primero si `activePanel` es `"mobiliario"`, `"arquitectura"`, `"joyeria"` o `"accesorios"` antes de revisar `comingSoonCategories[activePanel]`, por lo que al hacer clic en **Accesorios** se muestra el submenú con **CUORO**.
- En **móvil** (`Navigation.tsx:646`), la condición `activePanel === "contacto" || activePanel === "next-season" || (activePanel && comingSoonCategories[activePanel])` se evalúa *antes* de renderizar la lista de enlaces con acordeones (`Navigation.tsx:740-964`).
- Aunque el acordeón móvil para **Accesorios → CUORO** ya existe en `Navigation.tsx:918-964`, `accesorios` sigue definido dentro de `comingSoonCategories` en `src/data/ComingSoon.ts:32-38` (a diferencia de `joyeria`, que ya fue removido al activar COSMOS). Por eso móvil intercepta `"accesorios"` y muestra la vista "Coming Soon".

## Goals / Non-Goals

**Goals:**
- Lograr que al tocar **Accesorios** en el menú móvil se despliegue el submenú acordeón vertical con **CUORO**, con paridad exacta respecto a **Joyería → COSMOS** y Desktop.
- Mantener la fuente de verdad de categorías inactivas (`comingSoonCategories`) consistente con el estado real de las colecciones publicadas.

**Non-Goals:**
- Rediseñar la estructura o estilos del menú móvil o Desktop.
- Modificar la colección `/coleccion/accesorios` (`AccessoriesCollection.tsx`).
- Alterar las categorías aún en "Coming Soon" (`iluminacion`, `esenciales`, `vestuario`).

## Decisions

1. **Remover `accesorios` de `comingSoonCategories` en `src/data/ComingSoon.ts`**
   - *Por qué:* Es el mismo patrón aplicado previamente a `joyeria` (commit `b409fe8`). Al no existir `comingSoonCategories["accesorios"]`, la condición en `Navigation.tsx:646` no intercepta `activePanel === "accesorios"` y permite que el acordeón existente (`Navigation.tsx:918-964`) se despliegue naturalmente. También evita que `Navigation.tsx` precargue innecesariamente la imagen de "Coming Soon" de accesorios.
   - *Alternativa considerada:* Agregar una exclusión explícita `activePanel !== "accesorios"` en `Navigation.tsx:646`. Se descarta porque dejaría `accesorios` marcado erróneamente como "Coming Soon" en `ComingSoon.ts` cuando la colección CUORO ya está activa.

2. **Redirigir rutas legacy `/accesorios` y `/showcase/accesorios` en `src/App.tsx`**
   - *Por qué:* En `src/pages/Category.tsx:96-102`, las rutas legacy dependen de `comingSoonCategories` para mostrar `ComingSoonView`. Si se remueve `accesorios` de `comingSoonCategories` sin redirigir `/accesorios` (como ya ocurre con `/joyeria` y `/showcase/joyeria` hacia `/coleccion/cosmos` en `App.tsx:48-49`), esas URLs quedarían sin destino válido en `Category.tsx`. Redirigirlas a `/coleccion/accesorios` mantiene consistencia total.

## Risks / Trade-offs

- **[Riesgo] Alguna referencia directa a `comingSoonCategories.accesorios`** → Se verificó con búsqueda en `src/` que solo `Navigation.tsx` y `Category.tsx` consumen `comingSoonCategories` de forma dinámica (iterando claves). Al redirigir `/accesorios` y `/showcase/accesorios` en `App.tsx`, no quedan rutas rotas.
