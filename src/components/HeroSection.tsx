import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import heroDesktop from "/images/hero.webp"
import heroMobile from "/images/heroMobile.webp"

const HeroSection = () => {
  return (
    <div className="md:snap-start md:snap-always relative w-full min-h-screen h-screen overflow-hidden">
      <Navigation position="absolute" />
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
          className="text-center hero-title transition-opacity duration-200"
        >
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-medium tracking-wide mb-4">
            BRUTO
          </h2>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary-foreground/90 italic font-normal">
            Atelier
          </p>
        </motion.div>

      </div>
      <style>{`
        body.menu-open .hero-title,
        html.menu-open .hero-title {
          opacity: 0 !important;
          visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
