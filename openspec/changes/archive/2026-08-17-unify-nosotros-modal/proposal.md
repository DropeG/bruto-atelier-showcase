## Why

Currently, clicking the "BRUTO Atelier" logo in the Hero section opens the full-screen editorial `NosotrosModal` (featuring the brand manifesto and creative director portrait), while clicking "Nosotros" inside the navigation menu opens an inline sub-panel inside the drawer. This creates an inconsistent and fragmented user experience. Unifying both triggers ensures users get the full editorial storytelling modal regardless of how they access "Nosotros".

## What Changes

- Update the "Nosotros" navigation action across desktop and mobile menus in `Navigation.tsx` to directly open the `NosotrosModal` and close the menu drawer.
- Ensure `NosotrosModal` is globally accessible and managed consistently within navigation components across the site.
- Remove redundant inline drawer sub-panel code for "Nosotros" in `Navigation.tsx`.

## Capabilities

### New Capabilities
- `nosotros-modal-experience`: Unified trigger and display of the editorial Nosotros modal from both the Hero title and navigation menu items across all views.

### Modified Capabilities
<!-- No requirement changes to existing specs -->

## Impact

- `src/components/Navigation.tsx`: Updated link handlers for "Nosotros" to open `NosotrosModal` and close menu drawer; cleanup of unused drawer panel state/markup.
- `src/components/NosotrosModal.tsx`: Rendered in or connected to `Navigation.tsx` so it can be summoned anywhere in the application.
- `src/pages/Index.tsx`: Simplified or aligned with navigation-level modal management.
