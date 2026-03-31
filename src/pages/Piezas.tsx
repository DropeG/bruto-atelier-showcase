import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";

const Piezas = () => {
  const piezasIds = [7, 8];
  const items = galleryItems.filter(item => piezasIds.includes(item.id));

  return <ShowcaseViewer items={items} />;
};

export default Piezas;