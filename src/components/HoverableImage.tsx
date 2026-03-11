
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScroll } from "@/contexts/ScrollContext";

interface HoverableImageProps {
  src: string;
  alt?: string;
  href?: string;
}

const HoverableImage: React.FC<HoverableImageProps> = ({ src, alt = "", href }) => {
  const { saveSectionId } = useScroll();
  const [sectionId, setSectionId] = useState<string | null>(null);

  // Encontrar el ID de la sección padre cuando el componente se monta
  useEffect(() => {
    // Buscar el elemento padre más cercano que tenga un ID que empiece con "section-"
    let element = document.currentScript?.parentElement || null;
    
    if (!element) {
      // Si currentScript no funciona, intentar encontrarlo por referencia
      setTimeout(() => {
        const images = document.querySelectorAll('img[alt="' + alt + '"]');
        if (images.length > 0) {
          let parent = images[0].closest('[id^="section-"]') as HTMLElement | null;
          if (parent) {
            setSectionId(parent.id);
          }
        }
      }, 0);
    }
  }, [alt]);

  const handleLinkClick = () => {
    console.log("[HoverableImage] Click en foto con href:", href, "sectionId:", sectionId);
    
    // Buscar el elemento padre con ID que empiece con "section-"
    const element = document.currentScript?.parentElement;
    let parent = element?.closest('[id^="section-"]') as HTMLElement | null;
    
    if (!parent) {
      // Intentar encontrarlo por el atributo alt de la imagen
      const images = document.querySelectorAll('img[alt="' + alt + '"]');
      if (images.length > 0) {
        parent = images[0].closest('[id^="section-"]') as HTMLElement | null;
      }
    }

    if (parent && parent.id) {
      console.log("[HoverableImage] Guardando sección ID:", parent.id);
      saveSectionId(parent.id);
    } else {
      console.warn("[HoverableImage] No se pudo encontrar la sección padre");
    }
  };

  const image = (
    <div className="relative group w-full h-full cursor-pointer">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition duration-300 group-hover:blur-[2px]"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="select-none"
          style={{
            fontSize: "2rem",
            color: "#e0e0e0", 
            fontWeight: 300, 
            textShadow: "0 1px 8px rgba(0,0,0,0.10)",
            lineHeight: 1,
          }}
        >
          +
        </span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link to={href} onClick={handleLinkClick} className="block w-full h-full">
        {image}
      </Link>
    );
  }
  return image;
};

export default HoverableImage;
