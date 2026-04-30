import { useParams, useLocation } from "react-router-dom";
import { GalleryService } from "@/lib/gallery";
import ShowcaseViewer from "@/components/ShowcaseViewer";
import { Discipline, MobiliarioType } from "@/data/Gallery";
import { useIsMobile } from "@/hooks/use-mobile";

const Category = () => {
  const { discipline, type, id, category, title } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // 1. Resolve current context from parameters or URL path
  let currentDiscipline = discipline as Discipline | undefined;
  let currentType = type as MobiliarioType | undefined;
  
  // If no params, try to infer from legacy paths (e.g. /arquitectura)
  if (!currentDiscipline && !currentType) {
    const path = location.pathname.split("/").pop();
    if (path === "arquitectura") currentDiscipline = "arquitectura";
    if (path === "interiorismo") currentDiscipline = "interiorismo";
    if (path === "coleccion") { currentDiscipline = "mobiliario"; currentType = "coleccion"; }
    if (path === "serie") { currentDiscipline = "mobiliario"; currentType = "series"; }
    if (path === "piezas") { currentDiscipline = "mobiliario"; currentType = "piezas"; }
  }

  // Handle /showcase/mobiliario/:type where discipline is missing in params
  if (location.pathname.includes("/mobiliario/") && !currentDiscipline) {
    currentDiscipline = "mobiliario";
  }

  // 2. Resolve target item if ID is provided
  const item = GalleryService.getItemById(id);

  // 3. Resolve items for the viewer
  let items = [];
  let autoPlay = false;

  if (item) {
    // Navigating to a specific item
    const navType = GalleryService.getNavigationType(item);
    if (navType === "carousel") {
      items = GalleryService.getItemsByDiscipline(item.discipline, item.type, isMobile);
      autoPlay = true;
    } else {
      items = [item];
    }
  } else if (currentDiscipline) {
    // Navigating to a whole category/discipline
    items = GalleryService.getItemsByDiscipline(currentDiscipline, currentType, isMobile);
    autoPlay = true;
  } else if (category && title && id) {
    // Legacy support for /categoria/:category/:title/:id
    const legacyItem = GalleryService.getItemById(id);
    items = legacyItem ? [legacyItem] : [];
  }

  // Ensure the starting item is at index 0 if it exists
  if (item && items.length > 1) {
    const itemIndex = items.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      const reorderedItems = [
        ...items.slice(itemIndex),
        ...items.slice(0, itemIndex)
      ];
      items = reorderedItems;
    }
  }

  return <ShowcaseViewer items={items} autoPlay={autoPlay} />;
};

export default Category;