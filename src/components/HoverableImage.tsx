import React, { useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Buscar el elemento padre con ID que empiece con "section-" de forma limpia en el árbol DOM
    const foundParent = e.currentTarget.closest('[id^="section-"]') as HTMLElement | null;
    
    if (foundParent && foundParent.id) {
      console.log("[HoverableImage] Guardando sección ID:", foundParent.id);
      saveSectionId(foundParent.id);
    } else {
      console.warn("[HoverableImage] No se pudo encontrar la sección padre");
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsLoaded(true);
  };

  const image = (
    // keep the "group" wrapper but move hover behaviour to CSS media queries
    <div className="relative group w-full h-full cursor-pointer">
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        // use neutral class names; CSS will enable the visual hover only on devices with mouse
        className="w-full h-full object-cover transition duration-500 hoverable-blur ipad-only-position"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        style={{
          ["--ipad-pos" as string]: ipadPosition,
          backgroundImage: blurDataUrl && !isLoaded ? `url(${blurDataUrl})` : undefined,
          backgroundSize: "cover",
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
            fontSize: "clamp(2.4rem, 5vw, 5rem)",
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
