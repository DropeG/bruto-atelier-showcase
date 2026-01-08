import Navigation from "@/components/Navigation";
import StackingSection from "@/components/StackingSection";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";
import sillaWachi from "@/images/sillaWachi.jpeg";  
import banquetaWachi from "@/images/banquetaWachi.jpeg";
import mesaWachi from "@/images/mesaWachi.jpeg";

const Index = () => {
  return (
    <div className="relative">
      <Navigation />

      {/* Stacking Sections Container */}
      <div id="coleccion">
        {/* Section 1: Hero */}
        <StackingSection index={1}>
          <HeroSection />
        </StackingSection>
      </div>
       
    </div>
  );
};

export default Index;
