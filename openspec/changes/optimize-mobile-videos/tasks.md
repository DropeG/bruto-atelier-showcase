## 1. Asset Optimization & Processing

- [x] 1.1 Compress mobile video assets (`video1-mobile.mp4`, `video2-mobile.mp4`, `video3-mobile.mp4`) with H.264, audio removal, and `-movflags +faststart`.
- [x] 1.2 Generate lightweight WebP poster frames (`video1-poster.webp`, `video2-poster.webp`, `video3-poster.webp`) for instant fallback.

## 2. Component & Page Updates

- [x] 2.1 Update `SingleVideoBanner` in `src/components/VideoSection.tsx` to support `poster` and `mobileSrc` props.
- [x] 2.2 Update `Index.tsx` to pass poster images and mobile video URLs to `SingleVideoBanner` instances.
- [x] 2.3 Add image preloading for the primary mobile video poster in `Index.tsx`.

## 3. Verification & Testing

- [x] 3.1 Test instant visual rendering of poster frames on mobile viewport simulated network throttling.
- [x] 3.2 Verify smooth playback transition and autoplay behavior in Safari / Chrome mobile viewports.
