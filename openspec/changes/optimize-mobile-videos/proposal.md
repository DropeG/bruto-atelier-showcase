## Why

Mobile users on `bruto-atelier.com` experience noticeable latency and a black placeholder screen when reaching the video banners, caused by uncompressed 14MB video assets lacking MOOV atom faststart and missing poster frames. Optimizing mobile video delivery ensures an immediate, fluid, high-end editorial UX with 0ms visual friction.

## What Changes

- Create mobile-dedicated, compressed, portrait-formatted video loops (`video1-mobile.mp4`, `video2-mobile.mp4`, `video3-mobile.mp4`) with H.264 encoding, audio removal, and `-movflags +faststart`.
- Generate lightweight WebP poster images (`video1-poster.webp`, `video2-poster.webp`, `video3-poster.webp`) from frame 0 of each video for instant rendering.
- Update `SingleVideoBanner` component to support poster attributes and seamlessly transition from poster image to video playback.
- Preload the primary mobile video poster frame on page mount in `Index.tsx`.

## Capabilities

### New Capabilities
- `mobile-video-performance`: Optimizes mobile video loading, instant poster frame rendering, and lightweight progressive streaming for showcase video banners.

### Modified Capabilities

## Impact

- `src/components/VideoSection.tsx`: Addition of poster frame support and optimized video source selection.
- `src/pages/Index.tsx`: Preloading of initial poster asset.
- `public/videos/`: Addition of optimized mobile video files and poster WebP images.
