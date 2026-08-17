## 1. Unify Modal State in Navigation

- [x] 1.1 Add `isNosotrosModalOpen` state inside `Navigation.tsx` and render `NosotrosModal` inside `Navigation.tsx`.
- [x] 1.2 Update the "Nosotros" click handlers (both desktop and mobile viewports) in `Navigation.tsx` to close `isMenuOpen` and set `isNosotrosModalOpen(true)`.

## 2. Cleanup Legacy Navigation Drawer Panel

- [x] 2.1 Remove unused inline "nosotros" panel layout, image, and text blocks inside `Navigation.tsx`.
- [x] 2.2 Clean up the `activePanel` union type in `Navigation.tsx` if "nosotros" is no longer a panel value.

## 3. Verification & Testing

- [x] 3.1 Verify clicking "BRUTO Atelier" in Hero still opens the modal properly.
- [x] 3.2 Verify clicking "Nosotros" in navigation drawer closes the drawer and opens the `NosotrosModal`.
- [x] 3.3 Verify responsive behavior on desktop, tablet, and mobile viewports.
