## 1. Shopify API Updates

- [x] 1.1 Add `CUSTOMER_CREATE` and `CUSTOMER_ACCESS_TOKEN_CREATE` mutations to `src/lib/shopify/queries.ts`
- [x] 1.2 Add `GET_CUSTOMER` query to `src/lib/shopify/queries.ts`
- [x] 1.3 Add `CART_DISCOUNT_CODES_UPDATE` mutation to `src/lib/shopify/queries.ts`
- [x] 1.4 Create helper functions in `src/lib/shopify/client.ts` for customer auth (`createCustomer`, `createCustomerAccessToken`, `getCustomer`)
- [x] 1.5 Create helper function in `src/lib/shopify/client.ts` to apply discount codes to a cart (`applyCartDiscountCode`)

## 2. Authentication Context Rewrite

- [x] 2.1 Update `AuthContext.tsx` to use `createCustomerAccessToken` for login and store token in `localStorage`
- [x] 2.2 Update `AuthContext.tsx` to check `localStorage` on mount and fetch user details via `getCustomer`
- [x] 2.3 Update `AuthContext.tsx` to use `createCustomer` for signup
- [x] 2.4 Update `AuthContext.tsx` logout function to clear `localStorage`

## 3. Cart Integration

- [x] 3.1 Create a utility hook or update the cart context to detect when the user is logged in
- [x] 3.2 Update the cart addition flow so that if the user is authenticated, it calls `applyCartDiscountCode` with the `BRUTO_SOCIO_10` code
- [x] 3.3 Ensure the cart UI reflects the new `cost` object with the discount applied

## 4. UI Polish and Error Handling

- [x] 4.1 Update `AuthModal.tsx` to show proper error messages returned by Shopify (e.g., "invalid credentials")
- [x] 4.2 Update `Auth.tsx` / `AuthModal.tsx` to show loading states during API calls
- [x] 4.3 Verify the entire flow: Register, Login, Add Item, Check Cart Discount
