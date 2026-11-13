## ADDED Requirements

### Requirement: Contención estricta de la portada editorial en el flujo WACHI
El contenedor `.wachi-collection-flow__story` SHALL restringir la altura de `<ShowcaseViewer />` a exactamente el alto de su sección (`100dvh` / `100%`) y recortar cualquier desborde vertical (`overflow: hidden`) en navegadores móviles y de escritorio.

#### Scenario: Portada contenida sin desbordar hacia la grilla en Mobile
- **WHEN** el usuario accede a **Mobiliario → Colección WACHI** desde un navegador móvil con barras de interfaz dinámicas visibles (como Safari iOS)
- **THEN** la sección `.wachi-collection-flow__story` y su visor hijo no exceden `100dvh` ni invaden el espacio superior de la sección `.wachi-collection-flow__grid`

### Requirement: Cobertura blanca completa al bajar a la Colección WACHI en Mobile
La sección de la grilla de productos (`.wachi-collection-flow__grid` y `.wachi-collection`) SHALL posicionarse por encima de la portada editorial (`z-index` superior) con fondo blanco puro (`#fff`), garantizando que toda la pantalla superior e inferior se vea completamente blanca al hacer scroll hacia abajo.

#### Scenario: Scroll hacia abajo desde la foto inicial hasta los productos en Mobile
- **WHEN** el usuario desliza hacia abajo desde la portada de WACHI hacia la grilla de productos en celular
- **THEN** toda la pantalla, incluida la zona superior detrás del header (`←`, `BRUTO Atelier`, ícono de bolsa), se muestra 100% con fondo blanco limpio sin franjas de la foto anterior

#### Scenario: Scroll de retorno hacia la portada editorial
- **WHEN** el usuario se encuentra en la grilla de productos de WACHI en celular y desliza hacia arriba
- **THEN** el sistema mantiene el comportamiento de `scroll-snap` y permite regresar a la foto de portada inicial sin bloqueos

### Requirement: Inicio siempre en la foto superior al reingresar desde el menú
Al entrar a **Mobiliario → Colección WACHI** (`/showcase/mobiliario/coleccion` o `/coleccion`), el documento SHALL reiniciarse en la parte superior (`scrollY = 0`) mostrando la portada editorial antes de habilitar el `scroll-snap`, tanto en la primera visita como en reingresos posteriores tras haber bajado a la grilla y vuelto con la flecha `←`.

#### Scenario: Reingreso tras haber bajado a la grilla y vuelto con la flecha de retorno
- **WHEN** el usuario baja en **Mobiliario → Colección WACHI** hasta la grilla de productos, pulsa la flecha de retorno (`←`) para salir, abre el menú y selecciona nuevamente **Mobiliario → Colección WACHI**
- **THEN** la pantalla abre en la parte superior mostrando la foto editorial (`ShowcaseViewer`) con `scrollY = 0` y no salta directamente a la grilla de productos
