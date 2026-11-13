## 1. Compact Checkout Modifier in CartDrawer

- [x] 1.1 Add compact modifier classes (`wachi-collection__header--compact` on the drawer `<header>` and `wachi-checkout--compact` on the checkout `<section>`) in `src/components/CartDrawer.tsx` without altering `WachiRequestDrawer.tsx`.

## 2. Desktop Single-Screen Styles

- [x] 2.1 Add desktop (`@media (min-width: 851px)`) compact layout rules in `src/styles/wachi-collection.css` for `.wachi-collection__header--compact` and `.wachi-checkout--compact` (reduced vertical padding, form/section/field gaps, `38px` input height, and `42px` submit button height) so the full checkout fits within `100dvh` (`>= 700px` viewport height) without vertical page scroll.
- [x] 2.2 Constrain `.wachi-checkout--compact .wachi-checkout__items` on desktop (`min-width: 851px`) with a viewport-relative `max-height` and `overflow-y: auto` so multi-item carts scroll internally without pushing totals or the submit button below the fold.

## 3. Verification

- [x] 3.1 Verify `CartDrawer` in a desktop viewport (e.g. `1280×720` / `1440×800`) to confirm the header, both form sections, summary, and **FINALIZAR COMPRA** button fit on one screen without vertical scrolling.
- [x] 3.2 Verify mobile viewport (`<= 850px`) and `WachiRequestDrawer` to confirm no layout regressions (`npm run build` passed).
