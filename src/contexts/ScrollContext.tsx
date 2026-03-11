import React, { createContext, useContext, useCallback } from "react";

type ScrollContextType = {
  saveSectionId: (sectionId: string) => void;
  getSectionId: () => string | null;
  scrollToSection: (sectionId: string, container: HTMLDivElement | null) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const saveSectionId = useCallback((sectionId: string) => {
    console.log("[ScrollContext] Guardando sección ID:", sectionId);
    sessionStorage.setItem("lastSectionId", sectionId);
  }, []);

  const getSectionId = useCallback(() => {
    const sectionId = sessionStorage.getItem("lastSectionId");
    console.log("[ScrollContext] Leyendo sección ID guardada:", sectionId);
    return sectionId;
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string, container: HTMLDivElement | null) => {
      if (!container) {
        console.warn("[ScrollContext] Container no disponible");
        return;
      }

      // Buscar el elemento con el ID dentro del contenedor
      const element = container.querySelector(`#${sectionId}`);
      if (!element) {
        console.warn(`[ScrollContext] Sección con ID "${sectionId}" no encontrada`);
        return;
      }

      console.log("[ScrollContext] Haciendo scroll a sección:", sectionId);

      // Usar setTimeout para asegurar que el DOM esté renderizado
      setTimeout(() => {
        element.scrollIntoView({ behavior: "auto", block: "start" });
        console.log("[ScrollContext] Scroll completado a sección:", sectionId);
        sessionStorage.removeItem("lastSectionId");
      }, 0);
    },
    []
  );

  return (
    <ScrollContext.Provider value={{ saveSectionId, getSectionId, scrollToSection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScroll debe usarse dentro de ScrollProvider");
  }
  return context;
};
