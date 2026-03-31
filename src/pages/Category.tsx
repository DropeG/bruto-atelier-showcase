import { useParams } from "react-router-dom";
import { galleryItems } from "../data/Gallery";
import ShowcaseViewer from "../components/ShowcaseViewer";

const Category = () => {
  const { category, title, id } = useParams();
  
  // Buscamos el item por los parámetros de la URL
  const item = galleryItems.find(
    (i) =>
      i.category?.toLowerCase() === (category || "").toLowerCase() &&
      i.title.toLowerCase() === (title || "").toLowerCase() &&
      String(i.id) === String(id)
  );

  // Si encontramos el item, lo metemos en un array. Si no, array vacío.
  // El ShowcaseViewer detectará si está vacío y mostrará la pantalla de "No encontrado".
  const items = item ? [item] : [];

  // Apagamos el autoPlay porque es una sola imagen estática
  return <ShowcaseViewer items={items} autoPlay={false} />;
};

export default Category;