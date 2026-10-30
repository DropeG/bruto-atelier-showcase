import React, { createContext, useContext, useCallback } from "react";

type ScrollContextType = {
  saveSectionId: (sectionId: string) => void;
  getSectionId: () => string | null;
  scrollToSection: (sectionId: string, container?: HTMLElement | null) => Promise<boolean>;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const saveSectionId = useCallback((sectionId: string) => {
    console.log("[ScrollContext] Guardando sección ID:", sectionId);
    sessionStorage.setItem("lastSectionId", sectionId);

    const container = document.getElementById("coleccion");
    const target = container?.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`);
    if (container && target) {
      const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      sessionStorage.setItem("lastScrollTop", String(offset));
    } else {
      sessionStorage.removeItem("lastScrollTop");
    }
  }, []);

  const getSectionId = useCallback(() => {
    const sectionId = sessionStorage.getItem("lastSectionId");
    console.log("[ScrollContext] Leyendo sección ID guardada:", sectionId);
    return sectionId;
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string, container?: HTMLElement | null) => new Promise<boolean>((resolve) => {
      console.log("[ScrollContext] Haciendo scroll a sección:", sectionId);

      const restore = (attempt = 0) => {
        const target = container
          ? container.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)
          : document.getElementById(sectionId);

        if (!target) {
          if (attempt < 300) {
            window.requestAnimationFrame(() => restore(attempt + 1));
          } else {
            sessionStorage.removeItem("lastSectionId");
            resolve(false);
          }
          return;
        }

        if (container) {
          const containerTop = container.getBoundingClientRect().top;
          const targetTop = target.getBoundingClientRect().top;
          container.scrollTo({ top: container.scrollTop + targetTop - containerTop, behavior: "auto" });
        } else {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        }
        console.log("[ScrollContext] Scroll completado a sección:", sectionId);
        sessionStorage.removeItem("lastSectionId");
        resolve(true);
      };

      window.requestAnimationFrame(() => restore());
    }),
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
