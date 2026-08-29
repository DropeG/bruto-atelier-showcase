import { Link } from "react-router-dom";
import { useScroll } from "@/contexts/ScrollContext";
import type { ShopifyProduct } from "@/types/shopify";
import ShopifyImage from "./ShopifyImage";

type PanelLayout = "feature" | "diptych" | "feature-reverse";

interface ShoppableProductPanelProps {
  product: ShopifyProduct;
  sectionId: string;
  layout: PanelLayout;
}

function formatPrice(product: ShopifyProduct): string {
  const min = product.priceRange.minVariantPrice;
  const max = product.priceRange.maxVariantPrice;
  const formatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: min.currencyCode,
    maximumFractionDigits: min.currencyCode === "CLP" ? 0 : 2,
  });
  const formatted = formatter.format(Number(min.amount));
  return min.amount === max.amount ? formatted : `Desde ${formatted}`;
}

function productImage(product: ShopifyProduct) {
  return product.featuredImage || product.images.edges[0]?.node || null;
}

const ShoppableProductPanel = ({ product, sectionId, layout }: ShoppableProductPanelProps) => {
  const { saveSectionId } = useScroll();
  const isDiptych = layout === "diptych";
  const detail = product.productType || (product.vendor !== "Bruto Atelier" ? product.vendor : "");

  return (
    <article className={`shoppable-product shoppable-product--${layout}`}>
      <Link
        to={`/productos/${product.handle}`}
        onClick={() => saveSectionId(sectionId)}
        className="shoppable-product__link"
        aria-label={`Ver ${product.title}, ${formatPrice(product)}`}
      >
        <div className="shoppable-product__media">
          <ShopifyImage
            image={productImage(product)}
            alt={product.title}
            sizes={isDiptych ? "(min-width: 720px) 50vw, 100vw" : "(min-width: 1100px) 72vw, 100vw"}
          />
        </div>

        <div className="shoppable-product__information">
          <div className="shoppable-product__copy">
            <h2 className="shoppable-product__title">{product.title}</h2>
            {detail && <p className="shoppable-product__detail">{detail}</p>}
            <p className="shoppable-product__price">{formatPrice(product)}</p>
          </div>
          <span className="shoppable-product__action" aria-hidden="true">
            Ver producto <span>↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
};

export default ShoppableProductPanel;

