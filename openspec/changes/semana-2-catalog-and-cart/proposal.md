## Why

Implement the Semana 2 milestone of the Bruto Atelier Showcase project: establishing a headless e-commerce catalog and cart. The goal is to evolve the site from an immersive gallery into a fully functional storefront using the Shopify Storefront Cart API. We need to present the catalog using an ultra-premium "Atelier Editorial Grid" (inspired by Manuel Dreesmann and Ferm Living) that integrates seamlessly with our existing cinematic media and responsive layout strategy.

## What Changes

- Integrate Shopify Storefront Cart API (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`).
- Implement headless cart state persistence (`cartId` in `localStorage`).
- Build the "Atelier Editorial Grid" catalog view with 1 to 3 columns depending on device, interspersed with existing cinematic hero media.
- Introduce hover-triggered image swaps on Desktop to reveal wood grain/details.
- Replace full-page navigation for product details with a responsive Product Drawer (Side-Drawer on Desktop/Tablet, Bottom Sheet on Mobile).
- Add direct checkout redirection logic using Shopify's native checkout URL.

## Capabilities

### New Capabilities
- `cart-management`: Headless cart creation, line item management, and checkout redirection.
- `catalog-editorial-grid`: A fully responsive product grid layout with immersive hover interactions and embedded architectural media breaks.
- `product-drawer`: An ergonomic drawer/bottom-sheet for viewing product details, variants (wood/finishes), and adding items to the cart without breaking the shopping flow.

### Modified Capabilities
- `showcase-viewer`: Transitioning the primary product exploration mode from the full viewport slider to the new editorial grid, while retaining the slider for hero sections or specific architectural showcases.

## Impact

- `src/lib/shopify/client.ts` and `queries.ts` will expand to include Cart API mutations.
- `src/contexts/ShopifyContext.tsx` will hold cart state and `cartId` persistence.
- `src/pages/Category.tsx` will evolve to render the new `catalog-editorial-grid`.
- `src/components/ShowcaseViewer.tsx` will be adapted or complemented by the new grid layout.
- Global navigation and layout will incorporate Cart Drawer triggers and responsive behaviors.
