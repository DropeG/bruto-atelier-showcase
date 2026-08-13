## Why

The iPad Pro 12.9" has a viewport width of 1024px in portrait mode (1024px x 1366px). Because Tailwind's `lg:` breakpoint activates at `min-width: 1024px`, iPad Pro 12.9" Portrait is currently treated as Desktop landscape, triggering 100% viewport height (`h-screen`) and forced CSS scroll snapping (`lg:snap-y`). This results in the same ~1:2.67 aspect ratio photo stretching and rigid touch scrolling on iPad Pro 12.9".

Incorporating screen orientation (`portrait:` / `@media (orientation: portrait)`) ensures that all iPad models in portrait orientation (including iPad Pro 12.9") receive the 2-column proportional 4:5 grid (`h-[50vh]`) and smooth continuous touch scrolling, reserving `h-screen` snap behavior exclusively for landscape desktop viewports.

## What Changes

- **Orientation-Aware Scroll Snapping**: Restricts CSS scroll snapping (`snap-y snap-mandatory`) to landscape desktop viewports (`lg:landscape:` or `@media (min-width: 1024px) and (orientation: landscape)`).
- **Proportional Grid on All Tablet Portrait Devices**: Ensures `ImageRow` container height uses `h-[50vh]` on all portrait screens (including iPad Pro 1024px portrait), producing an aspect ratio of ~3:4 on iPad Pro 12.9" (512px x 683px) without vertical clipping.
- **VideoSection Orientation Handling**: Displays `SingleVideoBanner` on all portrait tablet viewports (including iPad Pro 12.9" portrait) and reserves 3-column split video for landscape desktop viewports.

## Capabilities

### New Capabilities
- `ipad-pro-portrait-support`: Extends tablet layout rules and smooth continuous scroll to iPad Pro 12.9" (1024px width) in portrait orientation.

### Modified Capabilities
(None)

## Impact

- `src/components/ImageRow.tsx`: Add orientation-aware height and snap classes.
- `src/pages/Index.tsx`: Add orientation-aware scroll container snap classes.
- `src/components/VideoSection.tsx`: Add orientation-aware display rules for single vs 3-column video.
- `src/components/Footer.tsx`: Add orientation-aware snap and layout classes.
