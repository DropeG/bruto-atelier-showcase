## Why

In iPad Vertical (Portrait mode, 768px–834px width), `ImageRow` elements currently render as a 2-column grid stretching to 100% viewport height (`h-screen`). This produces a distorted aspect ratio (~1:2.7) that severely crops architectural and furniture photography. Additionally, forced CSS scroll snapping (`md:snap-y md:snap-mandatory`) makes touch navigation feel rigid on iPad.

Changing the layout to Option B (2-column grid with proportional ~4:5 aspect ratio) and shifting scroll snapping from tablet `md:` (768px) to desktop `lg:` (1024px) resolves visual clipping while restoring smooth continuous scrolling on iPad devices.

## What Changes

- **ImageRow Layout in iPad Portrait**: Binds `ImageRow` height to a proportional height (~4:5 ratio / `h-[50vh]` or `aspect-[4/5]`) on iPad Portrait, preventing 1:2.7 vertical stretching while preserving side-by-side pairing.
- **Continuous Smooth Scroll**: Elevates scroll snapping rules (`snap-y snap-mandatory`) from `md:` (768px) to `lg:` (1024px) across `Index.tsx`, `ImageRow.tsx`, `VideoSection.tsx`, and `Footer.tsx`.
- **VideoSection Tablet Handling**: Adapts `VideoSection` to display single video banners (`SingleVideoBanner`) smoothly on tablet vertical instead of 3 squished video columns.

## Capabilities

### New Capabilities
- `ipad-layout-and-scroll`: Covers proportional 2-column grid image framing and smooth continuous touch scrolling behavior for iPad Portrait screens.

### Modified Capabilities
(None)

## Impact

- `src/components/ImageRow.tsx`: Modify container height and snap classes for tablet vs desktop breakpoints.
- `src/pages/Index.tsx`: Update scroll container snap classes from `md:snap-y` to `lg:snap-y`.
- `src/components/VideoSection.tsx`: Adjust responsive breakpoint for video presentation on tablet portrait.
- `src/components/Footer.tsx`: Update snap classes to `lg:snap-start`.
