## Context

The `NosotrosModal` dialog presents the editorial manifesto and visual identity of BRUTO Atelier, anchored by a portrait of Creative Director Mladen Marinovic' (`public/images/nosotros/nosotros.webp`). Currently, the asset is delivered at 1536 × 1920 px (150.3 kB) with unoptimized loading heuristics. Upon opening, users experience a brief empty brown container before the image renders. Additionally, mobile Safari renders a blue focus ring over the close button ("X"), and background page scrolling is not locked.

This design mirrors the architectural pattern successfully applied to `NewsletterModal` (Selectos auth modal), adapting it for a component where the image is visible on both mobile and desktop viewports.

## Goals / Non-Goals

**Goals:**
- Eliminate perceived loading lag with 0 ms visual response via Base64 blur placeholder.
- Cut asset transfer weight by >50% (from 150.3 kB down to <80 kB) using optimized dimensions and WebP compression.
- Ensure fluid 60/120 fps modal entrance animations using off-thread decoding (`decoding="async"`).
- Silently pre-warm the image into browser memory during idle cycles after initial page load.
- Eliminate the mobile Safari blue tap/focus ring on the modal close button.
- Lock background page scrolling when the modal is open, restoring it on close.

**Non-Goals:**
- Modifying the editorial copy, typography, or layout of the manifesto.
- Changing trigger mechanisms (Navigation drawer, desktop header, Hero section).
- Adding complex multi-breakpoint `srcset` variants (unnecessary for a single modal dialog image with fixed column boundaries).

## Decisions

### 1. Asset Resolution & Compression (960 × 1200 px, Quality 80)
- **Rationale**: The desktop modal column width is at most `md:w-1/2` of `lg:max-w-5xl` (1024 px), or ~512 px. In mobile viewports (`max-w-[88vw]`), the display width is ~340-380 px. Resizing the asset to 960 × 1200 px preserves the exact 4:5 aspect ratio while supplying near 2x Retina pixel density across all devices.
- **Alternatives considered**:
  - *Keep 1536 × 1920*: Wastes ~80 kB of unnecessary mobile and desktop network transfer.
  - *Resize to 600 × 750*: Noticeable loss of sharpness on MacBook Retina and 4K external displays.

### 2. Micro Base64 Blur Placeholder (98 Bytes)
- **Rationale**: A 10×12 px WebP thumbnail is embedded directly into `src/lib/blur-placeholders.ts` under `nosotrosModal`. The image container sets this as a CSS background (`bg-cover bg-center`).
- **User experience**: The dialog opens with immediate warm photographic texture that resolves smoothly into high-resolution focus over a 500 ms opacity transition once `onLoad` fires.

### 3. Off-Thread Asynchronous Decoding
- **Rationale**: Setting `loading="eager"` and `decoding="async"` guarantees that the browser prioritizes image loading without holding the main UI thread during the 600 ms entrance bezier animation.

### 4. Silent Background Pre-warmup
- **Rationale**: An idle effect (`requestIdleCallback` with a 2500 ms timeout) instantiates `new Image()` in the background after the page's critical path has executed. When the user eventually clicks "Nosotros", the asset is already in the browser's disk/memory cache, achieving instant 0 ms rendering.

### 5. Native `<dialog>` Mounting Lifecycle
- **Rationale**: Currently `NosotrosModal` returns `null` when closed (`if (!isOpen && !dialogRef.current?.open) return null;`). Removing this early exit allows the dialog to remain in the DOM (hidden natively by the browser) so that the idle pre-warmup hook runs on page load.

### 6. Mobile Safari Focus Ring & Scroll Lock
- **Rationale**: Adding `-webkit-tap-highlight-color: transparent !important`, `outline: none !important`, `box-shadow: none !important`, `tabIndex={-1}`, and executing `document.activeElement.blur()` on dialog open removes the WebKit focus ring. Synchronous locking of `document.body.style.overflow = "hidden"` and `document.documentElement.style.overflow = "hidden"` prevents annoying background bounce.

## Risks / Trade-offs

- **[Risk] Pre-warmup competing with hero video or first paint** → *Mitigation*: The warmup uses `requestIdleCallback` with a 2500 ms delay, ensuring it only executes once the hero video and primary UI have rendered.
- **[Risk] High-DPI sharpness loss** → *Mitigation*: 960 px width exceeds 1.87x pixel density for the 512 px container, indistinguishable from the original 1536 px image to the human eye.
