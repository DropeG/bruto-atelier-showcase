## 1. Caché e hidratación inmediata de colecciones

- [x] 1.1 Actualizar `useHomepageCollections` en `src/hooks/useHomepageProducts.ts` para leer/escribir las colecciones seleccionadas en `sessionStorage` e inicializar el estado inmediatamente (desde `sessionStorage` o `selectHomepageCollections(MOCK_COLLECTIONS)`) mientras revalida con Shopify en segundo plano.
- [x] 1.2 Verificar en `src/components/ShoppableGallery.tsx` que `ShoppableGallery` no entre en el estado `.shoppable-gallery--loading` cuando existan colecciones iniciales.

## 2. Continuidad visual de portadas al remontar

- [x] 2.1 Añadir o reutilizar placeholders Base64 en `src/lib/blur-placeholders.ts` para las portadas de `WACHI`, `CUORO` y `COSMOS`, aplicándolos como fondo inmediato en `.catalog-piece__media` dentro de `src/components/ShoppableGallery.tsx`.
- [x] 2.2 Precargar las portadas de `ShoppableGallery` en segundo plano o al interactuar con la flecha de retorno desde `src/pages/WachiCollection.tsx` y `src/components/CollectionShowcase.tsx`.

## 3. Paridad de salida y verificación

- [x] 3.1 Agregar `handleExitToGallery` al `<Link to={galleryUrl}>` de retorno en `src/components/CollectionShowcase.tsx` para igualar el comportamiento de `src/pages/WachiCollection.tsx`.
- [ ] 3.2 Probar manualmente en navegador el flujo: entrar a WACHI/CUORO/COSMOS, recargar dentro de la colección y volver con la flecha atrás, verificando que no aparezca la pantalla claro/café ni saltos de scroll.
- [x] 3.3 Ejecutar `npm run build` y los tests existentes (`npm test` / vitest) para confirmar que no hay regresiones.
