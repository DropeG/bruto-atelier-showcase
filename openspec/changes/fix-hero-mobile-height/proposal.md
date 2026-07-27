## Why

In mobile web browsers (especially iOS Safari and Android Chrome), the `HeroSection` element does not fill 100% of the visible mobile viewport height on initial load due to dynamic browser address bars and the use of `100vh`/`100dvh` without `100svh` constraints. As a result, the subsequent mobile layout section (`ImageRow 1` containing two home showcase images) peaks through at the bottom of the screen.

Using `100svh` (*Small Viewport Height*) and proper height bounds ensures the Hero section fits exactly 100% of the visible screen area across all mobile browsers.

## What Changes

- Update `HeroSection` container styles to utilize `100svh` as the primary height unit on mobile viewports.
- Ensure the background `picture` and `img` stretch full height seamlessly without allowing bottom overflow leak.
- Verify cross-browser compatibility across iOS Safari, iOS Chrome, and Android Chrome.

## Capabilities

### New Capabilities
- `hero-section`: Mobile viewport full-screen height presentation for the hero banner.

### Modified Capabilities

## Impact

- `src/components/HeroSection.tsx`: CSS class updates for mobile height units.
