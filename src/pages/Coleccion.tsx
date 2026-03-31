import { galleryItems } from "../data/Gallery";
import ShowcaseViewer, { ShowcaseItem } from "../components/ShowcaseViewer";

const mokaColor = "#9C7B66";

// Definimos los items extras con el layout doble y el color de fondo
const coleccionFolderItems: ShowcaseItem[] = [
  {
    id: "coleccion-extra-1",
    title: "Colección 1",
    thumbnail: "/images/colección/coleccion1.webp",
    detailImage: "/images/colección/coleccion1.webp",
    secondaryImage: "/images/colección/coleccion2.webp",
    layout: "double",
    backgroundColor: mokaColor,
  },
  {
    id: "coleccion-extra-2",
    title: "Colección 2",
    detailImage: "/images/colección/coleccion3.webp",
    thumbnail: "/images/colección/coleccion3.webp",
    secondaryImage: "/images/colección/coleccion4.webp",
    layout: "double",
    backgroundColor: mokaColor,
  },
];

const Coleccion = () => {
  const coleccionIds = [3];
  
  // Unimos los items de la galería con los carpetas locales
  const coleccionItems: ShowcaseItem[] = [
    ...galleryItems
      .filter((item) => coleccionIds.includes(item.id))
      .map((item) => ({
        ...item,
        layout: "single" as const,
      })),
    ...coleccionFolderItems,
  ];

  return <ShowcaseViewer items={coleccionItems} />;
};

export default Coleccion;