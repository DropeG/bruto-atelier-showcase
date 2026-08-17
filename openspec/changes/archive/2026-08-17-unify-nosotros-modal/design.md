## Context

Bruto Atelier presents its brand philosophy through an editorial popup dialog (`NosotrosModal`) consisting of a dual-pane layout: a portrait of Creative Director Mladen Marinovic' on the left and the brand manifesto/vision on the right.
Currently, this modal is only hooked up to the central "BRUTO Atelier" heading in the Hero section (`HeroSection.tsx`). In contrast, the navigation drawer (`Navigation.tsx`) has a separate nested slide-in panel for "Nosotros", which creates duplicate markup and an inconsistent interaction model.

## Goals / Non-Goals

**Goals:**
- Unify the "Nosotros" trigger across the entire website so that clicking "Nosotros" in the navigation drawer immediately closes the drawer and displays the full `NosotrosModal`.
- Ensure `NosotrosModal` is rendered globally within or alongside `Navigation.tsx` so any route/view with a navigation bar can trigger the modal.
- Clean up obsolete nested drawer subpanel logic and state related to "nosotros" in `Navigation.tsx`.

**Non-Goals:**
- Altering the visual design or copy of `NosotrosModal` itself.
- Changing how other drawer categories (e.g. "Mobiliario", "Contacto", or Next Season placeholders) operate.

## Decisions

1. **Host `NosotrosModal` inside `Navigation.tsx`**:
   - *Rationale*: `Navigation` is rendered on almost every view (`Index`, `Showcase`, `ComingSoon`, etc.). Hosting the modal state (`isNosotrosModalOpen`) inside `Navigation.tsx` makes it instantly functional anywhere without prop drilling or additional global context overhead.
   - *Alternatives considered*: A React Context for modals. Overkill for a single modal needed across existing navigation instances.

2. **Trigger Behavior for "Nosotros" Link**:
   - When the user clicks "Nosotros" in the navigation list (mobile or desktop):
     1. Set `isMenuOpen(false)` (close drawer).
     2. Set `isNosotrosModalOpen(true)` (open modal).

3. **Retain Hero Section Trigger**:
   - `HeroSection` can continue triggering `onOpenNosotros`, or directly delegate to the unified handler.

## Risks / Trade-offs

- [Risk] Animation race condition between closing the navigation drawer and opening the HTML dialog modal.
  → *Mitigation*: Trigger both state changes in the same tick; HTML `<dialog>` with backdrop blur gracefully overlays without animation conflict.
