import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";
import { useSearchParams } from "react-router-dom";

const Piezas = () => {
  const [searchParams] = useSearchParams();
  const piezasIds = [7, 8];
  const startId = Number(searchParams.get("start"));
  const orderedIds = piezasIds.includes(startId)
    ? [startId, ...piezasIds.filter((id) => id !== startId)]
    : piezasIds;

  const items = orderedIds
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter((item): item is (typeof galleryItems)[number] => Boolean(item));

  return <ShowcaseViewer items={items} />;
};

export default Piezas;