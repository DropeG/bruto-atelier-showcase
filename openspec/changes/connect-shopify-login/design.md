## Context

Currently, the React application mocks authentication (`AuthContext.tsx`). We are operating as a headless Shopify storefront using the Storefront API (`src/lib/shopify/client.ts`). The goal is to provide a 10% discount for registered users. 

Since we opted for "Option A" (Automatic Discount Code Injection), we need to integrate real Shopify Customer APIs to authenticate users, and inject a predefined discount code into their cart payload before they go to checkout.

## Goals / Non-Goals

**Goals:**
- Replace mock authentication with Shopify Storefront API (`customerCreate`, `customerAccessTokenCreate`).
- Persist user sessions securely in the browser.
- Automatically inject a predefined discount code (e.g., `BRUTO_SOCIO_10`) into the cart using the `cartDiscountCodesUpdate` mutation whenever an authenticated user has an active cart.

**Non-Goals:**
- Implementing Shopify B2B logic or Shopify Scripts (which may require Shopify Plus).
- Building a complex loyalty point system.
- Completely preventing users from sharing the discount code (since it's a standard Shopify discount code, it will be visible at checkout).

## Decisions

- **Authentication Method:** We will use `customerAccessTokenCreate` for login. This returns an access token that we will store in `localStorage` to persist the session. When the app loads, we will query the `customer` node using this token to restore the user state.
- **Discount Injection Hook:** Rather than applying the discount at checkout time on Shopify's domain, we will apply it proactively on the Storefront API side. We will create a new function `applyCartDiscount` and call it right after creating a cart or adding items to a cart, IF the user is authenticated.
- **Error Handling:** If the `customerAccessToken` expires (usually after 30 days or if invalidated), we will catch the GraphQL error and automatically log the user out on the frontend.

## Risks / Trade-offs

- **[Risk]** The discount code is visible to the user at checkout. They could theoretically share it with non-registered friends. 
  - **Mitigation:** We can configure the discount code in the Shopify Admin to *only* apply to specific customer segments (e.g., "Customer has account"), enforcing the rule on Shopify's backend even if the code leaks.
- **[Risk]** Extra API calls (latency). Applying a discount code requires an additional mutation after cart creation.
  - **Mitigation:** We can batch the mutations or run them optimistically without blocking the UI.
