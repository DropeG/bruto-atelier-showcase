## ADDED Requirements

### Requirement: Orientation-Aware Proportional Grid on iPad Pro Portrait
The showcase home page SHALL render `ImageRow` elements with bounded proportional height (~4:5 or `50vh`) on all devices in portrait orientation, including 1024px wide iPad Pro devices.

#### Scenario: Rendering ImageRow on iPad Pro 12.9" Portrait
- **WHEN** the showcase page is loaded on an iPad Pro 12.9" device (1024px width x 1366px height) in portrait orientation
- **THEN** each `ImageRow` renders 2 columns side by side with height bounded to ~683px (50vh), preventing vertical image stretching and producing a 3:4 aspect ratio.

### Requirement: Orientation-Aware Smooth Continuous Touch Scroll
The showcase main scroll container SHALL permit smooth continuous inertia scrolling without CSS snapping on all devices in portrait orientation (height greater than width).

#### Scenario: Touch scrolling on iPad Pro 12.9" Portrait
- **WHEN** a user scrolls vertically on an iPad Pro 12.9" device in portrait orientation
- **THEN** the page scrolls continuously with touch inertia, without rigid snap locks per screen height.

### Requirement: Landscape Desktop Snap Scrolling
The showcase main scroll container SHALL enforce CSS scroll snapping (`snap-y snap-mandatory`) exclusively on landscape viewports (screen width 1024px or wider where width is greater than height).

#### Scenario: Scrolling on Desktop Landscape or iPad Pro Landscape
- **WHEN** a user scrolls on a device screen width 1024px or wider in landscape orientation
- **THEN** the scroll container snaps cleanly to each section top (`snap-start`).
