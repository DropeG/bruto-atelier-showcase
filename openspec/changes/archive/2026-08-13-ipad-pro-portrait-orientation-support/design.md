## Context

The iPad Pro 12.9" has a viewport width of 1024px in portrait mode (1024px x 1366px). Because Tailwind's `lg:` breakpoint triggers at `min-width: 1024px`, iPad Pro 12.9" Portrait triggers desktop `lg:h-screen` and `lg:snap-y`, causing vertical 1:2.67 aspect ratio photo stretching and rigid touch snap scrolling.

## Goals / Non-Goals

**Goals:**
- Combine screen width with orientation matching so that all portrait devices (including 1024px iPad Pro 12.9" portrait) receive proportional 2-column grid (`h-[50vh]`) and smooth continuous touch scrolling.
- Restrict full-screen 100vh height (`h-screen`) and CSS snap scrolling (`snap-y snap-mandatory`) strictly to landscape desktop viewports.

**Non-Goals:**
- Changing desktop landscape view (>= 1024px landscape), which continues to use 2-column full screen snap scrolling.
- Changing mobile (< 768px) single column / 2-column mobile layout.

## Decisions

1. **Orientation Matching (`portrait:` vs `landscape:`)**
   - Tailwind supports `portrait:` (`@media (orientation: portrait)`) and `landscape:` (`@media (orientation: landscape)`) variants.
   - For scroll snapping: Use `lg:landscape:snap-y lg:landscape:snap-mandatory` (or `@media (min-width: 1024px) and (orientation: landscape)`).
   - For `ImageRow` container height: Use `h-64 md:portrait:h-[50vh] md:landscape:h-[50vh] lg:landscape:h-screen lg:portrait:h-[50vh]` or `md:h-[50vh] lg:landscape:h-screen lg:portrait:h-[50vh]`.
   - Result: Any device in portrait mode (including 1024px width iPad Pro) uses `h-[50vh]` (~683px height on iPad Pro, aspect 3:4) and no snap locks.
   - Alternatives Considered: Using `xl:` (1280px) for snap. (Orientation matching is superior because iPad Pro in Landscape 1366x1024 gets desktop snap, while in Portrait 1024x1366 gets tablet proportional grid!).

2. **VideoSection Display Rules**
   - Single video banner: `lg:landscape:hidden` (shown on all portrait devices).
   - 3-column video section: `hidden lg:landscape:flex` (shown only on landscape desktop screens).

## Risks / Trade-offs

- [Risk] Desktop browsers resized to narrow tall windows might trigger portrait mode. → Mitigation: Standard web practice; rotating back to normal desktop proportions restores desktop snap layout.
