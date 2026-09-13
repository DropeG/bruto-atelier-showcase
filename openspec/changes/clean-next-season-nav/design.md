## Context

In `Navigation.tsx`, navigation items within the drawer use a hover background `#EAD0B9`. However, because the list `<motion.ul>` specifies `overflow-y-auto`, the button's negative horizontal margin (`-mx-3`) gets clipped on the left side. As a result, the visible left boundary of the highlight box starts at x = 0, immediately touching the first letter of each item (e.g., the "J" in "Joyería") without horizontal breathing room. Additionally, when a user clicks a button, the default browser focus ring appears in blue. On the secondary preview card, the subheader displays "NEXT SEASON • BRUTO Atelier" and the footer displays "DISPONIBLE PRÓXIMAMENTE · 2026", which introduces redundancy and visual noise.

## Goals / Non-Goals

**Goals:**
- Provide balanced, proportional padding (`px-3.5` / `px-4`) for all navigation items in desktop and mobile menus without clipping defects.
- Retain the light highlight background (`bg-[#EAD0B9]`) for the currently active item whose panel is open (`activePanel === key`).
- Remove default browser focus rings (`focus:outline-none focus-visible:outline-none`).
- Clean the preview card header to display only "NEXT SEASON".
- Remove the availability footer "DISPONIBLE PRÓXIMAMENTE · 2026" / "Disponible Próximamente · 2026" on desktop and mobile.

**Non-Goals:**
- Modifying project routes, routing logic, or data models.
- Changing font families or overall color scheme.
- Altering the "Nosotros" or "Contacto" form logic.

## Decisions

1. **Eliminate negative margins (`-mx-3`) on buttons**:
   - Instead of trying to bleed negative margins out of a container that clips horizontal overflow (`overflow-y-auto`), adjust the button's internal padding (`px-3.5 py-2.5`) and list padding so buttons sit comfortably within the list bounds with uniform margin and rounded corners.
2. **Persistent active background**:
   - For items with sub-panels or coming-soon states (like `activePanel === "mobiliario"`, `activePanel === "contacto"`, or `activePanel === csKey`), apply `bg-[#EAD0B9]` conditionally when active, and `hover:bg-[#EAD0B9]` on hover.
3. **Typography and minimal preview card**:
   - Render the subheader strictly as `NEXT SEASON`.
   - Remove the bottom `Disponible Próximamente · 2026` line completely, allowing the image and title to breathe.

## Risks / Trade-offs

- [Risk] Mobile menu vs desktop menu inconsistency → Mitigation: Apply the exact same cleanup to both desktop and mobile drawer views.
