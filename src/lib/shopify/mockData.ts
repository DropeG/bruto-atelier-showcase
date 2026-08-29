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
    featuredImage: images[0],
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
    key: 'butaca-umbral',
    handle: 'butaca-umbral',
    title: 'Butaca Umbral',
    description: 'Butaca de roble macizo y cuero curtido, construida con uniones visibles y proporciones generosas.',
    productType: 'Asientos',
    tags: ['Mobiliario', 'Roble', 'Cuero'],
    price: '1190000',
    optionName: 'Acabado',
    variants: [
      { title: 'Roble natural · Cuero coñac' },
      { title: 'Roble ahumado · Cuero café', price: '1260000' },
    ],
    images: [
      { url: '/images/shopify-demo/butaca-umbral-01.webp', alt: 'Butaca Umbral en roble y cuero junto a una ventana', width: 1920, height: 1280 },
      { url: '/images/shopify-demo/butaca-umbral-02.webp', alt: 'Detalle del ensamble y tapicería de la Butaca Umbral', width: 1280, height: 1600 },
    ],
  }),
  createDemoProduct({
    key: 'lampara-ala',
    handle: 'lampara-ala',
    title: 'Lámpara Ala',
    description: 'Aplique escultórico de latón patinado y piedra, con una luz cálida que se proyecta sobre el muro.',
    productType: 'Iluminación',
    tags: ['Lámparas', 'Latón', 'Piedra'],
    price: '349000',
    optionName: 'Terminación',
    variants: [
      { title: 'Latón envejecido' },
      { title: 'Bronce oscuro', price: '369000', available: false },
    ],
    images: [
      { url: '/images/shopify-demo/lampara-ala-01.webp', alt: 'Lámpara Ala encendida sobre un muro texturado', width: 1280, height: 1600 },
      { url: '/images/shopify-demo/lampara-ala-02.webp', alt: 'Vista lateral de la pantalla de piedra de Lámpara Ala', width: 1600, height: 1200 },
    ],
  }),
  createDemoProduct({
    key: 'mesa-estrato',
    handle: 'mesa-estrato',
    title: 'Mesa Estrato',
    description: 'Mesa baja tallada en travertino, definida por un sobre circular y una base monolítica.',
    productType: 'Mesas',
    tags: ['Mobiliario', 'Travertino'],
    price: '890000',
    optionName: 'Diámetro',
    variants: [
      { title: '80 cm' },
      { title: '100 cm', price: '1090000' },
    ],
    images: [
      { url: '/images/shopify-demo/mesa-estrato-01.webp', alt: 'Mesa Estrato de travertino en un interior de madera', width: 1600, height: 1200 },
      { url: '/images/shopify-demo/mesa-estrato-02.webp', alt: 'Vista superior de la veta natural de Mesa Estrato', width: 1400, height: 1400 },
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
