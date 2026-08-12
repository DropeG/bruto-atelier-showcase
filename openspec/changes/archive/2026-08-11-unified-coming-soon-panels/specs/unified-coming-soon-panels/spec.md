## ADDED Requirements

### Requirement: Generic In-Menu Coming Soon Subpanels
El menú de navegación de Bruto Atelier DEBE desplegar un panel in-situ para cualquiera de las categorías inactivas (`iluminacion`, `esenciales`, `joyeria`, `vestuario`, `accesorios`) al ser seleccionadas en el menú, mostrando la insignia `Coming Soon` y sus datos editoriales sin redirigir de pantalla.

#### Scenario: User clicks an inactive category in Navigation
- **WHEN** el usuario hace clic en "Iluminación", "Esenciales", "Joyería", "Vestuario" o "Accesorios"
- **THEN** la aplicación abre el panel in-situ desplegable correspondiente con el distintivo "COMING SOON • BRUTO ATELIER", la foto 4:5 de previsualización y el estado de lanzamiento sin cambiar de URL.
