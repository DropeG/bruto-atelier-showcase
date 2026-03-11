
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScroll } from "@/contexts/ScrollContext";

interface HoverableImageProps {
  src: string;
  alt?: string;
  href?: string;
  ipadPosition?: string;
  blurDataUrl?: string; // Base64 pequeño para blur placeholder
}

const HoverableImage: React.FC<HoverableImageProps> = ({ 
  src, 
  alt = "", 
  href, 
  ipadPosition,
  blurDataUrl 
}) => {
  const { saveSectionId } = useScroll();
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState(blurDataUrl || "");
  const [isLoaded, setIsLoaded] = useState(false);

  // Lazy loading con blur background
  useEffect(() => {
    // Si no hay blurDataUrl, cargar la imagen completa directamente
    if (!blurDataUrl) {
      setImageSrc(src);
      setIsLoaded(true);
      return;
    }

    // Cargar imagen completa en background
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setImageSrc(src); // Fallback al original si falla
      setIsLoaded(true);
    };
    img.src = src;
  }, [src, blurDataUrl]);

  // Encontrar el ID de la sección padre cuando el componente se monta
  useEffect(() => {
    // Buscar el elemento padre más cercano que tenga un ID que empiece con "section-"
    const element = document.currentScript?.parentElement || null;
    
    if (!element) {
      // Si currentScript no funciona, intentar encontrarlo por referencia
      setTimeout(() => {
        const images = document.querySelectorAll('img[alt="' + alt + '"]');
        if (images.length > 0) {
          const parent = images[0].closest('[id^="section-"]') as HTMLElement | null;
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
    let foundParent = element?.closest('[id^="section-"]') as HTMLElement | null;
    
    if (!foundParent) {
      // Intentar encontrarlo por el atributo alt de la imagen
      const images = document.querySelectorAll('img[alt="' + alt + '"]');
      if (images.length > 0) {
        foundParent = images[0].closest('[id^="section-"]') as HTMLElement | null;
      }
    }

    if (foundParent && foundParent.id) {
      console.log("[HoverableImage] Guardando sección ID:", foundParent.id);
      saveSectionId(foundParent.id);
    } else {
      console.warn("[HoverableImage] No se pudo encontrar la sección padre");
    }
  };

  const image = (
    // keep the "group" wrapper but move hover behaviour to CSS media queries
    <div className="relative group w-full h-full cursor-pointer">
      <img
        src={imageSrc}
        alt={alt}
        // use neutral class names; CSS will enable the visual hover only on devices with mouse
        className="w-full h-full object-cover transition duration-500 hoverable-blur ipad-only-position"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        style={{
          ["--ipad-pos" as string]: ipadPosition,
          filter: isLoaded ? "blur(0px)" : "blur(8px)",
          transitionProperty: "filter, opacity",
        } as React.CSSProperties}
      />
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 hoverable-overlay transition duration-300"
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
