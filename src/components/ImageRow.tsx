
import React from "react";
import HoverableImage from "./HoverableImage";

interface ImageRowProps {
  leftSrc: string;
  leftAlt?: string;
  leftHref?: string;
  rightSrc: string;
  rightAlt?: string;
  rightHref?: string;
}


const ImageRow: React.FC<ImageRowProps> = ({
  leftSrc,
  leftAlt = "",
  leftHref,
  rightSrc,
  rightAlt = "",
  rightHref,
}) => (
  <div className="snap-start snap-always h-screen w-full flex">
    <div className="w-1/2 h-full">
      <HoverableImage src={leftSrc} alt={leftAlt} href={leftHref} />
    </div>
    <div className="w-1/2 h-full">
      <HoverableImage src={rightSrc} alt={rightAlt} href={rightHref} />
    </div>
  </div>
);

export default ImageRow;