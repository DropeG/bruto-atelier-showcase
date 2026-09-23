## Why

La primera apertura de una imagen puede dejar su fotografía invisible mientras descarga un fondo pesado; el carrusel sigue avanzando durante esa espera. Queremos que la carga y los cambios se sientan continuos, conservando íntegramente el diseño aprobado.

## What Changes

- Priorizar la vista seleccionada y preparar después la siguiente, sin descargar toda la categoría con igual prioridad.
- Separar la disponibilidad de la fotografía y del fondo; mostrar la fotografía preparada sin bloquearla por el fondo.
- Coordinar entrada, cambio de imagen y temporizador con la disponibilidad real de los recursos, incluida su decodificación.
- Mantener la imagen actual visible mientras se prepara la siguiente y descartar resultados de selecciones obsoletas.
- Generar variantes de fondos adecuadas a cada pantalla, verificando encuadre y calidad visual.
- Medir primera apertura, caché caliente, navegación manual/automática y retorno; conservar composición, textos, rutas, encuadres y animaciones actuales.

## Capabilities

### New Capabilities

- `gallery-loading-continuity`: Preparación priorizada de imágenes, transiciones coordinadas con carga, recuperación ante fallos y criterios de rendimiento reproducibles.

### Modified Capabilities

Ninguna. Se respetan las especificaciones existentes de áreas seguras y navegación.

## Impact

- `src/components/ShowcaseViewer.tsx`, `src/pages/Category.tsx`, `src/components/HoverableImage.tsx` y un módulo compartido de preparación de recursos.
- Datos y archivos derivados de `src/data/Gallery.tsx` y `public/images/gallery/`.
- Pruebas de navegador y reporte comparativo sobre build de producción local.
- Coordinar con `fix-native-lazy-loading` y `fix-http-cache-headers`: no reintroducir precarga masiva ni ampliar este cambio a políticas globales de caché.
- Sin modificaciones de diseño, despliegue ni dependencias de runtime previstas.
