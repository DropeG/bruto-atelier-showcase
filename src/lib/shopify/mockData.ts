import { ShopifyProduct, ShopInfo } from '@/types/shopify';

export const MOCK_SHOP_INFO: ShopInfo = {
  name: 'Bruto Atelier',
  description: 'Atelier de diseño de muebles a medida, arquitectura e interiorismo.',
  primaryDomain: {
    url: 'https://bruto-atelier.myshopify.com',
    host: 'bruto-atelier.myshopify.com',
  },
  paymentSettings: {
    currencyCode: 'CLP',
  },
};

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/mock-1',
    handle: 'mesa-comedor-travertino-bruto',
    title: 'Mesa Comedor Travertino Bruto',
    description: 'Mesa monolítica esculpida en mármol travertino con acabado cepillado orgánico y estructura interna reforzada.',
    descriptionHtml: '<p>Mesa monolítica esculpida en mármol travertino con acabado cepillado orgánico y estructura interna reforzada.</p>',
    availableForSale: true,
    tags: ['Mobiliario', 'Colección', 'Comedor', 'Mármol'],
    vendor: 'Bruto Atelier',
    productType: 'Mobiliario',
    priceRange: {
      minVariantPrice: { amount: '2450000', currencyCode: 'CLP' },
      maxVariantPrice: { amount: '2850000', currencyCode: 'CLP' },
    },
    featuredImage: {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      altText: 'Mesa Comedor Travertino Bruto',
      width: 1200,
      height: 900,
    },
    images: {
      edges: [
        {
          node: {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
            altText: 'Mesa Comedor Travertino Bruto',
            width: 1200,
            height: 900,
          },
        },
      ],
    },
    options: [
      {
        id: 'opt-1',
        name: 'Dimensiones',
        values: ['240 x 110 cm', '280 x 110 cm'],
      },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/mock-1-1',
            title: '240 x 110 cm',
            availableForSale: true,
            price: { amount: '2450000', currencyCode: 'CLP' },
            compareAtPrice: null,
            selectedOptions: [{ name: 'Dimensiones', value: '240 x 110 cm' }],
          },
        },
        {
          node: {
            id: 'gid://shopify/ProductVariant/mock-1-2',
            title: '280 x 110 cm',
            availableForSale: true,
            price: { amount: '2850000', currencyCode: 'CLP' },
            compareAtPrice: null,
            selectedOptions: [{ name: 'Dimensiones', value: '280 x 110 cm' }],
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/mock-2',
    handle: 'sillon-bucle-roble-fume',
    title: 'Sillón Bouclé & Roble Fumado',
    description: 'Sillón de lectura ergonómico en tapicería lana bouclé sobre una estructura artesanal de roble fumado.',
    descriptionHtml: '<p>Sillón de lectura ergonómico en tapicería lana bouclé sobre una estructura artesanal de roble fumado.</p>',
    availableForSale: true,
    tags: ['Mobiliario', 'Series', 'Living', 'Madera'],
    vendor: 'Bruto Atelier',
    productType: 'Mobiliario',
    priceRange: {
      minVariantPrice: { amount: '980000', currencyCode: 'CLP' },
      maxVariantPrice: { amount: '980000', currencyCode: 'CLP' },
    },
    featuredImage: {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      altText: 'Sillón Bouclé & Roble Fumado',
      width: 1200,
      height: 900,
    },
    images: {
      edges: [
        {
          node: {
            id: 'img-2',
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
            altText: 'Sillón Bouclé & Roble Fumado',
            width: 1200,
            height: 900,
          },
        },
      ],
    },
    options: [
      {
        id: 'opt-2',
        name: 'Acabado Madera',
        values: ['Roble Fumado', 'Roble Natural'],
      },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/mock-2-1',
            title: 'Roble Fumado',
            availableForSale: true,
            price: { amount: '980000', currencyCode: 'CLP' },
            compareAtPrice: null,
            selectedOptions: [{ name: 'Acabado Madera', value: 'Roble Fumado' }],
          },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/mock-3',
    handle: 'consola-brutalista-hormigon-nogal',
    title: 'Consola Brutalista Hormigón & Nogal',
    description: 'Pieza de hall escultural de edición limitada construida en hormigón fundido a mano y chapa de nogal americano.',
    descriptionHtml: '<p>Pieza de hall escultural de edición limitada construida en hormigón fundido a mano y chapa de nogal americano.</p>',
    availableForSale: true,
    tags: ['Mobiliario', 'Piezas', 'Hall', 'Edición Limitada'],
    vendor: 'Bruto Atelier',
    productType: 'Mobiliario',
    priceRange: {
      minVariantPrice: { amount: '1350000', currencyCode: 'CLP' },
      maxVariantPrice: { amount: '1350000', currencyCode: 'CLP' },
    },
    featuredImage: {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
      altText: 'Consola Brutalista Hormigón & Nogal',
      width: 1200,
      height: 900,
    },
    images: {
      edges: [
        {
          node: {
            id: 'img-3',
            url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
            altText: 'Consola Brutalista Hormigón & Nogal',
            width: 1200,
            height: 900,
          },
        },
      ],
    },
    options: [
      {
        id: 'opt-3',
        name: 'Material Base',
        values: ['Hormigón Ceniza'],
      },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/mock-3-1',
            title: 'Hormigón Ceniza',
            availableForSale: true,
            price: { amount: '1350000', currencyCode: 'CLP' },
            compareAtPrice: null,
            selectedOptions: [{ name: 'Material Base', value: 'Hormigón Ceniza' }],
          },
        },
      ],
    },
  },
];
