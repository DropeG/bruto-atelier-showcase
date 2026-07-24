export interface ComingSoonCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  images?: string[];
}

export const comingSoonCategories: Record<string, ComingSoonCategory> = {
  iluminacion: {
    id: "iluminacion",
    title: "ILUMINACIÓN",
    subtitle: "Atmósferas de luz & sombra",
    description: "Estamos curando piezas escultóricas de luz diseñadas a medida. Disponible pronto.",
    bgImage: "/images/hero.webp",
  },
  esenciales: {
    id: "esenciales",
    title: "ESENCIALES",
    subtitle: "Elementos fundamentales del habitar",
    description: "Objetos clave que definen la presencia de tus espacios. Próximamente.",
    bgImage: "/images/home/image1.webp",
  },
  joyeria: {
    id: "joyeria",
    title: "JOYERÍA",
    subtitle: "Esculturas portables & piedras orgánicas",
    description: "Piezas de autor elaboradas con ámbar, hueso y metales nobles de confección artesanal. Próximamente.",
    bgImage: "/images/joyeria/joyeria4.webp",
    images: [
      "/images/joyeria/joyeria4.webp",
      "/images/joyeria/joyeria1.webp",
    ],
  },
  vestuario: {
    id: "vestuario",
    title: "VESTUARIO",
    subtitle: "Textiles & arquitectura corporal",
    description: "Diseños de vestuario atemporal en lino y fibras naturales de confección delicada. Próximamente.",
    bgImage: "/images/vestuario/vestuario2.webp",
    images: [
      "/images/vestuario/vestuario2.webp",
      "/images/vestuario/vestuario1.webp",
      "/images/vestuario/vestuario4.webp",
      "/images/vestuario/vestuario3.webp",
    ],
  },
  accesorios: {
    id: "accesorios",
    title: "ACCESORIOS",
    subtitle: "Objetos de acento & carácter",
    description: "Detalles que transforman el ambiente y expresan singularidad. Disponible pronto.",
    bgImage: "/images/home/image7.webp",
  },
};
