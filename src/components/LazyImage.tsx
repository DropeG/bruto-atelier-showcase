import React, { useState, useEffect } from "react";

interface LazyImageProps {
  src: string;
  alt?: string;
  blurDataUrl?: string; // Base64 de imagen pequeña borrosa
  className?: string;
  onLoad?: () => void;
  fetchPriority?: "high" | "low" | "auto";
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = "",
  blurDataUrl,
  className = "",
  onLoad,
  fetchPriority = "low",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(blurDataUrl || "");

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      setImageSrc(src); // Fallback al original si falla
      setIsLoaded(true);
    };
    img.src = src;
  }, [src, onLoad]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-75"
      } ${className}`}
      loading="lazy"
      decoding="async"
      fetchPriority={fetchPriority}
      style={{
        filter: isLoaded ? "blur(0px)" : "blur(10px)",
        transitionProperty: "filter, opacity",
      }}
    />
  );
};

export default LazyImage;
