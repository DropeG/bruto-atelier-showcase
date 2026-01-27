import { motion } from "framer-motion";
import heroDesktop from "/images/hero.webp"
import heroMobile from "/images/heroMobile.webp"

const HeroSection = () => {
  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <picture className="w-full h-full block">
          <source 
            media="(max-width: 767px)"
            srcSet={heroMobile}
          />
          <img
            src={heroDesktop}
            alt="Luxury furniture in minimalist interior"
            className="w-full h-full object-cover object-[right_center] absolute inset-0"
            style={{ minHeight: '100vh', objectPosition: 'right center' }}
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-medium tracking-wide mb-4">
            BRUTO
          </h2>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary-foreground/90 italic font-normal">
            Atelier
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-12 text-editorial text-primary-foreground/80"
        >
          Sitio en Construcción
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 right-8 md:right-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-primary-foreground/50"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
