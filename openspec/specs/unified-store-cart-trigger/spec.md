# unified-store-cart-trigger Specification

## Purpose
TBD - created by archiving change unify-hero-cart. Update Purpose after archive.
## Requirements
### Requirement: Hero navigation cart button opens CartDrawer and reflects cart quantity
The shopping bag button in `Navigation.tsx` (both desktop and mobile headers) SHALL connect to `ShopifyContext` (`useShopify()`), open `CartDrawer` when clicked (`openCart`), and display the active cart unit count (`cart.totalQuantity`) whenever `totalQuantity > 0`.

#### Scenario: Clicking Hero cart icon opens CartDrawer
- **WHEN** the user clicks the shopping bag button in the Hero navigation header (desktop or mobile)
- **THEN** `openCart` is called and `CartDrawer` becomes visible displaying the current cart contents

#### Scenario: Hero cart displays updated count when items are in cart
- **WHEN** `cart.totalQuantity` is greater than `0` (e.g., after adding items in a collection or restoring a persisted cart)
- **THEN** the Hero shopping bag button displays the numeric count `cart.totalQuantity` next to `/bag.svg`
- **AND** updates its `aria-label` to include the piece count

#### Scenario: Hero cart hides count when cart is empty
- **WHEN** `cart` is `null` or `cart.totalQuantity` is `0`
- **THEN** no numeric counter badge is rendered next to `/bag.svg` in the Hero navigation

### Requirement: Unified Hero bag icon design and prominent sizing across store views and mobile
All shopping bag triggers across the store (`Navigation.tsx`, `CollectionShowcase.tsx`, and `WachiCollection.tsx`) SHALL render the Hero bag design (`/bag.svg`) instead of `lucide-react`'s `ShoppingBag` icon, scaled to match the Hero visual presence on desktop and enlarged on mobile for clear visibility and easy tapping.

#### Scenario: Collection headers render the Hero bag icon at full Hero scale
- **WHEN** the user views any collection page (`CosmosCollection`, `AccessoriesCollection`, or `WachiCollection`) on desktop or mobile
- **THEN** the header shopping bag button renders the `/bag.svg` icon at matching Hero scale (`58px` on desktop, `64px` on mobile) with `cart.totalQuantity` (when `> 0`) and opens `CartDrawer` on click

#### Scenario: Mobile cart button provides a prominent visual icon and comfortable touch target
- **WHEN** the user views the Hero or any collection page on a mobile viewport (`<= 767px`)
- **THEN** the `/bag.svg` icon renders at `64px × 64px` inside a button with at least `48px × 48px` interactive touch area

#### Scenario: Add-to-cart pulse animation preserved on collection bag icon
- **WHEN** a user adds a product to the cart in `CollectionShowcase`
- **THEN** the `/bag.svg` icon and its counter badge perform the visual pulse animation

### Requirement: Clean Resumen de Compra view without redundant cart icon or floating Home buttons
When `CartDrawer` (Resumen de Compra) is open, it SHALL NOT display a shopping bag icon in its top-right header, and floating Home buttons (`DiscountButton` `-10%` and `WhatsAppButton` `HABLEMOS`) SHALL NOT be visible.

#### Scenario: CartDrawer header omits top-right cart icon
- **WHEN** `CartDrawer` is open
- **THEN** the header renders the back button (`Volver`) on the left and does not render a shopping bag button on the right

#### Scenario: Floating discount and WhatsApp buttons are hidden when CartDrawer is open
- **WHEN** `CartDrawer` is opened from the Home page (`Index.tsx`)
- **THEN** neither the `-10%` (`DiscountButton`) nor the `HABLEMOS` (`WhatsAppButton`) button is visible over the Resumen de Compra view

