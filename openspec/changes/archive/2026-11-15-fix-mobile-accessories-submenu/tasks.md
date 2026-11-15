## 1. Limpieza de categoría Coming Soon y rutas

- [x] 1.1 Remover la entrada `accesorios` de `comingSoonCategories` en `src/data/ComingSoon.ts`.
- [x] 1.2 Actualizar `src/App.tsx` para redirigir `/accesorios` y `/showcase/accesorios` a `/coleccion/accesorios` (siguiendo el patrón de `/joyeria` y `/showcase/joyeria`).

## 2. Verificación

- [x] 2.1 Verificar en viewport móvil (`< 768px`) que al abrir el menú y tocar **Accesorios** se despliegue el submenú acordeón con **CUORO** (y vuelva a colapsar al tocar de nuevo), sin abrir la vista "Coming Soon".
- [x] 2.2 Verificar que tocar **CUORO** en móvil navega a `/coleccion/accesorios`, y que Desktop y las categorías inactivas (`Iluminación`, `Esenciales`, `Vestuario`) siguen funcionando sin regresiones.
- [x] 2.3 Ejecutar `npm run build` / verificación de tipos para confirmar que no hay errores de compilación.
