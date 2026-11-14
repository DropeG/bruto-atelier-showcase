## 1. Implementación

- [x] 1.1 Actualizar el `onClick` de `.wachi-stage__color-swatch` en `src/components/CollectionShowcase.tsx` para conservar el `perspectiveIndex` actual acotado a `color.perspectives.length - 1`.

## 2. Verificación

- [x] 2.1 Ampliar `src/pages/CosmosCollection.test.tsx` para comprobar que al navegar a la perspectiva 2 y cambiar entre `Negro` y `Blanco` se mantiene la perspectiva 2 en el otro color, y verificar que `npm test` y `npm run build` pasen.
