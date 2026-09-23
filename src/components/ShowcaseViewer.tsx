import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGalleryPresentation } from "@/hooks/use-gallery-presentation";
import { backgroundFor } from "@/lib/gallery-images";
import { useNavigate } from "react-router-dom";
import { motion, PanInfo } from "framer-motion";

// FASE 1: Tipado Universal.
// Esta interfaz soporta tanto imágenes simples (Arquitectura, Piezas)
// como dobles (Colección), haciéndola 100% reutilizable.
export interface ShowcaseItem {
  id: string | number;
  title: string;
  thumbnail: string;
  detailImage: string;
  secondaryImage?: string;
  layout?: "single" | "double";
  backgroundColor?: string;
  subtitle?: string;
}

interface ShowcaseViewerProps {
  items: ShowcaseItem[];
  autoPlay?: boolean;
  intervalTime?: number;
}

const ShowcaseViewer = ({ items, autoPlay = true, intervalTime = 5000 }: ShowcaseViewerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentIndex, outgoing, staged, prepared, select, requestedIndex, reduced } = useGalleryPresentation(items, autoPlay, intervalTime);
  const visibleLayers = new Set([currentIndex, outgoing, staged]);
  const layers = items.map((item, index) => ({ item, index })).filter(({ index }) => visibleLayers.has(index));
  const imagesLoaded = Object.fromEntries(items.map((item, index) => [item.id, prepared[index]?.detail]));
  const showFront = true;
  const firstPresentedIndex = useRef<number | null>(null);
  if (firstPresentedIndex.current === null && prepared[currentIndex]?.detail) firstPresentedIndex.current = currentIndex;
  const hasChanged = useRef(false);
  // Keep the first entrance intact even if the user starts a crossfade before it finishes.
  if (firstPresentedIndex.current !== null && !visibleLayers.has(firstPresentedIndex.current)) hasChanged.current = true;

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl text-gray-800">No encontrado</h1>
      </div>
    );
  }


  const handlePanEnd = (_: unknown, info: PanInfo) => {
    if (items.length <= 1) return;
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      select((requestedIndex + 1) % items.length);
    } else if (info.offset.x > swipeThreshold) {
      select((requestedIndex + items.length - 1) % items.length);
    }
  };

  return (
    <motion.div
      onPanEnd={handlePanEnd}
      className="relative w-full min-h-screen h-screen overflow-hidden bg-black select-none touch-pan-y cursor-grab active:cursor-grabbing"
    >

      {/* Botón de volver */}
      <button
        onClick={() => {
          if ((location.state as { fromGallery?: boolean } | null)?.fromGallery || window.history.state?.idx > 0) navigate(-1);
          else navigate("/", { replace: true });
        }}
        className="absolute left-8 z-40 text-white/70 hover:text-white transition-all duration-300 group min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 -mt-2"
        style={{ top: "max(2rem, calc(1rem + env(safe-area-inset-top, 0px)))" }}
        aria-label="Volver"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Indicador de carrusel (Solo se muestra si hay más de 1 imagen) */}
      {items.length > 1 && (
        <div
          className="absolute right-8 z-40 flex items-center gap-1 -mr-2 -mt-2"
          style={{ top: "max(2rem, calc(1rem + env(safe-area-inset-top, 0px)))" }}
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => select(index)}
              aria-current={index === currentIndex ? "true" : undefined}
              className="min-w-[32px] min-h-[44px] flex items-center justify-center p-1.5 focus:outline-none group"
              aria-label={`Ir a imagen ${index + 1}`}
            >
              <span
                className={`h-2 rounded-full transition-all duration-700 ease-out block ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50 group-hover:bg-white/70 w-2'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Capas de fondo (Thumbnails con blur) */}
      {layers.map(({ item, index }) => (
        <div
          key={`bg-${item.id}`}
          className="absolute inset-0 transition-[opacity,transform] duration-[2500ms]"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            transitionDuration: reduced ? "0ms" : "2500ms",
            pointerEvents: index === currentIndex ? 'auto' : 'none',
            transform: index === currentIndex ? 'scale(1.12)' : 'scale(1.05)',
            backgroundImage: `url(${backgroundFor(item.thumbnail).placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <img
            key={prepared[index]?.background || 'placeholder'}
            src={prepared[index]?.background || backgroundFor(item.thumbnail).placeholder}
            alt={item.title}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover object-center select-none ${prepared[index]?.background ? 'gallery-background-ready' : ''}`}
            style={{
              minHeight: "100vh",
              filter: index === currentIndex && showFront ? "blur(1px)" : "blur(4px)",
              transition: "filter 0.6s ease-out"
            }}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      {/* Imágenes principales (Detalle) en el centro */}
      {showFront && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          {layers.filter(({ index }) => prepared[index]?.detail).map(({ item, index }) => (
            <div
              key={`detail-${item.id}`}
              className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-[2500ms]"
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transitionDuration: reduced ? "0ms" : "2500ms",
                pointerEvents: index === currentIndex ? 'auto' : 'none',
                transform: index === currentIndex ? 'scale(1.03)' : 'scale(0.98)',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="relative flex flex-col items-center gap-6 px-4">

                {/* Renderizado: Doble vs Simple */}
                {item.layout === "double" ? (
                  <>
                    <div className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 ${index === firstPresentedIndex.current && !hasChanged.current ? "animate-fade-in-up" : ""}`}>
                      {[item.detailImage, item.secondaryImage].filter(Boolean).map((imageSrc, imageIndex) => (
                        <div key={`${item.id}-image-${imageIndex}`} className="relative bg-white shadow-2xl overflow-hidden aspect-[4/5] w-[70vw] max-w-[min(34vw,360px)]" style={{ maxHeight: '80vh' }}>
                          <img
                            src={imageSrc}
                            alt={`${item.title} ${imageIndex + 1}`}
                            draggable={false}
                            className={`w-full h-full object-cover select-none transition-opacity duration-700 ease-out ${imagesLoaded[item.id] ? 'opacity-100' : 'opacity-0'}`}
                            loading="eager"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Botón HABLEMOS + Subtítulo para layout doble */}
                    <div className={`flex flex-col items-center justify-center transition-opacity duration-700 delay-150 ease-out z-10 pointer-events-none ${imagesLoaded[item.id] ? 'opacity-100' : 'opacity-0'}`}>
                      <button
                        onClick={() => window.open("https://wa.me/56949569887", "_blank", "noopener,noreferrer")}
                        className="pointer-events-auto text-[#694634] border-[#694634] group flex items-center px-6 py-2 md:px-9 md:py-2.5 bg-transparent font-serif text-[10.5px] md:text-xs tracking-[0.22em] md:tracking-[0.25em] border transition-all duration-500 ease-out cursor-pointer relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(105,70,52,0.12)]"
                      >
                        HABLEMOS
                      </button>
                      {item.subtitle && (
                        <p className="mt-1.5 md:mt-2 w-full max-w-[280px] md:max-w-[420px] px-2 text-[9.5px] leading-tight md:text-xs text-center font-serif tracking-wide whitespace-normal break-words pointer-events-none text-[#694634]/90 select-none">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    className={`relative bg-white shadow-2xl aspect-[4/5] w-[88vw] max-w-[min(88vw,390px)] md:max-w-[min(70vw,64vh)] overflow-hidden ${index === firstPresentedIndex.current && !hasChanged.current ? "animate-fade-in-up" : ""}`}
                    style={{ maxHeight: '80vh' }}
                  >
                    <img
                      src={item.detailImage}
                      alt={item.title}
                      draggable={false}
                      className={`w-full h-full object-cover select-none transition-opacity duration-700 ease-out ${imagesLoaded[item.id] ? 'opacity-100' : 'opacity-0'}`}
                      loading="eager"
                      decoding="async"
                    />

                    {/* Zona inferior Passe-partout (18.8% exacto): Botón HABLEMOS + Subtítulo integrados */}
                    <div className={`absolute bottom-0 inset-x-0 h-[18.8%] flex flex-col items-center justify-center px-4 transition-opacity duration-700 delay-150 ease-out z-10 pointer-events-none ${imagesLoaded[item.id] ? 'opacity-100' : 'opacity-0'}`}>
                      <button
                        onClick={() => window.open("https://wa.me/56949569887", "_blank", "noopener,noreferrer")}
                        className="pointer-events-auto text-[#694634] border-[#694634] group flex items-center px-6 py-2 md:px-9 md:py-2.5 bg-transparent font-serif text-[10.5px] md:text-xs tracking-[0.22em] md:tracking-[0.25em] border transition-all duration-500 ease-out cursor-pointer relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(105,70,52,0.12)]"
                      >
                        HABLEMOS
                      </button>

                      {item.subtitle && (
                        <p className="mt-1.5 md:mt-2 w-full max-w-[290px] md:max-w-[420px] px-2 text-[9.5px] leading-tight md:text-xs text-center font-serif tracking-wide whitespace-normal break-words pointer-events-none text-[#694634]/90 select-none">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animaciones CSS compartidas */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(.23,1.01,.32,1) forwards;
        }
        @keyframes galleryBackgroundReady {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .gallery-background-ready { animation: galleryBackgroundReady .24s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up, .gallery-background-ready { animation: none; }
        }
      `}</style>
    </motion.div>
  );
};

export default ShowcaseViewer;
