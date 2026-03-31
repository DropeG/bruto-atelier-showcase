import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";

const Serie = () => {
  const serieIds = [2, 9];
  const items = galleryItems.filter(item => serieIds.includes(item.id));

  return <ShowcaseViewer items={items} />;
};

export default Serie;