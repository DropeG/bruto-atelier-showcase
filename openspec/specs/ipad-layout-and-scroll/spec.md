# ipad-layout-and-scroll Specification

## Purpose
TBD - created by archiving change ipad-portrait-grid-and-scroll. Update Purpose after archive.
## Requirements
### Requirement: Proportional 2-Column Grid on iPad Portrait
The showcase home page SHALL render `ImageRow` elements in a 2-column layout on iPad Portrait screens (width between 768px and 1023px) with a bounded proportional aspect ratio (~4:5) instead of forcing full viewport height (`h-screen`).

#### Scenario: Rendering ImageRow on iPad Portrait
- **WHEN** the showcase page is loaded on a device with a screen width between 768px and 1023px in portrait orientation
- **THEN** each `ImageRow` renders 2 columns side by side with height bounded to ~480px / 50vh, preventing vertical image stretching and preserving spatial proportion.

### Requirement: Smooth Continuous Touch Scroll on Tablet Devices
The showcase main scroll container SHALL permit smooth continuous inertia scrolling without mandatory CSS snapping on tablet devices in portrait orientation (screens under 1024px).

#### Scenario: Touch scrolling on iPad Portrait
- **WHEN** a user scrolls vertically on an iPad device in portrait orientation
- **THEN** the page scrolls continuously with touch inertia, without rigid snap locks per screen height.

### Requirement: Desktop Snap Scrolling
The showcase main scroll container SHALL enforce CSS scroll snapping (`snap-y snap-mandatory`) exclusively on desktop and landscape tablet viewports (screens 1024px wide or wider).

#### Scenario: Scrolling on Desktop or iPad Landscape
- **WHEN** a user scrolls on a device screen width 1024px or wider
- **THEN** the scroll container snaps cleanly to each section top (`lg:snap-start`).

