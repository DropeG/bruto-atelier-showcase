import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, ShoppingBag } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
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

function preloadAccessoryPerspectives(piece: AccessoryPiece) {
  if (typeof window === 'undefined') return;
  for (const perspective of piece.perspectives) {
    const img = new window.Image();
    img.src = perspective.src;
    img.decode?.().catch(() => {});
  }
}

const AccessoriesCollection = () => {
  const { cart, openCart } = useShopify();
  const [selectedId, setSelectedId] = useState<AccessoryPiece['id'] | null>(null);
  const [perspectiveIndex, setPerspectiveIndex] = useState(0);

  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  const activePiece = pieces.find((piece) => piece.id === selectedId) ?? null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      pieces.forEach(preloadAccessoryPerspectives);
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

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
    if (!activePiece) return;
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
  }, [activePiece]);

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
          <ShoppingBag size={22} strokeWidth={1.45} />
          {cart?.totalQuantity ? <span>{cart.totalQuantity}</span> : null}
        </button>
      </header>

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {!activePiece ? (
            <motion.section
              key="cuoro-grid"
              className="wachi-collection__content"
              aria-labelledby="accessories-collection-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="wachi-collection__intro">
                <p>Colección</p>
                <h1 id="accessories-collection-title">CUORO</h1>
              </div>

              <div className="wachi-collection__grid">
                {pieces.map((piece, index) => (
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
                      aria-label={`Ver ${piece.name}`}
                    >
                      <motion.div
                        layoutId={`cuoro-piece-image-${piece.id}`}
                        transition={yeezySpring}
                        className="wachi-collection__image"
                      >
                        <img
                          src={piece.image}
                          alt={piece.name}
                          width={piece.width}
                          height={piece.height}
                          decoding="async"
                          fetchPriority={index === 0 ? 'high' : undefined}
                        />
                      </motion.div>
                      <motion.h2
                        layoutId={`cuoro-piece-title-${piece.id}`}
                        transition={yeezySpring}
                      >
                        {piece.name}
                      </motion.h2>
                    </button>
                  </article>
                ))}
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
                        src={perspective.src}
                        alt={perspective.alt}
                        width={perspective.width}
                        height={perspective.height}
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
                  {activePiece.name}
                </motion.h2>

                <motion.p
                  className="wachi-stage__price"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  {activePiece.price}
                </motion.p>

                <motion.button
                  type="button"
                  className="wachi-stage__add"
                  aria-label={`Agregar ${activePiece.name}`}
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
