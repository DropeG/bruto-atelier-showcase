## 1. Cleanup HTML Meta Tags

- [x] 1.1 Remove `Cache-Control`, `Pragma`, and `Expires` meta tags from `index.html`

## 2. Reconfigure Vercel Headers

- [x] 2.1 Update `vercel.json` headers to add `Cache-Control: public, max-age=0, must-revalidate` for `/index.html`
- [x] 2.2 Update `vercel.json` media route headers (`/images/(.*)`, `/videos/(.*)`) to `public, max-age=86400, stale-while-revalidate=604800`

## 3. Verification

- [x] 3.1 Validate JSON structure in `vercel.json`
- [x] 3.2 Verify build output cleanly compiles without errors
