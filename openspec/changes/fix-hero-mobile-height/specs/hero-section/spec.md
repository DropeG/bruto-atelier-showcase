## ADDED Requirements

### Requirement: Full-height mobile hero viewport
The `HeroSection` element MUST occupy 100% of the visible viewport height (`100svh`) on mobile viewports (< 768px) across iOS Safari, iOS Chrome, Android Chrome, and other mobile browsers without allowing subsequent sections (`ImageRow 1`) to peak through at the bottom.

#### Scenario: Mobile viewport load on iOS Safari or Chrome
- **WHEN** a user opens the home page on a mobile device
- **THEN** the `HeroSection` fills 100% of the visible viewport height above the browser address bar
- **THEN** no portion of the subsequent section (`ImageRow 1`) is visible before scrolling
