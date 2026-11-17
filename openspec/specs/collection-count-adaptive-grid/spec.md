## Requirements

### Requirement: Exposición de cantidad y paridad de piezas en la grilla de colección
`CollectionShowcase` SHALL exponer en el DOM la cantidad de piezas (`data-piece-count`) y su paridad (`data-piece-parity="odd" | "even"`) en el contenedor de la grilla (`.wachi-collection__grid`) y en `.wachi-collection__content` para permitir que los estilos responsivos adapten la distribución sin lógica manual por colección.

#### Scenario: Grilla con una sola pieza
- **WHEN** `CollectionShowcase` recibe exactamente 1 pieza en `pieces`
- **THEN** `.wachi-collection__grid` incluye `data-piece-count="1"` y `data-piece-parity="odd"` junto con la clase `wachi-collection__grid--single`

#### Scenario: Grilla con múltiples piezas
- **WHEN** `CollectionShowcase` recibe 2, 3 o más piezas en `pieces`
- **THEN** `.wachi-collection__grid` refleja el conteo exacto en `data-piece-count` y `data-piece-parity="even"` (para 2, 4, ...) u `"odd"` (para 3, 5, ...)

### Requirement: Aprovechamiento adaptativo del espacio en móvil según cantidad de piezas
Para colecciones con clase `.accessories-collection`, el layout móvil (`<= 700px`) SHALL adaptar dimensiones de imagen, número de columnas y centrado vertical en función de `data-piece-count` y `data-piece-parity` manteniendo la estética editorial minimalista.

#### Scenario: Vista móvil con 1 pieza (ej. COSMOS actual)
- **WHEN** una colección `.accessories-collection` tiene `data-piece-count="1"` en móvil
- **THEN** el contenido se centra verticalmente dentro del viewport disponible y la pieza ocupa un ancho y alto protagónicos superiores al layout de grilla múltiple, eliminando el espacio vacío excesivo inferior

#### Scenario: Vista móvil con 2 piezas
- **WHEN** una colección `.accessories-collection` tiene `data-piece-count="2"` en móvil
- **THEN** las 2 piezas se muestran centradas verticalmente en el viewport con distribución simétrica y sin forzar que la segunda pieza ocupe fila completa

#### Scenario: Vista móvil con 3 piezas (ej. CUORO)
- **WHEN** una colección `.accessories-collection` tiene `data-piece-count="3"` en móvil
- **THEN** se mantiene la grilla de 2 columnas en la primera fila y la 3ª pieza centrada en la segunda fila

#### Scenario: Vista móvil con 4 o más piezas
- **WHEN** una colección `.accessories-collection` tiene 4 o más piezas en móvil
- **THEN** la grilla usa 2 columnas uniformes; si `data-piece-parity="even"` todas las filas quedan completas de a 2, y si `data-piece-parity="odd"` solo la última pieza se centra ocupando la fila inferior

### Requirement: Distribución proporcional en escritorio para 2 piezas
En escritorio (`> 700px`), cuando una colección `.accessories-collection` tiene `data-piece-count="2"`, la grilla SHALL usar 2 columnas centradas en lugar de 3 columnas con un espacio vacío a la derecha.

#### Scenario: Vista escritorio con 2 piezas
- **WHEN** una colección `.accessories-collection` tiene `data-piece-count="2"` en escritorio
- **THEN** la grilla renderiza 2 columnas centradas horizontalmente
