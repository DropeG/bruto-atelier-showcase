import { galleryItems } from "../data/Gallery";
import ShowcaseViewer, { ShowcaseItem } from "../components/ShowcaseViewer";
import { useIsMobile } from "../hooks/use-mobile";

const mokaColor = "#9C7B66";

// Definimos los items extras con el layout doble y el color de fondo para DESKTOP
const coleccionDesktopItems: ShowcaseItem[] = [
  {
    id: "coleccion-extra-1",
    title: "Colección 1",
    thumbnail: "/images/colección/coleccion1.webp",
    detailImage: "/images/colección/coleccion1.webp",
    secondaryImage: "/images/colección/coleccion2.webp",
    layout: "split",
    backgroundColor: mokaColor,
  },
  {
    id: "coleccion-extra-2",
    title: "Colección 2",
    detailImage: "/images/colección/coleccion3.webp",
    thumbnail: "/images/colección/coleccion3.webp",
    secondaryImage: "/images/colección/coleccion4.webp",
    layout: "split",
    backgroundColor: mokaColor,
  },
];

// Definimos los 3 items nuevos exclusivos para MOBILE (9:16)
const coleccionMobileItems: ShowcaseItem[] = [
  {
    id: "coleccion-mobile-1",
    title: "Colección Mobile 1",
    thumbnail: "/images/colección/coleccionMobile1.webp",
    detailImage: "/images/colección/coleccionMobile1.webp",
    layout: "single",
    backgroundColor: mokaColor,
    subtitle: "Diseño que respira."
  },
  {
    id: "coleccion-mobile-2",
    title: "Colección Mobile 2",
    thumbnail: "/images/colección/coleccionMobile2.webp",
    detailImage: "/images/colección/coleccionMobile2.webp",
    layout: "single",
    backgroundColor: mokaColor,
    subtitle: "Texturas naturales."
  },
  {
    id: "coleccion-mobile-3",
    title: "Colección Mobile 3",
    thumbnail: "/images/colección/coleccionMobile3.webp",
    detailImage: "/images/colección/coleccionMobile3.webp",
    layout: "single",
    backgroundColor: mokaColor,
    subtitle: "Artesanía brutal."
  },
];

const Coleccion = () => {
  const isMobile = useIsMobile();
  const coleccionIds = [3];
  
  // Ítem base (Wachi) que aparece en ambos
  const baseItem = galleryItems
    .filter((item) => coleccionIds.includes(item.id))
    .map((item) => ({
      ...item,
      layout: "single" as const,
    }));

  // Unimos los items según el dispositivo
  const items: ShowcaseItem[] = isMobile 
    ? [...baseItem, ...coleccionMobileItems]
    : [...baseItem, ...coleccionDesktopItems];

  return <ShowcaseViewer items={items} />;
};

export default Coleccion;