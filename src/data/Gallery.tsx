export interface GalleryItem {
    id: number;
    category: string;
    title: string;
    thumbnail: string;
    detailImage: string;
    route: string;
    subtitle?: string;
}

export const galleryItems: GalleryItem[] = [
    {
        id: 1, 
        category: "morar",
        title: "bespoke",
        thumbnail: "/images/gallery/colaZorro.webp",
        detailImage: "/images/gallery/morar-01-detail1.webp",
        route: "/categoria/morar/bespoke/1",
        subtitle: "Antojo de piedra, acero y madera."
    },

    {
        id: 2, 
        category: "series",
        title: "bespoke",
        thumbnail: "/images/gallery/series-01-thumb.webp",
        detailImage: "/images/gallery/series-01-detail1.webp",
        route: "/categoria/series/bespoke/2",
        subtitle: "No hay problema alguno, lo ajustamos."
    },
    {
        id: 3, 
        category: "coleccion",
        title: "wachi",
        thumbnail: "/images/gallery/colection-01-thumb.webp",
        detailImage: "/images/gallery/colection-01-detail1.webp",
        route: "/categoria/coleccion/wachi/3",
        subtitle: "La Patagonia nunca estuvo tan cerca."
    },
    {
        id: 4, 
        category: "morar",
        title: "bespoke",
        thumbnail: "/images/gallery/morar-02-thumb.webp",
        detailImage: "/images/gallery/morar-02-detail1.webp",
        route: "/categoria/morar/bespoke/4",
        subtitle: "No es magia, lo hacemos aparecer."
    },
    {
        id: 5, 
        category: "cabina",
        title: "bespoke",
        thumbnail: "/images/gallery/cabina-01-thumb.webp",
        detailImage: "/images/gallery/cabina-01-detail1.webp",
        route: "/categoria/cabina/bespoke/5",
        subtitle: "Mallas salmoneras despuntes de obra y tejuelas de un campanario caído, nuestra propuesta."
    },
    {
        id: 6, 
        category: "morar",
        title: "bespoke",
        thumbnail: "/images/gallery/bano.jpeg",
        detailImage: "/images/gallery/sombras1.webp",
        route: "/categoria/morar/bespoke/6",
        subtitle: "No es casualidad que distintos materiales hablen un mismo idioma. Nos encanta la diplomacia."
    },
    {
        id: 7, 
        category: "coleccion",
        title: "sabi",
        thumbnail: "/images/gallery/colection-02-thumb.webp",
        detailImage: "/images/gallery/colection-02-detail1.webp",
        route: "/categoria/coleccion/sabi/7",
        subtitle: "Únicos, así de simple."
    },
    {
        id: 8, 
        category: "coleccion",
        title: "formo",
        thumbnail: "/images/gallery/colection-03-thumb.webp",
        detailImage: "/images/gallery/colection-03-detail1.webp",
        route: "/categoria/coleccion/formo/8",
        subtitle: "La diferencia radica en los detalles."
    },
    {
        id: 9, 
        category: "series",
        title: "bespoke",
        thumbnail: "/images/gallery/rojo.jpeg",
        detailImage: "/images/gallery/series-02-detail1.webp",
        route: "/categoria/series/bespoke/9",
        subtitle: "¿Y tú, qué pondrás sobre la mesa?"
    },
    {
        id: 10, 
        category: "cabina",
        title: "bespoke",
        thumbnail: "/images/gallery/chilote.jpeg",
        detailImage: "/images/gallery/cabina-02-detail1.webp",
        route: "/categoria/cabina/bespoke/10",
        subtitle: "No te imaginas lo que hacemos posible en 1m²."
    }
];