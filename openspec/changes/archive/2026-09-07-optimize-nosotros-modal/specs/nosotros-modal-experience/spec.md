## ADDED Requirements

### Requirement: Instant Visual Delivery and Blur Placeholder for Nosotros Modal
The system SHALL display an ultra-compact Base64 blur placeholder immediately upon opening the Nosotros modal, and smoothly transition the photographic portrait to full opacity without empty background flashes.

#### Scenario: Opening the Nosotros modal
- **WHEN** the user triggers the Nosotros modal via navigation or hero title
- **THEN** the modal container SHALL immediately display the warm Base64 blur placeholder background
- **THEN** the high-resolution image SHALL transition from `opacity-0` to `opacity-100` over 500ms once decoded

### Requirement: Optimized Asset Payload for Nosotros Photo
The system SHALL serve the photographic asset `nosotros.webp` resized to 960 × 1200 px in WebP format with a production transfer size under 80 kB, preserving the 4:5 aspect ratio and visual clarity on 2x Retina displays.

#### Scenario: Asset request in production
- **WHEN** the browser requests `/images/nosotros/nosotros.webp`
- **THEN** the server SHALL deliver a WebP image with payload under 80 kB and dimensions not exceeding 960 × 1200 px

### Requirement: Silent Idle Memory Pre-warmup for Nosotros Photo
The system SHALL pre-warm `nosotros.webp` into the browser HTTP memory cache using `requestIdleCallback` after initial page load without delaying critical initial render or hero video playback.

#### Scenario: Background idle warmup
- **WHEN** the browser completes critical initial page execution and enters idle time
- **THEN** the system SHALL silently fetch `nosotros.webp` in memory so subsequent modal openings render with 0 ms network delay

### Requirement: Touch Focus and Scroll Lock Management for Nosotros Modal
The system SHALL suppress mobile WebKit tap highlight and blue focus rings on the close button ("X"), and SHALL lock document background scrolling while the Nosotros modal is active.

#### Scenario: Mobile Safari tap on close button
- **WHEN** the Nosotros modal opens in mobile Safari
- **THEN** the close button SHALL NOT display a blue tap highlight or focus ring
- **THEN** document body and root scrolling SHALL be locked to prevent background movement
