## 1. Cart State & Core API Integration

- [x] 1.1 Implement Shopify Cart API mutations (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`) in `src/lib/shopify/queries.ts`.
- [x] 1.2 Update `src/lib/shopify/client.ts` to export functions that execute these new Cart mutations.
- [x] 1.3 Modify `src/contexts/ShopifyContext.tsx` to handle `cartId` state, persist it in `localStorage`, and expose cart management functions (add/update/remove) to the app.

## 2. Product Detail Drawer / Bottom Sheet UI

- [ ] 2.1 Create a new `ProductDrawer.tsx` component that accepts a `ShowcaseItem` (or `ShopifyProduct`).
- [ ] 2.2 Implement responsive layout for `ProductDrawer.tsx`: Side-Drawer on Desktop/Tablet, Bottom-Sheet on Mobile, using `framer-motion` for smooth enter/exit animations.
- [ ] 2.3 Integrate wood/finish variant selectors and the "Add to Cart" / "Checkout" button inside the drawer.

## 3. Atelier Editorial Grid UI

- [ ] 3.1 Create a new `CatalogGrid.tsx` component that receives an array of products and renders the responsive grid (3 col Desktop, 2 col Tablet, 1 col Mobile).
- [ ] 3.2 Implement the Desktop hover effect (Image Swap) on product cards within the grid, ensuring graceful fallback on touch devices.
- [ ] 3.3 Add support for injecting "Cinematic Media Blocks" (existing large photos/videos) periodically within the `CatalogGrid.tsx` to break up the layout.
- [ ] 3.4 Wire product card clicks in the grid to open the `ProductDrawer.tsx` without triggering a full page navigation.

## 4. Page Integration & Polish

- [ ] 4.1 Update `src/pages/Category.tsx` to conditionally render the immersive `ShowcaseViewer` as a hero header, followed by the new `CatalogGrid.tsx` below it.
- [ ] 4.2 Add a Cart icon/badge to `Navigation.tsx` that reflects the current cart item count from `ShopifyContext`.
- [ ] 4.3 Verify all responsive states, test cart persistence across reloads, and ensure Shopify checkout redirection works correctly.
