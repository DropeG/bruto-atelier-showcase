## 1. Asset Preparation and Placeholders

- [x] 1.1 Generate 98-byte Base64 blur placeholder and add `nosotrosModal` to `src/lib/blur-placeholders.ts`
- [x] 1.2 Resize and optimize `public/images/nosotros/nosotros.webp` to 960 × 1200 px with WebP quality 80

## 2. NosotrosModal Performance & UX Refinements

- [x] 2.1 Update `NosotrosModal.tsx` lifecycle to keep dialog mounted and add idle memory pre-warmup hook
- [x] 2.2 Add Base64 placeholder container styling, eager loading, async decoding, and opacity transition to modal image
- [x] 2.3 Suppress Safari/iOS blue focus ring on close button and blur active element on dialog open
- [x] 2.4 Synchronously lock and restore document body and root scroll when modal opens and closes

## 3. Verification & Build Validation

- [x] 3.1 Verify clean production build via `npm run build` and check optimized image bundle size
- [x] 3.2 Verify responsive visual rendering and touch interactions in browser
