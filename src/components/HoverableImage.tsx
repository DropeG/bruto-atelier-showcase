
import React from "react";
import { Link } from "react-router-dom";

interface HoverableImageProps {
  src: string;
  alt?: string;
  href?: string;
}

const HoverableImage: React.FC<HoverableImageProps> = ({ src, alt = "", href }) => {
  const image = (
    <div className="relative group w-full h-full cursor-pointer">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition duration-300 group-hover:blur-[2px]"
      />
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="select-none"
          style={{
            fontSize: "3rem",
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
      <Link to={href} className="block w-full h-full">
        {image}
      </Link>
    );
  }
  return image;
};

export default HoverableImage;
