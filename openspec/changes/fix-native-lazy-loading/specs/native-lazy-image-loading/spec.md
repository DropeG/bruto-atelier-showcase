## ADDED Requirements

### Requirement: Pure Native Lazy Loading
The image components (`LazyImage` and `HoverableImage`) SHALL rely on native browser `<img loading="lazy" decoding="async">` attributes without triggering imperative `new Image()` preloads upon React component mount.

#### Scenario: Deferred image request until viewport entry
- **WHEN** an image component mounts outside the current viewport
- **THEN** no programmatic HTTP request SHALL be issued until the browser natively triggers media fetch for the element

#### Scenario: DOM Load Event Blur Transition
- **WHEN** the browser finishes lazily fetching the image URL
- **THEN** the DOM `<img onLoad={...}>` event SHALL trigger and transition the CSS filter from blur to crisp (`blur(0px)`)

### Requirement: Idiomatic React Section ID Lookup
The `HoverableImage` component SHALL NOT access non-standard or `null` ESM DOM properties such as `document.currentScript`.

#### Scenario: Click section saving
- **WHEN** a user clicks a `HoverableImage` link
- **THEN** the section ID SHALL be resolved via event target traversal (`e.currentTarget.closest('[id^="section-"]')`)
