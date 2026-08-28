## Context

Bruto Atelier has an ultra-premium visual identity inspired by Zara Home and Audo Copenhagen. The `NewsletterModal.tsx` component is styled with brand colors (`#9C7B66`, `#F7F5F0`), editorial typography, and a native HTML5 dialog with custom ease-out-quart transitions. We will evolve this exact component into the official Shopify Authentication & Member Discount modal.

## Goals / Non-Goals

**Goals:**
- Maintain 100% of the aesthetic fidelity of `NewsletterModal` (left banner image, warm color palette, underline minimal inputs, smooth transitions).
- Add password fields and toggle between Register (creating a Shopify customer account) and Login (retrieving Shopify customer session).
- Connect submissions directly to `useAuth()` so registering/logging in activates the 10% member discount (`BRUTO_SOCIO_10`) in the cart.
- Wire `Navigation.tsx` so clicking the User icon opens this modal, or allows logging out if already authenticated.

**Non-Goals:**
- Building multi-step identity verification (2FA/OAuth) at this stage.
- Modifying checkout pages outside our Storefront API scope.

## Decisions

- **Single Editorial Modal:** Unify the previous `AuthModal` concept directly into the `NewsletterModal` styling so all user authentication happens inside this luxury container.
- **Form State Toggle:** Default to "10% en tu primera compra" (Register mode), with a clean text link "Ya soy socio · Iniciar sesión" that toggles the form to Login mode without changing the modal frame.
- **Success State:** When registration/login succeeds, display the animated checkmark with the message *"¡Bienvenido! Tu beneficio del 10% ha sido activado"*, closing smoothly after 1.5s.

## Risks / Trade-offs

- **[Risk]** Adding a password field might increase friction compared to a simple email newsletter signup.
  - **Mitigation:** Keep the UI minimal with clean single-line inputs and copy that emphasizes the instant 10% discount benefit on their order.
