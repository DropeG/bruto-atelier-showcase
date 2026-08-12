## ADDED Requirements

### Requirement: Headless Cart Initialization
The system SHALL initialize a headless Shopify cart when the user adds their first item or when an existing cart ID is retrieved from local storage.

#### Scenario: User visits for the first time
- **WHEN** the user adds an item to the cart and no cart ID exists in local storage
- **THEN** a `cartCreate` mutation is executed, the new cart ID is stored, and the item is added.

### Requirement: Cart Line Modifications
The system SHALL allow adding, updating quantities, and removing items via the Shopify Storefront API.

#### Scenario: User adds a bespoke variant
- **WHEN** the user selects a specific wood finish and adds to cart
- **THEN** the exact variant ID is passed to `cartLinesAdd` and the cart context updates.

### Requirement: Checkout Redirection
The system SHALL redirect the user to the native Shopify checkout using the URL provided by the Cart API.

#### Scenario: User initiates checkout
- **WHEN** the user clicks "Finalizar Compra" in the cart drawer
- **THEN** the browser redirects to the `checkoutUrl` provided by the cart object.
