import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, ShoppingBag } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { catalogImageProps } from '@/lib/catalog-images';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import '@/styles/wachi-collection.css';

interface PiecePerspective {
  src: string;
  alt: string;
  className?: string;
}

interface WachiPiece {
  name: string;
  image: string;
  kind: 'ensemble' | 'table' | 'chair' | 'bench';
  price: string;
  perspectives: readonly PiecePerspective[];
}

const pieces: readonly WachiPiece[] = [
  {
    name: 'Set',
    image: '/images/shopify-demo/coleccion/wachi-fondo-blanco.png',
    kind: 'ensemble',
    price: '$1.190.000',
    perspectives: [
      {
        src: '/images/shopify-demo/coleccion/wachi-fondo-blanco.png',
        alt: 'Set WACHI — Conjunto de mesa, sillas y banqueta en Lenga',
        className: 'wachi-stage__img--ensemble',
      },
      {
        src: '/images/shopify-demo/coleccion/wachi-perspectiva-2.png',
        alt: 'Set WACHI — Perspectiva diagonal 3/4 del conjunto completo',
        className: 'wachi-stage__img--ensemble-2',
      },
      {
        src: '/images/shopify-demo/coleccion/wachi-perspectiva-3.png',
        alt: 'Set WACHI — Vista de cabecera del conjunto completo',
        className: 'wachi-stage__img--ensemble-3',
      },
    ],
  },
  {
    name: 'Mesa',
    image: '/images/shopify-demo/coleccion/mesa-fondo-blanco.png',
    kind: 'table',
    price: '$890.000',
    perspectives: [
      {
        src: '/images/shopify-demo/coleccion/mesa-fondo-blanco.png',
        alt: 'Mesa WACHI — Vista frontal',
        className: '',
      },
      {
        src: '/images/shopify-demo/coleccion/mesa-perspectiva-2.png',
        alt: 'Mesa WACHI — Perspectiva diagonal 3/4',
        className: 'wachi-stage__img--perspective-2',
      },
      {
        src: '/images/shopify-demo/coleccion/mesa-perspectiva-3.png',
        alt: 'Mesa WACHI — Vista de cabecera',
        className: 'wachi-stage__img--perspective-3',
      },
    ],
  },
  {
    name: 'Silla',
    image: '/images/shopify-demo/coleccion/silla-fondo-blanco.png',
    kind: 'chair',
    price: '$290.000',
    perspectives: [
      {
        src: '/images/shopify-demo/coleccion/silla-fondo-blanco.png',
        alt: 'Silla WACHI — Vista lateral en Lenga',
        className: 'wachi-stage__img--chair',
      },
      {
        src: '/images/shopify-demo/coleccion/silla-perspectiva-2.png',
        alt: 'Silla WACHI — Perspectiva frontal 3/4',
        className: 'wachi-stage__img--chair',
      },
      {
        src: '/images/shopify-demo/coleccion/silla-perspectiva-3.png',
        alt: 'Silla WACHI — Perspectiva posterior 3/4',
        className: 'wachi-stage__img--chair',
      },
    ],
  },
  {
    name: 'Banqueta',
    image: '/images/shopify-demo/coleccion/banqueta-fondo-blanco.png',
    kind: 'bench',
    price: '$390.000',
    perspectives: [
      {
        src: '/images/shopify-demo/coleccion/banqueta-fondo-blanco.png',
        alt: 'Banqueta WACHI — Vista frontal en Lenga',
        className: 'wachi-stage__img--bench',
      },
      {
        src: '/images/shopify-demo/coleccion/banqueta-perspectiva-2.png',
        alt: 'Banqueta WACHI — Perspectiva diagonal 3/4',
        className: 'wachi-stage__img--bench-2',
      },
      {
        src: '/images/shopify-demo/coleccion/banqueta-perspectiva-3.png',
        alt: 'Banqueta WACHI — Vista de cabecera',
        className: 'wachi-stage__img--bench-3',
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

const WachiCollection = () => {
  const { cart, openCart } = useShopify();
  const [selectedKind, setSelectedKind] = useState<WachiPiece['kind'] | null>(null);
  const [perspectiveIndex, setPerspectiveIndex] = useState(0);

  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  const activePiece = pieces.find((piece) => piece.kind === selectedKind) ?? null;

  const handleOpenPiece = (kind: WachiPiece['kind']) => {
    setPerspectiveIndex(0);
    setSelectedKind(kind);
  };

  const handleClosePiece = () => {
    setPerspectiveIndex(0);
    setSelectedKind(null);
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

  const currentPerspective = activePiece
    ? activePiece.perspectives[perspectiveIndex] ?? activePiece.perspectives[0]
    : null;

  return (
    <main className={`wachi-collection${activePiece ? ' wachi-collection--stage-active' : ''}`}>
      <header className="wachi-collection__header">
        {activePiece ? (
          <button
            type="button"
            className="wachi-collection__icon"
            onClick={handleClosePiece}
            aria-label="Volver a la colección WACHI"
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
              key="wachi-grid"
              className="wachi-collection__content"
              aria-labelledby="wachi-collection-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="wachi-collection__intro">
                <p>Colección</p>
                <h1 id="wachi-collection-title">WACHI</h1>
              </div>

              <div className="wachi-collection__grid">
                {pieces.map((piece) => (
                  <article
                    key={piece.kind}
                    className={`wachi-collection__piece wachi-collection__piece--${piece.kind} wachi-collection__piece--interactive`}
                  >
                    <button
                      type="button"
                      className="wachi-collection__piece-trigger"
                      onClick={() => handleOpenPiece(piece.kind)}
                      aria-label={`Ver ${piece.name}`}
                    >
                      <motion.div
                        layoutId={`wachi-piece-image-${piece.kind}`}
                        transition={yeezySpring}
                        className="wachi-collection__image"
                      >
                        <img
                          {...catalogImageProps(piece.image, '(max-width: 850px) 44vw, 22vw')}
                          alt={piece.name}
                          loading={piece.kind === 'ensemble' ? 'eager' : 'lazy'}
                          decoding="async"
                          fetchPriority={piece.kind === 'ensemble' ? 'high' : undefined}
                        />
                      </motion.div>
                      <motion.h2
                        layoutId={`wachi-piece-title-${piece.kind}`}
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
              key={`wachi-stage-${activePiece.kind}`}
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
                  layoutId={`wachi-piece-image-${activePiece.kind}`}
                  transition={yeezySpring}
                  className="wachi-stage__media"
                >
                  {currentPerspective && (
                    <img
                      key={currentPerspective.src}
                      {...catalogImageProps(currentPerspective.src, '(max-width: 850px) 84vw, 44vw')}
                      alt={currentPerspective.alt}
                      className={`wachi-stage__img ${currentPerspective.className ?? ''}`}
                      decoding="async"
                    />
                  )}
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
                  layoutId={`wachi-piece-title-${activePiece.kind}`}
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

export default WachiCollection;
