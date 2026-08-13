# Analytics

## Purpose
TBD - Track user activity and pageviews.

## Requirements

### Requirement: Pageview Tracking
El sistema MUST registrar cada visita a una página de la aplicación usando Vercel Analytics para medir el tráfico sin utilizar cookies ni requerir un banner de consentimiento.

#### Scenario: User visits the site
- **WHEN** un usuario entra a cualquier página del sitio web (ej. el Home o el catálogo).
- **THEN** Vercel Analytics registra una vista de página asociada a esa ruta de forma anónima.

#### Scenario: Client-side navigation
- **WHEN** el usuario navega a través de los enlaces de la SPA (Single Page Application) sin recargar el navegador.
- **THEN** Vercel Analytics detecta el cambio de ruta y registra una nueva vista de página automáticamente.
