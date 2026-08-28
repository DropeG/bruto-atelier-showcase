## ADDED Requirements

### Requirement: User Registration
The system SHALL allow users to create a new customer account via the Shopify Storefront API.

#### Scenario: Successful Registration
- **WHEN** user submits valid registration details (name, email, password)
- **THEN** system creates a customer in Shopify using `customerCreate` mutation
- **THEN** system automatically logs the user in

### Requirement: User Login
The system SHALL allow users to authenticate using their Shopify credentials.

#### Scenario: Successful Login
- **WHEN** user submits correct email and password
- **THEN** system generates a `customerAccessToken` via Storefront API
- **THEN** system persists the token in local storage
- **THEN** system fetches customer details and updates the Auth context

### Requirement: Session Persistence
The system SHALL maintain the user session across page reloads.

#### Scenario: Restoring Session
- **WHEN** the application initializes
- **THEN** system checks local storage for a `customerAccessToken`
- **THEN** if valid, fetches customer details and restores the logged-in state
- **THEN** if invalid/expired, clears the token and sets logged-out state
