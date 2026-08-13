## Context

In iPad Portrait view (768px to 1023px width), Tailwind's `md:` breakpoint triggers desktop full-height layout (`h-screen`) and forced CSS scroll snapping (`md:snap-y`). This causes two UX problems:
1. Photos in `ImageRow` stretch into 1:2.7 vertical slivers, cropping out interior depth and furniture craftsmanship.
2. Touch scrolling feels rigid because mandatory snap locks the screen height.

## Goals / Non-Goals

**Goals:**
- Implement Option B: Preserve 2-column grid on iPad Portrait while capping row height to `md:h-[50vh]` (~4:5 aspect ratio), matching desktop photo proportions.
- Shift scroll snapping from `md:` (768px) to `lg:` (1024px) across all showcase sections to enable smooth continuous inertia scroll on iPad.
- Ensure `VideoSection` displays single video banners on iPad Portrait instead of squished 3-column split video.

**Non-Goals:**
- Changing desktop grid layout or desktop snap scrolling behavior (which remains unchanged at `>= 1024px`).
- Changing mobile (< 768px) layout.

## Decisions

1. **Shift Snap Container Breakpoints from `md:` to `lg:`**
   - Rationale: Tablet users on touch screens prefer smooth, continuous flick-scrolling. Moving `snap-y snap-mandatory` to `lg:` restores natural iOS inertia scroll on iPad portrait.
   - Alternatives Considered: Disabling snap via JavaScript user-agent detection. (Rejected: Tailwind breakpoint elevation `lg:` is declarative, zero JS overhead, and cleaner).

2. **Proportional Aspect Framing in `ImageRow` (`md:h-[50vh] lg:h-screen`)**
   - Rationale: On a 1024px high iPad screen, `50vh` equals ~512px height. With 384px width per column, the ratio is 384:512 (4:5 aspect ratio), matching the exact desktop framing without vertical clipping.
   - Alternatives Considered: 1-Column full width stack (Option A). (User preferred Option B for side-by-side project pairing).

3. **VideoSection Elevation to `lg:`**
   - Rationale: 3 split video columns in 768px width create 1:4 narrow video strips. Switching 3-column video to `lg:flex` and `SingleVideoBanner` to `lg:hidden` gives iPad Portrait full-width video banners.

## Risks / Trade-offs

- [Risk] iPad Landscape (1024px+ width) will use Desktop snap mode, while iPad Portrait uses continuous scroll. → Mitigation: Tested orientation behavior; seamless transition on screen rotation.
