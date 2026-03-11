import React from "react";
import HoverableImage from "./HoverableImage";

interface ImageRowProps {
  leftSrc: string;
  leftAlt?: string;
  leftHref?: string;
  leftIpadPosition?: string;
  leftBlurDataUrl?: string;
  rightSrc: string;
  rightAlt?: string;
  rightHref?: string;
  rightIpadPosition?: string;
  rightBlurDataUrl?: string;
}


const ImageRow: React.FC<ImageRowProps> = ({
  leftSrc,
  leftAlt = "",
  leftHref,
  leftIpadPosition,
  leftBlurDataUrl,
  rightSrc,
  rightAlt = "",
  rightHref,
  rightIpadPosition,
  rightBlurDataUrl,
}) => (
  <div className="md:snap-start md:snap-always h-64 md:h-screen w-full flex">
    <div className="w-1/2 h-full">
      <HoverableImage 
        src={leftSrc} 
        alt={leftAlt} 
        href={leftHref} 
        ipadPosition={leftIpadPosition}
        blurDataUrl={leftBlurDataUrl}
      />
    </div>
    <div className="w-1/2 h-full">
      <HoverableImage 
        src={rightSrc} 
        alt={rightAlt} 
        href={rightHref} 
        ipadPosition={rightIpadPosition}
        blurDataUrl={rightBlurDataUrl}
      />
    </div>
  </div>
);

export default ImageRow;