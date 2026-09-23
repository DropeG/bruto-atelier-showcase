## ADDED Requirements

### Requirement: Independent selected image readiness
The viewer SHALL prepare the selected detail image before speculative images and SHALL begin its existing entrance within 100 ms of successful decoding without waiting for a pending background.

#### Scenario: Slow background
- **WHEN** the selected detail is decoded but its background remains pending
- **THEN** the detail begins its approved entrance over a lightweight representation of the same background without an empty frame

### Requirement: Bounded resource preparation
The system SHALL deduplicate preparation by resource variant and SHALL defer other detail requests until the selected detail is prepared. Hidden DOM images MUST NOT bypass this ordering. Speculative preparation SHALL be bounded and disabled when data-saving preferences require it.

#### Scenario: First category visit
- **WHEN** a user opens a category item without cached resources
- **THEN** its detail is prioritized and the remaining category is not eagerly downloaded in parallel with that detail

#### Scenario: Intent followed by click
- **WHEN** a user opens an item whose exact resource variant is already being prepared after hover or focus
- **THEN** the viewer reuses that preparation without a duplicate transfer

### Requirement: Continuous transitions
The viewer SHALL retain the currently presented view until the requested destination is decoded. The last requested destination SHALL win over obsolete pending requests. Approved transition durations and visual composition SHALL remain unchanged.

#### Scenario: Rapid selection
- **WHEN** the user requests multiple destinations while an earlier destination is still loading
- **THEN** the current view stays visible and only the most recent requested destination is presented when ready

#### Scenario: Ready manual destination
- **WHEN** the user selects an already prepared destination
- **THEN** visible transition response starts within 100 ms and completes with the existing animation duration

### Requirement: Presentation-aware autoplay
The viewer SHALL start its five-second dwell timer after the current view has completed its entrance and its background has resolved successfully or through fallback. It SHALL wait for the next destination to be prepared before transitioning, maintain at most one timer, and suspend autoplay in hidden tabs.

#### Scenario: Slow initial load
- **WHEN** the first selected view needs more than five seconds to prepare
- **THEN** autoplay does not skip it and the user receives a complete five-second dwell once presented

#### Scenario: Resume tab
- **WHEN** the user returns to a previously hidden viewer tab
- **THEN** the current view remains and autoplay starts a fresh dwell without accumulated advances

### Requirement: Resilient readiness and return
Failures SHALL NOT be recorded as successful decoding or block navigation. The viewer SHALL retain the current image on a failed destination, retain a background fallback on direct-entry detail failure, and allow a bounded retry on a new request. Returning to the gallery SHALL preserve the originating section without replaying a loading blur for an already prepared image.

#### Scenario: Background failure
- **WHEN** a background fails but the detail is available
- **THEN** the detail remains visible over the fallback and navigation and autoplay remain usable

#### Scenario: Cached return
- **WHEN** the user returns from the viewer to an already loaded originating gallery section
- **THEN** the section is restored and its photographs do not flash empty or replay a loading blur

### Requirement: Responsive assets and verifiable performance
The system SHALL select appropriately sized background variants while preserving the approved framing and appearance. Validation SHALL use a reproducible production-build harness and report cold and warm results separately.

#### Scenario: Reference mobile load
- **WHEN** Series/9 is tested five times at 390 × 844 with a fresh document, disabled cache, 1.6 Mbps throughput, 150 ms latency and normal CPU
- **THEN** median time from click to selected detail fully visible is at most three seconds, the selected detail precedes autoplay, and requested first-view image bytes are reduced by at least 60 percent relative to the baseline under identical conditions

#### Scenario: Cached transition quality
- **WHEN** five transitions run with decoded images in the recorded reference environment
- **THEN** there are no empty intermediate frames or frame intervals above 50 ms attributable to the viewer, and the report includes frame measurements and visual verification
