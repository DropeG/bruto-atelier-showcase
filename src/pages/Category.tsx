import { useLayoutEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { GalleryService } from "@/lib/gallery";
import ShowcaseViewer from "@/components/ShowcaseViewer";
import ComingSoonView from "@/components/ComingSoonView";
import { Discipline, MobiliarioType } from "@/data/Gallery";
import { comingSoonCategories } from "@/data/ComingSoon";
import { useIsMobile } from "@/hooks/use-mobile";
import WachiCollection from "@/pages/WachiCollection";

const Category = () => {
  const { discipline, type, id, category, title } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const flowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;

    const resetWindowScroll = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    const previousScrollRestoration =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : null;
    if (previousScrollRestoration !== null) {
      window.history.scrollRestoration = "manual";
    }

    document.body.classList.remove("menu-open");
    document.documentElement.classList.remove("menu-open");
    delete flow.dataset.snapReady;
    resetWindowScroll();

    let settled = false;
    let settleTimer = 0;
    let frame2 = 0;

    const enableSnap = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(settleTimer);
      window.removeEventListener("touchstart", onUserIntent);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
      if (flowRef.current) {
        flowRef.current.dataset.snapReady = "true";
      }
    };

    const onUserIntent = () => {
      enableSnap();
    };

    window.addEventListener("touchstart", onUserIntent, { passive: true, once: true });
    window.addEventListener("wheel", onUserIntent, { passive: true, once: true });
    window.addEventListener("keydown", onUserIntent, { passive: true, once: true });

    const frame1 = window.requestAnimationFrame(() => {
      resetWindowScroll();
      frame2 = window.requestAnimationFrame(() => {
        resetWindowScroll();
      });
    });

    settleTimer = window.setTimeout(() => {
      resetWindowScroll();
      enableSnap();
    }, 350);

    return () => {
      window.cancelAnimationFrame(frame1);
      if (frame2) window.cancelAnimationFrame(frame2);
      window.clearTimeout(settleTimer);
      window.removeEventListener("touchstart", onUserIntent);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
      resetWindowScroll();
      if (previousScrollRestoration !== null) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, [location.pathname, location.key]);
  
  // 1. Resolve current context from parameters or URL path
  let currentDiscipline = discipline as Discipline | undefined;
  let currentType = type as MobiliarioType | undefined;
  
  // Extract path identifier
  const pathSegment = location.pathname.split("/").pop()?.toLowerCase() || "";
  
  // Check if it's an inactive "Coming Soon" category
  const activeComingSoonKey = Object.keys(comingSoonCategories).find(
    (key) => key === currentDiscipline || key === pathSegment
  );

  if (activeComingSoonKey) {
    return <ComingSoonView category={comingSoonCategories[activeComingSoonKey]} />;
  }

  // If no params, try to infer from legacy paths (e.g. /arquitectura)
  if (!currentDiscipline && !currentType) {
    if (pathSegment === "arquitectura") currentDiscipline = "arquitectura";
    if (pathSegment === "interiorismo") currentDiscipline = "interiorismo";
    if (pathSegment === "coleccion") { currentDiscipline = "mobiliario"; currentType = "coleccion"; }
    if (pathSegment === "serie") { currentDiscipline = "mobiliario"; currentType = "series"; }
    if (pathSegment === "piezas") { currentDiscipline = "mobiliario"; currentType = "piezas"; }
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

  // The menu's WACHI entry opens the editorial story first, then snaps to the
  // existing collection grid. The separate "Ver" link still opens the grid
  // route directly.
  if (currentDiscipline === "mobiliario" && currentType === "coleccion") {
    return (
      <div key={location.key} ref={flowRef} className="wachi-collection-flow">
        <section className="wachi-collection-flow__story" aria-label="Historia de la colección WACHI">
          <ShowcaseViewer key={location.pathname} items={items} autoPlay={autoPlay} />
        </section>
        <section className="wachi-collection-flow__grid" aria-label="Piezas de la colección WACHI">
          <WachiCollection />
        </section>
      </div>
    );
  }

  return <ShowcaseViewer key={location.pathname} items={items} autoPlay={autoPlay} />;
};

export default Category;
