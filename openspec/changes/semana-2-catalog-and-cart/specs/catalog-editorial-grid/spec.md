## ADDED Requirements

### Requirement: Responsive Grid Layout
The system SHALL display the catalog in a responsive grid structure: 3 columns on Desktop, 2 columns on Tablet, and 1 column on Mobile to maximize visual impact.

#### Scenario: Mobile viewing
- **WHEN** the viewport is less than 768px (MD breakpoint)
- **THEN** products stack vertically in a single column taking up full width with minimal padding.

### Requirement: Desktop Hover Interactions
The system SHALL perform a smooth image crossfade on Desktop devices when hovering over a product image.

#### Scenario: Desktop hover
- **WHEN** a cursor hovers over a product card image
- **THEN** the primary image fades out smoothly and the secondary/detail image fades in.

### Requirement: Cinematic Media Interruption
The system SHALL support inserting full-width or multi-column spanning video/photo assets in between grid rows.

#### Scenario: Immersive scroll break
- **WHEN** rendering the product grid data
- **THEN** periodic cinematic assets (e.g. from existing projects) span the full available width to break the grid pattern.
