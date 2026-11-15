## Why

En dispositivos móviles (`< 768px`), al tocar **Accesorios** en el menú de navegación, la aplicación abre la pantalla intermedia de "Coming Soon" con la imagen del tarjetero en lugar de desplegar el submenú acordeón con **CUORO**, a diferencia de Desktop y de **Joyería → COSMOS**. Esto rompe la paridad entre plataformas e impide navegar directamente a la colección activa de **CUORO** desde el menú móvil.

## What Changes

- Remover `accesorios` de `comingSoonCategories` en `src/data/ComingSoon.ts`, replicando el tratamiento dado a `joyeria` al activar COSMOS, para que el menú móvil no intercepte `activePanel === "accesorios"` como vista "Coming Soon".
- Asegurar que el menú móvil renderice el acordeón vertical existente de **Accesorios → CUORO** (`Navigation.tsx`), manteniendo intacto el comportamiento en Desktop y el de las categorías aún inactivas (`iluminacion`, `esenciales`, `vestuario`).
- Verificar que rutas legacy (`/accesorios`) sigan comportándose de forma consistente sin regresiones.

## Capabilities

### New Capabilities
<!-- Sin nuevas capacidades; se corrige y extiende el comportamiento del acordeón móvil existente -->

### Modified Capabilities
- `mobile-nav-accordion`: Extender el requisito de expansión en acordeón vertical móvil para cubrir **Accesorios → CUORO** (y su paridad con **Joyería → COSMOS**), asegurando que no sea interceptado por la vista de "Coming Soon".

## Impact

- `src/data/ComingSoon.ts`: Eliminación de la entrada `accesorios` de `comingSoonCategories`.
- `src/components/Navigation.tsx`: Sin cambios estructurales requeridos si `comingSoonCategories["accesorios"]` deja de existir (o verificación de orden de evaluación en línea 646).
- `src/pages/Category.tsx`: Revisión del fallback para rutas legacy `/accesorios` o `/showcase/accesorios`.
