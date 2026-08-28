export type Discipline = "arquitectura" | "interiorismo" | "mobiliario" | "independent";
export type MobiliarioType = "coleccion" | "series" | "piezas";

export interface GalleryItem {
    id: number | string;
    discipline: Discipline;
    type?: MobiliarioType;
    title: string;
    thumbnail: string;
    detailImage: string;
    secondaryImage?: string;
    layout?: "single" | "double";
    subtitle?: string;
}

export const galleryItems: GalleryItem[] = [
    {
        id: 1, 
        discipline: "interiorismo",
        title: "bespoke",
        thumbnail: "/images/gallery/colaZorro.webp",
        detailImage: "/images/gallery/morar-01-detail1.webp",
        subtitle: "Antojo de piedra, acero y madera."
    },
    {
        id: 2, 
        discipline: "mobiliario",
        type: "series",
        title: "bespoke",
        thumbnail: "/images/gallery/series-01-thumb.webp",
        detailImage: "/images/gallery/series-01-detail1.webp",
        subtitle: "No hay problema alguno, lo ajustamos."
    },
    {
        id: 3, 
        discipline: "mobiliario",
        type: "coleccion",
        title: "wachi",
        thumbnail: "/images/gallery/colection-01-thumb.webp",
        detailImage: "/images/gallery/colection-01-detail1.webp",
        subtitle: "Nuestra colección en Lenga, la Patagonia nunca estuvo tan cerca."
    },
    {
        id: 4, 
        discipline: "independent",
        title: "bespoke",
        thumbnail: "/images/gallery/morar-02-thumb.webp",
        detailImage: "/images/gallery/morar-02-detail1.webp",
        subtitle: "No es magia, lo hacemos aparecer."
    },
    {
        id: 5, 
        discipline: "arquitectura",
        title: "bespoke",
        thumbnail: "/images/gallery/cabina-01-thumb.webp",
        detailImage: "/images/gallery/cabina-01-detail1.webp",
        subtitle: "Mallas salmoneras despuntes de obra y tejuelas de un campanario caído, nuestra propuesta."
    },
    {
        id: 6, 
        discipline: "interiorismo",
        title: "bespoke",
        thumbnail: "/images/gallery/bano.jpeg",
        detailImage: "/images/gallery/sombras1.webp",
        subtitle: "No es casualidad que distintos materiales hablen un mismo idioma. Nos encanta la diplomacia."
    },
    {
        id: 7, 
        discipline: "mobiliario",
        type: "piezas",
        title: "sabi",
        thumbnail: "/images/gallery/colection-02-thumb.webp",
        detailImage: "/images/gallery/colection-02-detail1.webp",
        subtitle: "Únicos, así de simple."
    },
    {
        id: 8, 
        discipline: "mobiliario",
        type: "piezas",
        title: "formo",
        thumbnail: "/images/gallery/colection-03-thumb.webp",
        detailImage: "/images/gallery/colection-03-detail1.webp",
        subtitle: "La diferencia radica en los detalles."
    },
    {
        id: 9, 
        discipline: "mobiliario",
        type: "series",
        title: "bespoke",
        thumbnail: "/images/gallery/rojo.jpeg",
        detailImage: "/images/gallery/series-02-detail1.webp",
        subtitle: "¿Y tú, qué pondrás sobre la mesa?"
    },
    {
        id: 10, 
        discipline: "arquitectura",
        title: "bespoke",
        thumbnail: "/images/gallery/chilote.jpeg",
        detailImage: "/images/gallery/cabina-02-detail1.webp",
        subtitle: "No te imaginas lo que hacemos posible en 1m²."
    }
];