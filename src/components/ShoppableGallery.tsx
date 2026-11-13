import { useEffect, useRef } from 'react';
import { catalogImageProps } from '@/lib/catalog-images';
import { preloadCollectionGrid, type CollectionId } from '@/lib/collection-images';
import { Link } from 'react-router-dom';
import { useCollectionSnap } from '@/hooks/useCollectionSnap';
import { useHomepageCollections } from '@/hooks/useHomepageProducts';
import { useScroll } from '@/contexts/ScrollContext';
import type { ShopifyCollection } from '@/types/shopify';
import '@/styles/shoppable-gallery.css';

const SECTION_ID = 'section-product-featured';
const WACHI_SECTION_ID = 'catalog-piece-wachi';

function collectionUrl(collection: ShopifyCollection, isDemo: boolean): string {
  const query = isDemo ? '?demoMode=true' : '';
  if (collection.handle === 'wachi') return `/coleccion/wachi${query}`;
  if (collection.handle === 'cuoro') return `/coleccion/accesorios${query}`;
  return `/coleccion/${collection.handle}${query}`;
}

function collectionIdForHandle(handle: string): CollectionId | null {
  if (handle === 'wachi') return 'wachi';
  if (handle === 'cuoro') return 'cuoro';
  if (handle === 'cosmos') return 'cosmos';
  return null;
}

interface CatalogCollectionCardProps {
  collection: ShopifyCollection;
  isDemo: boolean;
  position: 'hero' | 'tile' | 'reverse';
  onNavigate: (sectionId: string) => void;
}

const CatalogCollectionCard = ({ collection, isDemo, position, onNavigate }: CatalogCollectionCardProps) => {
  const isWachi = collection.handle === 'wachi';
  const isCuoro = collection.handle === 'cuoro';
  const isCosmos = collection.handle === 'cosmos';
  const image = collection.image;
  const mobileImage = isWachi
    ? catalogImageProps('/images/shopify-demo/coleccion/wachi-mobile-left.webp', '100vw')
    : undefined;
  const localHeroFallback = isWachi
    ? '/images/shopify-demo/coleccion/wachi-hero-horizontal.png'
    : isCuoro
      ? '/images/shopify-demo/accesorios-tarjetero.jpeg'
      : isCosmos
        ? '/images/shopify-demo/joyeria/cosmos-hero.webp'
        : undefined;
  const imageUrl = localHeroFallback || image?.url;
  const actionLabel = 'Ver';
  const collectionId = collectionIdForHandle(collection.handle);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = articleRef.current;
    if (!node || !collectionId || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void preloadCollectionGrid(collectionId);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [collectionId]);

  const handleIntentPreload = () => {
    if (collectionId) {
      void preloadCollectionGrid(collectionId);
    }
  };

  return (
    <article
      ref={articleRef}
      id={`catalog-piece-${collection.handle}`}
      className={`catalog-piece catalog-piece--${position}${isWachi ? ' catalog-piece--collection' : ''}${isCuoro ? ' catalog-piece--accessories' : ''}${isCosmos ? ' catalog-piece--cosmos' : ''}`}
    >
      <Link
        to={collectionUrl(collection, isDemo)}
        onMouseEnter={handleIntentPreload}
        onFocus={handleIntentPreload}
        onTouchStart={handleIntentPreload}
        onClick={() => onNavigate(isCuoro ? WACHI_SECTION_ID : `catalog-piece-${collection.handle}`)}
        className="catalog-piece__link"
        aria-label={`${actionLabel} ${collection.title}`}
      >
        <div className="catalog-piece__media">
          {imageUrl && (
            <picture>
              {mobileImage && (
                <source media="(max-width: 600px)" srcSet={mobileImage.srcSet || mobileImage.src} sizes="100vw" />
              )}
              <img
                {...catalogImageProps(imageUrl, position === 'hero' ? '(max-width: 850px) 100vw, 60vw' : '(max-width: 850px) 100vw, 50vw')}
                alt={image?.altText || collection.title}
                loading="eager"
                decoding="sync"
              />
            </picture>
          )}
        </div>
        <div className="catalog-piece__information">
          <span className="catalog-piece__type">Colección</span>
          <h2>{collection.title}</h2>
          <p className="catalog-piece__description">{collection.description}</p>
          <span className="catalog-piece__action">{actionLabel} <span aria-hidden="true">→</span></span>
        </div>
        {(position === 'reverse' || position === 'tile') && (
          <div className="catalog-piece__tile-label">
            <div>
              <span className="catalog-piece__type">Colección</span>
              <h2>{collection.title}</h2>
            </div>
            <span aria-hidden="true">↗</span>
          </div>
        )}
      </Link>
    </article>
  );
};

const ShoppableGallery = () => {
  const { collections, isLoading, isDemo } = useHomepageCollections();
  const galleryRef = useRef<HTMLElement>(null);

  useCollectionSnap(galleryRef, `${collections.length}:${isLoading}`);
  const { saveSectionId } = useScroll();

  if (isLoading && collections.length === 0) {
    return <section className="shoppable-gallery shoppable-gallery--loading" aria-label="Cargando colecciones" aria-busy="true" />;
  }
  if (collections.length === 0) return null;

  const [featured, ...bottomCollections] = collections;
  const onNavigate = (sectionId: string) => saveSectionId(sectionId);

  return (
    <section ref={galleryRef} id={SECTION_ID} className="shoppable-gallery" aria-label="Galería comprable">
      <CatalogCollectionCard collection={featured} isDemo={isDemo} position="hero" onNavigate={onNavigate} />
      {bottomCollections.length > 0 && (
        <div className="shoppable-gallery__bottom">
          {bottomCollections.slice(0, 2).map((collection) => (
            <CatalogCollectionCard
              key={collection.handle}
              collection={collection}
              isDemo={isDemo}
              position="tile"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
      <div className="shoppable-gallery__exit" aria-hidden="true" />
    </section>
  );
};

export default ShoppableGallery;
