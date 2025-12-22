import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StackingSectionProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const StackingSection = ({ children, index, className = "" }: StackingSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className={`stacking-section ${className}`}
      style={{ zIndex: index }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="w-full h-full min-h-screen"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default StackingSection;
