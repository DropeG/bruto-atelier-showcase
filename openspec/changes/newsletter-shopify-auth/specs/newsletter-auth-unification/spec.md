## ADDED Requirements

### Requirement: Editorial Shopify Auth Modal
The system SHALL provide a modal matching the `NewsletterModal` visual style to authenticate or register users in Shopify.

#### Scenario: User registers for 10% discount
- **WHEN** user submits their name, email, and password in the register view
- **THEN** the system creates a customer account in Shopify via `signup()`
- **THEN** the system logs the user in, shows the success animation, and applies the 10% member discount

#### Scenario: Existing user logs in
- **WHEN** user toggles to "Iniciar Sesión" and enters valid Shopify credentials
- **THEN** the system authenticates the user via `login()`
- **THEN** the modal shows a success confirmation and closes

#### Scenario: User opens auth from navigation
- **WHEN** user clicks the User icon in the top navigation bar
- **THEN** the system opens the unified editorial authentication modal

#### Scenario: Logged-in user interacts with navigation
- **WHEN** an authenticated user clicks the User icon in the navigation bar
- **THEN** the system offers an option to log out or view account state
