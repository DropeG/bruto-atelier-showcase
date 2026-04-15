import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";
import { useSearchParams } from "react-router-dom";

const Interiorismo = () => {
  const [searchParams] = useSearchParams();
  const interiorismoIds = [1, 6];
  const startId = Number(searchParams.get("start"));
  const orderedIds = interiorismoIds.includes(startId)
    ? [startId, ...interiorismoIds.filter((id) => id !== startId)]
    : interiorismoIds;

  const items = orderedIds
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter((item): item is (typeof galleryItems)[number] => Boolean(item));

  return <ShowcaseViewer items={items} />;
};

export default Interiorismo;