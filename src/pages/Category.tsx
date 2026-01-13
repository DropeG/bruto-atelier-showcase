import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { galleryItems } from "../data/Gallery";



const Category = () => {
  const { category, title, id } = useParams();
  const [showFront, setShowFront] = useState(false);
  const triggered = useRef(false);
  const item = galleryItems.find(
    (i) =>
      i.category.toLowerCase() === (category || "").toLowerCase() &&
      i.title.toLowerCase() === (title || "").toLowerCase() &&
      String(i.id) === String(id)
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowFront(true), 5000);

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

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl text-gray-800">No encontrado</h1>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={item.thumbnail}
        alt={item.title}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1500 ${showFront ? 'blur-[1px] scale-105' : ''}`}
        style={{ minHeight: "100vh" }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* Imagen de adelante con animación */}
      {showFront && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <img
            src={item.detailImage}
            alt={item.title + ' detalle'}
            className="max-w-[80vw] max-h-[80vh] shadow-2xl animate-fade-in-up"
            style={{
              animation: 'fadeInUp 1s cubic-bezier(.23,1.01,.32,1)'
            }}
          />
        </div>
      )}

      {/* Animación CSS */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(.23,1.01,.32,1);
        }
      `}</style>
    </div>
  );
};

export default Category;
