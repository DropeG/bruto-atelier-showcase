## ADDED Requirements

### Requirement: Minimum 44px Touch Target Size for Navigation Items
The system SHALL provide a minimum touch target height of 44px for all interactable navigation links and buttons inside the overlay drawer menu in `Navigation.tsx`.

#### Scenario: User taps a menu link on a mobile or tablet touch screen
- **WHEN** the user interacts with any primary link (e.g. Arquitectura, Interiorismo, Mobiliario) or sub-category link in the lateral menu
- **THEN** the clickable bounding box area SHALL measure at least 44px vertically, preventing accidental miss-taps on adjacent items

### Requirement: Compact Menu List Spacing with Visual Padding
The lateral menu container SHALL reduce vertical gap spacing while applying vertical padding `py-3` to maintain visual balance and prevent overflow on short viewports.

#### Scenario: User opens the navigation drawer on a compact screen
- **WHEN** the menu drawer is opened
- **THEN** all navigation items SHALL be fully visible and scrollable if the list height exceeds 80% of the viewport height
