## ADDED Requirements

### Requirement: Snap diferido en el flujo editorial-grilla de Colección WACHI
El contenedor `.wachi-collection-flow` SHALL iniciar sin `scroll-snap-type: y mandatory` activo al montarse y SHALL habilitar el snap vertical (`data-snap-ready="true"`) únicamente después de que la vista esté asentada en la parte superior (`scrollY = 0`) tras el cierre del menú o al detectar la primera interacción de desplazamiento del usuario (`touchstart` / `wheel`).

#### Scenario: Reingreso desde el menú en iOS Safari tras haber bajado a la grilla y vuelto con la flecha
- **WHEN** el usuario entra a **Mobiliario → Colección WACHI**, baja hasta la grilla blanca de productos, toca la flecha de retorno (`←`) para volver al inicio, abre el menú y selecciona nuevamente **Mobiliario → Colección WACHI** en iOS Safari
- **THEN** la pantalla se abre arriba mostrando la foto editorial superior (`.wachi-collection-flow__story`) en `scrollY = 0` y no salta automáticamente hacia la grilla de productos

#### Scenario: Deslizamiento manual hacia la grilla tras el reingreso
- **WHEN** el usuario ya está en la parte superior de **Mobiliario → Colección WACHI** y desliza hacia abajo para ver los productos
- **THEN** el sistema activa `data-snap-ready="true"` y realiza el `scroll-snap` hacia la grilla blanca de productos con normalidad

### Requirement: Bloqueo de restauración automática de scroll del navegador en flujo WACHI
Durante la permanencia en `/showcase/mobiliario/coleccion`, el sistema SHALL establecer `history.scrollRestoration` en `'manual'` (restaurando su valor previo al desmontar) y limpiar `menu-open` antes de aplicar `scrollTo(0, 0)` para evitar que iOS Safari ignore el reinicio por `overflow: hidden` o restaure un desplazamiento previo.

#### Scenario: Salida con flecha de retorno y limpieza de estado
- **WHEN** el usuario toca la flecha `←` en la grilla blanca de `WachiCollection`
- **THEN** el scroll del documento se reinicia a `0` sin interferencia de `scroll-behavior: smooth` ni de restauración automática del historial
