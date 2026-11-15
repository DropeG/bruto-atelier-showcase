## Why

Currently, when viewing a single product inside a collection's detail stage (e.g., `WACHI` or `CUORO`), users must return to the collection grid to inspect another piece in the same collection. Replicating Yeezy's vertical scroll-to-next-piece interaction allows users to fluidly cycle through all pieces within the active collection directly from the product stage, where **only the product photograph slides vertically** while the surrounding UI chrome remains anchored in place, and **the underlying page remains completely locked on both desktop and mobile touch devices** (no background page scroll or rubber-banding when swiping vertically).

## What Changes

- Add circular vertical navigation (scroll down = next piece, scroll up = previous piece) inside the product detail stage of collections (`WachiCollection` and `CollectionShowcase`).
- Support mouse wheel / trackpad vertical scroll, vertical touch swipe on mobile/tablet, and `ArrowDown` / `ArrowUp` keyboard navigation when a piece is open in the stage.
- **Media-only vertical slide animation**: Isolate the vertical sliding motion exclusively to the product image container (`.wachi-stage__media` inside a clipped `.wachi-stage__media-slot`), keeping `.wachi-stage`, `.wachi-stage__arrow`, `.wachi-stage__dots`, and `.wachi-stage__info` stationary on screen while updating their content in place.
- **Mobile & Desktop Viewport Lock on Active Stage**: Lock native page scrolling and touch dragging (`touchmove` with `{ passive: false }` calling `event.preventDefault()`, plus `touch-action: none` and `100dvh` overflow lock on `.wachi-stage` / active piece stage) so swiping up or down on mobile changes the piece without scrolling the background page.
- Enforce strict collection isolation so scrolling only cycles through pieces belonging to the currently active collection (`WACHI` cycles `Set → Mesa → Silla → Banqueta → Set`; `CUORO` cycles `Tabaquera → Sleeve → Tarjetero → Tabaquera`; single-piece collections like `COSMOS` do not trigger vertical piece transitions).
- Apply a gesture cooldown/debounce so a single scroll or trackpad flick advances by exactly one piece, resets perspective index to `0`, and closes open size/color pickers.

## Capabilities

### New Capabilities
- `collection-stage-vertical-scroll`: Circular vertical scroll, swipe, and keyboard navigation with media-only directional vertical slide transitions and full mobile/desktop background scroll lock inside a collection's product detail stage.

### Modified Capabilities
<!-- None -->

## Impact

- `src/hooks/use-stage-vertical-nav.ts`: Non-passive `touchmove` listener (`{ passive: false }`) calling `event.preventDefault()` when a stage is active to stop mobile browsers from scrolling the page during vertical swipes.
- `src/pages/WachiCollection.tsx` & `src/components/CollectionShowcase.tsx`: Reset window/stage scroll on piece open and distinguish piece-stage lock (`.wachi-collection--piece-stage`) from scrollable checkout/request drawers.
- `src/styles/wachi-collection.css`: `touch-action: none`, `overscroll-behavior: none`, and viewport height lock (`height: 100dvh; overflow: hidden`) when a product stage is active so mobile swipes never move the page behind the stage.
