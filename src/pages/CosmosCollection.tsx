import CollectionShowcase, { type CollectionPiece } from '@/components/CollectionShowcase';

const pieces: readonly CollectionPiece[] = [
  {
    id: 'anillo-cosmos',
    name: 'Anillo Cosmos',
    description: 'Plata 950 cepillada con piedra mineral blanca y constelación de engastes a ras.',
    image: '/images/shopify-demo/joyeria/anillo-fondo-blanco.webp',
    width: 896,
    height: 896,
    price: '$240.000',
    perspectives: [
      {
        src: '/images/shopify-demo/joyeria/anillo-fondo-blanco.webp',
        alt: 'Anillo Cosmos — Vista 3/4 en plata cepillada y piedra blanca',
        width: 896,
        height: 896,
        className: 'cosmos-stage__img--anillo',
      },
      {
        src: '/images/shopify-demo/joyeria/anillo-perspectiva-2.webp',
        alt: 'Anillo Cosmos — Vista frontal macro de la constelación',
        width: 896,
        height: 896,
        className: 'cosmos-stage__img--anillo',
      },
      {
        src: '/images/shopify-demo/joyeria/anillo-perspectiva-3.webp',
        alt: 'Anillo Cosmos — Vista de perfil en plata 950',
        width: 896,
        height: 896,
        className: 'cosmos-stage__img--anillo',
      },
    ],
    colors: [
      {
        id: 'blanco',
        label: 'Blanco',
        swatch: '#ffffff',
        variantTitle: 'Blanco',
        description: 'Plata 950 cepillada con piedra mineral blanca y constelación de engastes a ras.',
        perspectives: [
          {
            src: '/images/shopify-demo/joyeria/anillo-fondo-blanco.webp',
            alt: 'Anillo Cosmos — Vista 3/4 en plata cepillada y piedra blanca',
            width: 896,
            height: 896,
            className: 'cosmos-stage__img--anillo',
          },
          {
            src: '/images/shopify-demo/joyeria/anillo-perspectiva-2.webp',
            alt: 'Anillo Cosmos — Vista frontal macro de la constelación',
            width: 896,
            height: 896,
            className: 'cosmos-stage__img--anillo',
          },
          {
            src: '/images/shopify-demo/joyeria/anillo-perspectiva-3.webp',
            alt: 'Anillo Cosmos — Vista de perfil en plata 950',
            width: 896,
            height: 896,
            className: 'cosmos-stage__img--anillo',
          },
        ],
      },
      {
        id: 'negro',
        label: 'Negro',
        swatch: '#171715',
        variantTitle: 'Negro',
        description: 'Plata 950 cepillada con piedra mineral negra y constelación de engastes a ras.',
        perspectives: [
          {
            src: '/images/shopify-demo/joyeria/anillo-negro-fondo-blanco.webp',
            alt: 'Anillo Cosmos — Vista 3/4 en plata cepillada y piedra negra',
            width: 896,
            height: 896,
            className: 'cosmos-stage__img--anillo',
          },
          {
            src: '/images/shopify-demo/joyeria/anillo-negro-perspectiva-2.webp',
            alt: 'Anillo Cosmos — Vista frontal macro de la constelación en piedra negra',
            width: 896,
            height: 896,
            className: 'cosmos-stage__img--anillo',
          },
          {
            src: '/images/shopify-demo/joyeria/anillo-negro-perspectiva-3.webp',
            alt: 'Anillo Cosmos — Vista de perfil en plata 950 y piedra negra',
            width: 896,
            height: 896,
            className: 'cosmos-stage__img--anillo',
          },
        ],
      },
    ],
  },
];

const CosmosCollection = () => (
  <CollectionShowcase
    collectionId="cosmos"
    title="COSMOS"
    titleId="cosmos-collection-title"
    layoutPrefix="cosmos"
    className="accessories-collection cosmos-collection"
    pieces={pieces}
  />
);

export default CosmosCollection;
