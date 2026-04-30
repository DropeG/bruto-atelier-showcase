import { galleryItems, GalleryItem, Discipline, MobiliarioType } from "@/data/Gallery";

/**
 * GalleryService (Deep Module)
 * Encapsulates all lookup and routing logic for the studio's portfolio.
 */
export const GalleryService = {
  /**
   * Returns all items in the gallery.
   */
  getAllItems(): GalleryItem[] {
    return galleryItems;
  },

  /**
   * Finds a specific item by its unique ID.
   */
  getItemById(id: string | number | undefined): GalleryItem | undefined {
    if (id === undefined) return undefined;
    return galleryItems.find((item) => String(item.id) === String(id));
  },

  /**
   * Returns all items belonging to a specific discipline.
   * If it's Mobiliario, a type must also be provided.
   * Supports device-specific filtering.
   */
  getItemsByDiscipline(discipline: Discipline, type?: MobiliarioType, isMobile: boolean = false): GalleryItem[] {
    return galleryItems.filter((item) => {
      if (item.discipline !== discipline) return false;
      if (discipline === "mobiliario" && type) {
        if (item.type !== type) return false;
      }
      
      // Device-specific filtering
      if (isMobile && item.isDesktopOnly) return false;
      if (!isMobile && item.isMobileOnly) return false;
      
      return true;
    });
  },

  /**
   * Generates the semantic URL for a gallery item.
   * Logic: /showcase/:discipline/:type?/:id
   */
  getItemUrl(item: GalleryItem): string {
    const discipline = item.discipline.toLowerCase();
    const id = item.id;
    
    if (item.discipline === "mobiliario" && item.type) {
      return `/showcase/mobiliario/${item.type.toLowerCase()}/${id}`;
    }
    
    return `/showcase/${discipline}/${id}`;
  },

  /**
   * Determines the "Navigation Type" for an item.
   * Carousel View: Mobiliario, Arquitectura, Interiorismo.
   * Single View: Independent.
   */
  getNavigationType(item: GalleryItem): "carousel" | "single" {
    if (item.discipline === "independent") {
      return "single";
    }
    return "carousel";
  }
};
