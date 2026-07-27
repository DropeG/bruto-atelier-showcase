## Context

On mobile Safari (iOS) and Chrome (Android/iOS), dynamic address bars modify the visible viewport. Currently `HeroSection` uses `h-screen h-[100dvh] min-h-[100dvh]`, which causes Safari iOS to evaluate `100vh` on load or lag on `100dvh`, rendering the container taller than the visible viewport or leaving a bottom gap where `ImageRow 1` shows up.

## Goals / Non-Goals

**Goals:**
- Update `HeroSection` container styles using CSS `100svh` (*Small Viewport Height*) for mobile devices (< 768px).
- Maintain responsive layout behavior on desktop (`md:h-screen` / `md:snap-start`).
- Ensure background `<picture>` and `<img>` fill 100% height without distortion or gaps.

**Non-Goals:**
- Restructuring the order of image rows or mobile video components on `Index.tsx`.
- Modifying desktop scroll snap rules.

## Decisions

### Decision 1: Use `h-[100svh]` for Mobile Viewport Height
- **Rationale:** `100svh` represents the exact visible height when dynamic mobile browser bars (URL bar) are expanded. This prevents initial page scroll and prevents content below (`ImageRow 1`) from bleeding into the hero screen.
- **Alternatives Considered:**
  - `100vh`: Includes space under address bar, causing initial overflow.
  - `100dvh`: Recalculates dynamically during scroll, causing layout jumps or initial sizing mismatch in WebKit.

## Risks / Trade-offs

- **[Risk] Older mobile browsers lacking `svh` support** → **Mitigation:** Retain `h-screen` as a fallback preceding `h-[100svh]` in Tailwind styling.
