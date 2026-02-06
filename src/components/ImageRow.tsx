
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
  <div style={{
    display: "flex",
    gap: "0px",
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch"
  }}>
    <div className="w-1/2 h-64 md:h-screen">
      <HoverableImage src={leftSrc} alt={leftAlt} href={leftHref} />
    </div>
    <div className="w-1/2 h-64 md:h-screen">
      <HoverableImage src={rightSrc} alt={rightAlt} href={rightHref} />
    </div>
  </div>
);

export default ImageRow;