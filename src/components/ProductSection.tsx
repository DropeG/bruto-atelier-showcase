import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ProductSectionProps {
  name: string;
  subtitle?: string;
  imageUrl: string;
  imagePosition?: "left" | "right" | "center";
  labelPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const ProductSection = ({
  name,
  subtitle,
  imageUrl,
  imagePosition = "center",
  labelPosition = "bottom-left",
}: ProductSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const positionClasses = {
    "top-left": "top-8 left-8 md:top-16 md:left-16",
    "top-right": "top-8 right-8 md:top-16 md:right-16",
    "bottom-left": "bottom-8 left-8 md:bottom-16 md:left-16",
    "bottom-right": "bottom-8 right-8 md:bottom-16 md:right-16",
  };

  const imageLayoutClasses = {
    left: "justify-start pl-8 md:pl-16 lg:pl-24",
    right: "justify-end pr-8 md:pr-16 lg:pr-24",
    center: "justify-center px-8 md:px-16",
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-screen bg-background flex items-center overflow-hidden"
    >
      {/* Image Container */}
      <div className={`flex w-full h-full py-16 ${imageLayoutClasses[imagePosition]}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-full w-auto max-w-[85vw] md:max-w-[70vw] lg:max-w-[55vw]"
        >
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-auto object-cover"
          />
        </motion.div>
      </div>

      {/* Product Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`absolute ${positionClasses[labelPosition]}`}
      >
        <p className="text-editorial text-muted-foreground mb-2">{subtitle || "Colección"}</p>
        <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground font-medium">
          {name}
        </h3>
      </motion.div>
    </div>
  );
};

export default ProductSection;
