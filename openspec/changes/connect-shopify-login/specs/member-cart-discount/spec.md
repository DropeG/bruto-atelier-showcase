## ADDED Requirements

### Requirement: Automatic Discount Injection
The system SHALL automatically apply a predefined member discount code to the cart if the user is authenticated.

#### Scenario: Logged in user adds item to cart
- **WHEN** an authenticated user adds a product to their cart
- **THEN** the system applies the member discount code via `cartDiscountCodesUpdate` mutation
- **THEN** the cart UI reflects the discounted totals

#### Scenario: Anonymous user adds item to cart
- **WHEN** an unauthenticated user adds a product to their cart
- **THEN** the system does not apply any discount code

#### Scenario: User logs in with existing cart
- **WHEN** a user logs in and already has an active cart session
- **THEN** the system applies the member discount code to the existing cart
