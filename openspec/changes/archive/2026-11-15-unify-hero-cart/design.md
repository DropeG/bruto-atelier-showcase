## Context

The application has shopping bag triggers in `Navigation.tsx` (Hero), `CollectionShowcase.tsx` (COSMOS, CUORO), and `WachiCollection.tsx` (WACHI), plus the full-screen `CartDrawer.tsx` (Resumen de Compra).
Key technical findings:
1. `/bag.svg` has a `viewBox="0 0 1024 1024"` where the drawn bag path occupies roughly 33% of the canvas width/height in the center. In `.wachi-collection__icon`, a fixed `height: 44px` and a `48px` image size caused the visible bag glyph in collection headers to appear noticeably smaller (~15px) than expected.
2. In `Index.tsx`, `DiscountButton` (`-10%`) and `WhatsAppButton` (`HABLEMOS`) use `fixed ... z-50` and appear after `<CartDrawer />` in the DOM, causing them to render on top of `CartDrawer` (`z-50`) when the cart is opened from the Home page.
3. Inside `CartDrawer.tsx`, showing the shopping bag icon in the top-right corner is redundant because the user is already viewing the shopping bag summary.

## Goals / Non-Goals

**Goals:**
- Connect `Navigation.tsx` (desktop and mobile) to `useShopify()` so the Hero cart button opens `CartDrawer` and displays `cart.totalQuantity` when `> 0`.
- Use `/bag.svg` in `Navigation.tsx`, `CollectionShowcase.tsx`, and `WachiCollection.tsx` with prominent sizing: `58px` in collection desktop headers and `64px` (`w-16 h-16`) on mobile viewports (`<= 767px`) with a generous touch target (`min-w-[48px] min-h-[48px]`).
- Remove the top-right cart button inside `CartDrawer.tsx`.
- Hide `DiscountButton` and `WhatsAppButton` when `isCartOpen` is `true` and raise `CartDrawer` to `z-[100]`.

**Non-Goals:**
- Changing `ShopifyContext` state management, GraphQL queries, or `localStorage` persistence.

## Decisions

1. **Prominent `/bag.svg` sizing in collection headers and mobile**:
   - *Decision*: Set `.wachi-collection__bag` to `width: auto; height: auto; min-width: 48px; min-height: 48px;` (overriding `.wachi-collection__icon`'s `44px` box) and set `.wachi-collection__bag-img` to `width: 58px; height: 58px; margin-inline: -13px;` on desktop and `width: 64px; height: 64px; margin-inline: -14px;` on mobile (`@media (max-width: 767px)`). In `Navigation.tsx`, use `w-14 h-14` (`56px`) on desktop and `w-16 h-16` (`64px`) on mobile inside a `min-w-[48px] min-h-[48px]` button.
   - *Rationale*: Compensates for the ~67% transparent padding inside `/bag.svg`'s viewBox so the actual bag outline renders at ~20–22px tall with a comfortable tap area on mobile phones.

2. **Remove cart icon from `CartDrawer.tsx` header**:
   - *Decision*: Remove the right-side `.wachi-collection__bag` button from `CartDrawer.tsx` and leave a layout spacer `<span className="wachi-collection__icon" aria-hidden="true" />` so the header flex alignment stays intact while only showing the left `<ChevronLeft />` back button.

3. **Hide `-10%` and `HABLEMOS` in `CartDrawer`**:
   - *Decision*: In `Index.tsx`, read `const { isCartOpen } = useShopify();` and only render `<WhatsAppButton />` and `<DiscountButton />` when `!isCartOpen`. Also update `CartDrawer.tsx` root container from `z-50` to `z-[100]`.

## Risks / Trade-offs

- **[Risk] Existing unit tests looking for `Cerrar bolsa` in `CartDrawer`** → **Mitigation**: Update `CartDrawer.test.tsx` to verify that `CartDrawer` only renders the `Volver` button on the left and does not render a redundant cart icon on the right.
