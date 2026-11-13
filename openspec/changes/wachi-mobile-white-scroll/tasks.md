## 1. Contención y Apilamiento en Estilos de WACHI

- [x] 1.1 Actualizar `src/styles/wachi-collection.css` para contener y recortar `.wachi-collection-flow__story` (`position: relative; z-index: 0; height: 100lvh; overflow: hidden;`) y ajustar `.wachi-collection-flow__story > div` a `height: 100%; min-height: 100%; max-height: 100%;` para evitar desbordes de `100vh` en Mobile.
- [x] 1.2 Actualizar `src/styles/wachi-collection.css` para asegurar el apilamiento con fondo blanco puro (`position: relative; z-index: 1; min-height: 100lvh; background: #fff;`) en `.wachi-collection-flow__grid` y `.wachi-collection`, y añadir `padding-top: 88px` en mobile para cubrir la barra de estado.
- [x] 1.3 Reiniciar el scroll a `0` al entrar/salir de **Mobiliario → Colección WACHI** (`Category.tsx`, `WachiCollection.tsx`, `Navigation.tsx` y regla `data-entering="true"` en `wachi-collection.css`) para iniciar siempre en la foto superior.

## 2. Verificación y Pruebas

- [x] 2.1 Ejecutar `npx tsc --noEmit`, `npm run build` y las pruebas unitarias existentes para confirmar que no hay errores de compilación ni regresiones.
