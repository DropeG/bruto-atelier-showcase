# Verificación de carga y continuidad de galería

## Resultado

Implementado conservando composición, fotografías principales, encuadres, marco, textos, rutas y controles. La fotografía seleccionada ya no espera al fondo; el cambio automático espera su presentación y conserva cinco segundos de permanencia. Las selecciones pendientes no sustituyen la vista actual hasta estar decodificadas y los resultados obsoletos no ganan frente a una selección más reciente.

| Medición | Antes | Después |
| --- | ---: | ---: |
| Foto elegida plenamente visible, mediana de 5 aperturas frías | 10.182 ms | 1.210 ms |
| Peor apertura de esas 5 | 10.187 ms | 1.218 ms |
| Bytes de imágenes de la categoría transferidos durante la prueba | 1.179.193 | 405.102 |
| Respuesta a cambio manual con recursos preparados, 5 cambios | — | 50–65 ms |
| Intervalo máximo entre frames en esos cambios | — | 17,7 ms |
| Frames >50 ms / imágenes duplicadas en transferencia | — | 0 / 0 |

Reducción de transferencias: **65,6 %**, incluyendo las dos vistas de Series preparadas durante la prueba. El fondo rojo de la compilación pasó de 841.235 a 114.902 bytes transferidos. El detalle seleccionado se decodificó a los 565–580 ms e inició su aparición 19–25 ms después, mientras el fondo seguía cargando.

Datos: [antes](evidence/baseline-cold.json), [después](evidence/verified-cold.json), [cambios preparados](evidence/warm.json).

## Condiciones y alcance de las cifras

- Build de producción local servido en `127.0.0.1:4178`; línea base del código `cb1650d`. No es una medición del hosting publicado.
- Chromium/Phi, viewport 390 × 844, DPR 2, CPU normal, 1.600.000 bits/s de descarga y latencia configurada de 150 ms.
- Cada apertura fría usa un documento nuevo. Se habilita Network y deshabilita su caché **después** de cada navegación; los bytes de transferencia confirman descarga real. Las primeras rondas contaminadas por caché se descartaron.
- Para aislar la primera apertura, se inhibió solo la precarga por intención durante la preparación del clic usando `saveData` en la instrumentación y se restauró la conexión normal en la fase capture del clic, antes de montar el visor. La precarga de la próxima imagen dentro del visor permaneció habilitada. Esto evita confundir una vista anticipada por hover con una apertura fría.
- Inicio del reloj: clic real en el enlace. Foto visible: archivo disponible y opacidad efectiva de imagen y ancestros ≥0,99. La entrada conserva su duración total de 1 s aunque alcance esa opacidad antes de terminar de moverse.
- La línea base capturó 13 s y la comparación 11 s; ambas ventanas incluyen todos los archivos de las mismas dos vistas ya terminados. Los bytes no incluyen imágenes de portada, vídeos ni código.
- `scripts/gallery-probe.mjs` contiene la instrumentación de descarga, decode, visibilidad efectiva, transferencias y frames. Se inyecta solo en el navegador de pruebas, nunca en la aplicación.
- Los intervalos de `requestAnimationFrame` son una señal de continuidad en este equipo, no una garantía de FPS en cualquier dispositivo o compositor.

## Comprobaciones realizadas

- **16 pruebas de regresión** con el visor real y descarga/decode controlados: fondo retrasado, autoplay prematuro, última selección válida, fallo/reintento, deduplicación, caché acotado con recursos activos retenidos, ahorro de datos, pestaña oculta, solicitud automática pendiente al ocultar la pestaña, desmontaje, colección vacía, vista única y cambio durante la primera entrada.
- Cinco cambios con recursos preparados: respuesta máxima 64,9 ms; una fotografía permaneció visible durante todo el fundido, sin frame vacío. El mínimo del máximo de opacidad de las dos fotografías fue ~0,507 en el punto intermedio del fundido.
- Retorno con la flecha: sección original alineada desde el primer frame medido a 17 ms, fotografías cargadas y `blur(0px)` durante toda la muestra de 800 ms. No hizo falta modificar `ScrollContext`. [Muestra](evidence/return.json).
- Atrás del navegador: regresó a `/` con la sección de Piezas visible (top 56 px, posición restaurada por el historial).
- Arrastre horizontal: cambió de imagen 1 a imagen 2.
- Interiorismo, Arquitectura, Piezas, Colección e Independent: detalles cargados, controles presentes y sin desbordamiento horizontal a 1024 × 1366. [Resultados](evidence/categories.json).
- Escritorio 1440 × 900 y cambios de orientación/tamaño: encuadres y controles conservados; variantes adaptadas al tamaño/DPR sin reemplazar el fondo hasta que el nuevo recurso está preparado.
- CPU 4× en viewport móvil, un cambio manual: máximo 17,7 ms entre frames y cero intervalos >50 ms en esta máquina.
- WebKit local, 390 × 844, DPR 2 y modo táctil: apertura, cambio manual y Volver desde entrada directa correctos; sin errores de JavaScript ni desbordamiento. Es una prueba del motor, **no de un iPhone/iPad físico**.
- `npm run build`: pasa. ESLint de todos los archivos de aplicación y pruebas modificados: pasa. `git diff --check`: pasa.
- El chequeo global de TypeScript sigue encontrando dos directivas `@ts-expect-error` innecesarias anteriores a este trabajo en `VideoSection.tsx`, líneas 73 y 104. Se corrigió el tipo de disciplina en `Category.tsx`, que sí pertenece al flujo intervenido. No se alteró el componente de vídeo.

## Conservación visual y duración

Comparación visual en móvil: [antes](evidence/before-mobile.png), [después](evidence/after-mobile.png), [WebKit](evidence/webkit-mobile.png). La textura y el color del fondo mantienen el aspecto de la fotografía dentro del desenfoque y recorte existentes; se conservan originales para una revisión adicional en dispositivo físico.

Hallazgo adicional: la versión anterior declaraba `duration-[2500ms]`, pero esa clase no estaba presente en el CSS compilado y la duración efectiva era **150 ms**. Se estableció explícitamente la duración prevista de **2500 ms** para el cambio de capas. La entrada sigue en 1000 ms; el fondo preparado se revela sobre su placeholder en 600 ms, y se respeta la preferencia de movimiento reducido.

Las variantes se escogen con el mismo cálculo de viewport, DPR, recorte `cover` y escala para preparación y render. Se usa una URL concreta compartida para evitar dos elecciones incompatibles de `srcset` y precarga. Al redimensionar se prepara la variante nueva sin vaciar la existente.

## Repetir las comprobaciones

1. `npm test` ejecuta las regresiones; `npm run generate:gallery` regenera derivados con Sharp sin sobrescribir originales.
2. `npm run build` y `npm run preview -- --host 127.0.0.1 --port 4178` preparan la aplicación compilada.
3. Abrir una sesión de navegador nueva, fijar las condiciones anteriores e inyectar `installGalleryProbe.toString()` desde `scripts/gallery-probe.mjs` antes del clic real. Leer `window.galleryProbe` cuando `done` sea verdadero. Restaurar las condiciones normales al finalizar.
4. Comparar `prepared`, `visible`, `full`, transferencias por URL y frames. Para cambios calientes, medir también el inicio de la opacidad entrante y que al menos una fotografía permanezca visible en cada frame.
5. Detener únicamente el servidor de preview iniciado para la prueba.

## Límites y reversión

Queda pendiente la comprobación final en iPhone/iPad físico y en el hosting desplegado. Las condiciones reales de red pueden producir otros tiempos.

No se publicó ni se hizo commit. Para revertir este cambio, retirar sus modificaciones del visor, hook, preparación compartida, precarga por intención y referencias de manifest; eliminar exclusivamente los derivados de `public/images/gallery/responsive/`. Los archivos originales, rutas y datos principales de las fotografías no fueron sustituidos. Las pruebas y este reporte pueden conservarse como referencia.
