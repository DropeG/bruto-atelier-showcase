# collection-stage-vertical-scroll Specification

## Purpose
TBD - created by archiving change collection-stage-vertical-scroll. Update Purpose after archive.
## Requirements
### Requirement: Circular vertical navigation between pieces within a collection stage
When a user is viewing a piece inside a collection's detail stage (`.wachi-stage`) and the collection contains more than one piece, the system SHALL allow navigating to the next or previous piece in that same collection via vertical scroll (mouse wheel / trackpad), vertical touch swipe, or keyboard (`ArrowDown` / `ArrowUp`), wrapping around circularly at both ends of the collection's piece list.

#### Scenario: Scrolling down through WACHI pieces in circular order
- **WHEN** the user opens `Set` in the `WACHI` collection stage and performs successive downward scroll gestures
- **THEN** the stage transitions in order `Set → Mesa → Silla → Banqueta → Set` without leaving the `WACHI` collection

#### Scenario: Scrolling up wraps from first piece to last piece
- **WHEN** the user is viewing the first piece of a multi-piece collection (e.g., `Set` in `WACHI` or `Tabaquera` in `CUORO`) and scrolls up (or presses `ArrowUp` or swipes down)
- **THEN** the stage transitions to the last piece of that same collection (`Banqueta` in `WACHI` or `Tarjetero` in `CUORO`)

#### Scenario: Strict isolation per collection
- **WHEN** the user cycles through pieces in `CUORO` (`Tabaquera`, `Sleeve`, `Tarjetero`)
- **THEN** only `CUORO` pieces are shown and no pieces from `WACHI` or `COSMOS` are ever entered

#### Scenario: Single-piece collection does not trigger vertical piece transitions
- **WHEN** the user opens `Anillo Cosmos` in the `COSMOS` collection (which has only 1 piece) and scrolls vertically
- **THEN** the stage remains on `Anillo Cosmos` without triggering a vertical slide transition

### Requirement: Media-only directional vertical slide animation and stationary stage chrome
When transitioning between pieces inside the detail stage via vertical navigation, the system SHALL animate **only the product photograph (`.wachi-stage__media`)** with a directional vertical slide matching the gesture direction while keeping the stage shell (`.wachi-stage`), perspective arrows (`.wachi-stage__arrow`), perspective dots (`.wachi-stage__dots`), and product info block (`.wachi-stage__info`) stationary in place, resetting the perspective index to `0` and closing any open size or color picker.

#### Scenario: Downward scroll slides only the product photo in from below while info stays anchored
- **WHEN** the user scrolls down to advance to the next piece in the collection stage
- **THEN** the current product photograph (`.wachi-stage__media`) slides upward out of the media slot while the next product photograph slides upward into place from below (`index 0`), and the arrows, dots, title, description, price, and action button remain stationary without sliding vertically

#### Scenario: Upward scroll slides only the product photo in from above while info stays anchored
- **WHEN** the user scrolls up to return to the previous piece in the collection stage
- **THEN** the current product photograph (`.wachi-stage__media`) slides downward out of the media slot while the previous product photograph slides downward into place from above (`index 0`), and the arrows, dots, title, description, price, and action button remain stationary without sliding vertically

#### Scenario: Open size or color selector resets on vertical piece change
- **WHEN** the size selector in `WACHI` (`Mesa`) or color selector in `CollectionShowcase` is open and the user scrolls vertically to another piece
- **THEN** the selector closes and the incoming piece renders in its default state

### Requirement: Gesture debouncing, mobile touch-scroll lock, and scroll-snap isolation
The system SHALL debounce vertical scroll gestures so a single scroll wheel or trackpad flick advances by at most one piece, SHALL lock native document scrolling and mobile touch panning (`touchmove` prevention and `touch-action: none` / `overflow: hidden`) while a product stage is open so swiping on mobile never scrolls the page behind the stage, and SHALL pause this lock when checkout/request drawers or the shopping bag drawer are open.

#### Scenario: Single trackpad flick advances one piece
- **WHEN** the user performs a single trackpad flick with momentum in the collection stage
- **THEN** the stage advances by exactly one piece and ignores trailing inertia events during the transition cooldown

#### Scenario: Mobile vertical swipe changes piece without scrolling the background page
- **WHEN** the user is viewing a piece in the stage on a mobile device and drags their finger vertically (`touchstart` → `touchmove` → `touchend`)
- **THEN** the `touchmove` event's default native page scroll is prevented, `.wachi-stage` remains fixed in the viewport, and only the piece transition is triggered

#### Scenario: Scrolling up inside WACHI stage does not snap back to editorial story
- **WHEN** the user enters `WACHI` via `/showcase/mobiliario/coleccion`, opens a piece in the stage, and scrolls upward
- **THEN** the stage transitions to the previous `WACHI` piece and the document does NOT scroll back up to `.wachi-collection-flow__story`

#### Scenario: Vertical stage navigation and scroll lock pause when request or cart drawer is open
- **WHEN** `WachiRequestDrawer` or `CartDrawer` is open over the collection page
- **THEN** vertical scrolling operates normally inside the open drawer without changing the active piece in the background

