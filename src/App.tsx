import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Category from "./pages/Category";
import Arquitectura from "./pages/Arquitectura";
import Interiorismo from "./pages/Interiorismo";
import Coleccion from "./pages/Coleccion";
import Serie from "./pages/Serie";
import Piezas from "./pages/Piezas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/arquitectura" element={<Arquitectura />} />
          <Route path="/interiorismo" element={<Interiorismo />} />
          <Route path="/coleccion" element={<Coleccion />} />
          <Route path="/serie" element={<Serie />} />
          <Route path="/piezas" element={<Piezas />} />
          <Route path="/categoria/:category/:title/:id" element={<Category />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
