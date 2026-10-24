import { ShopifyImage, ShopifyProduct, ShopifyProductVariant, ShopInfo } from '@/types/shopify';

export const MOCK_ID_MARKER = 'demo-bruto-';

export const isDemoShopifyId = (id: string): boolean => id.includes(MOCK_ID_MARKER);

export const MOCK_SHOP_INFO: ShopInfo = {
  name: 'Bruto Atelier · Demo',
  description: 'Catálogo editorial de demostración.',
  primaryDomain: {
    url: 'https://bruto-atelier.myshopify.com',
    host: 'bruto-atelier.myshopify.com',
  },
  paymentSettings: { currencyCode: 'CLP' },
};

interface DemoProductInput {
  key: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  price: string;
  images: Array<{ url: string; alt: string; width: number; height: number }>;
  galleryImage?: { url: string; alt: string; width: number; height: number };
  optionName: string;
  variants: Array<{ title: string; price?: string; available?: boolean }>;
}

function createDemoProduct(input: DemoProductInput): ShopifyProduct {
  const images: ShopifyImage[] = input.images.map((image, index) => ({
    id: `gid://shopify/ProductImage/${MOCK_ID_MARKER}${input.key}-${index + 1}`,
    url: image.url,
    altText: image.alt,
    width: image.width,
    height: image.height,
  }));
  const variants: ShopifyProductVariant[] = input.variants.map((variant, index) => ({
    id: `gid://shopify/ProductVariant/${MOCK_ID_MARKER}${input.key}-${index + 1}`,
    title: variant.title,
    availableForSale: variant.available ?? true,
    price: { amount: variant.price ?? input.price, currencyCode: 'CLP' },
    compareAtPrice: null,
    selectedOptions: [{ name: input.optionName, value: variant.title }],
    image: images[index % images.length],
  }));

  return {
    id: `gid://shopify/Product/${MOCK_ID_MARKER}${input.key}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    availableForSale: variants.some((variant) => variant.availableForSale),
    tags: ['Demo', ...input.tags],
    vendor: 'Bruto Atelier',
    productType: input.productType,
    priceRange: {
      minVariantPrice: {
        amount: Math.min(...variants.map((variant) => Number(variant.price.amount))).toString(),
        currencyCode: 'CLP',
      },
      maxVariantPrice: {
        amount: Math.max(...variants.map((variant) => Number(variant.price.amount))).toString(),
        currencyCode: 'CLP',
      },
    },
    featuredImage: input.galleryImage ? {
      url: input.galleryImage.url,
      altText: input.galleryImage.alt,
      width: input.galleryImage.width,
      height: input.galleryImage.height,
    } : images[0],
    images: { edges: images.map((node) => ({ node })) },
    options: [
      {
        id: `gid://shopify/ProductOption/${MOCK_ID_MARKER}${input.key}-1`,
        name: input.optionName,
        values: input.variants.map((variant) => variant.title),
      },
    ],
    variants: { edges: variants.map((node) => ({ node })) },
  };
}

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  createDemoProduct({
    key: 'silla-coleccion',
    handle: 'silla-coleccion',
    title: 'Wachi',
    description: 'En Lenga, a medida.',
    productType: 'Colección',
    tags: ['Mobiliario', 'Madera', 'ColeccionDestacada', 'OcultarPrecio'],
    price: '1190000',
    optionName: 'Terminación',
    variants: [
      { title: 'Madera natural' },
    ],
    images: [
      { url: '/images/shopify-demo/coleccion/wachi-fondo-blanco.png', alt: 'Conjunto Wachi en Lenga: mesa, banco y sillas sobre fondo blanco', width: 1187, height: 1325 },
    ],
    galleryImage: { url: '/images/shopify-demo/coleccion/wachi-hero-horizontal.png', alt: 'Conjunto Wachi en Lenga: mesa, banco y sillas', width: 1672, height: 941 },
  }),
  createDemoProduct({
    key: 'accesorios-cuero',
    handle: 'accesorios-cuero',
    title: 'Accesorios',
    description: 'Tarjetero de cuero Bruto Atelier.',
    productType: 'Accesorios',
    tags: ['Cuero', 'Accesorios', 'OcultarPrecio'],
    price: '129000',
    optionName: 'Color',
    variants: [
      { title: 'Azul' },
    ],
    images: [
      { url: '/images/shopify-demo/accesorios-tarjetero.jpeg', alt: 'Tarjetero de cuero azul Bruto Atelier sobre un bloque de mármol', width: 2134, height: 2016 },
    ],
  }),
  createDemoProduct({
    key: 'mesa-coleccion',
    handle: 'mesa-coleccion',
    title: 'Mesa Colección',
    description: 'Mesa de madera clara con cubierta de extremos redondeados y dos apoyos macizos.',
    productType: 'Mesas',
    tags: ['Mobiliario', 'Madera'],
    price: '890000',
    optionName: 'Terminación',
    variants: [
      { title: 'Madera natural' },
    ],
    images: [
      { url: '/images/shopify-demo/coleccion/mesa-fondo-blanco.png', alt: 'Mesa de madera clara de la colección, aislada sobre fondo blanco', width: 1187, height: 1325 },
    ],
    galleryImage: { url: '/images/colección/coleccion4.webp', alt: 'Mesa de madera clara de la colección en un interior', width: 1228, height: 1371 },
  }),
  createDemoProduct({
    key: 'fundas-de-cuero',
    handle: 'fundas-de-cuero',
    title: 'Fundas de Cuero',
    description: 'Fundas de cuero en tonos coñac, azul y negro.',
    productType: 'Accesorios',
    tags: ['Cuero', 'Accesorios'],
    price: '129000',
    optionName: 'Color',
    variants: [
      { title: 'Coñac' },
      { title: 'Azul' },
      { title: 'Negro' },
    ],
    images: [
      { url: '/images/mock/sleeves.jpg', alt: 'Tres fundas de cuero en colores coñac, azul y negro sobre una mesa de piedra', width: 1376, height: 768 },
    ],
  }),
  createDemoProduct({
    key: 'objeto-cuero',
    handle: 'objeto-cuero',
    title: 'Objeto Cuero',
    description: 'Bandeja flexible cosida a mano en cuero de grano completo para organizar los objetos cotidianos.',
    productType: 'Objetos',
    tags: ['Cuoro', 'Cuero', 'Accesorios'],
    price: '129000',
    optionName: 'Color',
    variants: [
      { title: 'Coñac' },
      { title: 'Azul profundo' },
      { title: 'Negro', available: false },
    ],
    images: [
      { url: '/images/shopify-demo/objeto-cuero-01.webp', alt: 'Objeto Cuero color coñac sobre una superficie de madera', width: 1920, height: 1280 },
      { url: '/images/shopify-demo/objeto-cuero-02.webp', alt: 'Detalle de las costuras artesanales de Objeto Cuero', width: 1280, height: 1600 },
    ],
  }),
];
