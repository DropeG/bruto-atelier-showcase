## 1. Registrar la línea base

- [x] 1.1 Revisar estado real de lazy loading/caché y especificaciones de áreas seguras; capturar diseño y duraciones actuales como referencia.
- [x] 1.2 Preparar harness de navegador contra build de producción local que registre clic, descarga, decode, visibilidad efectiva, fin de transición, bytes y frames. Diferenciar documento nuevo de caché caliente.
- [x] 1.3 Reproducir Series/9 cinco veces a 390 × 844, 1,6 Mbps/150 ms, y registrar mediana/peor caso; agregar Interiorismo, Arquitectura, Piezas, Colección e Independent como cobertura funcional.
- [x] 1.4 Crear pruebas de regresión que fallen con fondo retrasado, autoplay antes de presentación y resultados de selecciones obsoletas, usando el flujo real del visor.

## 2. Corregir la preparación de imágenes

- [x] 2.1 Implementar preparación compartida por variante con deduplicación, decode, caché acotado y estados de error; verificar finalización única y limpieza al desmontar.
- [x] 2.2 Priorizar detalle seleccionado y fondo seleccionado; diferir siguiente vista y evitar solicitudes adelantadas desde imágenes DOM ocultas.
- [x] 2.3 Separar disponibilidad del detalle y fondo; preparar fallback del mismo fondo y comenzar la entrada del detalle cuando esté decodificado, conservando las animaciones aprobadas.
- [x] 2.4 Verificar la prueba de fondo retrasado: el detalle empieza a mostrarse en ≤100 ms tras decode y no espera al fondo.

## 3. Coordinar cambios y autoplay

- [x] 3.1 Mantener la vista actual mientras se prepara la siguiente; separar destino solicitado de presentado y aplicar solo la última selección pendiente.
- [x] 3.2 Iniciar los cinco segundos tras completar presentación; esperar destino preparado, cancelar ciclo en navegación manual y mantener un único temporizador.
- [x] 3.3 Pausar en pestaña oculta y reanudar sin avances acumulados; resolver errores de detalle/fondo con fallback, controles operables y reintento acotado.
- [x] 3.4 Pasar regresiones de carga lenta, clics rápidos, una sola imagen, fallos de red y navegación fuera del visor durante una descarga.

## 4. Reducir bytes y anticipar la selección

- [x] 4.1 Generar variantes candidatas de fondos pesados sin sobrescribir originales y registrar tamaño/dimensiones.
- [x] 4.2 Comparar visualmente textura, color y encuadre en móvil, escritorio y DPR alto; escoger variantes aceptables y documentar cualquier compromiso.
- [x] 4.3 Conectar la selección única de variante (viewport, DPR y recorte cover) a la preparación compartida; comprobar ausencia de doble descarga y objetivo de reducción ≥60 % en primera vista móvil de Series/9.
- [x] 4.4 Añadir precarga acotada por intención de hover/foco/pointerdown, sin bloquear clics ni cargar toda la galería y respetando ahorro de datos.

## 5. Verificar regreso y continuidad visual

- [x] 5.1 Probar flecha Volver, Atrás del navegador y entrada directa: sección correcta, controles operables y ausencia de flash/desenfoque repetido en recursos cacheados.
- [x] 5.2 Corregir restauración o reutilización de imágenes solo donde se reproduzca un defecto; conservar rutas, orden, scroll y diseño aprobado.
- [x] 5.3 Comparar capturas y secuencias antes/después para asegurar que composición, encuadre, textos, marco, curvas y duraciones permanecen iguales.

## 6. Cerrar con evidencia

- [x] 6.1 Repetir cinco ejecuciones del escenario frío: objetivo de foto elegida plenamente visible ≤3 s de mediana y siempre antes del primer avance.
- [x] 6.2 Medir cambios calientes: respuesta ≤100 ms, ninguna imagen vacía y sin frames >50 ms atribuibles al visor durante cinco transiciones.
- [x] 6.3 Probar escritorio, 390 × 844, tablet y CPU 4×; comprobar WebKit/iOS donde esté disponible y declarar cobertura pendiente de dispositivo físico.
- [x] 6.4 Ejecutar build y comprobaciones pertinentes; distinguir fallos previos ajenos al cambio y eliminar instrumentación temporal.
- [x] 6.5 Guardar reporte antes/después con condiciones, bytes, tiempos, capturas, limitaciones y procedimiento de reversión. Detener el servidor iniciado solo para estas pruebas.
