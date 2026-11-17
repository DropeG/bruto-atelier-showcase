import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMeta {
  title: string;
  description: string;
  canonicalPath?: string;
}

const SITE_ORIGIN = "https://www.bruto-atelier.com";
const DEFAULT_DESCRIPTION =
  "BRUTO Atelier: Creemos en lo que se diferencia en silencio y trasciende en el tiempo. Diseñamos singularidad, fabricando de manera local con materiales y artesanos seleccionados.";

const EXACT_ROUTE_META: Record<string, PageMeta> = {
  "/": {
    title: "BRUTO Atelier | Arquitectura, Ambientes y Objetos",
    description: DEFAULT_DESCRIPTION,
    canonicalPath: "/",
  },
  "/coleccion/wachi": {
    title: "WACHI — Mobiliario | BRUTO Atelier",
    description:
      "Colección WACHI de BRUTO Atelier. Mobiliario de autor diseñado y fabricado localmente con materiales seleccionados.",
    canonicalPath: "/coleccion/wachi",
  },
  "/coleccion/accesorios": {
    title: "CUORO — Accesorios | BRUTO Atelier",
    description:
      "Colección CUORO de BRUTO Atelier. Accesorios en cuero diseñados y fabricados artesanalmente.",
    canonicalPath: "/coleccion/accesorios",
  },
  "/coleccion/cosmos": {
    title: "COSMOS — Joyería | BRUTO Atelier",
    description:
      "Colección COSMOS de BRUTO Atelier. Joyería en plata 950 y piedra mineral.",
    canonicalPath: "/coleccion/cosmos",
  },
  "/vestuario": {
    title: "Vestuario — Próximamente | BRUTO Atelier",
    description: "Próximamente: línea de vestuario de BRUTO Atelier.",
    canonicalPath: "/vestuario",
  },
  "/iluminacion": {
    title: "Iluminación — Próximamente | BRUTO Atelier",
    description: "Próximamente: línea de iluminación de BRUTO Atelier.",
    canonicalPath: "/iluminacion",
  },
  "/esenciales": {
    title: "Esenciales — Próximamente | BRUTO Atelier",
    description: "Próximamente: línea de esenciales de BRUTO Atelier.",
    canonicalPath: "/esenciales",
  },
};

const PREFIX_ROUTE_META: Array<{ prefix: string; meta: PageMeta }> = [
  {
    prefix: "/showcase/mobiliario/coleccion",
    meta: EXACT_ROUTE_META["/coleccion/wachi"],
  },
  {
    prefix: "/coleccion",
    meta: EXACT_ROUTE_META["/coleccion/wachi"],
  },
  {
    prefix: "/showcase/mobiliario/serie",
    meta: {
      title: "Serie — Mobiliario | BRUTO Atelier",
      description: "Mobiliario de serie diseñado por BRUTO Atelier.",
    },
  },
  {
    prefix: "/serie",
    meta: {
      title: "Serie — Mobiliario | BRUTO Atelier",
      description: "Mobiliario de serie diseñado por BRUTO Atelier.",
      canonicalPath: "/showcase/mobiliario/serie",
    },
  },
  {
    prefix: "/showcase/mobiliario/piezas",
    meta: {
      title: "Piezas — Mobiliario | BRUTO Atelier",
      description: "Piezas únicas de mobiliario diseñadas por BRUTO Atelier.",
    },
  },
  {
    prefix: "/piezas",
    meta: {
      title: "Piezas — Mobiliario | BRUTO Atelier",
      description: "Piezas únicas de mobiliario diseñadas por BRUTO Atelier.",
      canonicalPath: "/showcase/mobiliario/piezas",
    },
  },
  {
    prefix: "/showcase/mobiliario",
    meta: {
      title: "Mobiliario | BRUTO Atelier",
      description: "Mobiliario de autor diseñado y fabricado por BRUTO Atelier.",
    },
  },
  {
    prefix: "/showcase/arquitectura",
    meta: {
      title: "Arquitectura | BRUTO Atelier",
      description: "Proyectos de arquitectura por BRUTO Atelier.",
    },
  },
  {
    prefix: "/arquitectura",
    meta: {
      title: "Arquitectura | BRUTO Atelier",
      description: "Proyectos de arquitectura por BRUTO Atelier.",
      canonicalPath: "/showcase/arquitectura",
    },
  },
  {
    prefix: "/showcase/interiorismo",
    meta: {
      title: "Interiorismo | BRUTO Atelier",
      description: "Proyectos de interiorismo y ambientes por BRUTO Atelier.",
    },
  },
  {
    prefix: "/interiorismo",
    meta: {
      title: "Interiorismo | BRUTO Atelier",
      description: "Proyectos de interiorismo y ambientes por BRUTO Atelier.",
      canonicalPath: "/showcase/interiorismo",
    },
  },
];

function resolvePageMeta(pathname: string): PageMeta {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (EXACT_ROUTE_META[normalized]) {
    return EXACT_ROUTE_META[normalized];
  }

  for (const entry of PREFIX_ROUTE_META) {
    if (normalized === entry.prefix || normalized.startsWith(`${entry.prefix}/`)) {
      return {
        ...entry.meta,
        canonicalPath: entry.meta.canonicalPath ?? normalized,
      };
    }
  }

  return {
    title: "BRUTO Atelier | Arquitectura, Ambientes y Objetos",
    description: DEFAULT_DESCRIPTION,
    canonicalPath: normalized || "/",
  };
}

function upsertMetaTag(attrName: "name" | "property", attrValue: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonicalLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Synchronizes document title, Open Graph tags, meta description, and canonical URL
 * on route transitions so search crawlers see distinct metadata per route.
 */
const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolvePageMeta(pathname);
    const canonicalUrl = `${SITE_ORIGIN}${meta.canonicalPath ?? pathname}`;

    document.title = meta.title;
    upsertMetaTag("name", "description", meta.description);
    upsertMetaTag("property", "og:title", meta.title);
    upsertMetaTag("property", "og:description", meta.description);
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertCanonicalLink(canonicalUrl);
  }, [pathname]);

  return null;
};

export default RouteMeta;
