## Context

Bruto Atelier's collection pages follow a Yeezy-inspired grid-to-stage pattern implemented in `src/pages/WachiCollection.tsx` (`WACHI`: `Set`, `Mesa`, `Silla`, `Banqueta`) and `src/components/CollectionShowcase.tsx` (`CUORO`: `Tabaquera`, `Sleeve`, `Tarjetero`; `COSMOS`: `Anillo Cosmos`).

While media-only vertical slide transitions work cleanly, testing on mobile revealed that performing a vertical touch swipe inside the product stage also scrolls the underlying page in the background. On mobile browsers (iOS Safari, Chrome Android), passive `touchstart`/`touchend` listeners do not stop native document panning during `touchmove`, and if the user scrolled down the 2-column mobile grid before tapping a product, the document remains scrollable while in the stage.

## Goals / Non-Goals

**Goals:**
- Allow users in the product detail stage (`.wachi-stage`) to cycle through pieces of the **current collection only** via vertical scroll (mouse wheel / trackpad), vertical touch swipe, and `ArrowDown` / `ArrowUp` keys in circular order.
- **Animate only the product photograph (`.wachi-stage__media`) vertically** when transitioning between pieces inside the stage while keeping `.wachi-stage`, arrows, dots, and `.wachi-stage__info` stationary.
- **Lock background page scroll completely on mobile and desktop while a piece is open in `.wachi-stage`**: swiping vertically on a phone must only trigger the product transition, with zero movement, panning, or rubber-band bounce of the page behind it.
- Keep normal vertical scrolling enabled in the collection grid (when no piece is open) and inside open drawers (`WachiRequestDrawer` and `CartDrawer`).

**Non-Goals:**
- Blocking scroll when viewing the collection grid or when filling out the `WachiRequestDrawer` / `CartDrawer`.
- Crossing boundaries between collections.

## Decisions

### 1. Stable Outer `.wachi-stage` + Inner `<AnimatePresence>` on `.wachi-stage__media`
- **Decision**: Keep `key="wachi-stage"` / `key={`${layoutPrefix}-stage`}` stable on `<motion.section className="wachi-stage">` and wrap `.wachi-stage__media` inside `.wachi-stage__media-slot` with `<AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>`.

### 2. Mobile Touch-Move Interception + CSS Viewport Lock on `.wachi-stage`
- **Decision**:
  1. In `src/hooks/use-stage-vertical-nav.ts`, add a non-passive `touchmove` listener (`{ passive: false }`) active whenever the product stage is open (`lockScroll` / `enabled`). When a single-finger touch drag occurs inside the stage, call `event.preventDefault()` if `event.cancelable` is true so mobile Safari/Chrome never pans the document.
  2. In `src/styles/wachi-collection.css`, apply `touch-action: none` and `overscroll-behavior: none` to `.wachi-stage`, and lock `.wachi-collection--piece-stage` (active when `activePiece` is open and `!isRequestDrawerOpen`) to `height: 100dvh; max-height: 100dvh; overflow: hidden;` (and `html:has(.wachi-collection--piece-stage), body:has(.wachi-collection--piece-stage) { overflow: hidden; overscroll-behavior: none; }`).
  3. In `.wachi-collection-flow` (`Category.tsx`), when `.wachi-collection--piece-stage` is active, scroll the `.wachi-collection-flow__grid` section to the top of the viewport (`scrollIntoView` / `window.scrollTo` on piece open) so locking `overflow: hidden` frames the stage cleanly at 100% viewport height.

## Risks / Trade-offs

- **[Risk] Locking scroll when `WachiRequestDrawer` or `CartDrawer` is open** → **Mitigation**: Use a dedicated modifier `.wachi-collection--piece-stage` that is only present when `Boolean(activePiece) && !isRequestDrawerOpen` (and release the touchmove interception when `isCartOpen` or `isRequestDrawerOpen` is true), ensuring forms and cart lists remain scrollable on small screens.
