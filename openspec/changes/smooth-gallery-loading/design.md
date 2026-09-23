## Context

Diagnóstico local del 23-09-2026, no medición de producción ni de teléfono físico:

- En Series/9, a 1,6 Mbps y 150 ms de latencia, el detalle se descargó en ~1,7 s y el fondo `rojo.jpeg` en ~8,5 s. `imagesLoaded[item.id]` espera ambos; el detalle permaneció oculto innecesariamente.
- En repetición móvil de 390 × 844 con documento nuevo y caché deshabilitada, la selección apareció alrededor de 10 s: el temporizador había avanzado antes de que estuviera lista.
- En cambios con imágenes preparadas no se observaron intervalos entre frames superiores a 50 ms en este equipo. No hay evidencia para cambiar las duraciones por motivos de rendimiento.
- Una conversión exploratoria de `rojo.jpeg` a WebP de 1600 px pasó de 1292 a 126 KiB; falta comparación visual. Es una estimación, no un asset aprobado.
- `Category` rota la categoría para comenzar por el elemento elegido. Se conserva ese orden y todas las rutas actuales.

## Goals / Non-Goals

**Goals:** eliminar esperas evitables, evitar cambios hacia imágenes sin preparar y conservar la continuidad al entrar, cambiar y volver. Disminuir bytes sin degradar el encuadre ni la fotografía.

**Non-Goals:** rediseñar, quitar autoplay, acortar las animaciones aprobadas, alterar textos o navegación, modificar vídeos o caché global, desplegar durante esta planificación.

## Decisions

### 1. Medición reproducible antes de editar

Usar build de producción local para nueva línea base, porque Vite de desarrollo no representa un despliegue. Medir desde el clic: cambio de ruta, recurso descargado, recurso decodificado, primer frame visible y fin de transición. Calcular visibilidad efectiva incluyendo ancestros: la opacidad del `<img>` por sí sola no demuestra que el usuario lo vea.

Separar documento nuevo/caché deshabilitada de navegación repetida/caché caliente; deshabilitar caché HTTP sin recrear el documento no elimina imágenes ya retenidas en memoria. Registrar viewport, DPR, CPU, red y versión. Cinco ejecuciones por escenario, mediana y peor caso; no presentar p95 con una muestra tan pequeña.

### 2. Preparación compartida y acotada

Crear un pequeño módulo de preparación por URL/variante con promesas deduplicadas, estados loading/ready/error y `decode()` antes de ready. La foto seleccionada tiene prioridad; el fondo seleccionado es la segunda necesidad y la próxima vista se prepara después. Evitar que los `<img>` ocultos con `loading="eager"` disparen solicitudes que el planificador pretendía diferir. Mantener montadas las capas necesarias para la transición actual y siguiente, no todos los recursos de la categoría.

Usar un caché acotado (por ejemplo 8 recursos, sin expulsar los activos), liberar referencias de imágenes no utilizadas y no cachear errores permanentemente. Cada finalización cuenta una sola vez; revisar la combinación actual de `img.complete` y `onload` para evitar doble contabilización.

En galería, precargar únicamente el destino de intención clara (`pointerenter` con breve espera, foco de teclado o `pointerdown`), compartiendo el módulo con el visor. No interceptar el clic ni precargar todas las tarjetas; respetar ahorro de datos y mantener navegación con enlace directo.

Alternativa descartada: cargar toda la categoría de inmediato. Reduce algunas esperas futuras a costa de retrasar la imagen que realmente se pidió.

### 3. Disponibilidad independiente y transición coordinada

Estados conceptuales: preparando → entrando → visible → preparando siguiente → transición → visible. Disponibilidad del detalle y fondo separada; un fondo lento no retiene el detalle. Preparar un placeholder ligero del mismo fondo, con el mismo encuadre y oscurecimiento, para mantener continuidad sin introducir nuevos elementos visuales.

La animación de entrada del detalle comienza una vez decodificado; no gastar la animación mientras la imagen está invisible. Conservar duraciones, curvas, escala, marco y composición actuales. El fondo sustituye su placeholder una vez decodificado mediante la transición existente. Se valida que no aparezcan flashes de blanco/negro ni reinicios involuntarios.

Durante cambios, conservar la vista actual hasta que la siguiente pueda mostrarse. Separar selección solicitada de vista presentada: varias pulsaciones rápidas actualizan el destino pendiente y solo gana la última, sin respuestas tardías ni saltos intermedios. No cambiar el indicador activo hasta presentar el destino.

### 4. Reloj sincronizado con presentación

Conservar los cinco segundos de permanencia, contados desde el fin de la entrada/transición de la vista y la preparación del fondo, no desde el montaje. Si la siguiente vista no está preparada al vencer, retener la actual hasta prepararla. Navegación manual cancela/reinicia el ciclo; un solo temporizador activo. Pausar en pestaña oculta y reanudar con un intervalo completo, sin avances acumulados.

Ante error de fondo, usar el placeholder disponible y considerar la vista degradada lista para evitar bloqueo. Ante error del detalle entrante, conservar la vista actual; en entrada directa mantener fondo y controles operables. Reintento acotado al volver a solicitar, sin bucle ni marcar descargas fallidas como éxito.

### 5. Variantes de fondos con control de calidad

Generar variantes candidatas de 800/1600/2400 px de ancho, ajustadas tras revisar viewport, DPR y recorte `cover`. La selección de variante se calcula una sola vez con viewport, DPR, recorte `cover` y escala 1,12; la precarga y el `<img>` reciben exactamente esa URL. Se evita que decisiones independientes de `srcset` y precarga bajen dos variantes. Al cambiar orientación/tamaño se prepara la nueva variante y se conserva la anterior hasta que esté decodificada. Conservar originales y usar nombres nuevos para assets derivados.

Prioridad: `rojo.jpeg`, `chilote.jpeg`, `bano.jpeg` y `cabina-01-thumb.webp`. Comparar textura, bordes, color y encuadre en escritorio, móvil y DPR alto. Elegir peso por calidad real; 100 KB no es un límite universal. Objetivo inicial: reducir al menos 60 % los bytes del conjunto solicitado para la primera vista de Series/9 a 390 px, sin pérdida perceptible aprobada en revisión visual.

### 6. Retorno y validación

Comprobar flecha del visor, Atrás del navegador y enlace directo. Reutilizar recursos ya preparados y evitar repetir desenfoque de carga en imágenes cacheadas. Modificar restauración de scroll solo si la prueba reproduce un salto; preservar la sección original y evitar introducir desplazamiento suave involuntario.

Objetivos en el entorno controlado (se registran como objetivos, no resultados):

- Series/9, 390 × 844, 1,6 Mbps/150 ms, CPU normal, documento nuevo: foto seleccionada plenamente visible ≤3 s en mediana de cinco ejecuciones y antes del primer avance automático.
- Detalle decodificado: iniciar su transición en ≤100 ms aunque el fondo siga pendiente; finalizar según duración aprobada.
- Cambio manual con destino listo: iniciar respuesta visible ≤100 ms; conservar duración de transición existente.
- Cinco transiciones con caché caliente: sin huecos visuales y sin frames >50 ms atribuibles al visor; registrar tasa/percentiles de frames como evidencia auxiliar, no garantía universal de FPS.
- Ninguna descarga de detalle ajeno antes de preparar el detalle seleccionado; ninguna descarga duplicada de la misma variante por precarga y render.
- QA adicional a 4× CPU, red lenta, orientación distinta, pérdida de red, clics rápidos, un solo elemento y enlace directo. Registrar límites observados en vez de prometer tiempos en cualquier conexión.

## Risks / Trade-offs

- Precarga por intención consume datos → una selección acotada, caché compartido y omitir especulación con ahorro de datos.
- Menos bytes pueden perder textura → comparar variantes contra originales y conservar resolución mayor donde sea necesaria.
- Contar permanencia desde presentación cambia el instante del primer avance → mantiene los cinco segundos visibles y evita saltar contenido sin verlo.
- `decode()` o una descarga pueden fallar → estados de error explícitos, controles operables y reintento acotado.
- Rendimiento de Safari/iPhone puede diferir → probar WebKit y dispositivo físico cuando esté disponible; declarar esa cobertura pendiente si no lo está.
- Otros cambios pendientes afectan lazy loading/caché → revisar estado real antes de implementar y no copiar sus propuestas como hechos vigentes.

## Migration Plan

Implementar primero coordinación de recursos/transiciones, después variantes y precarga por intención. Validar cada etapa con el mismo harness. Conservar originales y referencias anteriores para revertir la implementación y los assets sin cambios de datos ni rutas. Publicación queda fuera del plan de implementación local.

## Open Questions

Sin decisiones de producto bloqueantes. Durante implementación se determinará la variante de imagen aceptable por pantalla y se documentará disponibilidad de iPhone/iPad físico para QA. Cualquier cambio visual o de duración requeriría una decisión nueva del usuario.


## Ajustes confirmados durante implementación

- La compilación anterior no emitía la clase arbitraria de duración de 2500 ms: `getComputedStyle` devolvía 150 ms. Se fija explícitamente la duración de 2500 ms ya declarada en el visor y en este plan; por eso el cambio deja de sentirse como un corte de 150 ms.
- La entrada mantiene su animación de 1000 ms. El fondo pasa del placeholder de la misma fotografía a su variante preparada en 600 ms; el temporizador espera también esa presentación. Los detalles siguientes se presentan sin esperar su fondo, conservando la imagen saliente durante el fundido.
- Se eligieron WebP a calidad 85 y anchos 800/1600/2400 cuando el original permite esos tamaños. Los originales permanecen intactos.
- La primera ronda de mediciones reutilizaba validaciones HTTP de caché entre navegaciones. Se descartó como línea base fría y se repitió habilitando Network y deshabilitando su caché después de cada navegación, con documento nuevo y verificación de bytes transferidos.
