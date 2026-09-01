## Why

The client requested grouping all three showcase videos consecutively on mobile devices directly following the hero section, placing all clickable project tiles and image rows below them rather than intercalating videos between image rows.

## What Changes

- Reorganize mobile view hierarchy on the Home page (`/`):
  - Hero Section
  - Stacked Mobile Video 1 (`/videos/video1-mobile.mp4`)
  - Stacked Mobile Video 2 (`/videos/video2-mobile.mp4`)
  - Stacked Mobile Video 3 (`/videos/video3-mobile.mp4`)
  - All 5 Project Image Rows (10 project tiles: Cocina, Mueble Azul, Comedor, Paisaje, Casita Árbol, Morar, Banqueta, Flores, Mueble Rojo, Cabina)
  - Footer
- Desktop landscape layout remains intact with the 3-column side-by-side video section (`VideoSection`).
- Maintain seamless playsinline, autoplay, and poster fallback behavior across iOS/Android browsers.

## Capabilities

### New Capabilities
- `home-mobile-video-stack`: Organizes the mobile homepage layout with sequential full-viewport video banners placed immediately below the hero and preceding the catalog image grid.

### Modified Capabilities
<!-- None -->

## Impact

- Affected code: `src/pages/Index.tsx`
- User experience: Mobile visitors will scroll through the 3 video showcases sequentially before browsing project image tiles.
