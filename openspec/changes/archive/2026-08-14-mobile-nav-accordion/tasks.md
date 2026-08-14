## 1. Refactor Mobile Mobiliario Submenu Layout

- [x] 1.1 Replace the absolute popout panel (`absolute left-[120px] -top-2 w-[150px]`) in the `md:hidden` block of `src/components/Navigation.tsx` with an inline Framer Motion accordion `<motion.div>`.
- [x] 1.2 Add clean left indent (`pl-4`) and smooth height/opacity transitions (`initial={{ height: 0, opacity: 0 }}`, `animate={{ height: "auto", opacity: 1 }}`).
- [x] 1.3 Ensure touch targets for sub-links ("Colección", "Serie", "Piezas") maintain minimum `44px` touch target height (`min-h-[44px]`).

## 2. Verification

- [x] 2.1 Verify on mobile viewport that tapping "Mobiliario" smoothly expands sub-links vertically without overlapping right-aligned badges or category text.
- [x] 2.2 Verify that desktop (`md:flex`) menu layout remains unaffected.
