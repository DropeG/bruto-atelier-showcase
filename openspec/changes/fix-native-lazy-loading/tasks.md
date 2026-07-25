## 1. Refactor LazyImage Component

- [x] 1.1 Remove `useEffect` and `new Image()` preloader from `LazyImage.tsx`
- [x] 1.2 Bind `onLoad` and `onError` handlers directly to DOM `<img />` element to control blur state transition

## 2. Refactor HoverableImage Component

- [x] 2.1 Remove `useEffect` and `new Image()` preloader from `HoverableImage.tsx`
- [x] 2.2 Remove brittle `document.currentScript` DOM queries and replace with `e.currentTarget.closest('[id^="section-"]')` event handler in `HoverableImage.tsx`

## 3. Verification

- [x] 3.1 Verify clean TypeScript compilation and build execution (`npm run build`)
- [x] 3.2 Verify network tab defers off-screen images until scrolled
