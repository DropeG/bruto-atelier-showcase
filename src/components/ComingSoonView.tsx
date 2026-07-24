import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "./Navigation";
import { ComingSoonCategory } from "@/data/ComingSoon";

interface ComingSoonViewProps {
  category: ComingSoonCategory;
}

const ComingSoonView: React.FC<ComingSoonViewProps> = ({ category }) => {
  const navigate = useNavigate();
  const images = category.images && category.images.length > 0 ? category.images : [category.bgImage];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-[#121110] text-[#F7F5F0] font-serif flex flex-col justify-between">
      {/* Header Navigation */}
      <Navigation position="fixed" hideIcons={true} />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-12 md:px-16 pt-12 sm:pt-20 lg:pt-24 pb-2 sm:pb-6 lg:pb-12 gap-3 sm:gap-6 lg:gap-16 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Left Side: Framed Portrait (4:5) Main Image Display */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative shrink-0">
          <div className="relative w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[440px] aspect-[4/5] max-h-[42vh] sm:max-h-[50vh] lg:max-h-[72vh] rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-[#1A1918]">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[selectedIndex]}
                src={images[selectedIndex]}
                alt={`${category.title} - ${selectedIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Desktop Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                <button
                  onClick={handlePrev}
                  className="p-1.5 sm:p-2 rounded-full bg-black/40 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all active:scale-95 pointer-events-auto shadow-md"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 sm:p-2 rounded-full bg-black/40 hover:bg-white hover:text-black text-white backdrop-blur-md transition-all active:scale-95 pointer-events-auto shadow-md"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            {/* Photo Counter Tag */}
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/50 backdrop-blur-md text-[9px] sm:text-[11px] font-sans tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-white/90 border border-white/10">
                0{selectedIndex + 1} / 0{images.length}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Editorial Content & Interactive Thumbnail Lookbook */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-2 sm:space-y-4 lg:space-y-6 shrink-0">
          <div>
            <span className="text-[9px] sm:text-xs uppercase tracking-[0.3em] text-[#F7F5F0]/60 font-sans block mb-0.5 sm:mb-2">
              PRÓXIMAMENTE • BRUTO ATELIER
            </span>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-medium tracking-wider text-[#F7F5F0] mb-0.5 sm:mb-3">
              {category.title}
            </h1>

            <p className="text-xs sm:text-xl italic text-[#F7F5F0]/85 font-light">
              {category.subtitle}
            </p>
          </div>

          <p className="text-[11px] sm:text-sm font-light text-[#F7F5F0]/75 max-w-lg mx-auto lg:mx-0 leading-tight sm:leading-relaxed hidden sm:block">
            {category.description}
          </p>

          {/* Interactive 4:5 Thumbnails Strip */}
          {images.length > 1 && (
            <div className="pt-0 sm:pt-2">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#F7F5F0]/50 font-sans block mb-1 sm:mb-3">
                LOOKBOOK DE PRELANZAMIENTO
              </span>
              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative aspect-[4/5] w-10 sm:w-20 rounded-md overflow-hidden transition-all duration-300 ${
                      selectedIndex === idx
                        ? "ring-2 ring-white scale-105 opacity-100 shadow-lg"
                        : "opacity-45 hover:opacity-85 scale-100 border border-white/10"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniaura ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-1 sm:pt-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-white/30 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans font-medium text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full group shadow-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Watermark */}
      <div className="w-full py-2 sm:py-4 px-6 sm:px-12 flex justify-between items-center text-[9px] sm:text-[10px] text-white/40 tracking-widest font-sans border-t border-white/10 shrink-0">
        <div>BRUTO ATELIER © 2026</div>
        <div className="uppercase hidden sm:block">Colección de {category.title}</div>
      </div>
    </div>
  );
};

export default ComingSoonView;
