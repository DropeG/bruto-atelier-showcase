# 🏛️ CONTEXT: Bruto Atelier Domain Model

## 📖 Glossary

### 🎨 Disciplines
The highest level of classification for the studio's work.
- **Arquitectura**: Architectural projects.
- **Interiorismo**: Interior design projects.
- **Mobiliario**: Furniture design, which acts as a container for specialized types.
- **Independent**: Items that do not currently belong to a formal discipline but are visible in the showcase.

### 🪑 Mobiliario Types
Specialized categories within the Mobiliario discipline.
- **Colección**: High-level curated sets.
- **Series**: Variations or related product lines.
- **Piezas**: Individual bespoke furniture items.

### 🧭 Navigation Types
The logic used to display an item when clicked.
- **Single View**: Displays one specific item/project in isolation (used for Arquitectura, Interiorismo, and Independent).
- **Carousel View**: Displays all items belonging to the same category/group, allowing the user to cycle through them (used for Mobiliario sub-categories).

---

## 🛠️ Architecture Rules

### 1. The Discipline Invariant
Every `GalleryItem` must belong to a **Discipline**. If it doesn't fit a business category, it is marked as `Independent`.

### 2. Routing Locality
Routes are calculated based on the item's `Discipline` and `Type`. No hardcoded routes should exist in the data file.
- Logic: `discipline/type/id`

### 3. Viewer Selection
The system selects the Viewer based on the **Navigation Type**:
- If `Mobiliario`, use `CarouselView` (Context: same `type`).
- Otherwise, use `SingleView`.

---

## 🏗️ Module Map

- **GalleryService (Deep Module)**: The only module allowed to touch the raw `galleryItems` array. It provides semantic lookups like `getMobiliarioByType(type)`.
- **ShowcaseViewer**: The base UI component for rendering high-impact images.
- **NavigationSentinel**: Managed by `ScrollContext`, it ensures the user returns to the correct grid position when navigating back from a Detail view.
