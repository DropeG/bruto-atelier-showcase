# Cinematic Carousel Transition Design Spec

**Status:** Approved
**Date:** 2026-04-20
**Feature:** Elegant ShowcaseViewer Transition

## 1. Overview
The goal is to move away from "web-like" horizontal sliding transitions towards a "cinematic" luxury brand experience (similar to Zara Home or H&M Home). This is achieved through long crossfades and a slow, continuous zoom effect that makes the photography feel alive and calm.

## 2. Architecture & Components

### 2.1 ShowcaseViewer.tsx
We will modify the inline styles and CSS transitions within the `ShowcaseViewer` component to implement the new visual language.

#### Background Layer (`bg-layer`)
- **Opacity:** Transition duration increased to 2500ms.
- **Transform:** 
  - `scale(1.05)` when inactive/incoming.
  - `scale(1.12)` when active.
  - No horizontal translation.
- **Timing:** `cubic-bezier(0.4, 0, 0.2, 1)` for opacity; `linear` (or very long ease-out) for scale.

#### Detail Image Layer (`detail-layer`)
- **Opacity:** Transition duration increased to 2500ms.
- **Transform:**
  - `scale(0.98)` when incoming (creates a "reveal" effect).
  - `scale(1.03)` when active.
- **Layering:** The detail image should feel slightly detached from the background zoom to create depth.

### 2.2 Variables
- `TRANSITION_DURATION`: 2500ms.
- `ZOOM_STEP`: ~5-7% increase over the duration of the slide.
- `EASING`: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard luxury easing).

## 3. Implementation Details
- Update the `style` object in `ShowcaseViewer.tsx` for both the background loop and the detail image loop.
- Remove `translateX` logic entirely.
- Ensure the `transition` property in the `className` or `style` reflects the new durations.

## 4. Success Criteria
- The transition between images feels "invisible" and fluid.
- There is no horizontal "jump" or "slide".
- The images feel like they are slowly breathing/moving towards the viewer.
- The "HABLEMOS" button and subtitle remain legible and stable.

## 5. Self-Review
- **Spec Coverage:** Covers background, detail images, timing, and easing.
- **Consistency:** Uses the same timing for both layers but different scales for depth.
- **Ambiguity:** Explicitly defines removal of translation.
- **Scope:** Focused purely on the transition logic of one component.
