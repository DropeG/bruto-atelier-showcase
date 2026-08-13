## ADDED Requirements

### Requirement: Clickable Next Season Menu Items with Side Panels
El menú de navegación DEBE mostrar la insignia "Next Season" en las categorías no activas y permitir hacer clic en ellas para desplegar una pestaña lateral in-situ (*activePanel*) con el estilo del contenedor "Nosotros".

#### Scenario: User clicks an inactive category item
- **WHEN** el usuario hace clic en "Iluminación", "Esenciales", "Joyería", "Vestuario" o "Accesorios"
- **THEN** la barra de navegación abre la pestaña lateral en móvil con un botón de volver de 20px (área de toque táctil cómoda de 44px) y texto superior de 14px, mostrando el kicker `BRUTO ATELIER` (sin duplicar `NEXT SEASON`), título serif amplio (`text-2xl`), foto de preview de 210px alineada a la izquierda y estado `Disponible Próximamente · 2026` nítido en `11px`.
