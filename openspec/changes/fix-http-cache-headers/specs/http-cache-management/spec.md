## ADDED Requirements

### Requirement: Granular HTTP Cache Headers
The application SHALL configure distinct, standards-compliant (RFC 9111) HTTP Cache-Control headers for HTML document entrypoints, hashed build assets, and static media files across all modern web browsers (Chrome, Safari, Firefox, Edge, Opera).

#### Scenario: Document request cache validation
- **WHEN** any client (Chrome, Safari, Firefox, Edge, etc.) requests `/index.html` or the root route `/`
- **THEN** the server SHALL return `Cache-Control: public, max-age=0, must-revalidate`

#### Scenario: Immutable compiled assets
- **WHEN** any client requests any asset under `/assets/*`
- **THEN** the server SHALL return `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: Revalidating static media
- **WHEN** any client requests any image or video file under `/images/*` or `/videos/*`
- **THEN** the server SHALL return `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`

### Requirement: No Client HTML Meta Cache Interceptions
The client HTML document SHALL NOT include `<meta http-equiv="Cache-Control">` meta tags that destroy browser HTTP cache mechanisms for static media resources.

#### Scenario: Clean HTML HEAD tags
- **WHEN** `index.html` is parsed by any web browser
- **THEN** it SHALL NOT contain `http-equiv="Cache-Control"`, `http-equiv="Pragma"`, or `http-equiv="Expires"` meta tags
