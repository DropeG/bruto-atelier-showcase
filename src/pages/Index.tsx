import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import NewsletterModal from "@/components/NewsletterModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import DiscountButton from "@/components/DiscountButton";
import Cocina from "/images/cocina.webp";
import MuebleAzul from "/images/muebleAzul.webp";
import Comedor from "/images/comedor.webp";
import Paisaje from "/images/paisaje.webp";
import CasitaArbol from "/images/casitaArbol.webp";
import Morar from "/images/morar.webp";
import Banqueta from "/images/banquetaBlanca.webp";
import Flores from "/images/flores.webp";
import MuebleRojo from "/images/muebleRojo.webp";
import Cabina from "/images/cabina.webp";
import ImageRow from "@/components/ImageRow";
 
const Index = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showDiscount, setShowDiscount] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowDiscount(window.scrollY < 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <Navigation />
      <NewsletterModal openModal={openModal} onClose={() => setOpenModal(false)} />
      <WhatsAppButton />
      <DiscountButton onClick={() => setOpenModal(true)} isVisible={showDiscount} />

      {/* Stacking Sections Container */}
      <div id="coleccion">
        {/* Section 1: Hero */}
          <HeroSection />
          <ImageRow
            leftSrc={Cocina}
            leftAlt="Cocina"
            leftHref="/categoria/morar/bespoke/1"
            rightSrc={MuebleAzul}
            rightAlt="Mueble Azul"
            rightHref="/categoria/series/bespoke/2"
          />
          <ImageRow
            leftSrc={Comedor}
            leftAlt="Comedor"
            leftHref="/categoria/colection/wachi/3"
            rightSrc={Paisaje}
            rightAlt="Paisaje"
            rightHref="/categoria/morar/bespoke/4"
          />
          <ImageRow
            leftSrc={CasitaArbol}
            leftAlt="Casita Arbol"
            leftHref="/categoria/cabina/bespoke/5"
            rightSrc={Morar}
            rightAlt="Morar"
            rightHref="/categoria/morar/bespoke/6"
          />
          <ImageRow
            leftSrc={Banqueta}
            leftAlt="Banqueta"
            leftHref="/categoria/colection/sabi/7"
            rightSrc={Flores}
            rightAlt="Flores"
            rightHref="/categoria/colection/formo/8"
          />
          <ImageRow
            leftSrc={MuebleRojo}
            leftAlt="Mueble Rojo"
            leftHref="/categoria/series/bespoke/9"     
            rightSrc={Cabina}
            rightAlt="Cabina"
            rightHref="/categoria/cabina/bespoke/10"
          />

          {/* ContactSection - Hidden for now, will be shown when user clicks "Contacto" in menu */}
          {/* <ContactSection /> */}
          <Footer />

      
      </div>
       
    </div>
  );
};

export default Index;
