## Context

The current `src/pages/Index.tsx` intercalates `SingleVideoBanner` instances between `ImageRow` components on mobile screens (`ImageRow 1 -> Video 1 -> ImageRow 2 & 3 -> Video 2 -> ImageRow 4 -> Video 3 -> ImageRow 5`). The client wants all three videos grouped sequentially following the HeroSection, before all project rows.

## Goals / Non-Goals

**Goals:**
- Move all three `SingleVideoBanner` components in `src/pages/Index.tsx` directly below `section-hero` / `section-video` on mobile viewports.
- Group all `ImageRow` components (1 through 5) sequentially directly after the video block.
- Keep desktop landscape behavior completely unaffected (3-column side-by-side video triptych).
- Verify clean playback behavior and responsive layouts.

**Non-Goals:**
- Redesigning the video aspect ratios or video assets.
- Changing desktop layout or carousel logic.

## Decisions

- **Direct reordering in `Index.tsx`**: Place `SingleVideoBanner` 1, 2, and 3 consecutively right after `#section-video` in `src/pages/Index.tsx`.
- **Preserve `SingleVideoBanner` props & preloading**: Keep `/videos/video1-poster.webp`, `/videos/video2-poster.webp`, `/videos/video3-poster.webp` posters and inline play attributes.

## Risks / Trade-offs

- **[Memory & Battery pressure on Mobile Safari]** → Maintain `preload="metadata"` and lightweight poster images so that off-screen videos do not overload mobile RAM.
- **[Catalog discovery friction]** → Client specifically requested this layout test; changes are easily reversible in `Index.tsx`.
