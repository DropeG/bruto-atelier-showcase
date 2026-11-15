## 1. Stage Vertical Navigation Hook & Styles

- [x] 1.1 Create `src/hooks/use-stage-vertical-nav.ts` to handle non-passive vertical `wheel` gestures (with trackpad inertia cooldown), vertical touch swipes (`touchstart`/`touchend`), and `ArrowDown`/`ArrowUp` keyboard navigation when a collection stage is active and `pieces.length > 1`.
- [x] 1.2 Update `src/styles/wachi-collection.css` to lock scroll-snapping on `html:has(.wachi-collection-flow .wachi-collection--stage-active)` and add `overscroll-behavior-y: contain` on `.wachi-stage` so vertical scrolling inside a piece never snaps the page back to the story section.
- [x] 1.3 Add `.wachi-stage__media-slot` (and `.wachi-stage__media-slot--sliding`) styles in `src/styles/wachi-collection.css` so the vertical slide animation is cleanly contained within the photo viewport without overlapping the stationary title or controls.
- [x] 1.4 Update `src/hooks/use-stage-vertical-nav.ts` to intercept `touchmove` with `{ passive: false }` and call `event.preventDefault()` while a piece stage is active so mobile touch swipes never scroll the background page.
- [x] 1.5 Update `src/styles/wachi-collection.css`, `src/pages/WachiCollection.tsx`, and `src/components/CollectionShowcase.tsx` to apply `.wachi-collection--piece-stage` (`touch-action: none`, `overflow: hidden`, fixed `100dvh` stage height, and scroll-into-view alignment on open) so the page behind the stage stays completely fixed on mobile.

## 2. WACHI Collection Media-Only Vertical Slide (`WachiCollection.tsx`)

- [x] 2.1 Integrate `useStageVerticalNav` in `src/pages/WachiCollection.tsx` (enabled when `activePiece` is present and `!isRequestDrawerOpen && !isCartOpen`) to cycle circularly through `Set → Mesa → Silla → Banqueta → Set`.
- [x] 2.2 Refactor `src/pages/WachiCollection.tsx` so `<motion.section className="wachi-stage">` uses a stable key (`wachi-stage`) and remains stationary (keeping arrows, dots, title, description, price, and button anchored in place), while wrapping only `.wachi-stage__media` in `<AnimatePresence mode="popLayout" custom={slideDirection}>` so only the product photo slides vertically.

## 3. Shared Collection Showcase Media-Only Vertical Slide (`CollectionShowcase.tsx`)

- [x] 3.1 Integrate `useStageVerticalNav` in `src/components/CollectionShowcase.tsx` (enabled when `activePiece` is present, `pieces.length > 1`, and `!isCartOpen`) so multi-piece collections like `CUORO` cycle circularly (`Tabaquera → Sleeve → Tarjetero → Tabaquera`) while single-piece collections (`COSMOS`) ignore vertical scroll.
- [x] 3.2 Refactor `src/components/CollectionShowcase.tsx` so `<motion.section className="wachi-stage">` uses a stable key (`${layoutPrefix}-stage`) and remains stationary, while wrapping only `.wachi-stage__media` in `<AnimatePresence mode="popLayout" custom={slideDirection}>` so only the product photo slides vertically.

## 4. Verification & Tests

- [x] 4.1 Update `src/pages/CollectionVerticalScroll.test.tsx` to verify that mobile `touchmove` events inside an active stage call `preventDefault()` (locking background scroll) while still triggering the piece transition on `touchend`, and run `npm test` + `npm run build`.
