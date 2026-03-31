import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";

const Interiorismo = () => {
  const interiorismoIds = [1, 6];
  const items = galleryItems.filter(item => interiorismoIds.includes(item.id));

  return <ShowcaseViewer items={items} />;
};

export default Interiorismo;