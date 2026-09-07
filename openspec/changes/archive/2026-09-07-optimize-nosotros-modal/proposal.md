## Why

The `NosotrosModal` dialog displays a large photograph of Creative Director Mladen Marinovic' (`public/images/nosotros/nosotros.webp`) that currently weighs 150.3 kB at 1536 × 1920 px. When opened on mobile or desktop, the image suffers from network latency and sudden pop-in over an empty background. Additionally, the close button displays a blue highlight/focus ring on mobile Safari/iOS, and the background page continues scrolling behind the modal. Optimizing the image asset, adding Base64 blur placeholders, enabling idle pre-warmup, locking background scroll, and stripping mobile focus rings aligns the Nosotros experience with the luxury standard of Bruto Atelier.

## What Changes

- **Asset Optimization**: Resize and compress `public/images/nosotros/nosotros.webp` from 1536 × 1920 px (150.3 kB) to 960 × 1200 px (~65-75 kB built), preserving the exact 4:5 aspect ratio with zero noticeable loss in quality.
- **Micro Blur Placeholder**: Add a lightweight 10×12 px Base64 WebP placeholder (~98 bytes) in `src/lib/blur-placeholders.ts` under `nosotrosModal` to provide an instant warm aesthetic while the high-resolution asset loads.
- **Eager and Async Image Decoding**: Configure `loading="eager"` and `decoding="async"` on the modal image to prevent blocking modal entrance animations.
- **Smooth Opacity Transition**: Manage image load state (`isImageLoaded`) with `opacity-0` transitioning smoothly to `opacity-100 duration-500` upon `onLoad`.
- **Silent Idle Pre-warmup**: Implement background image pre-warming via `requestIdleCallback` so the image is pre-cached in memory without competing with initial page load or hero video playback.
- **Safari/iOS Blue Ring Elimination**: Remove WebKit tap highlight and focus rings on the close button ("X") via `-webkit-tap-highlight-color: transparent !important`, `outline: none !important`, `box-shadow: none !important`, and blurring active focus on dialog mount.
- **Background Scroll Locking**: Ensure `document.body` and `document.documentElement` lock overflow to `hidden` while the modal is open, restoring scroll on close.

## Capabilities

### New Capabilities
<!-- None: all requirements extend existing nosotros-modal-experience capability -->

### Modified Capabilities
- `nosotros-modal-experience`: Extends requirements to mandate instant visual delivery with Base64 blur placeholder, off-thread decoding, silent idle pre-warmup, background scroll lock, and Safari/iOS blue focus ring elimination on close button.

## Impact

- **Affected Components**: `src/components/NosotrosModal.tsx`
- **Asset Library**: `src/lib/blur-placeholders.ts`
- **Static Assets**: `public/images/nosotros/nosotros.webp`
- **Performance**: Reduces network payload by >50%, eliminates perceived latency (0 ms visual feedback), preserves 60/120 fps modal entrance animations.
