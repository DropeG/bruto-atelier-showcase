# viewer-safe-areas Specification

## Requirements

### Requirement: Dynamic Safe Area Inset Support in Showcase Viewer Controls
The system SHALL apply dynamic `env(safe-area-inset-top)` calculations to the absolute positioning of control buttons (back button and carousel indicators) in `ShowcaseViewer.tsx`.

#### Scenario: User views showcase media on an iPadOS device with top system UI or notch
- **WHEN** the ShowcaseViewer is active on a device with top safe area insets
- **THEN** the back button and carousel dots SHALL maintain a minimum offset of 32px or `env(safe-area-inset-top) + 16px`, avoiding obstruction by system status bars

### Requirement: Enhanced Touch Target for Carousel Dots
The system SHALL wrap carousel indicator dots in a transparent interactive container with a minimum size of 32px × 44px.

#### Scenario: User taps a carousel dot on a touch device
- **WHEN** the user taps near an indicator dot in the carousel control
- **THEN** the system SHALL switch to the corresponding image index without requiring pinpoint precision
