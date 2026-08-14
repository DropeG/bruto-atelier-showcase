# mobile-nav-accordion Specification

## Purpose
TBD - created by archiving change mobile-nav-accordion. Update Purpose after archive.
## Requirements
### Requirement: Vertical accordion expansion for Mobiliario in mobile view
The navigation drawer on mobile viewports (< 768px) SHALL expand the Mobiliario sub-items vertically in-flow when tapped, rather than opening an absolute horizontal popout overlay.

#### Scenario: User opens Mobiliario accordion on mobile
- **WHEN** the user opens the navigation menu on mobile and taps "Mobiliario"
- **THEN** the sub-links ("Colección", "Serie", "Piezas") expand vertically directly underneath "Mobiliario"
- **THEN** all lower menu links and badges shift downwards smoothly without horizontal overlapping or clipping

#### Scenario: User collapses Mobiliario accordion on mobile
- **WHEN** the user taps "Mobiliario" while its sub-menu is expanded
- **THEN** the sub-links collapse vertically and lower menu links smoothly return to their default spacing

#### Scenario: Mobile touch target compliance
- **WHEN** the Mobiliario accordion is expanded on mobile
- **THEN** each sub-link ("Colección", "Serie", "Piezas") SHALL provide a minimum touch target height of 44px

