import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";
import { useSearchParams } from "react-router-dom";

const Serie = () => {
  const [searchParams] = useSearchParams();
  const serieIds = [2, 9];
  const startId = Number(searchParams.get("start"));
  const orderedIds = serieIds.includes(startId)
    ? [startId, ...serieIds.filter((id) => id !== startId)]
    : serieIds;

  const items = orderedIds
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter((item): item is (typeof galleryItems)[number] => Boolean(item));

  return <ShowcaseViewer items={items} />;
};

export default Serie;