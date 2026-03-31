import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";

const Arquitectura = () => {
  const arquitecturaIds = [5, 10];
  const items = galleryItems.filter(item => arquitecturaIds.includes(item.id));

  return <ShowcaseViewer items={items} />;
};

export default Arquitectura;