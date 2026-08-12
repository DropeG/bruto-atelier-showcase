## Context

The current state of Bruto Atelier Showcase allows for connecting to Shopify (Week 1 completed) but the UI is focused strictly on an immersive, cinematic, full-screen slider (Gallery mode). The user needs to browse multiple products effectively while maintaining the luxury brand feel (Manuel Dreesmann, Ferm Living, Audo Cph aesthetics). 

## Goals / Non-Goals

**Goals:**
- Implement the "Atelier Editorial Grid" catalog view that integrates seamlessly with existing hero cinematic assets.
- Ensure the layout is fully responsive (Desktop: 3 columns with hover; Tablet: 2 columns; Mobile: 1 column immersive).
- Implement Shopify Cart API headless connections (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`).
- Build an ergonomic product detail drawer (Side-drawer for Desktop/Tablet, Bottom-sheet for Mobile).

**Non-Goals:**
- Do not remove the existing cinematic video/photo assets.
- Do not migrate checkout off of Shopify. Shopify Checkout remains the final payment destination.
- Do not build a complex multi-level filtering sidebar (filters remain minimal horizontal pills/dropdowns).

## Decisions

- **Responsive Approach:** 
  - *Mobile:* 1-column layout edge-to-edge for premium focus, replacing the side-drawer with a Bottom Sheet for ergonomic one-handed use. 
  - *Tablet:* 2-column layout. 
  - *Desktop:* 3-column with a 30-40% right-side drawer.
- **Cart State Management:** Use the existing `ShopifyContext` to store the Cart object and persist the `cartId` in `localStorage`. 
- **Animation Library:** Use `framer-motion` (already in project) for smooth drawer slide-ins, bottom-sheet reveals, and hover crossfades.

## Risks / Trade-offs

- **Risk:** Existing high-resolution images in the grid may impact LCP (Largest Contentful Paint) and overall performance on Mobile.
  - *Mitigation:* Ensure strict use of `LazyImage.tsx` (native lazy loading) and base64 blur placeholders for grid items. Only eager-load the top cinematic hero element.
- **Risk:** Touch interaction on Mobile makes "Hover" image swaps impossible.
  - *Mitigation:* Do not rely on hover for critical information. The default image must be strong. The bottom sheet will contain the full image carousel.
