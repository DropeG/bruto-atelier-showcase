# auth-modal-image-performance Specification

## Purpose
TBD - created by archiving change optimize-auth-modal-image. Update Purpose after archive.
## Requirements
### Requirement: Entrega Optimizada de Imagen para Modal de Autenticación
The system SHALL deliver the photographic asset `newsLetter.webp` in dimensions optimized for 2x Retina displays (880 × 1160 px), with a transfer payload under 85 kB in WebP format.

#### Scenario: Visualización en pantallas de alta densidad
- **WHEN** un usuario abre el modal de autenticación en una pantalla de escritorio o monitor 4K
- **THEN** la imagen fotográfica se renderiza nítida y ajustada a la columna de 440 px sin requerir una transferencia superior a 85 kB

### Requirement: Precarga Inteligente en Segundo Plano (Idle Warmup)
The system SHALL pre-warm and cache in memory the authentication modal image exclusively on desktop viewports (`>= 768px`) during browser idle time after initial page load.

#### Scenario: Precarga en pantallas de escritorio
- **WHEN** el usuario navega en un dispositivo con viewport de ancho mayor o igual a 768 px
- **THEN** el sistema inicia la precarga asíncrona de `newsLetter.webp` en memoria de modo que la apertura posterior del modal sea instantánea (0 ms de espera de red)

#### Scenario: Omisión de precarga en móviles
- **WHEN** el usuario navega en un dispositivo móvil con viewport menor a 768 px
- **THEN** el sistema NO descarga `newsLetter.webp`, preservando el consumo de datos móviles

### Requirement: Decodificación Inmediata y Blur Placeholder
The modal image element SHALL load eagerly (`loading="eager"`), decode asynchronously (`decoding="async"`), and display a Base64 blur placeholder while full-resolution rendering completes.

#### Scenario: Apertura inmediata del modal sin cuadros vacíos
- **WHEN** el usuario hace clic en el disparador del modal de autenticación
- **THEN** el contenedor muestra inmediatamente el blur placeholder en Base64 y realiza una transición suave hacia la imagen nítida sin mostrar un fondo café plano

