import ShoppableProductPanel from "./ShoppableProductPanel";
import { useHomepageProducts } from "@/hooks/useHomepageProducts";
import "@/styles/shoppable-gallery.css";

const LoadingGallery = () => (
  <div className="shoppable-gallery shoppable-gallery--loading" aria-label="Cargando productos" aria-busy="true">
    <div className="shoppable-loading-feature">
      <div className="shoppable-loading-media" />
      <div className="shoppable-loading-copy" />
    </div>
  </div>
);

const ShoppableGallery = () => {
  const { products, isLoading } = useHomepageProducts();

  if (isLoading && products.length === 0) return <LoadingGallery />;
  if (products.length === 0) return null;

  const [featured, second, third, fourth] = products;

  return (
    <section className="shoppable-gallery" aria-label="Productos destacados">
      <div id="section-product-featured" className="shoppable-gallery__snap">
        <ShoppableProductPanel
          product={featured}
          sectionId="section-product-featured"
          layout="feature"
        />
      </div>

      {products.length === 2 && second && (
        <div id="section-product-second" className="shoppable-gallery__snap">
          <ShoppableProductPanel
            product={second}
            sectionId="section-product-second"
            layout="feature-reverse"
          />
        </div>
      )}

      {products.length >= 3 && (
        <div id="section-product-diptych" className="shoppable-gallery__diptych shoppable-gallery__snap">
          <ShoppableProductPanel product={second} sectionId="section-product-diptych" layout="diptych" />
          <ShoppableProductPanel product={third} sectionId="section-product-diptych" layout="diptych" />
        </div>
      )}

      {fourth && (
        <div id="section-product-fourth" className="shoppable-gallery__snap">
          <ShoppableProductPanel
            product={fourth}
            sectionId="section-product-fourth"
            layout="feature-reverse"
          />
        </div>
      )}
    </section>
  );
};

export default ShoppableGallery;

