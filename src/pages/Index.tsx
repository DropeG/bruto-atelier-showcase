import { useEffect, useRef, useState } from "react";
import {
  HeroSection,
  VideoSection,
  Footer,
  NosotrosModal,
  WhatsAppButton,
  DiscountButton,
  ShoppableGallery,
} from "@/components";
import { SingleVideoBanner } from "@/components/VideoSection";
import { useScroll } from "@/contexts/ScrollContext";
import { useAuth } from "@/contexts/AuthContext";
import { blurPlaceholders } from "@/lib/blur-placeholders";
import { GalleryService } from "@/lib/gallery";
import imageHome1 from "/images/home/image1.webp";
import imageHome2 from "/images/home/image2.webp";
import imageHome3 from "/images/home/image3.webp";
import imageHome4 from "/images/home/image4.webp";
import imageHome5 from "/images/home/image5.webp";
import imageHome6 from "/images/home/image6.webp";
import imageHome7 from "/images/home/image7.webp";
import imageHome8 from "/images/home/image8.webp";
import imageHome9 from "/images/home/image9.webp";
import imageHome10 from "/images/home/image10.webp";
import ImageRow from "@/components/ImageRow";
 
const Index = () => {
  const { user, openAuthModal } = useAuth();
  const [openNosotros, setOpenNosotros] = useState(false);
  const [showDiscount, setShowDiscount] = useState(true);
  const { getSectionId, scrollToSection } = useScroll();

  // Helper to get URL for an item ID safely
  const getUrl = (id: number) => {
    const item = GalleryService.getItemById(id);
    return item ? GalleryService.getItemUrl(item) : "#";
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Restaurar scroll a la sección guardada al montar el componente
  useEffect(() => {
    console.log("[Index] Componente montado, intentando restaurar sección");
    const sectionId = getSectionId();
    if (sectionId) {
      scrollToSection(sectionId, scrollContainerRef.current);
    }
    // Precargar el poster del primer video en móviles para 0ms latency
    const posterImg = new Image();
    posterImg.src = "/videos/video1-poster.webp";
  }, [getSectionId, scrollToSection]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      const scrollPos = container ? container.scrollTop : window.scrollY;
      setShowDiscount(scrollPos < 50);
    };

    handleScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDemoMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demoMode") === "true";

  return (
    <div className="relative">
      {!isDemoMode && <NosotrosModal isOpen={openNosotros} onClose={() => setOpenNosotros(false)} />}
      {!isDemoMode && <WhatsAppButton />}
      {!isDemoMode && !user && <DiscountButton onClick={openAuthModal} isVisible={showDiscount} />}

      {/* Main Collection Container */}
      <div
        ref={scrollContainerRef}
        className="h-[100svh] lg:landscape:h-screen overflow-y-scroll lg:landscape:snap-y lg:landscape:snap-mandatory w-full relative"
        id="coleccion"
      >
        {/* Section 1: Hero */}
        <div id="section-hero">
          <HeroSection onOpenNosotros={() => setOpenNosotros(true)} />
        </div>

        {/* Editorial commerce: products remain part of the gallery rhythm */}
        <ShoppableGallery />

        {/* Section 2: Desktop Video Block */}
        <div id="section-video">
          <VideoSection />
        </div>

        {/* ImageRow 1: Cocina y Mueble Azul */}
        <div id="section-row-1">
          <ImageRow
            leftSrc={imageHome1}
            leftAlt="Cocina"
            leftHref={getUrl(1)}
            leftIpadPosition="0% center"
            leftBlurDataUrl={blurPlaceholders.imageHome1}
            rightSrc={imageHome2}
            rightAlt="Mueble Azul"
            rightHref={getUrl(2)}
            rightBlurDataUrl={blurPlaceholders.imageHome2}
          />
        </div>

        {/* Intercalated Mobile Video 1 */}
        <SingleVideoBanner
          src="/videos/video1.mp4"
          mobileSrc="/videos/video1-mobile.mp4"
          poster="/videos/video1-poster.webp"
        />

        {/* ImageRow 2: Comedor y Paisaje */}
        <div id="section-row-2">
          <ImageRow
            leftSrc={imageHome3}
            leftAlt="Comedor"
            leftHref={getUrl(3)}
            leftIpadPosition="34% center"
            leftBlurDataUrl={blurPlaceholders.imageHome3}
            rightSrc={imageHome4}
            rightAlt="Paisaje"
            rightHref={getUrl(4)}
            rightBlurDataUrl={blurPlaceholders.imageHome4}
          />
        </div>

        {/* ImageRow 3: Casita Árbol y Morar */}
        <div id="section-row-3">
          <ImageRow
            leftSrc={imageHome5}
            leftAlt="Casita Árbol"
            leftHref={getUrl(5)}
            leftBlurDataUrl={blurPlaceholders.imageHome5}
            rightSrc={imageHome6}
            rightAlt="Morar"
            rightHref={getUrl(6)}
            rightIpadPosition="30% center"
            rightBlurDataUrl={blurPlaceholders.imageHome6}
          />
        </div>

        {/* Intercalated Mobile Video 2 */}
        <SingleVideoBanner
          src="/videos/video2.mp4"
          mobileSrc="/videos/video2-mobile.mp4"
          poster="/videos/video2-poster.webp"
        />

        {/* ImageRow 4: Banqueta y Flores */}
        <div id="section-row-4">
          <ImageRow
            leftSrc={imageHome7}
            leftAlt="Banqueta"
            leftHref={getUrl(7)}
            leftIpadPosition="50% center"
            leftBlurDataUrl={blurPlaceholders.imageHome7}
            rightSrc={imageHome8}
            rightAlt="Flores"
            rightHref={getUrl(8)}
            rightBlurDataUrl={blurPlaceholders.imageHome8}
          />
        </div>

        {/* Intercalated Mobile Video 3 */}
        <SingleVideoBanner
          src="/videos/video3.mp4"
          mobileSrc="/videos/video3-mobile.mp4"
          poster="/videos/video3-poster.webp"
        />

        {/* ImageRow 5: Mueble Rojo y Cabina */}
        <div id="section-row-5">
          <ImageRow
            leftSrc={imageHome9}  
            leftAlt="Mueble Rojo"
            leftHref={getUrl(9)}
            leftBlurDataUrl={blurPlaceholders.imageHome9}
            rightSrc={imageHome10}
            rightAlt="Cabina"
            rightHref={getUrl(10)}
            rightBlurDataUrl={blurPlaceholders.imageHome10}
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
