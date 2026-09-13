## ADDED Requirements

### Requirement: Proportional padding on navigation items
The navigation item buttons in the desktop and mobile menus SHALL have balanced, proportional left and right padding inside their background highlight, without being clipped by the list container.

#### Scenario: Hovering or selecting a category item
- **WHEN** user hovers over or activates a category button (such as "Joyería")
- **THEN** the highlight box contains visible, symmetric padding between the left border of the box and the start of the label text.

### Requirement: Persistent active highlight on open panels
When a navigation item corresponds to the currently open panel (`activePanel`), the button SHALL maintain its light highlight background (`bg-[#EAD0B9]`).

#### Scenario: Next Season panel is open
- **WHEN** user clicks on a Next Season category (such as "Esenciales" or "Joyería")
- **THEN** the button remains highlighted with `bg-[#EAD0B9]` while the panel is visible.

### Requirement: Clean Next Season preview card header
The Next Season preview card SHALL display "NEXT SEASON" as its top tracking label without appending "• BRUTO Atelier".

#### Scenario: Opening Next Season preview panel
- **WHEN** user opens any Next Season category panel
- **THEN** the top tracking label reads "NEXT SEASON" in both desktop and mobile views.

### Requirement: Removal of redundant availability footer
The Next Season preview card SHALL NOT display the footer text "DISPONIBLE PRÓXIMAMENTE · 2026" or "Disponible Próximamente · 2026".

#### Scenario: Inspecting the preview card
- **WHEN** the preview card renders
- **THEN** the space below the category image is clean with no redundant availability footer text.
