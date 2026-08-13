## 1. Orientation-Aware Scroll & Layout Rules

- [x] 1.1 Update `src/pages/Index.tsx` scroll container snap classes to `lg:landscape:snap-y lg:landscape:snap-mandatory lg:landscape:h-screen h-[100svh] overflow-y-scroll w-full relative` so portrait screens stay smooth and continuous.
- [x] 1.2 Update `src/components/ImageRow.tsx` classes to `lg:landscape:snap-start lg:landscape:snap-always h-64 md:h-[50vh] lg:landscape:h-screen w-full flex` to ensure iPad Pro Portrait (1024px) retains 50vh height.
- [x] 1.3 Update `src/components/Footer.tsx` classes to `lg:landscape:snap-start lg:landscape:snap-always bg-background text-foreground py-8 px-6 min-h-auto lg:landscape:h-screen lg:landscape:flex lg:landscape:items-center lg:landscape:justify-center`.
- [x] 1.4 Update `src/components/VideoSection.tsx` display rules so 3-column video uses `hidden lg:landscape:flex` and single banner uses `lg:landscape:hidden`.

## 2. Verification

- [x] 2.1 Verify layout behavior on iPad Pro 12.9" Portrait (1024px x 1366px) to confirm proportional 4:5 image framing and smooth continuous scroll.
- [x] 2.2 Verify layout behavior on Desktop Landscape (>= 1024px landscape) to confirm snap scrolling remains functional.
