## ADDED Requirements

### Requirement: Unified Nosotros Modal Trigger
The system SHALL open the full editorial `NosotrosModal` dialog when the user clicks the "Nosotros" navigation item or the Hero section "BRUTO Atelier" title.

#### Scenario: User clicks Nosotros in navigation drawer
- **WHEN** the user opens the navigation drawer and clicks on the "Nosotros" item
- **THEN** the navigation drawer SHALL close
- **THEN** the `NosotrosModal` dialog SHALL open with the brand manifesto and director portrait

#### Scenario: User closes Nosotros modal
- **WHEN** the user clicks the close button ("X"), clicks outside the dialog backdrop, or presses Escape
- **THEN** the `NosotrosModal` dialog SHALL close smoothly
