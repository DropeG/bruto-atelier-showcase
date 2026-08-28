## Why

The current `NewsletterModal` has the refined, editorial aesthetic of Bruto Atelier (`#9C7B66` palette, high-contrast imagery, smooth dialog transitions), but only sent data to a Google Form. Meanwhile, the generic `AuthModal` lacked this brand identity and wasn't connected to the Navigation button. We need to unify this experience so the newsletter/welcome modal with the 10% discount promise directly registers or logs in the customer into Shopify using the exact same visual design.

## What Changes

- Transform the modal into an editorial Authentication & Member Benefit modal matching `NewsletterModal`'s aesthetic.
- Support both Registration ("Únete y obtén 10%") and Login ("Ya tengo cuenta / Iniciar sesión").
- Connect form actions directly to Shopify's `customerCreate` and `customerAccessTokenCreate` via `useAuth()`.
- Update `Navigation.tsx` User icon to trigger this unified modal and reflect current user session state (e.g. initial or logout action when logged in).

## Capabilities

### New Capabilities
- `newsletter-auth-unification`: Unified editorial authentication modal with Shopify integration and 10% discount activation.

### Modified Capabilities

## Impact

- `src/components/NewsletterModal.tsx`: Updated to support Shopify auth (signup & login) with seamless error handling and success state.
- `src/components/Navigation.tsx`: Properly wired to open the authentication modal when clicking the User icon, and handle user profile/logout actions.
