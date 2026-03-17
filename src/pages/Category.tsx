import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { galleryItems } from "../data/Gallery";



const Category = () => {
  const { category, title, id } = useParams();
  const navigate = useNavigate();
  const [showFront, setShowFront] = useState(false);
  const [isDetailLoaded, setIsDetailLoaded] = useState(false);
  const item = galleryItems.find(
    (i) =>
      i.category.toLowerCase() === (category || "").toLowerCase() &&
      i.title.toLowerCase() === (title || "").toLowerCase() &&
      String(i.id) === String(id)
  );

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

  useEffect(() => {
    setIsDetailLoaded(false);
  }, [item?.detailImage]);

  if (!item) {
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

      {/* Imagen de fondo */}
      <img
        src={item.thumbnail}
        alt={item.title}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1500 ${showFront ? 'blur-[1px] scale-105' : ''}`}
        style={{ minHeight: "100vh" }}
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* Imagen de adelante con animación */}  
      {showFront && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {/* Contenedor relativo que envuelve la imagen física */}
          <div 
            className="relative bg-white shadow-2xl animate-fade-in-up max-w-[85vw] md:max-w-[min(70vw,65vh)] xl:max-w-[85vw]" 
            style={{ maxHeight: '80vh' }}
          >
            <img
              src={item.detailImage}
              alt={item.title}
              className="w-full h-auto block md:object-contain"
              style={{ 
                maxHeight: '80vh', 
                animation: 'fadeInUp 1s cubic-bezier(.23,1.01,.32,1)' 
              }}
              loading="lazy"
              onLoad={() => setIsDetailLoaded(true)}
            />

            {/* Capa del Botón: Posicionada sobre el espacio en blanco de la foto */}
            {isDetailLoaded && (
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
            )}
          </div>
        </div>
      )}

      {/* Animación CSS */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes buttonAppear {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%, 100% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.08), 0 0 14px rgba(255, 255, 255, 0.06); }
          50% { box-shadow: 0 0 12px rgba(255, 255, 255, 0.12), 0 0 18px rgba(255, 255, 255, 0.08); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(.23,1.01,.32,1);
        }
      `}</style>
    </div>
  );
};

export default Category;
