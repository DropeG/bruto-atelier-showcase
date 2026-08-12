## ADDED Requirements

### Requirement: Navigation Menu Next Season Subpanel
El menú de navegación de Bruto Atelier DEBE activar una pestaña o panel desplegable in-situ (`activePanel === "vestuario"`) al hacer clic en "Vestuario", sin cambiar de ruta ni redirigir a una página externa.

#### Scenario: User clicks Vestuario in Navigation Menu
- **WHEN** el usuario hace clic en "Vestuario" en el menú de navegación (desktop o móvil)
- **THEN** se despliega el panel in-situ con el tag "NEXT SEASON", título "VESTUARIO" y bajada editorial ligera sin salir del menú ni efectuar peticiones HTTP pesadas.

### Requirement: Lightweight Single-Asset Fallback Page
La vista de categoría para rutas no activas (`ComingSoonView`) DEBE renderizar una tarjeta editorial liviana con una única imagen optimizada, sin ejecutar scripts de precarga masivos en bucle ni tiras de miniaturas.

#### Scenario: Direct URL access to showcase category
- **WHEN** un usuario navega directamente a `/showcase/vestuario` por URL
- **THEN** la aplicación renderiza de forma instantánea la vista editorial sutil sin sobrecarga de memoria ni errores de desbordamiento de viewport en dispositivos móviles.
