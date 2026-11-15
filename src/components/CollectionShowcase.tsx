import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, Plus, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { catalogImageProps } from '@/lib/catalog-images';
import {
  COLLECTION_REGISTRY,
  preloadResponsiveSources,
  preloadShoppableGalleryCovers,
  useCollectionGridReady,
  type CollectionId,
} from '@/lib/collection-images';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import { MOCK_PRODUCTS } from '@/lib/shopify/mockData';
import '@/styles/wachi-collection.css';
import '@/styles/accessories-collection.css';

export interface CollectionPerspective {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export interface CollectionColorOption {
  id: string;
  label: string;
  swatch: string;
  variantTitle?: string;
  description?: string;
  perspectives: readonly CollectionPerspective[];
}

export interface CollectionPiece {
  id: string;
  name: string;
  description: string;
  image: string;
  width: number;
  height: number;
  price: string;
  perspectives: readonly CollectionPerspective[];
  colors?: readonly CollectionColorOption[];
}

interface CollectionShowcaseProps {
  collectionId: Exclude<CollectionId, 'wachi'>;
  title: string;
  subtitle?: string;
  titleId: string;
  layoutPrefix: string;
  className?: string;
  stageSizes?: string;
  pieces: readonly CollectionPiece[];
}

const springTransition = {
  type: 'spring',
  stiffness: 240,
  damping: 30,
  mass: 0.9,
} as const;

const DEFAULT_STAGE_SIZES = '(max-width: 850px) 84vw, 44vw';

function preloadPiecePerspectives(piece: CollectionPiece, stageSizes: string) {
  const sources = Array.from(
    new Set([
      ...piece.perspectives.map((perspective) => perspective.src),
      ...(piece.colors?.flatMap((color) => color.perspectives.map((perspective) => perspective.src)) ?? []),
    ]),
  );
  void preloadResponsiveSources(sources, stageSizes, 'high');
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

const CollectionShowcase = ({
  collectionId,
  title,
  subtitle = 'Colección',
  titleId,
  layoutPrefix,
  className = '',
  stageSizes = DEFAULT_STAGE_SIZES,
  pieces,
}: CollectionShowcaseProps) => {
  const { cart, isCartOpen, openCart, products, addToCart, isCartLoading } = useShopify();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [perspectiveIndex, setPerspectiveIndex] = useState(0);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added' | 'error'>('idle');
  const [bagPulseKey, setBagPulseKey] = useState(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const feedbackTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  const registryConfig = COLLECTION_REGISTRY[collectionId];
  const perspectiveSources = Array.from(
    new Set(
      pieces.flatMap((piece) => [
        ...piece.perspectives.slice(1).map((perspective) => perspective.src),
        ...(piece.colors?.flatMap((color) => color.perspectives.map((perspective) => perspective.src)) ?? []),
      ]),
    ),
  );

  const activePiece = pieces.find((piece) => piece.id === selectedId) ?? null;
  const hasColors = Boolean(activePiece?.colors?.length);
  const activeColor =
    activePiece?.colors?.find((color) => color.id === selectedColorId) ??
    activePiece?.colors?.[0] ??
    null;
  const activePerspectives = activeColor ? activeColor.perspectives : (activePiece?.perspectives ?? []);
  const activeDescription = activeColor?.description ?? activePiece?.description ?? '';

  const activeShopifyProduct = activePiece
    ? products.find((product) => product.handle === activePiece.id) ??
      MOCK_PRODUCTS.find((product) => product.handle === activePiece.id)
    : undefined;
  const activeVariant = (() => {
    if (!activeShopifyProduct) return undefined;
    const variants = activeShopifyProduct.variants.edges.map((edge) => edge.node);
    if (activeColor) {
      const matchTarget = (activeColor.variantTitle ?? activeColor.label).trim().toLowerCase();
      const matched = variants.find(
        (variant) =>
          variant.title.trim().toLowerCase() === matchTarget ||
          variant.selectedOptions.some((opt) => opt.value.trim().toLowerCase() === matchTarget),
      );
      if (matched) return matched;
    }
    return variants[0];
  })();
  const activeVariantId = activeVariant?.id;
  const activeDisplayTitle = activeShopifyProduct?.title || activePiece?.name || '';
  const activeDisplayPrice = formatClpPrice(
    activeVariant?.price.amount ?? activeShopifyProduct?.priceRange.minVariantPrice.amount,
    activePiece?.price,
  );

  const isGridReady = useCollectionGridReady({
    gridSources: registryConfig.gridSources,
    gridSizes: registryConfig.gridSizes,
    perspectiveSources,
    perspectiveSizes: stageSizes,
  });

  useEffect(() => {
    if (!isGridReady) return;
    void preloadShoppableGalleryCovers('low');
  }, [isGridReady]);

  const handleIntentPreloadGallery = () => {
    void preloadShoppableGalleryCovers('high');
  };

  const handleExitToGallery = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  useEffect(() => () => clearFeedbackTimer(), []);

  const handleOpenPiece = (id: string) => {
    clearFeedbackTimer();
    setAddStatus('idle');
    const target = pieces.find((piece) => piece.id === id);
    if (target) preloadPiecePerspectives(target, stageSizes);
    setPerspectiveIndex(0);
    setIsColorPickerOpen(false);
    setSelectedColorId(target?.colors?.[0]?.id ?? null);
    setSelectedId(id);
  };

  const handleClosePiece = () => {
    clearFeedbackTimer();
    setAddStatus('idle');
    setPerspectiveIndex(0);
    setIsColorPickerOpen(false);
    setSelectedColorId(null);
    setSelectedId(null);
  };

  const handleAddToCart = async () => {
    if (!activeVariantId || addStatus === 'adding' || isCartLoading) return;
    clearFeedbackTimer();
    setAddStatus('adding');
    const result = await addToCart(activeVariantId, 1);

    if (result.ok) {
      const nextCount = result.data?.totalQuantity ?? (cart?.totalQuantity ?? 0) + 1;
      setAddStatus('added');
      setBagPulseKey((prev) => prev + 1);
      setLiveAnnouncement(`${activeDisplayTitle} agregado a la bolsa. Total: ${nextCount}.`);
      feedbackTimerRef.current = window.setTimeout(() => {
        setAddStatus('idle');
        feedbackTimerRef.current = null;
      }, 1400);
      return;
    }

    setAddStatus('error');
    setLiveAnnouncement('No fue posible agregar la pieza a la bolsa.');
    feedbackTimerRef.current = window.setTimeout(() => {
      setAddStatus('idle');
      feedbackTimerRef.current = null;
    }, 2200);
  };

  const handlePrevPerspective = () => {
    if (!activePiece || activePerspectives.length <= 1) return;
    const total = activePerspectives.length;
    setPerspectiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNextPerspective = () => {
    if (!activePiece || activePerspectives.length <= 1) return;
    const total = activePerspectives.length;
    setPerspectiveIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (!activePiece || isCartOpen) return;
    const total = activePerspectives.length;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isColorPickerOpen) {
          setIsColorPickerOpen(false);
        } else {
          handleClosePiece();
        }
      } else if (total > 1 && event.key === 'ArrowLeft') {
        setPerspectiveIndex((prev) => (prev - 1 + total) % total);
      } else if (total > 1 && event.key === 'ArrowRight') {
        setPerspectiveIndex((prev) => (prev + 1) % total);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePiece, activePerspectives.length, isCartOpen, isColorPickerOpen]);

  const isSinglePiece = pieces.length === 1;

  return (
    <main className={`wachi-collection ${className}${activePiece ? ' wachi-collection--stage-active' : ''}`}>
      <header className="wachi-collection__header">
        {activePiece ? (
          <button
            type="button"
            className="wachi-collection__icon"
            onClick={handleClosePiece}
            aria-label={`Volver a la colección ${title}`}
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
          {bagPulseKey > 0 && !shouldReduceMotion ? (
            <motion.div
              key={`bag-pulse-${bagPulseKey}`}
              className="wachi-collection__bag-pulse"
              initial={{ scale: 0.7, opacity: 0.55 }}
              animate={{ scale: 1.85, opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
          ) : null}
          {cart?.totalQuantity ? (
            <motion.span
              key={`bag-count-${bagPulseKey}-${cart.totalQuantity}`}
              className="wachi-collection__bag-count"
              initial={bagPulseKey > 0 && !shouldReduceMotion ? { scale: 0.65, opacity: 0.6 } : false}
              animate={bagPulseKey > 0 && !shouldReduceMotion ? { scale: [0.65, 1.38, 0.94, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              {cart.totalQuantity}
            </motion.span>
          ) : null}
          <motion.div
            key={`bag-icon-${bagPulseKey}`}
            className="wachi-collection__bag-icon"
            animate={bagPulseKey > 0 && !shouldReduceMotion ? { y: [0, -4, 0], scale: [1, 1.15, 1] } : undefined}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <ShoppingBag size={20} strokeWidth={1.45} />
          </motion.div>
        </button>
      </header>

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {!activePiece ? (
            <motion.section
              key={`${layoutPrefix}-grid`}
              className="wachi-collection__content"
              aria-labelledby={titleId}
              initial={{ opacity: isGridReady ? 1 : 0 }}
              animate={{ opacity: isGridReady ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="wachi-collection__intro">
                <p>{subtitle}</p>
                <h1 id={titleId}>{title}</h1>
              </div>

              <div className={`wachi-collection__grid${isSinglePiece ? ' wachi-collection__grid--single' : ''}`}>
                {pieces.map((piece) => {
                  const shopifyPiece =
                    products.find((product) => product.handle === piece.id) ??
                    MOCK_PRODUCTS.find((product) => product.handle === piece.id);
                  const displayTitle = shopifyPiece?.title || piece.name;
                  return (
                    <article
                      key={piece.id}
                      className={`wachi-collection__piece wachi-collection__piece--${piece.id} wachi-collection__piece--interactive`}
                    >
                      <button
                        type="button"
                        className="wachi-collection__piece-trigger"
                        onMouseEnter={() => preloadPiecePerspectives(piece, stageSizes)}
                        onFocus={() => preloadPiecePerspectives(piece, stageSizes)}
                        onClick={() => handleOpenPiece(piece.id)}
                        aria-label={`Ver ${displayTitle}`}
                      >
                        <motion.div
                          layoutId={`${layoutPrefix}-piece-image-${piece.id}`}
                          transition={springTransition}
                          className="wachi-collection__image"
                        >
                          <img
                            {...catalogImageProps(piece.image, registryConfig.gridSizes)}
                            alt={displayTitle}
                            loading="eager"
                            decoding="sync"
                            fetchPriority="high"
                          />
                        </motion.div>
                        <motion.h2
                          layoutId={`${layoutPrefix}-piece-title-${piece.id}`}
                          transition={springTransition}
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
              key={`${layoutPrefix}-stage-${activePiece.id}`}
              className="wachi-stage"
              aria-label={`Vista detallada de ${activePiece.name}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="wachi-stage__viewport">
                {activePerspectives.length > 1 && (
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
                )}

                <motion.div
                  layoutId={`${layoutPrefix}-piece-image-${activePiece.id}`}
                  transition={springTransition}
                  className="wachi-stage__media"
                >
                  {activePerspectives.map((perspective, idx) => {
                    const isActive = idx === perspectiveIndex;
                    return (
                      <img
                        key={perspective.src}
                        {...catalogImageProps(perspective.src, stageSizes)}
                        alt={perspective.alt}
                        loading="eager"
                        decoding="sync"
                        aria-hidden={!isActive}
                        className={`wachi-stage__img ${perspective.className ?? ''}${isActive ? '' : ' wachi-stage__img--hidden'}`}
                      />
                    );
                  })}
                </motion.div>

                {activePerspectives.length > 1 && (
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
                )}
              </div>

              <div className="wachi-stage__info">
                {activePerspectives.length > 1 && (
                  <motion.div
                    className="wachi-stage__dots"
                    role="tablist"
                    aria-label="Perspectivas del producto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.12, duration: 0.18 }}
                  >
                    {activePerspectives.map((perspective, idx) => (
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
                )}

                <div className="wachi-stage__title-row">
                  <motion.h2
                    layoutId={`${layoutPrefix}-piece-title-${activePiece.id}`}
                    transition={springTransition}
                    className="wachi-stage__title"
                  >
                    {hasColors && isColorPickerOpen ? 'SELECCIONAR COLOR' : activeDisplayTitle}
                  </motion.h2>

                  <AnimatePresence>
                    {hasColors && isColorPickerOpen && (
                      <motion.button
                        key="close-colors"
                        type="button"
                        className="wachi-stage__close-sizes"
                        onClick={() => setIsColorPickerOpen(false)}
                        aria-label="Cerrar selector de color"
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

                {!(hasColors && isColorPickerOpen) && (
                  <motion.p
                    className="wachi-stage__description"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.12, duration: 0.2 }}
                  >
                    {activeDescription}
                  </motion.p>
                )}

                <motion.p
                  className="wachi-stage__price"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  {activeDisplayPrice}
                </motion.p>

                <AnimatePresence>
                  {hasColors && isColorPickerOpen && activePiece.colors ? (
                    <motion.div
                      key="color-picker"
                      className="wachi-stage__colors"
                      role="radiogroup"
                      aria-label="Seleccionar color"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      {activePiece.colors.map((color) => {
                        const isSelected = activeColor?.id === color.id;
                        return (
                          <button
                            key={color.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={color.label}
                            title={color.label}
                            className={`wachi-stage__color-swatch${isSelected ? ' wachi-stage__color-swatch--selected' : ''}`}
                            style={{ backgroundColor: color.swatch }}
                            onClick={() => {
                              setSelectedColorId(color.id);
                              setPerspectiveIndex((prev) =>
                                Math.min(prev, Math.max(0, color.perspectives.length - 1)),
                              );
                            }}
                          />
                        );
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="wachi-stage__add-wrap">
                  <motion.button
                    type="button"
                    className={`wachi-stage__add${
                      addStatus === 'adding'
                        ? ' wachi-stage__add--adding'
                        : addStatus === 'added'
                          ? ' wachi-stage__add--added'
                          : addStatus === 'error'
                            ? ' wachi-stage__add--error'
                            : ''
                    }`}
                    aria-label={
                      addStatus === 'added'
                        ? `${activeDisplayTitle} agregado a la bolsa`
                        : hasColors && !isColorPickerOpen
                          ? `Seleccionar color de ${activeDisplayTitle}`
                          : hasColors && isColorPickerOpen && activeColor
                            ? `Agregar ${activeDisplayTitle} ${activeColor.label} a la bolsa`
                            : `Agregar ${activeDisplayTitle}`
                    }
                    disabled={
                      hasColors && !isColorPickerOpen
                        ? false
                        : addStatus === 'adding' || isCartLoading || !activeVariantId
                    }
                    onClick={() => {
                      if (hasColors && !isColorPickerOpen) {
                        setIsColorPickerOpen(true);
                        return;
                      }
                      void handleAddToCart();
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={
                      addStatus === 'added' && !shouldReduceMotion
                        ? { opacity: 1, y: 0, scale: [1, 1.12, 1] }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    exit={{ opacity: 0 }}
                    transition={
                      addStatus === 'added'
                        ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                        : { delay: 0.18, duration: 0.2 }
                    }
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {addStatus === 'adding' ? (
                        <motion.span
                          key="adding"
                          className="wachi-stage__add-glyph"
                          initial={{ opacity: 0, scale: 0.75 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.75 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Loader2 size={18} strokeWidth={1.6} className="wachi-stage__add-spinner" />
                        </motion.span>
                      ) : addStatus === 'added' ? (
                        <motion.span
                          key="added"
                          className="wachi-stage__add-glyph"
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.55 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Check size={18} strokeWidth={2} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          className="wachi-stage__add-glyph"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Plus size={20} strokeWidth={1.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <AnimatePresence>
                    {addStatus === 'added' ? (
                      <motion.span
                        key="status-added"
                        className="wachi-stage__add-status"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        Agregado
                      </motion.span>
                    ) : addStatus === 'error' ? (
                      <motion.span
                        key="status-error"
                        className="wachi-stage__add-status wachi-stage__add-status--error"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        No se pudo agregar
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>

                <span className="sr-only" aria-live="polite">
                  {liveAnnouncement}
                </span>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </main>
  );
};

export default CollectionShowcase;
