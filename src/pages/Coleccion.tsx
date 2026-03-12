import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { galleryItems } from "../data/Gallery";

type CarouselItem = {
  id: string;
  title: string;
  thumbnail: string;
  detailImage: string;
  layout?: "single" | "double";
  secondaryImage?: string;
};

const coleccionFolderItems: CarouselItem[] = [
  {
    id: "coleccion-extra-1",
    title: "Colección 1",
    thumbnail: "/images/colección/coleccion1.webp",
    detailImage: "/images/colección/coleccion1.webp",
    secondaryImage: "/images/colección/coleccion2.webp",
    layout: "double",
  },
  {
    id: "coleccion-extra-2",
    title: "Colección 2",
    detailImage: "/images/colección/coleccion3.webp",
    thumbnail: "/images/colección/coleccion3.webp",
    secondaryImage: "/images/colección/coleccion4.webp",
    layout: "double",
  },
];

const mokaColor = "#9C7B66";

const Coleccion = () => {
  const navigate = useNavigate();
  const [showFront, setShowFront] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // IDs de las imágenes de colección
  const coleccionIds = [3];
  const coleccionItems: CarouselItem[] = [
    ...galleryItems
      .filter((item) => coleccionIds.includes(item.id))
      .map((item) => ({
        id: `gallery-${item.id}`,
        title: item.title,
        thumbnail: item.thumbnail,
        detailImage: item.detailImage,
        layout: "single" as const,
      })),
    ...coleccionFolderItems,
  ];

  // Precargar todas las imágenes
  useEffect(() => {
    coleccionItems.forEach((item) => {
      const imageSources = [item.detailImage, item.thumbnail, item.secondaryImage].filter(Boolean) as string[];
      let loadedCount = 0;

      imageSources.forEach((source) => {
        const img = new Image();
        img.src = source;
        img.onload = () => {
          loadedCount += 1;

          if (loadedCount === imageSources.length) {
            setImagesLoaded((prev) => ({ ...prev, [item.id]: true }));
          }
        };
      });
    });
  }, [coleccionItems]);

  // Cambiar automáticamente cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % coleccionItems.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [coleccionItems.length]);

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

  if (coleccionItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl text-gray-800">No encontrado</h1>
      </div>
    );
  }

  const allImagesLoaded = coleccionItems.every((item) => imagesLoaded[item.id]);

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
        {coleccionItems.map((_, index) => (
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
      {coleccionItems.map((item, index) => (
        <div
          key={`bg-${item.id}`}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none',
            backgroundColor: item.layout === "double" ? mokaColor : undefined,
          }}
        >
          {item.layout === "single" ? (
            <>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center blur-[1px] scale-105"
                style={{ minHeight: "100vh" }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          ) : null}
        </div>
      ))}

      {/* Imágenes principales - todas renderizadas con crossfade */}  
      {showFront && allImagesLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {coleccionItems.map((item, index) => (
            <div
              key={`detail-${item.id}`}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out"
              style={{ 
                opacity: index === currentIndex ? 1 : 0,
                pointerEvents: index === currentIndex ? 'auto' : 'none'
              }}
            >
              <div className="relative flex flex-col items-center gap-6 px-4">
                {item.layout === "double" ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                    {[item.detailImage, item.secondaryImage].filter(Boolean).map((imageSrc, imageIndex) => (
                      <div
                        key={`${item.id}-image-${imageIndex}`}
                        className="relative bg-white shadow-2xl"
                        style={{ maxWidth: 'min(34vw, 360px)', maxHeight: '80vh' }}
                      >
                        <img
                          src={imageSrc}
                          alt={`${item.title} ${imageIndex + 1}`}
                          className="w-full h-auto block"
                          style={{ maxHeight: '80vh' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="relative bg-white shadow-2xl" 
                    style={{ maxWidth: '85vw', maxHeight: '80vh' }}
                  >
                    <img
                      src={item.detailImage}
                      alt={item.title}
                      className="w-full h-auto block"
                      style={{ maxHeight: '80vh' }}
                    />
                  </div>
                )}

                {/* Botón HABLEMOS */}
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => window.open("https://wa.me/56949569887", "_blank", "noopener,noreferrer")}
                    className="group flex items-center px-6 py-2 md:px-10 md:py-2.5 bg-transparent text-white font-serif text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em]
                               border border-white/60 hover:border-white transition-all duration-700 ease-out 
                               cursor-pointer relative overflow-hidden 
                               hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.14)]"
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

export default Coleccion;
