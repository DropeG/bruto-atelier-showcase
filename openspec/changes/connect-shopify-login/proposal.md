## Why

The current authentication system is mocked and only stores user state in the browser's memory without connecting to any real backend. To provide real value to registered users (like a 10% member discount), we need to connect our frontend authentication to Shopify's Customer API and automatically inject a discount code into their cart.

## What Changes

- Replace the mock authentication in `AuthContext` with real calls to Shopify's Storefront API (`customerCreate`, `customerAccessTokenCreate`, `customer`).
- Update the cart management logic to automatically apply a predefined discount code (e.g., `MEMBER10`) to the checkout when an authenticated user modifies their cart.
- Add robust error handling for login/signup failures and invalid/expired tokens.
- Ensure the user sees the discount reflected when they proceed to checkout.

## Capabilities

### New Capabilities
- `shopify-customer-auth`: Shopify Storefront API authentication (login, signup, session management).
- `member-cart-discount`: Automatic discount code injection to the Shopify cart for logged-in users.

### Modified Capabilities

## Impact

- `src/contexts/AuthContext.tsx` will be completely rewritten to use Shopify APIs.
- `src/lib/shopify/client.ts` will receive new mutations and queries for customer management and discount code application.
- `src/lib/shopify/queries.ts` will receive new GraphQL queries for customers and discount codes.
- The global checkout/cart flow will be slightly modified to ensure the discount code is applied before redirecting to checkout.
