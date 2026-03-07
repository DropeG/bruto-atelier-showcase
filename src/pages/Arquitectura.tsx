import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { galleryItems } from "../data/Gallery";

const Arquitectura = () => {
  const navigate = useNavigate();
  const [showFront, setShowFront] = useState(false);
  const [isDetailLoaded, setIsDetailLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // IDs de las imágenes de arquitectura
  const arquitecturaIds = [5, 10];
  const arquitecturaItems = galleryItems.filter(item => 
    arquitecturaIds.includes(item.id)
  );

  const currentItem = arquitecturaItems[currentIndex];

  // Cambiar automáticamente cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % arquitecturaItems.length
      );
      setIsDetailLoaded(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [arquitecturaItems.length]);

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

  if (!currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl text-gray-800">No encontrado</h1>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden">
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
        {arquitecturaItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsDetailLoaded(false);
            }}
            className={`h-2 rounded-full transition-all duration-700 ease-out ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70 w-2'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Imagen de fondo */}
      <img
        key={`thumb-${currentItem.id}`}
        src={currentItem.thumbnail}
        alt={currentItem.title}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[2000ms] ${showFront ? 'blur-[1px] scale-105 opacity-100' : 'opacity-0'}`}
        style={{ minHeight: "100vh" }}
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-[2000ms]" />

      {/* Imagen de adelante con animación */}  
      {showFront && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {/* Contenedor relativo que envuelve la imagen física */}
          <div 
            key={`detail-${currentItem.id}`}
            className="relative bg-white shadow-2xl animate-fade-in-up-slow" 
            style={{ maxWidth: '85vw', maxHeight: '80vh' }}
          >
            <img
              src={currentItem.detailImage}
              alt={currentItem.title}
              className="w-full h-auto block transition-opacity duration-1000"
              style={{ 
                maxHeight: '80vh', 
                animation: 'fadeInUpSlow 1.5s cubic-bezier(.23,1.01,.32,1)' 
              }}
              loading="lazy"
              onLoad={() => setIsDetailLoaded(true)}
            />

            {/* Capa del Botón: Posicionada sobre el espacio en blanco de la foto */}
            {isDetailLoaded && (
              <div className="absolute bottom-[9%] md:bottom-[10%] left-0 w-full flex justify-center animate-button-appear">
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
            )}
          </div>
        </div>
      )}

      {/* Animación CSS */}
      <style>{`
        @keyframes fadeInUpSlow {
          0% { opacity: 0; transform: translateY(30px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes buttonAppear {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up-slow {
          animation: fadeInUpSlow 1.5s cubic-bezier(.23,1.01,.32,1);
        }
        .animate-button-appear {
          animation: buttonAppear 1.2s cubic-bezier(.23,1.01,.32,1) 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default Arquitectura;
