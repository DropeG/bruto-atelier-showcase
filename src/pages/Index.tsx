import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";
import StackingSection from "@/components/StackingSection";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative">
      <CustomCursor />
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
            imageUrl="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=1974&auto=format&fit=crop"
            imagePosition="right"
            labelPosition="bottom-left"
          />
        </StackingSection>

        {/* Section 3: Banqueta Wachi */}
        <StackingSection index={3} className="bg-background">
          <ProductSection
            name="Banqueta Wachi"
            subtitle="Asientos"
            imageUrl="https://images.unsplash.com/photo-1549497538-303791108f95?q=80&w=1974&auto=format&fit=crop"
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
            imageUrl="https://images.unsplash.com/photo-1611464908623-07f19927264e?q=80&w=1974&auto=format&fit=crop"
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
