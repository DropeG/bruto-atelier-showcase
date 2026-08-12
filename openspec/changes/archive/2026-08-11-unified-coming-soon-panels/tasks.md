## 1. Estandarización de Datos de Categorías Inactivas

- [x] 1.1 Limpiar `src/data/ComingSoon.ts` removiendo arreglos múltiples de imágenes secundarias en `joyeria` para que todas usen una única imagen estática optimizada.

## 2. Unificación de Paneles In-situ en Navegación

- [x] 2.1 Actualizar el tipo `activePanel` en `Navigation.tsx` a incluir `"iluminacion" | "esenciales" | "joyeria" | "vestuario" | "accesorios"`.
- [x] 2.2 Configurar el mapeo de ítems del menú en desktop y móvil para detectar categorías en `comingSoonCategories`, mostrando la insignia `Coming Soon` y activando su panel in-situ.
- [x] 2.3 Implementar el renderizado dinámico del panel Coming Soon en desktop y móvil dentro de `Navigation.tsx`.
