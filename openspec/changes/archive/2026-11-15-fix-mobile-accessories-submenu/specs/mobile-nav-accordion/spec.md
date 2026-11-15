## ADDED Requirements

### Requirement: Vertical accordion expansion for Accesorios in mobile view
The navigation drawer on mobile viewports (< 768px) SHALL expand the Accesorios sub-items vertically in-flow when tapped, matching the behavior of Joyería and Desktop, rather than opening a "Coming Soon" full-screen panel.

#### Scenario: User opens Accesorios accordion on mobile
- **WHEN** the user opens the navigation menu on mobile and taps "Accesorios"
- **THEN** the sub-link ("CUORO") expands vertically directly underneath "Accesorios"
- **THEN** the menu does not switch to the "Coming Soon" view

#### Scenario: User navigates to CUORO from mobile Accesorios accordion
- **WHEN** the Accesorios accordion is expanded on mobile and the user taps "CUORO"
- **THEN** the navigation drawer closes and the app navigates to `/coleccion/accesorios` (preserving `?demoMode=true` if active)

#### Scenario: User collapses Accesorios accordion on mobile
- **WHEN** the user taps "Accesorios" while its sub-menu is expanded
- **THEN** the "CUORO" sub-link collapses vertically and lower menu links smoothly return to their default spacing
