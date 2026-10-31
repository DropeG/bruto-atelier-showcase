import { useRef } from 'react';
import { catalogImageProps } from '@/lib/catalog-images';
import { Link } from 'react-router-dom';
import { useCollectionSnap } from '@/hooks/useCollectionSnap';
import { useHomepageProducts } from '@/hooks/useHomepageProducts';
import { useScroll } from '@/contexts/ScrollContext';
import type { ShopifyProduct } from '@/types/shopify';
import '@/styles/shoppable-gallery.css';

const SECTION_ID = 'section-product-featured';
const WACHI_SECTION_ID = 'catalog-piece-silla-coleccion';

function formatPrice(product: ShopifyProduct): string {
  const min = product.priceRange.minVariantPrice;
  const max = product.priceRange.maxVariantPrice;
  const formatted = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: min.currencyCode,
    maximumFractionDigits: min.currencyCode === 'CLP' ? 0 : 2,
  }).format(Number(min.amount));
  return Number(min.amount) === Number(max.amount) ? formatted : `Desde ${formatted}`;
}

function productUrl(product: ShopifyProduct, isDemo: boolean): string {
  if (product.tags.includes('ColeccionDestacada')) return `/coleccion/wachi${isDemo ? '?demoMode=true' : ''}`;
  if (product.handle === 'accesorios-cuero') return `/coleccion/accesorios${isDemo ? '?demoMode=true' : ''}`;
  return `/productos/${product.handle}${isDemo ? '?demoMode=true' : ''}`;
}

interface CatalogPieceProps {
  product: ShopifyProduct;
  isDemo: boolean;
  position: 'hero' | 'reverse';
  onNavigate: (sectionId: string) => void;
}

const CatalogPiece = ({ product, isDemo, position, onNavigate }: CatalogPieceProps) => {
  const title = product.handle === 'accesorios-cuero' ? 'CUORO' : product.title;
  const description = product.handle === 'accesorios-cuero' ? 'Nuestra expresión en pelle.' : product.description;
  const image = product.featuredImage || product.images.edges[0]?.node;
  const mobileImage = product.tags.includes('ColeccionDestacada')
    ? catalogImageProps('/images/shopify-demo/coleccion/wachi-mobile-left.webp', '100vw')
    : undefined;
  const showPrice = !product.tags.includes('OcultarPrecio');
  const actionLabel = 'Ver';

  return (
    <article id={`catalog-piece-${product.handle}`} className={`catalog-piece catalog-piece--${position}${product.tags.includes('ColeccionDestacada') ? ' catalog-piece--collection' : ''}${product.handle === 'accesorios-cuero' ? ' catalog-piece--accessories' : ''}`}>
      <Link
        to={productUrl(product, isDemo)}
        onClick={() => onNavigate(
          product.handle === 'accesorios-cuero' ? WACHI_SECTION_ID : `catalog-piece-${product.handle}`
        )}
        className="catalog-piece__link"
        aria-label={`${actionLabel} ${title}${showPrice ? `, ${formatPrice(product)}` : ''}`}
      >
        <div className="catalog-piece__media">
          {image?.url && <picture>
            {mobileImage && <source media="(max-width: 600px)" srcSet={mobileImage.srcSet || mobileImage.src} sizes="100vw" />}
            <img {...catalogImageProps(image.url, position === 'hero' ? '(max-width: 850px) 100vw, 60vw' : '(max-width: 850px) 100vw, 50vw')} alt={image.altText || title} loading="eager" decoding="sync" />
          </picture>}
        </div>
        <div className="catalog-piece__information">
            <span className="catalog-piece__type">{product.handle === 'accesorios-cuero' ? 'Colección' : product.productType || 'Mobiliario'}</span>
            <h2>{title}</h2>
            <p className="catalog-piece__description">{description}</p>
            {showPrice && <p className="catalog-piece__price">{formatPrice(product)}</p>}
            <span className="catalog-piece__action">{actionLabel} <span aria-hidden="true">→</span></span>
        </div>
        {position === 'reverse' && (
          <div className="catalog-piece__tile-label">
            <h2>{title}</h2>
            <span aria-hidden="true">↗</span>
          </div>
        )}
      </Link>
    </article>
  );
};

const ShoppableGallery = () => {
  const { products, isLoading, isDemo } = useHomepageProducts();
  const galleryRef = useRef<HTMLElement>(null);

  useCollectionSnap(galleryRef, `${products.length}:${isLoading}`);
  const { saveSectionId } = useScroll();

  if (isLoading && products.length === 0) {
    return <section className="shoppable-gallery shoppable-gallery--loading" aria-label="Cargando piezas" aria-busy="true" />;
  }
  if (products.length === 0) return null;

  const [featured, second] = products;
  const onNavigate = (sectionId: string) => saveSectionId(sectionId);

  return (
    <section ref={galleryRef} id={SECTION_ID} className="shoppable-gallery" aria-label="Galería comprable">
      <CatalogPiece product={featured} isDemo={isDemo} position="hero" onNavigate={onNavigate} />
      {second && <CatalogPiece product={second} isDemo={isDemo} position="reverse" onNavigate={onNavigate} />}
      <div className="shoppable-gallery__exit" aria-hidden="true" />
    </section>
  );
};

export default ShoppableGallery;
