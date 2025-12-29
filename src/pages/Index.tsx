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

        {/* Section 2: Silla Wachi */}
        <StackingSection index={2} className="bg-background">
          <ProductSection
            name="Silla Wachi"
            subtitle="Asientos"
            imageUrl={sillaWachi}
            imagePosition="right"
            labelPosition="bottom-left"
          />
        </StackingSection>

        {/* Section 3: Banqueta Wachi */}
        <StackingSection index={3} className="bg-background">
          <ProductSection
            name="Banqueta Wachi"
            subtitle="Asientos"
            imageUrl={banquetaWachi}
            imagePosition="left"
            labelPosition="bottom-right"
          />
        </StackingSection>

        {/* Section 4: Quote */}
        <StackingSection index={4}>
          <QuoteSection />
        </StackingSection>

        {/* Section 5: Mesa Wachi */}
        <StackingSection index={5} className="bg-background">
          <ProductSection
            name="Mesa Wachi"
            subtitle="Mesas"
            imageUrl={mesaWachi}
            imagePosition="center"
            labelPosition="bottom-left"
          />
        </StackingSection>
      </div>

      {/* Footer - Not part of stacking */}
      <div id="atelier" className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
