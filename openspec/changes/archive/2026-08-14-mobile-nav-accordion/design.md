## Context

In `src/components/Navigation.tsx`, the mobile menu container (`md:hidden`) currently renders an absolute popout overlay (`absolute left-[120px] -top-2 w-[150px]`) when `activePanel === "mobiliario"`. On narrow mobile screens, this popout collides horizontally with category labels and "Next Season / NEXT YEAR" badges on the right edge of the navigation list.

## Goals / Non-Goals

**Goals:**
- Transition the mobile Mobiliario sub-menu from absolute horizontal positioning (`left-[120px]`) to an inline, vertical accordion drop-down.
- Animate expansion/collapse using Framer Motion (`AnimatePresence` with `height` / `opacity` transitions).
- Preserve existing 44px touch targets on mobile for touch accessibility.
- Preserve desktop (`md:flex`) horizontal popout/panel behavior unchanged.

**Non-Goals:**
- Modifying desktop navigation behavior (`md:` classes).
- Changing sub-menu behavior for "Nosotros", "Contacto", or "Next Season" categories.

## Decisions

### Decision 1: In-flow vertical Framer Motion expansion for mobile Mobiliario sub-menu
- **Approach**: Replace the `absolute left-[120px]` popout in the `md:hidden` block with an inline `<motion.div>` that expands height (`initial={{ height: 0, opacity: 0 }}`, `animate={{ height: "auto", opacity: 1 }}`) directly below the Mobiliario item button.
- **Rationale**: Keeps all sub-links strictly within the flow of the `300px` drawer container without overflowing or overlapping right-aligned badges.
- **Alternatives Considered**: Slide-in drill-down panel (Option 2) - discarded to keep all top-level categories visible while navigating Mobiliario.

## Risks / Trade-offs

- **[Risk]** Layout jumping if animation heights aren't properly constrained.
  - *Mitigation*: Use Framer Motion `overflow-hidden` container with smooth duration (`0.25s`) and easeOut curves.
