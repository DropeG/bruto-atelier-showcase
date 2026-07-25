import React, { useState } from "react";

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

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoaded(true);
  };

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleImageLoad}
      onError={handleImageError}
      className={`transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-75"
      } ${className}`}
      loading="lazy"
      decoding="async"
      fetchPriority={fetchPriority}
      style={{
        backgroundImage: blurDataUrl && !isLoaded ? `url(${blurDataUrl})` : undefined,
        backgroundSize: "cover",
        filter: isLoaded ? "blur(0px)" : "blur(10px)",
        transitionProperty: "filter, opacity",
      }}
    />
  );
};

export default LazyImage;
