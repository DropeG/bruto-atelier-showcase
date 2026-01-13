
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
    alignItems: "center"
  }}>
    <div style={{ width: "50%" }}>
      <HoverableImage src={leftSrc} alt={leftAlt} href={leftHref} />
    </div>
    <div style={{ width: "50%" }}>
      <HoverableImage src={rightSrc} alt={rightAlt} href={rightHref} />
    </div>
  </div>
);

export default ImageRow;