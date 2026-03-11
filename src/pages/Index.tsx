import { useEffect, useRef, useState } from "react";
import {
  HeroSection,
  VideoSection,
  Footer,
  ContactSection,
  NewsletterModal,
  WhatsAppButton,
  DiscountButton,
  ImageRow as ImageRowComp,
} from "@/components";
import { useScroll } from "@/contexts/ScrollContext";
import Cocina from "/images/cocina.webp";
import MuebleAzul from "/images/muebleAzul.webp";
import Comedor from "/images/comedor.webp";
import Paisaje from "/images/paisaje.webp";
import CasitaArbol from "/images/casitaArbol.webp";
import Morar from "/images/morar.webp";
import Banqueta from "/images/banquetaBlanca.webp";
import Flores from "/images/gallery/flore.webp";
import MuebleRojo from "/images/muebleRojo.webp";
import Cabina from "/images/cabina.webp";
import ImageRow from "@/components/ImageRow";
 
const Index = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showDiscount, setShowDiscount] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { getSectionId, scrollToSection } = useScroll();

  // Restaurar scroll a la sección guardada al montar el componente
  useEffect(() => {
    console.log("[Index] Componente montado, intentando restaurar sección");
    const sectionId = getSectionId();
    if (sectionId && scrollContainerRef.current) {
      scrollToSection(sectionId, scrollContainerRef.current);
    }
  }, [getSectionId, scrollToSection]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      setShowDiscount(container.scrollTop < 50);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <NewsletterModal openModal={openModal} onClose={() => setOpenModal(false)} />
      <WhatsAppButton />
      <DiscountButton onClick={() => setOpenModal(true)} isVisible={showDiscount} />

      {/* Scroll Snap Container */}
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-scroll md:snap-y md:snap-mandatory"
        id="coleccion"
      >
        {/* Section 1: Hero */}
        <div id="section-hero">
          <HeroSection />
        </div>

        {/* Section 2: Videos */}
        <div id="section-video">
          <VideoSection />
        </div>

        {/* ImageRow 1: Cocina y Mueble Azul */}
        <div id="section-row-1">
          <ImageRow
            leftSrc={Cocina}
            leftAlt="Cocina"
            leftHref="/categoria/morar/bespoke/1"
            rightSrc={MuebleAzul}
            rightAlt="Mueble Azul"
            rightHref="/categoria/series/bespoke/2"
          />
        </div>

        {/* ImageRow 2: Comedor y Paisaje */}
        <div id="section-row-2">
          <ImageRow
            leftSrc={Comedor}
            leftAlt="Comedor"
            leftHref="/categoria/colection/wachi/3"
            rightSrc={Paisaje}
            rightAlt="Paisaje"
            rightHref="/categoria/morar/bespoke/4"
          />
        </div>

        {/* ImageRow 3: Casita Arbol y Morar */}
        <div id="section-row-3">
          <ImageRow
            leftSrc={CasitaArbol}
            leftAlt="Casita Arbol"
            leftHref="/categoria/cabina/bespoke/5"
            rightSrc={Morar}
            rightAlt="Morar"
            rightHref="/categoria/morar/bespoke/6"
          />
        </div>

        {/* ImageRow 4: Banqueta y Flores */}
        <div id="section-row-4">
          <ImageRow
            leftSrc={Banqueta}
            leftAlt="Banqueta"
            leftHref="/categoria/colection/sabi/7"
            rightSrc={Flores}
            rightAlt="Flores"
            rightHref="/categoria/colection/formo/8"
          />
        </div>

        {/* ImageRow 5: Mueble Rojo y Cabina */}
        <div id="section-row-5">
          <ImageRow
            leftSrc={MuebleRojo}
            leftAlt="Mueble Rojo"
            leftHref="/categoria/series/bespoke/9"
            rightSrc={Cabina}
            rightAlt="Cabina"
            rightHref="/categoria/cabina/bespoke/10"
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
