import CollectionShowcase, { type CollectionPiece } from '@/components/CollectionShowcase';

const pieces: readonly CollectionPiece[] = [
  {
    id: 'tabaquera',
    name: 'Tabaquera',
    description: 'Estuche flexible en cuero vacuno granulado con cierre envolvente.',
    image: '/images/shopify-demo/accesorios/tabaquera-fondo-blanco.webp',
    width: 1326,
    height: 1187,
    price: '$129.000',
    perspectives: [
      {
        src: '/images/shopify-demo/accesorios/tabaquera-fondo-blanco.webp',
        alt: 'Tabaquera CUORO — Cuero azul granulado',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--tabaquera',
      },
      {
        src: '/images/shopify-demo/accesorios/tabaquera-perspectiva-2.webp',
        alt: 'Tabaquera CUORO — Perspectiva diagonal 3/4',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--tabaquera',
      },
      {
        src: '/images/shopify-demo/accesorios/tabaquera-perspectiva-3.webp',
        alt: 'Tabaquera CUORO — Vista semi-abierta interior',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--tabaquera',
      },
    ],
  },
  {
    id: 'sleeve',
    name: 'Sleeve',
    description: 'Funda protectora en cuero coñac de grano natural cosida a mano.',
    image: '/images/shopify-demo/accesorios/sleev-fondo-blanco.webp',
    width: 1668,
    height: 943,
    price: '$149.000',
    perspectives: [
      {
        src: '/images/shopify-demo/accesorios/sleev-fondo-blanco.webp',
        alt: 'Sleeve CUORO — Funda de cuero coñac',
        width: 1668,
        height: 943,
        className: 'accessories-stage__img--sleeve',
      },
      {
        src: '/images/shopify-demo/accesorios/sleev-perspectiva-2.webp',
        alt: 'Sleeve CUORO — Perspectiva vertical 3/4 cerrada',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--sleeve',
      },
      {
        src: '/images/shopify-demo/accesorios/sleev-perspectiva-3.webp',
        alt: 'Sleeve CUORO — Vista con solapa abierta',
        width: 1326,
        height: 1187,
        className: 'accessories-stage__img--sleeve',
      },
    ],
  },
  {
    id: 'tarjetero',
    name: 'Tarjetero',
    description: 'Pieza compacta de perfil delgado en cuero graneado con corte preciso.',
    image: '/images/shopify-demo/accesorios/tarjetero-fondo-blanco.webp',
    width: 1290,
    height: 1219,
    price: '$89.000',
    perspectives: [
      {
        src: '/images/shopify-demo/accesorios/tarjetero-fondo-blanco.webp',
        alt: 'Tarjetero CUORO — Cuero verde granulado',
        width: 1290,
        height: 1219,
        className: 'accessories-stage__img--tarjetero',
      },
      {
        src: '/images/shopify-demo/accesorios/tarjetero-perspectiva-2.webp',
        alt: 'Tarjetero CUORO — Perspectiva vertical 3/4',
        width: 1290,
        height: 1219,
        className: 'accessories-stage__img--tarjetero',
      },
      {
        src: '/images/shopify-demo/accesorios/tarjetero-perspectiva-3.webp',
        alt: 'Tarjetero CUORO — Vista con tarjetas en las ranuras',
        width: 1290,
        height: 1219,
        className: 'accessories-stage__img--tarjetero',
      },
    ],
  },
];

const AccessoriesCollection = () => (
  <CollectionShowcase
    collectionId="cuoro"
    title="CUORO"
    titleId="accessories-collection-title"
    layoutPrefix="cuoro"
    className="accessories-collection"
    pieces={pieces}
  />
);

export default AccessoriesCollection;
