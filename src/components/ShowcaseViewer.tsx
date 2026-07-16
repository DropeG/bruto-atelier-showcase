import { useEffect, useState } from "react";
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
  layout?: "single" | "double" | "split";
  backgroundColor?: string; // Ideal para el color Moka de Coleccion.tsx
  subtitle?: string
}

interface ShowcaseViewerProps {
  items: ShowcaseItem[];
  autoPlay?: boolean;
  intervalTime?: number;
}

const ShowcaseViewer = ({ items, autoPlay = true, intervalTime = 5000 }: ShowcaseViewerProps) => {
  const navigate = useNavigate();
  const [showFront, setShowFront] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string | number, boolean>>({});

  // 1. Lógica de Precarga Optimizada (tomada de Piezas.tsx)
  useEffect(() => {
    if (!items || items.length === 0) return;

    items.forEach(item => {
      const imageSources = [item.detailImage, item.thumbnail, item.secondaryImage].filter(Boolean) as string[];
      let loadedCount = 0;

      imageSources.forEach(source => {
        const img = new Image();
        img.src = source;
        img.onload = () => {
          loadedCount += 1;
          // Solo marcamos como cargado cuando TODAS las imágenes del ítem (si es doble) están listas
          if (loadedCount === imageSources.length) {
            setImagesLoaded(prev => ({ ...prev, [item.id]: true }));
          }
        };
      });
    });
  }, [items]);

  // 2. Lógica de Carrusel Automático
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return; // No hacer autoplay si es una sola foto (ej: Category.tsx)

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [items.length, autoPlay, intervalTime, currentIndex]);

  // 3. Lógica de Revelado (Interacción del usuario)
  useEffect(() => {
    const timer = setTimeout(() => setShowFront(true), 1000);

    const handleInteraction = () => {
      setShowFront(true);
      clearTimeout(timer);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
    };

    window.addEventListener("wheel", handleInteraction, { passive: true });
    window.addEventListener("touchmove", handleInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
    };
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl text-gray-800">No encontrado</h1>
      </div>
    );
  }

  const allImagesLoaded = items.every((item) => imagesLoaded[item.id]);

  const handlePanEnd = (_: unknown, info: PanInfo) => {
    if (items.length <= 1) return;
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    } else if (info.offset.x > swipeThreshold) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
    }
  };

  return (
    <motion.div 
      onPanEnd={handlePanEnd}
      className="relative w-full min-h-screen h-screen overflow-hidden bg-black select-none touch-pan-y cursor-grab active:cursor-grabbing"
    >

      {/* Botón de volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-40 text-white/70 hover:text-white transition-all duration-300 group"
        aria-label="Volver"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Indicador de carrusel (Solo se muestra si hay más de 1 imagen) */}
      {items.length > 1 && (
        <div className="absolute top-8 right-8 z-40 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-700 ease-out ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70 w-2'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Capas de fondo (Thumbnails con blur) */}
      {items.map((item, index) => (
        <div
          key={`bg-${item.id}`}
          className="absolute inset-0 transition-all duration-[2500ms]"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none',
            backgroundColor: item.backgroundColor || undefined,
            transform: index === currentIndex ? 'scale(1.12)' : 'scale(1.05)',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {(!item.layout || item.layout === "single" || item.layout === "double") && (
            <>
              <img
                src={item.thumbnail}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover object-center select-none"
                style={{ 
                  minHeight: "100vh",
                  filter: index === currentIndex && showFront ? "blur(1px)" : "blur(4px)",
                  transition: "filter 0.6s ease-out"
                }}
                loading="lazy"
                decoding="async"
                // Optimización de carga basada en el índice actual
                fetchPriority={index === currentIndex ? "high" : "low"} 
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          )}
        </div>
      ))}

      {/* Imágenes principales (Detalle) en el centro */}  
      {showFront && allImagesLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          {items.map((item, index) => (
            <div
              key={`detail-${item.id}`}
              className="absolute inset-0 flex items-center justify-center transition-all duration-[2500ms]"
              style={{ 
                opacity: index === currentIndex ? 1 : 0,
                pointerEvents: index === currentIndex ? 'auto' : 'none',
                transform: index === currentIndex ? 'scale(1.03)' : 'scale(0.98)',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className={`relative flex flex-col items-center gap-6 ${item.layout === "split" ? "w-full h-full" : "px-4"}`}>
                
                {/* Renderizado Condicional: Doble vs Simple vs Split */}
                {item.layout === "split" ? (
                  <div className="flex w-full h-full animate-fade-in-up">
                    {[item.detailImage, item.secondaryImage].filter(Boolean).map((imageSrc, imageIndex) => (
                      <div key={`${item.id}-image-${imageIndex}`} className="w-1/2 h-full overflow-hidden">
                        <img 
                          src={imageSrc} 
                          alt={`${item.title} ${imageIndex + 1}`} 
                          draggable={false}
                          className="w-full h-full object-cover select-none" 
                          loading="eager" 
                        />
                      </div>
                    ))}
                  </div>
                ) : item.layout === "double" ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 animate-fade-in-up">
                    {[item.detailImage, item.secondaryImage].filter(Boolean).map((imageSrc, imageIndex) => (
                      <div key={`${item.id}-image-${imageIndex}`} className="relative bg-white shadow-2xl" style={{ maxWidth: 'min(34vw, 360px)', maxHeight: '80vh' }}>
                        <img src={imageSrc} alt={`${item.title} ${imageIndex + 1}`} draggable={false} className="w-full h-auto block md:object-contain select-none" style={{ maxHeight: '80vh' }} loading="eager" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative bg-white shadow-2xl animate-fade-in-up max-w-[85vw] md:max-w-[min(70vw,65vh)] xl:max-w-[85vw]" style={{ maxHeight: '80vh' }}>
                    <img src={item.detailImage} alt={item.title} draggable={false} className="w-full h-auto block md:object-contain select-none" style={{ maxHeight: '80vh' }} loading="eager" decoding="async" fetchPriority="high" />
                  </div>
                )}

                {/* Botón HABLEMOS Universal */}
                <div className={`${item.layout === "split" ? "absolute bottom-[10%] z-30" : "absolute bottom-[9%] md:bottom-[10%]"} left-0 w-full flex justify-center ${item.layout === "double" ? "relative bottom-0 mt-4" : ""}`}>
                  
                  {/* Ancla del botón + subtítulo con contexto de ancho para evitar desbordes */}
                  <div className="relative flex w-full justify-center px-4">
                    <button
                      onClick={() => window.open("https://wa.me/56949569887", "_blank", "noopener,noreferrer")}
                      className={`pointer-events-auto text-[#694634] border-[#694634] group flex items-center px-6 py-2.5 md:px-10 md:py-2.5 bg-transparent font-serif text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] border transition-all duration-700 ease-out cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] ${item.layout === "split" ? "bg-white/80 backdrop-blur-sm" : ""}`}
                    >
                      HABLEMOS
                    </button>

                    {/* Subtítulo centrado y con ancho limitado para que no se salga de la foto */}
                    <span className={`absolute top-full left-1/2 mt-2 md:mb-3 w-full max-w-[280px] md:max-w-[420px] -translate-x-1/2 px-4 text-[10px] leading-tight md:text-[13px] text-center font-serif tracking-wide whitespace-normal break-words pointer-events-none ${item.layout === "split" ? "text-white drop-shadow-md" : "text-[#694634]"}`}>
                      {item.subtitle}
                    </span>
                  </div>

                </div>

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
      `}</style>
    </motion.div>
  );
};

export default ShowcaseViewer;