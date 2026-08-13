## 1. Smooth Scroll & Breakpoint Elevation

- [x] 1.1 Update `src/pages/Index.tsx` scroll container snap classes from `md:snap-y md:snap-mandatory` to `lg:snap-y lg:snap-mandatory` to enable smooth scroll on iPad Portrait.
- [x] 1.2 Update `src/components/ImageRow.tsx` snap classes from `md:snap-start md:snap-always` to `lg:snap-start lg:snap-always`.
- [x] 1.3 Update `src/components/Footer.tsx` snap classes from `md:snap-start md:snap-always` to `lg:snap-start lg:snap-always`.

## 2. ImageRow Proportional Grid (Option B)

- [x] 2.1 Update `src/components/ImageRow.tsx` container height rules to `h-64 md:h-[50vh] lg:h-screen`, providing ~4:5 aspect ratio on iPad Portrait (768px–1023px).

## 3. VideoSection Breakpoint Adaptation

- [x] 3.1 Update `src/components/VideoSection.tsx` 3-column video layout from `md:flex` to `lg:flex`.
- [x] 3.2 Update `src/components/VideoSection.tsx` `SingleVideoBanner` layout from `md:hidden` to `lg:hidden`.

## 4. Verification & Testing

- [x] 4.1 Verify layout behavior on iPad Portrait resolution (768px x 1024px & 834px x 1194px) to ensure no vertical photo clipping and smooth continuous scroll.
- [x] 4.2 Verify layout behavior on Desktop (>= 1024px) to ensure 2-column full screen snap scrolling remains fully functional.
