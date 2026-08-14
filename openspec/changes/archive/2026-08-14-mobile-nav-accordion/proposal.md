## Why

In mobile screens (< 768px), opening the "Mobiliario" submenu in the navigation menu triggers an absolute horizontal popout overlay (`left-[120px] w-[150px]`). This creates a visual overlap collision with right-aligned elements in the menu drawer, specifically category tags and "Next Season / NEXT YEAR" badges. Replacing the horizontal popout with an in-flow vertical accordion expansion ensures clean spatial hierarchy, smooth touch interactions, and eliminates visual collisions.

## What Changes

- Replace horizontal popout overlay for "Mobiliario" in mobile view with a smooth, vertical accordion drop-down beneath the "Mobiliario" link.
- Indent sub-links ("Colección", "Serie", "Piezas") vertically under "Mobiliario" when active.
- Animate vertical expansion and collapse smoothly using Framer Motion (`AnimatePresence` and height transition).
- Maintain existing touch target sizes (minimum 44px) for all sub-links on mobile devices.

## Capabilities

### New Capabilities
- `mobile-nav-accordion`: Vertical accordion menu expansion for navigation sub-items on mobile screen sizes without horizontal overlap.

### Modified Capabilities

## Impact

- Affected code: `src/components/Navigation.tsx`
- Affected devices: Mobile viewports (< 768px). Desktop layout (>= 768px) remains unchanged.
