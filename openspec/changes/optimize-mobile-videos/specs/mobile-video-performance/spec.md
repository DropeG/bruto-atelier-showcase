## ADDED Requirements

### Requirement: Instant Poster Frame Display
The mobile video banner component MUST display a high-resolution WebP poster frame instantly (0ms delay) prior to video buffering.

#### Scenario: Mobile banner mounts or scrolls into view
- **WHEN** the user navigates or scrolls to a mobile video section
- **THEN** the poster frame is rendered immediately without displaying a black or blank layout shift.

### Requirement: Progressive Video Faststart
Mobile video files MUST be encoded with progressive streaming faststart (`-movflags +faststart`) and stripped of audio tracks to minimize network payload to under 3 MB per loop.

#### Scenario: Video stream buffer initiation
- **WHEN** the browser requests playback for a mobile video banner
- **THEN** playback begins after fetching only the initial MOOV atom header without awaiting full file download.

### Requirement: Poster Asset Preloading
The application MUST preload the primary mobile video poster asset on initial page mount.

#### Scenario: Home page initialization
- **WHEN** the home showcase page finishes initial rendering
- **THEN** the poster image for `video1-mobile` is preloaded in the browser cache.
