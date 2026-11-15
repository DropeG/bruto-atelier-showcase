## Why

Currently, the shopping bag button in the Hero navigation (`Navigation.tsx`) is a static button that is not wired to `ShopifyContext`, so clicking it does not open `CartDrawer` and it never displays the active item count (`cart.totalQuantity`). Additionally, the collection views (`CollectionShowcase.tsx`, `WachiCollection.tsx`) render a generic `lucide-react` `ShoppingBag` icon instead of the custom Hero bag icon (`/bag.svg`), `CartDrawer.tsx` displays a redundant cart icon and allows Home floating buttons (`-10%` and `HABLEMOS`) to bleed over it, and the `/bag.svg` icon needs appropriate visual scaling across collection headers and mobile viewports.

## What Changes

- Connect the Hero navigation cart button (`Navigation.tsx`, both desktop and mobile) to `useShopify()` so that clicking it opens `CartDrawer` (`openCart`) and displays `cart.totalQuantity` whenever `totalQuantity > 0`.
- Unify the shopping bag icon across the store headers (`Navigation.tsx`, `CollectionShowcase.tsx`, and `WachiCollection.tsx`) to exclusively use the Hero bag design (`/bag.svg`) with matching visual scale on desktop (`58px`) and enhanced visibility/touch target on mobile (`64px`).
- Remove the redundant cart button from the top-right header of `CartDrawer.tsx` (Resumen de Compra).
- Hide floating Home buttons (`DiscountButton` `-10%` and `WhatsAppButton` `HABLEMOS`) when `isCartOpen` is `true` and raise `CartDrawer` to `z-[100]`.

## Capabilities

### New Capabilities
- `unified-store-cart-trigger`: Unified shopping bag icon (`/bag.svg`), item counter badge (`cart.totalQuantity`), mobile touch/size optimization, and clean `CartDrawer` overlay across the Hero navigation (`Navigation.tsx`), collection headers (`CollectionShowcase.tsx`, `WachiCollection.tsx`), and `CartDrawer.tsx`.

### Modified Capabilities
<!-- No existing spec requirements are modified -->

## Impact

- `src/components/Navigation.tsx`: Wire desktop and mobile cart buttons to `useShopify()` (`cart`, `openCart`), display `cart.totalQuantity` when `> 0`, and enlarge mobile `/bag.svg` (`w-16 h-16`) with generous touch target.
- `src/components/CollectionShowcase.tsx`: Replace `lucide-react` `ShoppingBag` with `/bag.svg` while keeping the counter and pulse animation.
- `src/pages/WachiCollection.tsx`: Replace `lucide-react` `ShoppingBag` with `/bag.svg` while keeping `stockBagCount` and `openCart`.
- `src/components/CartDrawer.tsx`: Remove the redundant top-right cart icon in the Resumen de Compra header and raise overlay `z-index` to `z-[100]`.
- `src/pages/Index.tsx`: Hide `DiscountButton` and `WhatsAppButton` when `isCartOpen` is `true`.
- `src/styles/wachi-collection.css`: Scale `.wachi-collection__bag-img` (`58px` desktop, `64px` mobile) and `.wachi-collection__bag` (`height: auto`, `min-height: 48px`) so the bag matches the Hero icon size and is easy to tap on mobile.
