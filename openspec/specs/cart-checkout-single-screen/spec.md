# cart-checkout-single-screen Specification

## Purpose
TBD - created by archiving change cart-checkout-single-screen. Update Purpose after archive.
## Requirements
### Requirement: Single-screen desktop layout for CartDrawer checkout
The `CartDrawer` checkout view SHALL fit within a single desktop viewport (`100dvh`) without vertical page scrolling on standard laptop and desktop screens (`min-width: 901px` and viewport height `>= 700px`) when displaying 1 to 3 cart items.

#### Scenario: Checkout fits on a standard laptop screen without scrolling
- **WHEN** the user opens the shopping bag (`CartDrawer`) with at least one item on a desktop viewport (`>= 901px` wide and `>= 700px` tall)
- **THEN** the top navigation header, **INFORMACIÓN DE CONTACTO**, **DIRECCIÓN DE DESPACHO**, **RESUMEN DE COMPRA**, and the **FINALIZAR COMPRA** submit button are all visible within the viewport without requiring vertical scrolling

### Requirement: Overflow containment for multi-item cart summaries on desktop
The `CartDrawer` summary items list SHALL constrain its height on desktop viewports so that adding multiple distinct products does not push the totals or the checkout form beyond a single screen.

#### Scenario: Many items in cart summary scroll internally
- **WHEN** the user has multiple distinct items in the cart that exceed the available summary column height on desktop (`>= 901px`)
- **THEN** the items list scrolls internally while keeping the totals and the left-hand checkout form with **FINALIZAR COMPRA** visible within the viewport

### Requirement: Mobile layout and WachiRequestDrawer isolation
The compact desktop checkout adjustments SHALL NOT alter the mobile checkout layout (`<= 900px`) or introduce visual regressions in `WachiRequestDrawer`.

#### Scenario: Mobile viewport retains natural stacked scrolling
- **WHEN** the user opens `CartDrawer` on a mobile viewport (`<= 900px`)
- **THEN** the form and summary stack vertically with standard touch-friendly input heights and natural vertical scrolling

#### Scenario: WachiRequestDrawer layout remains unchanged
- **WHEN** the user opens `WachiRequestDrawer` on desktop or mobile
- **THEN** its existing spacing, profile selector, and notes textarea layout remain unaffected by the compact `CartDrawer` styles

