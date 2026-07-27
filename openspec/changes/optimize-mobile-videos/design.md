## Context

The showcase site uses single video banners on mobile view inter-spaced between gallery rows. Currently, `video1.mp4` is a 14MB desktop horizontal video served directly on mobile devices without poster fallback, causing several seconds of black screen delay on cellular connections in production (`bruto-atelier.com`).

## Goals / Non-Goals

**Goals:**
- Compress mobile video loops to ~1.5–2.5 MB using vertical 9:16 aspect ratio, H.264 encoding, and `-movflags +faststart`.
- Extract initial poster frame images (`.webp`, <50KB) for each video.
- Extend `SingleVideoBanner` to render `poster` image and handle seamless image-to-video transition.
- Preload Video 1 poster frame on initial page mount.

**Non-Goals:**
- Modifying desktop video grid column layouts.
- Altering existing section snapping or scroll contexts.

## Decisions

### 1. Dedicated Mobile Video Files & Poster WebPs
- **Decision:** Create `/videos/video1-mobile.mp4`, `/videos/video2-mobile.mp4`, `/videos/video3-mobile.mp4` and corresponding `video1-poster.webp`, etc.
- **Rationale:** Serving high-resolution desktop videos to mobile displays wastes bandwidth and network time. Mobile-specific vertical streams cut weight by ~85%.

### 2. Poster Image Attributes & Preloading
- **Decision:** Use native HTML5 `<video poster="...">` in combination with React image preloading in `Index.tsx`.
- **Rationale:** Ensures 0ms latency rendering of the initial visual frame before network video chunk downloads complete.

## Risks / Trade-offs

- [iOS Auto-Play Policy] → Ensure `muted`, `playsInline`, and explicit JS `video.play()` triggers remain intact so mobile browsers do not require manual play clicks.
- [Visual Compression Artifacts] → Keep CRF at ~26 to preserve high visual aesthetics without exceeding ~2.5 MB target file size.
