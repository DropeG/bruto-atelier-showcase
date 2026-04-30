import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollProvider } from "@/contexts/ScrollContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Category from "./pages/Category";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScrollProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Semantic Showcase Routes */}
            <Route path="/showcase/mobiliario/:type/:id" element={<Category />} />
            <Route path="/showcase/mobiliario/:type" element={<Category />} />
            <Route path="/showcase/:discipline/:id" element={<Category />} />
            <Route path="/showcase/:discipline" element={<Category />} />
            
            {/* Legacy support and temporary landing for old menus */}
            <Route path="/arquitectura" element={<Category />} />
            <Route path="/interiorismo" element={<Category />} />
            <Route path="/coleccion" element={<Category />} />
            <Route path="/serie" element={<Category />} />
            <Route path="/piezas" element={<Category />} />
            <Route path="/categoria/:category/:title/:id" element={<Category />} />
            
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ScrollProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
