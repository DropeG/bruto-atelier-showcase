import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { galleryItems } from "../data/Gallery";

const Piezas = () => {
  const navigate = useNavigate();
  const [showFront, setShowFront] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  // IDs de las imágenes de piezas
  const piezasIds = [7, 8];
  const piezasItems = galleryItems.filter(item => 
    piezasIds.includes(item.id)
  );

  // Precargar todas las imágenes con mejor optimización
  useEffect(() => {
    piezasItems.forEach(item => {
      // Precargar imagen detalle (con mayor prioridad)
      const img = new Image();
      img.src = item.detailImage;
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [item.id]: true }));
      };
      
      // Precargar thumbnail (con menor prioridad)
      const thumbImg = new Image();
      thumbImg.src = item.thumbnail;
    });
  }, [piezasItems.length]);

  // Cambiar automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % piezasItems.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [piezasItems.length]);

  useEffect(() => {
    const timer = setTimeout(() => setShowFront(true), 1000);

    const handleWheel = () => {
      setShowFront(true);
      clearTimeout(timer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
    const handleTouchMove = () => {
      setShowFront(true);
      clearTimeout(timer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  if (piezasItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl text-gray-800">No encontrado</h1>
      </div>
    );
  }

  const allImagesLoaded = piezasItems.every(item => imagesLoaded[item.id]);

  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden bg-black">
      {/* Botón de volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-40 text-white/70 hover:text-white transition-all duration-300 group"
        aria-label="Volver"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 transform group-hover:-translate-x-1 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Indicador de carrusel */}
      <div className="absolute top-8 right-8 z-40 flex gap-2">
        {piezasItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-700 ease-out ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70 w-2'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Capas de fondo - todas renderizadas */}
      {piezasItems.map((item, index) => (
        <div
          key={`bg-${item.id}`}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none'
          }}
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            style={{ 
              minHeight: "100vh",
              filter: index === currentIndex ? "blur(1px)" : "blur(4px)",
              transition: "filter 0.6s ease-out"
            }}
            loading="lazy"
            decoding="async"
            fetchPriority={index === currentIndex ? "high" : "low"}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      {/* Imágenes principales - todas renderizadas con crossfade */}  
      {showFront && allImagesLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {piezasItems.map((item, index) => (
            <div
              key={`detail-${item.id}`}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out"
              style={{ 
                opacity: index === currentIndex ? 1 : 0,
                pointerEvents: index === currentIndex ? 'auto' : 'none'
              }}
            >
              <div 
                className="relative bg-white shadow-2xl" 
                style={{ maxWidth: '85vw', maxHeight: '80vh' }}
              >
                <img
                  src={item.detailImage}
                  alt={item.title}
                  className="w-full h-auto block"
                  style={{ maxHeight: '80vh' }}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />

                {/* Botón HABLEMOS */}
                <div className="absolute bottom-[9%] md:bottom-[10%] left-0 w-full flex justify-center">
                  <button
                    onClick={() => window.open("https://wa.me/56949569887", "_blank", "noopener,noreferrer")}
                    className="group flex items-center px-6 py-2 md:px-10 md:py-2.5 bg-transparent text-gray-800 font-serif text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em]
                               border border-gray-400 hover:border-gray-600 transition-all duration-700 ease-out 
                               cursor-pointer relative overflow-hidden 
                               hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)]"
                  >
                    HABLEMOS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Piezas;
