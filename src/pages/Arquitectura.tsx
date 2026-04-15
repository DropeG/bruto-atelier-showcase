import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";
import { useSearchParams } from "react-router-dom";

const Arquitectura = () => {
  const [searchParams] = useSearchParams();
  const arquitecturaIds = [5, 10];
  const startId = Number(searchParams.get("start"));
  const orderedIds = arquitecturaIds.includes(startId)
    ? [startId, ...arquitecturaIds.filter((id) => id !== startId)]
    : arquitecturaIds;

  const items = orderedIds
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter((item): item is (typeof galleryItems)[number] => Boolean(item));

  return <ShowcaseViewer items={items} />;
};

export default Arquitectura;