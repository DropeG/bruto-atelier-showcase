## Why

Client feedback on the navigation drawer identified styling defects and visual clutter: the active/hover highlight box on category items lacks proportional padding (text touches the left boundary due to container overflow clipping), the "• BRUTO ATELIER" label on the preview card is redundant with "NEXT SEASON", and the footer text "DISPONIBLE PRÓXIMAMENTE · 2026" clutters the preview card. Cleaning these elements creates an ultra-minimal, refined editorial presentation aligned with the brand's aesthetic standards (Zara Home / Audo Copenhagen).

## What Changes

- **Proportional padding for navigation item highlights**: Fix the horizontal alignment and clipping defect on desktop and mobile navigation items. Remove negative margins (`-mx-3`) that were being clipped by `overflow-y-auto`, ensuring symmetric, proportional breathing room around the text and badge.
- **Active state background persistence**: Ensure that the selected/active category retains the light beige highlight background (`bg-[#EAD0B9]`) when its panel is open, providing clear visual feedback without relying on browser-default focus rings.
- **Remove redundant brand subheader**: Remove "• BRUTO Atelier" next to "NEXT SEASON" on preview cards in both desktop and mobile views, keeping only "NEXT SEASON".
- **Remove availability footer**: Remove "DISPONIBLE PRÓXIMAMENTE · 2026" / "Disponible Próximamente · 2026" from preview cards in both desktop and mobile views.
- **Clean focus states**: Remove default blue browser focus rings on navigation buttons, replacing with clean, accessible styling.

## Capabilities

### New Capabilities
- `clean-next-season-nav`: Refined spacing, persistent active states, and minimal preview card layout for Next Season navigation items in desktop and mobile drawers.

### Modified Capabilities

## Impact

- Affected files: `src/components/Navigation.tsx`.
- No API, database, or breaking changes. Visual and layout refinement only.
