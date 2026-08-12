## ADDED Requirements

### Requirement: Contextual Detail Drawer
The system SHALL present product details within a sliding contextual panel (drawer) rather than redirecting to a dedicated product page, ensuring the user's scroll position in the catalog is maintained.

#### Scenario: Opening product details on Desktop
- **WHEN** the user clicks a product card on Desktop
- **THEN** a Side-Drawer slides in from the right covering ~30-40% of the screen.

#### Scenario: Opening product details on Mobile
- **WHEN** the user taps a product card on Mobile
- **THEN** a Bottom-Sheet slides up from the bottom of the screen covering ~85% of the viewport.

### Requirement: Immersive Asset Integration
The system SHALL allow viewing high-resolution imagery and videos within the drawer's top section.

#### Scenario: Exploring product variants
- **WHEN** the user views the product drawer
- **THEN** a swipeable carousel or autoplaying video of the product details is visible at the top of the drawer.
