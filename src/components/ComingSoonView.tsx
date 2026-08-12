import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navigation from "./Navigation";
import { ComingSoonCategory } from "@/data/ComingSoon";

interface ComingSoonViewProps {
  category: ComingSoonCategory;
}

const ComingSoonView: React.FC<ComingSoonViewProps> = ({ category }) => {
  const navigate = useNavigate();
  const displayImage = category.bgImage;

  return (
    <div className="relative w-full min-h-[100svh] bg-[#121110] text-[#F7F5F0] font-serif flex flex-col justify-between overflow-x-hidden">
      {/* Header Navigation */}
      <Navigation position="fixed" hideIcons={true} />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 md:px-16 pt-24 pb-12 gap-8 lg:gap-16 max-w-6xl mx-auto w-full my-auto">
        
        {/* Left Side: Framed Portrait Image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative shrink-0">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px] aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-[#1A1918]">
            <motion.img
              src={displayImage}
              alt={category.title}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right Side: Editorial Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-4 sm:space-y-6 shrink-0">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#F7F5F0]/60 font-sans block mb-2">
              PRÓXIMAMENTE • COMING SOON
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-wider text-[#F7F5F0] mb-2">
              {category.title}
            </h1>

            <p className="text-sm sm:text-xl italic text-[#F7F5F0]/85 font-light">
              {category.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm font-light text-[#F7F5F0]/75 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            {category.description}
          </p>

          {/* Back Button */}
          <div className="pt-2 sm:pt-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/30 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans font-medium text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full group shadow-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Watermark */}
      <div className="w-full py-4 px-6 sm:px-12 flex justify-between items-center text-[9px] sm:text-[10px] text-white/40 tracking-widest font-sans border-t border-white/10 shrink-0">
        <div>BRUTO ATELIER © 2026</div>
        <div className="uppercase hidden sm:block">Colección de {category.title}</div>
      </div>
    </div>
  );
};

export default ComingSoonView;
