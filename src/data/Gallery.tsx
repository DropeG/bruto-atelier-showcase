export interface GalleryItem {
    id: number;
    category: string;
    title: string;
    thumbnail: string;
    detailImage: string;
    route: string;
}

export const galleryItems: GalleryItem[] = [
    {
        id: 1, 
        category: "morar",
        title: "bespoke",
        thumbnail: "/images/gallery/lampara.jpeg",
        detailImage: "/images/gallery/morar-01-detail.webp",
        route: "/categoria/morar/bespoke/1"
    },

    {
        id: 2, 
        category: "series",
        title: "bespoke",
        thumbnail: "/images/gallery/series-01-thumb.webp",
        detailImage: "/images/gallery/series-01-detail.webp",
        route: "/categoria/series/bespoke/2"
    },
    {
        id: 3, 
        category: "colection",
        title: "wachi",
        thumbnail: "/images/gallery/colection-01-thumb.webp",
        detailImage: "/images/gallery/colection-01-detail.webp",
        route: "/categoria/colection/wachi/3"
    },
    {
        id: 4, 
        category: "morar",
        title: "bespoke",
        thumbnail: "/images/gallery/morar-02-thumb.webp",
        detailImage: "/images/gallery/morar-02-detail.webp",
        route: "/categoria/morar/bespoke/4"
    },
    {
        id: 5, 
        category: "cabina",
        title: "bespoke",
        thumbnail: "/images/gallery/cabina-01-thumb.webp",
        detailImage: "/images/gallery/cabina-01-detail.webp",
        route: "/categoria/cabina/bespoke/5"
    },
    {
        id: 6, 
        category: "morar",
        title: "bespoke",
        thumbnail: "/images/gallery/bano.jpeg",
        detailImage: "/images/gallery/sombras.webp",
        route: "/categoria/morar/bespoke/6"
    },
    {
        id: 7, 
        category: "colection",
        title: "sabi",
        thumbnail: "/images/gallery/colection-02-thumb.webp",
        detailImage: "/images/gallery/colection-02-detail.webp",
        route: "/categoria/colection/sabi/7"
    },
    {
        id: 8, 
        category: "colection",
        title: "formo",
        thumbnail: "/images/gallery/colection-03-thumb.webp",
        detailImage: "/images/gallery/colection-03-detail.webp",
        route: "/categoria/colection/formo/8"
    },
    {
        id: 9, 
        category: "series",
        title: "bespoke",
        thumbnail: "/images/gallery/rojo.jpeg",
        detailImage: "/images/gallery/series-02-detail.webp",
        route: "/categoria/series/bespoke/9"
    },
    {
        id: 10, 
        category: "cabina",
        title: "bespoke",
        thumbnail: "/images/gallery/chilote.jpeg",
        detailImage: "/images/gallery/cabina-02-detail.webp",
        route: "/categoria/cabina/bespoke/10"
    }
];