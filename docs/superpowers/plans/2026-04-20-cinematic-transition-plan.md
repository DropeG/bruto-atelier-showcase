# Cinematic Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Cinematic Transition" (Zara Home style) in `ShowcaseViewer.tsx` using long crossfades and a subtle, slow zoom effect.

**Architecture:** Replace horizontal translation with scale transformations and increase the transition duration for an ethereal feel.

**Tech Stack:** React, CSS Transitions, Tailwind CSS.

---

### Task 1: Update Carousel Styles for Cinematic Transition

**Files:**
- Modify: `src/components/ShowcaseViewer.tsx`

- [ ] **Step 1: Update Background Layer (`bg-layer`) Styles.**
Remove the `translateX` logic and implement the slow zoom (`scale`) effect with a 2500ms duration.

```tsx
      {/* Capas de fondo (Thumbnails con blur) */}
      {items.map((item, index) => (
        <div
          key={`bg-${item.id}`}
          className="absolute inset-0 transition-all duration-[2500ms]"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none',
            backgroundColor: item.backgroundColor || undefined,
            transform: index === currentIndex ? 'scale(1.12)' : 'scale(1.05)',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {(!item.layout || item.layout === "single" || item.layout === "double") && (
            <>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ 
                  minHeight: "100vh",
                  filter: index === currentIndex && showFront ? "blur(1px)" : "blur(4px)",
                  transition: "filter 0.6s ease-out"
                }}
                loading="lazy"
                decoding="async"
                // Optimización de carga basada en el índice actual
                fetchPriority={index === currentIndex ? "high" : "low"} 
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          )}
        </div>
      ))}
```

- [ ] **Step 2: Update Detail Layer Styles.**
Remove the `translateX` logic and implement a complementary scale effect to create depth.

```tsx
          {items.map((item, index) => (
            <div
              key={`detail-${item.id}`}
              className="absolute inset-0 flex items-center justify-center transition-all duration-[2500ms]"
              style={{ 
                opacity: index === currentIndex ? 1 : 0,
                pointerEvents: index === currentIndex ? 'auto' : 'none',
                transform: index === currentIndex ? 'scale(1.03)' : 'scale(0.98)',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
```

- [ ] **Step 3: Commit and Verify.**
1. Open the `/coleccion` page.
2. Observe the auto-play transition.
3. Confirm the movement is exclusively a slow, calming zoom.
4. Confirm the transition feels fluid and high-end.

```bash
git add src/components/ShowcaseViewer.tsx
git commit -m "feat(ui): implement cinematic zoom transition for ShowcaseViewer"
```
