## 1. Simplificación de Datos de Categorías Inactivas

- [x] 1.1 Actualizar `src/data/ComingSoon.ts` para simplificar `vestuario` manteniendo una única referencia de imagen liviana y eliminando arreglos de imágenes múltiples redundantes.

## 2. Integración de Panel "Next Season" en Navegación

- [x] 2.1 Actualizar `Navigation.tsx` para extender `activePanel` a incluir `"vestuario"`.
- [x] 2.2 Configurar el botón "Vestuario" en el menú (desktop y móvil) para alternar el panel `activePanel === "vestuario"` in-situ en lugar de navegar a `/showcase/vestuario`.
- [x] 2.3 Construir la tarjeta desplegable "Next Season" en desktop y móvil con badge `NEXT SEASON • BRUTO ATELIER`, tipografía refinada y animación fluida `AnimatePresence`.

## 3. Optimización de la Vista Fallback `ComingSoonView`

- [x] 3.1 Refactorizar `ComingSoonView.tsx` eliminando la precarga dinámica en bucle JS (`new Image()`) y retirando la tira de miniaturas / lookbook inferior.
- [x] 3.2 Corregir restricciones de viewport en móvil (`100svh` / flex spacing) para garantizar que la vista fallback sea limpia e instantánea si se entra por URL directa.
