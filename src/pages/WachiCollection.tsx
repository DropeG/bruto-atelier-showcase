import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { catalogImageProps } from '@/lib/catalog-images';
import {
  COLLECTION_REGISTRY,
  preloadResponsiveSources,
  preloadShoppableGalleryCovers,
  useCollectionGridReady,
} from '@/lib/collection-images';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import { useStageVerticalNav, type VerticalSlideDirection } from '@/hooks/use-stage-vertical-nav';
import WachiRequestDrawer, { type WachiRequestLineItem } from '@/components/WachiRequestDrawer';
import '@/styles/wachi-collection.css';

interface PiecePerspective {
  src: string;
  alt: string;
  className?: string;
}

interface WachiPiece {
  name: string;
  description: string;
  image: string;
  kind: 'ensemble' | 'table' | 'chair' | 'bench';
  price: string;
  sizes?: readonly string[];
  perspectives: readonly PiecePerspective[];
}

const pieces: readonly WachiPiece[] = [
  {
    name: 'Set',
    description: 'Set en lenga patagónica maciza a medida, terminación en aceite-cera inocuo.',
    image: '/images/shopify-demo/coleccion/wachi-fondo-blanco.png',
    kind: 'ensemble',
    price: '$4.990.000',
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
    description: 'Mesa en lenga patagónica maciza a medida, terminación en aceite-cera inocuo.',
    image: '/images/shopify-demo/coleccion/mesa-fondo-blanco.png',
    kind: 'table',
    price: '$3.290.000',
    sizes: [
      'Largo entre 140-156 cm Ancho entre 80-120 cm',
      'Largo entre 157-189 cm Ancho entre 80-120 cm',
      'Largo entre 190-220 cm Ancho entre 80-120 cm',
    ],
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
    description: 'Silla en lenga patagónica maciza, terminación en aceite-cera inocuo.',
    image: '/images/shopify-demo/coleccion/silla-fondo-blanco.png',
    kind: 'chair',
    price: '$620.000',
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
    description: 'Banqueta en lenga patagónica maciza, terminación en aceite-cera inocuo.',
    image: '/images/shopify-demo/coleccion/banqueta-fondo-blanco.png',
    kind: 'bench',
    price: '$890.000',
    sizes: [
      'Largo entre 140-156 cm Ancho 45 cm',
      'Largo entre 157-189 cm Ancho 45 cm',
      'Largo entre 190-220 cm Ancho 45 cm',
    ],
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

const stageSlideTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} as const;

const WACHI_GRID_SIZES = COLLECTION_REGISTRY.wachi.gridSizes;
const WACHI_GRID_SOURCES = COLLECTION_REGISTRY.wachi.gridSources;
const STAGE_IMAGE_SIZES = '(max-width: 850px) 84vw, 44vw';
const WACHI_PERSPECTIVE_SOURCES = pieces.flatMap((piece) =>
  piece.perspectives.slice(1).map((perspective) => perspective.src),
);

function preloadPiecePerspectives(piece: WachiPiece) {
  void preloadResponsiveSources(
    piece.perspectives.map((perspective) => perspective.src),
    STAGE_IMAGE_SIZES,
    'high',
  );
}

function preloadNeighbourPieces(index: number) {
  if (pieces.length <= 1) return;
  const next = pieces[(index + 1) % pieces.length];
  const prev = pieces[(index - 1 + pieces.length) % pieces.length];
  if (next) preloadPiecePerspectives(next);
  if (prev && prev.kind !== next?.kind) preloadPiecePerspectives(prev);
}

const WachiCollection = () => {
  const { cart, isCartOpen, openCart } = useShopify();
  const mainRef = useRef<HTMLElement | null>(null);
  const [selectedKind, setSelectedKind] = useState<WachiPiece['kind'] | null>(null);
  const [slideDirection, setSlideDirection] = useState<VerticalSlideDirection>(0);
  const [perspectiveIndex, setPerspectiveIndex] = useState(0);
  const [isSizePickerOpen, setIsSizePickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [requestItems, setRequestItems] = useState<WachiRequestLineItem[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const stockBagCount = cart?.totalQuantity || 0;

  const handleAddPieceToRequest = (piece: WachiPiece, size: string | null) => {
    const key = `${piece.kind}::${size ?? 'default'}`;
    setRequestItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex === -1) {
        return [...prev, { key, piece, selectedSize: size, quantity: 1 }];
      }
      return prev.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
    setIsRequestDrawerOpen(true);
  };

  const handleUpdateRequestItemQuantity = (key: string, delta: number) => {
    setRequestItems((prev) => {
      const next = prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0);
      if (next.length === 0) {
        setIsRequestDrawerOpen(false);
      }
      return next;
    });
  };

  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  const handleExitToGallery = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const activePiece = pieces.find((piece) => piece.kind === selectedKind) ?? null;

  const isGridReady = useCollectionGridReady({
    gridSources: WACHI_GRID_SOURCES,
    gridSizes: WACHI_GRID_SIZES,
    perspectiveSources: WACHI_PERSPECTIVE_SOURCES,
    perspectiveSizes: STAGE_IMAGE_SIZES,
  });

  useEffect(() => {
    if (!isGridReady) return;
    void preloadShoppableGalleryCovers('low');
  }, [isGridReady]);

  const handleIntentPreloadGallery = () => {
    void preloadShoppableGalleryCovers('high');
  };

  const handleOpenPiece = (kind: WachiPiece['kind']) => {
    const targetIndex = pieces.findIndex((piece) => piece.kind === kind);
    const target = targetIndex !== -1 ? pieces[targetIndex] : undefined;
    if (target) {
      preloadPiecePerspectives(target);
      preloadNeighbourPieces(targetIndex);
    }
    mainRef.current?.scrollIntoView?.({ block: 'start', behavior: 'instant' as ScrollBehavior });
    setSlideDirection(0);
    setPerspectiveIndex(0);
    setIsSizePickerOpen(false);
    setSelectedSize(null);
    setIsRequestDrawerOpen(false);
    setSelectedKind(kind);
  };

  const handleClosePiece = () => {
    setSlideDirection(0);
    setPerspectiveIndex(0);
    setIsSizePickerOpen(false);
    setSelectedSize(null);
    setIsRequestDrawerOpen(false);
    setSelectedKind(null);
  };

  const handleVerticalNavigatePiece = (direction: -1 | 1) => {
    if (!selectedKind || pieces.length <= 1) return;
    const currentIndex = pieces.findIndex((piece) => piece.kind === selectedKind);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + pieces.length) % pieces.length;
    const nextPiece = pieces[nextIndex];
    if (!nextPiece) return;

    preloadPiecePerspectives(nextPiece);
    preloadNeighbourPieces(nextIndex);
    setSlideDirection(direction);
    setPerspectiveIndex(0);
    setIsSizePickerOpen(false);
    setSelectedSize(null);
    setSelectedKind(nextPiece.kind);
  };

  useStageVerticalNav({
    enabled: Boolean(activePiece) && !isRequestDrawerOpen && !isCartOpen,
    itemCount: pieces.length,
    onNavigate: handleVerticalNavigatePiece,
  });

  const mediaSlideVariants = {
    enter: (dir: VerticalSlideDirection) =>
      dir === 0
        ? { opacity: 1, y: 0 }
        : {
            opacity: 0,
            y: shouldReduceMotion ? 0 : dir > 0 ? '100%' : '-100%',
          },
    center: (dir: VerticalSlideDirection) => ({
      opacity: 1,
      y: 0,
      transition: dir === 0 ? yeezySpring : stageSlideTransition,
    }),
    exit: (dir: VerticalSlideDirection) =>
      dir === 0
        ? { opacity: 0, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }
        : {
            opacity: 0,
            y: shouldReduceMotion ? 0 : dir > 0 ? '-100%' : '100%',
            transition: stageSlideTransition,
          },
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
    if (!activePiece && !isRequestDrawerOpen) return;
    const total = activePiece?.perspectives.length ?? 1;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isRequestDrawerOpen) {
          setIsRequestDrawerOpen(false);
        } else if (isSizePickerOpen) {
          setIsSizePickerOpen(false);
        } else {
          handleClosePiece();
        }
      } else if (!isRequestDrawerOpen && activePiece && event.key === 'ArrowLeft') {
        setPerspectiveIndex((prev) => (prev - 1 + total) % total);
      } else if (!isRequestDrawerOpen && activePiece && event.key === 'ArrowRight') {
        setPerspectiveIndex((prev) => (prev + 1) % total);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePiece, isSizePickerOpen, isRequestDrawerOpen]);

  const showPieceOrCheckoutHeader = Boolean(activePiece || isRequestDrawerOpen);
  const isPieceStageLocked = Boolean(activePiece) && !isRequestDrawerOpen;

  return (
    <main
      ref={mainRef}
      className={`wachi-collection${showPieceOrCheckoutHeader ? ' wachi-collection--stage-active' : ''}${
        isPieceStageLocked ? ' wachi-collection--piece-stage' : ''
      }`}
    >
      <header className="wachi-collection__header">
        {isRequestDrawerOpen ? (
          <button
            type="button"
            className="wachi-collection__icon"
            onClick={() => setIsRequestDrawerOpen(false)}
            aria-label="Volver a la pieza WACHI"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
        ) : activePiece ? (
          <button
            type="button"
            className="wachi-collection__icon"
            onClick={handleClosePiece}
            aria-label="Volver a la colección WACHI"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
        ) : (
          <Link
            to={galleryUrl}
            onClick={handleExitToGallery}
            onMouseEnter={handleIntentPreloadGallery}
            onFocus={handleIntentPreloadGallery}
            onTouchStart={handleIntentPreloadGallery}
            className="wachi-collection__icon"
            aria-label="Volver a la galería"
          >
            <ArrowLeft size={23} strokeWidth={1.45} />
          </Link>
        )}

        <Link
          to={galleryUrl}
          onClick={handleExitToGallery}
          onMouseEnter={handleIntentPreloadGallery}
          onFocus={handleIntentPreloadGallery}
          onTouchStart={handleIntentPreloadGallery}
          className={`wachi-collection__wordmark${showPieceOrCheckoutHeader ? ' wachi-collection__wordmark--hidden' : ''}`}
          tabIndex={showPieceOrCheckoutHeader ? -1 : undefined}
        >
          BRUTO Atelier
        </Link>

        {!isRequestDrawerOpen && (
          <button
            type="button"
            className="wachi-collection__icon wachi-collection__bag"
            onClick={openCart}
            aria-label={`Abrir bolsa${stockBagCount ? `, ${stockBagCount} piezas` : ''}`}
          >
            {stockBagCount ? <span className="wachi-collection__bag-count">{stockBagCount}</span> : null}
            <img src="/bag.svg" alt="" aria-hidden="true" className="wachi-collection__bag-img" />
          </button>
        )}
      </header>

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {isRequestDrawerOpen ? (
            <motion.div
              key="wachi-checkout-stage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <WachiRequestDrawer
                open={isRequestDrawerOpen}
                onOpenChange={setIsRequestDrawerOpen}
                piece={activePiece}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                items={requestItems}
                onUpdateItemQuantity={handleUpdateRequestItemQuantity}
                onClearItems={() => setRequestItems([])}
              />
            </motion.div>
          ) : !activePiece ? (
            <motion.section
              key="wachi-grid"
              className="wachi-collection__content"
              aria-labelledby="wachi-collection-title"
              initial={{ opacity: isGridReady ? 1 : 0 }}
              animate={{ opacity: isGridReady ? 1 : 0 }}
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
                      onMouseEnter={() => preloadPiecePerspectives(piece)}
                      onFocus={() => preloadPiecePerspectives(piece)}
                      onClick={() => handleOpenPiece(piece.kind)}
                      aria-label={`Ver ${piece.name}`}
                    >
                      <motion.div
                        layoutId={`wachi-piece-image-${piece.kind}`}
                        transition={yeezySpring}
                        className="wachi-collection__image"
                      >
                        <img
                          {...catalogImageProps(piece.image, WACHI_GRID_SIZES)}
                          alt={piece.name}
                          loading="eager"
                          decoding="sync"
                          fetchPriority="high"
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
              key="wachi-stage"
              className="wachi-stage"
              aria-label={`Vista detallada de ${activePiece.name}`}
              data-slide-direction={slideDirection}
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

                <div
                  className={`wachi-stage__media-slot${
                    slideDirection !== 0 ? ' wachi-stage__media-slot--sliding' : ''
                  }`}
                >
                  <AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>
                    <motion.div
                      key={activePiece.kind}
                      layoutId={
                        slideDirection === 0 ? `wachi-piece-image-${activePiece.kind}` : undefined
                      }
                      custom={slideDirection}
                      variants={mediaSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="wachi-stage__media"
                    >
                      {activePiece.perspectives.map((perspective, idx) => {
                        const isActive = idx === perspectiveIndex;
                        return (
                          <img
                            key={perspective.src}
                            {...catalogImageProps(perspective.src, STAGE_IMAGE_SIZES)}
                            alt={perspective.alt}
                            loading="eager"
                            decoding="sync"
                            aria-hidden={!isActive}
                            className={`wachi-stage__img ${perspective.className ?? ''}${isActive ? '' : ' wachi-stage__img--hidden'}`}
                          />
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

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

                <div className="wachi-stage__title-row">
                  <motion.h2
                    layoutId={slideDirection === 0 ? `wachi-piece-title-${activePiece.kind}` : undefined}
                    transition={yeezySpring}
                    className="wachi-stage__title"
                  >
                    {activePiece.sizes && isSizePickerOpen ? 'Medida:' : activePiece.name}
                  </motion.h2>

                  <AnimatePresence>
                    {activePiece.sizes && isSizePickerOpen && (
                      <motion.button
                        key="close-sizes"
                        type="button"
                        className="wachi-stage__close-sizes"
                        onClick={() => setIsSizePickerOpen(false)}
                        aria-label="Cerrar selector de medidas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                      >
                        <X size={18} strokeWidth={1.6} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {!isSizePickerOpen && (
                  <motion.p
                    className="wachi-stage__description"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.12, duration: 0.2 }}
                  >
                    {activePiece.description}
                  </motion.p>
                )}

                <motion.p
                  className="wachi-stage__price"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  {activePiece.price}
                </motion.p>

                <AnimatePresence mode="wait" initial={false}>
                  {activePiece.sizes && isSizePickerOpen ? (
                    <motion.div
                      key="size-picker"
                      className="wachi-stage__sizes"
                      role="radiogroup"
                      aria-label="Seleccionar dimensiones"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      {activePiece.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            className={`wachi-stage__size-option${isSelected ? ' wachi-stage__size-option--selected' : ''}`}
                            onClick={() => {
                              setSelectedSize(size);
                              setIsSizePickerOpen(false);
                              handleAddPieceToRequest(activePiece, size);
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.button
                      key="add-trigger"
                      type="button"
                      className="wachi-stage__inquire-btn"
                      aria-label={`Solicitar ${activePiece.name}`}
                      onClick={() => {
                        if (activePiece.sizes?.length) {
                          setIsSizePickerOpen(true);
                        } else {
                          handleAddPieceToRequest(activePiece, null);
                        }
                      }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      {activePiece.sizes?.length ? 'ELEGIR MEDIDAS Y SOLICITAR' : 'SOLICITAR PIEZA'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </main>
  );
};

export default WachiCollection;
