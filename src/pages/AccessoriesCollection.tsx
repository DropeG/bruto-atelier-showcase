import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, ShoppingBag } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { catalogImageProps } from '@/lib/catalog-images';
import {
  COLLECTION_REGISTRY,
  preloadResponsiveSources,
  useCollectionGridReady,
} from '@/lib/collection-images';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import '@/styles/wachi-collection.css';
import '@/styles/accessories-collection.css';

interface AccessoryPerspective {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

interface AccessoryPiece {
  id: 'tabaquera' | 'sleeve' | 'tarjetero';
  name: string;
  description: string;
  image: string;
  width: number;
  height: number;
  price: string;
  perspectives: readonly AccessoryPerspective[];
}

const pieces: readonly AccessoryPiece[] = [
  {
    id: 'tabaquera',
    name: 'Tabaquera',
    description: 'Estuche flexible en cuero vacuno granulado con cierre envolvente.',
    image: '/images/shopify-demo/accesorios/tabaquera-fondo-blanco.webp',
    width: 1326,
    height: 1187,
    price: '$129.000',
    perspectives: [
      {
        src: '/images/shopify-demo/accesorios/tabaquera-fondo-blanco.webp',
        alt: 'Tabaquera CUORO — Cuero azul granulado',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--tabaquera',
      },
      {
        src: '/images/shopify-demo/accesorios/tabaquera-perspectiva-2.webp',
        alt: 'Tabaquera CUORO — Perspectiva diagonal 3/4',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--tabaquera',
      },
      {
        src: '/images/shopify-demo/accesorios/tabaquera-perspectiva-3.webp',
        alt: 'Tabaquera CUORO — Vista semi-abierta interior',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--tabaquera',
      },
    ],
  },
  {
    id: 'sleeve',
    name: 'Sleeve',
    description: 'Funda protectora en cuero coñac de grano natural cosida a mano.',
    image: '/images/shopify-demo/accesorios/sleev-fondo-blanco.webp',
    width: 1668,
    height: 943,
    price: '$149.000',
    perspectives: [
      {
        src: '/images/shopify-demo/accesorios/sleev-fondo-blanco.webp',
        alt: 'Sleeve CUORO — Funda de cuero coñac',
        width: 1668,
        height: 943,
        className: 'accessories-stage__img--sleeve',
      },
      {
        src: '/images/shopify-demo/accesorios/sleev-perspectiva-2.webp',
        alt: 'Sleeve CUORO — Perspectiva vertical 3/4 cerrada',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--sleeve',
      },
      {
        src: '/images/shopify-demo/accesorios/sleev-perspectiva-3.webp',
        alt: 'Sleeve CUORO — Vista con solapa abierta',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--sleeve',
      },
    ],
  },
  {
    id: 'tarjetero',
    name: 'Tarjetero',
    description: 'Pieza compacta de perfil delgado en cuero graneado con corte preciso.',
    image: '/images/shopify-demo/accesorios/tarjetero-fondo-blanco.webp',
    width: 1290,
    height: 1219,
    price: '$89.000',
    perspectives: [
      {
        src: '/images/shopify-demo/accesorios/tarjetero-fondo-blanco.webp',
        alt: 'Tarjetero CUORO — Cuero verde granulado',
        width: 1290,
        height: 1219,
        className: 'accessories-stage__img--tarjetero',
      },
      {
        src: '/images/shopify-demo/accesorios/tarjetero-perspectiva-2.webp',
        alt: 'Tarjetero CUORO — Perspectiva vertical 3/4',
        width: 1290,
        height: 1219,
        className: 'accessories-stage__img--tarjetero',
      },
      {
        src: '/images/shopify-demo/accesorios/tarjetero-perspectiva-3.webp',
        alt: 'Tarjetero CUORO — Vista con tarjetas en las ranuras',
        width: 1290,
        height: 1219,
        className: 'accessories-stage__img--tarjetero',
      },
    ],
  },
];

const yeezySpring = {
  type: 'spring',
  stiffness: 240,
  damping: 30,
  mass: 0.9,
} as const;

const CUORO_GRID_SIZES = COLLECTION_REGISTRY.cuoro.gridSizes;
const CUORO_GRID_SOURCES = COLLECTION_REGISTRY.cuoro.gridSources;
const CUORO_STAGE_SIZES = '(max-width: 850px) 84vw, 44vw';
const CUORO_PERSPECTIVE_SOURCES = pieces.flatMap((piece) =>
  piece.perspectives.slice(1).map((perspective) => perspective.src),
);

function preloadAccessoryPerspectives(piece: AccessoryPiece) {
  void preloadResponsiveSources(
    piece.perspectives.map((perspective) => perspective.src),
    CUORO_STAGE_SIZES,
    'high',
  );
}

function formatClpPrice(amount?: string, fallback?: string): string {
  if (!amount) return fallback ?? '';
  const num = Number(amount);
  if (Number.isNaN(num)) return fallback ?? '';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(num);
}

const AccessoriesCollection = () => {
  const { cart, isCartOpen, openCart, products, addToCart, isCartLoading } = useShopify();
  const [selectedId, setSelectedId] = useState<AccessoryPiece['id'] | null>(null);
  const [perspectiveIndex, setPerspectiveIndex] = useState(0);

  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  const activePiece = pieces.find((piece) => piece.id === selectedId) ?? null;
  const activeShopifyProduct = activePiece
    ? products.find((product) => product.handle === activePiece.id)
    : undefined;
  const activeVariant = activeShopifyProduct?.variants.edges[0]?.node;
  const activeVariantId = activeVariant?.id;
  const activeDisplayTitle = activeShopifyProduct?.title || activePiece?.name || '';
  const activeDisplayPrice = formatClpPrice(
    activeVariant?.price.amount ?? activeShopifyProduct?.priceRange.minVariantPrice.amount,
    activePiece?.price,
  );

  const isGridReady = useCollectionGridReady({
    gridSources: CUORO_GRID_SOURCES,
    gridSizes: CUORO_GRID_SIZES,
    perspectiveSources: CUORO_PERSPECTIVE_SOURCES,
    perspectiveSizes: CUORO_STAGE_SIZES,
  });

  const handleOpenPiece = (id: AccessoryPiece['id']) => {
    const target = pieces.find((piece) => piece.id === id);
    if (target) preloadAccessoryPerspectives(target);
    setPerspectiveIndex(0);
    setSelectedId(id);
  };

  const handleClosePiece = () => {
    setPerspectiveIndex(0);
    setSelectedId(null);
  };

  const handlePrevPerspective = () => {
    if (!activePiece) return;
    const total = activePiece.perspectives.length;
    setPerspectiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNextPerspective = () => {
    if (!activePiece) return;
    const total = activePiece.perspectives.length;
    setPerspectiveIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (!activePiece || isCartOpen) return;
    const total = activePiece.perspectives.length;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClosePiece();
      } else if (event.key === 'ArrowLeft') {
        setPerspectiveIndex((prev) => (prev - 1 + total) % total);
      } else if (event.key === 'ArrowRight') {
        setPerspectiveIndex((prev) => (prev + 1) % total);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePiece, isCartOpen]);

  return (
    <main className={`wachi-collection accessories-collection${activePiece ? ' wachi-collection--stage-active' : ''}`}>
      <header className="wachi-collection__header">
        {activePiece ? (
          <button
            type="button"
            className="wachi-collection__icon"
            onClick={handleClosePiece}
            aria-label="Volver a la colección CUORO"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
        ) : (
          <Link to={galleryUrl} className="wachi-collection__icon" aria-label="Volver a la galería">
            <ArrowLeft size={23} strokeWidth={1.45} />
          </Link>
        )}

        <Link
          to={galleryUrl}
          className={`wachi-collection__wordmark${activePiece ? ' wachi-collection__wordmark--hidden' : ''}`}
          tabIndex={activePiece ? -1 : undefined}
        >
          BRUTO Atelier
        </Link>

        <button
          type="button"
          className="wachi-collection__icon wachi-collection__bag"
          onClick={openCart}
          aria-label={`Abrir bolsa${cart?.totalQuantity ? `, ${cart.totalQuantity} piezas` : ''}`}
        >
          {cart?.totalQuantity ? (
            <span className="wachi-collection__bag-count">{cart.totalQuantity}</span>
          ) : null}
          <ShoppingBag size={20} strokeWidth={1.45} />
        </button>
      </header>

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {!activePiece ? (
            <motion.section
              key="cuoro-grid"
              className="wachi-collection__content"
              aria-labelledby="accessories-collection-title"
              initial={{ opacity: isGridReady ? 1 : 0 }}
              animate={{ opacity: isGridReady ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="wachi-collection__intro">
                <p>Colección</p>
                <h1 id="accessories-collection-title">CUORO</h1>
              </div>

              <div className="wachi-collection__grid">
                {pieces.map((piece) => {
                  const shopifyPiece = products.find((product) => product.handle === piece.id);
                  const displayTitle = shopifyPiece?.title || piece.name;
                  return (
                    <article
                      key={piece.id}
                      className={`wachi-collection__piece wachi-collection__piece--${piece.id} wachi-collection__piece--interactive`}
                    >
                      <button
                        type="button"
                        className="wachi-collection__piece-trigger"
                        onMouseEnter={() => preloadAccessoryPerspectives(piece)}
                        onFocus={() => preloadAccessoryPerspectives(piece)}
                        onClick={() => handleOpenPiece(piece.id)}
                        aria-label={`Ver ${displayTitle}`}
                      >
                        <motion.div
                          layoutId={`cuoro-piece-image-${piece.id}`}
                          transition={yeezySpring}
                          className="wachi-collection__image"
                        >
                          <img
                            {...catalogImageProps(piece.image, CUORO_GRID_SIZES)}
                            alt={displayTitle}
                            loading="eager"
                            decoding="sync"
                            fetchPriority="high"
                          />
                        </motion.div>
                        <motion.h2
                          layoutId={`cuoro-piece-title-${piece.id}`}
                          transition={yeezySpring}
                        >
                          {displayTitle}
                        </motion.h2>
                      </button>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key={`cuoro-stage-${activePiece.id}`}
              className="wachi-stage"
              aria-label={`Vista detallada de ${activePiece.name}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="wachi-stage__viewport">
                <motion.button
                  type="button"
                  className="wachi-stage__arrow wachi-stage__arrow--prev"
                  onClick={handlePrevPerspective}
                  aria-label="Perspectiva anterior"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  <ChevronLeft size={22} strokeWidth={1.6} />
                </motion.button>

                <motion.div
                  layoutId={`cuoro-piece-image-${activePiece.id}`}
                  transition={yeezySpring}
                  className="wachi-stage__media"
                >
                  {activePiece.perspectives.map((perspective, idx) => {
                    const isActive = idx === perspectiveIndex;
                    return (
                      <img
                        key={perspective.src}
                        {...catalogImageProps(perspective.src, CUORO_STAGE_SIZES)}
                        alt={perspective.alt}
                        loading="eager"
                        decoding="sync"
                        aria-hidden={!isActive}
                        className={`wachi-stage__img ${perspective.className ?? ''}${isActive ? '' : ' wachi-stage__img--hidden'}`}
                      />
                    );
                  })}
                </motion.div>

                <motion.button
                  type="button"
                  className="wachi-stage__arrow wachi-stage__arrow--next"
                  onClick={handleNextPerspective}
                  aria-label="Siguiente perspectiva"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  <ChevronRight size={22} strokeWidth={1.6} />
                </motion.button>
              </div>

              <div className="wachi-stage__info">
                <motion.div
                  className="wachi-stage__dots"
                  role="tablist"
                  aria-label="Perspectivas del producto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.12, duration: 0.18 }}
                >
                  {activePiece.perspectives.map((perspective, idx) => (
                    <button
                      key={perspective.alt}
                      type="button"
                      role="tab"
                      aria-selected={idx === perspectiveIndex}
                      aria-label={`Perspectiva ${idx + 1}`}
                      className={`wachi-stage__dot${idx === perspectiveIndex ? ' wachi-stage__dot--active' : ''}`}
                      onClick={() => setPerspectiveIndex(idx)}
                    />
                  ))}
                </motion.div>

                <motion.h2
                  layoutId={`cuoro-piece-title-${activePiece.id}`}
                  transition={yeezySpring}
                  className="wachi-stage__title"
                >
                  {activeDisplayTitle}
                </motion.h2>

                <motion.p
                  className="wachi-stage__description"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.12, duration: 0.2 }}
                >
                  {activePiece.description}
                </motion.p>

                <motion.p
                  className="wachi-stage__price"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  {activeDisplayPrice}
                </motion.p>

                <motion.button
                  type="button"
                  className="wachi-stage__add"
                  aria-label={`Agregar ${activePiece.name}`}
                  disabled={isCartLoading}
                  onClick={() => {
                    if (activeVariantId) {
                      void addToCart(activeVariantId, 1);
                    }
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.18, duration: 0.2 }}
                >
                  <Plus size={20} strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </main>
  );
};

export default AccessoriesCollection;
