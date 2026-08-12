import {
  ShopifyGraphQLResponse,
  ShopInfo,
  ShopifyProduct,
  ShopifyConnectionStatus,
} from '@/types/shopify';
import {
  GET_SHOP_INFO_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
} from './queries';
import { MOCK_SHOP_INFO, MOCK_PRODUCTS } from './mockData';

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-07';

export function isShopifyConfigured(): boolean {
  return Boolean(
    SHOPIFY_DOMAIN &&
      SHOPIFY_DOMAIN !== 'tu_storefront_access_token_aqui' &&
      SHOPIFY_TOKEN &&
      SHOPIFY_TOKEN !== 'tu_storefront_access_token_aqui'
  );
}

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify credentials not configured or placeholder detected');
  }

  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API HTTP Error: ${response.status} ${response.statusText}`);
  }

  const json: ShopifyGraphQLResponse<T> = await response.json();

  if (json.errors && json.errors.length > 0) {
    const errorMsg = json.errors.map((e) => e.message).join(', ');
    throw new Error(`Shopify GraphQL Error: ${errorMsg}`);
  }

  if (!json.data) {
    throw new Error('Shopify GraphQL returned no data');
  }

  return json.data;
}

export async function testShopifyConnection(): Promise<ShopifyConnectionStatus> {
  const domain = SHOPIFY_DOMAIN || 'bruto-atelier.myshopify.com (Mock)';
  const apiVersion = SHOPIFY_API_VERSION;

  if (!isShopifyConfigured()) {
    return {
      isConnected: true,
      isLive: false,
      domain,
      apiVersion,
      shopInfo: MOCK_SHOP_INFO,
      error: 'Modo Fallback/Mock Activo (Sin credenciales en .env.local)',
    };
  }

  try {
    const data = await shopifyFetch<{ shop: ShopInfo }>({
      query: GET_SHOP_INFO_QUERY,
    });

    return {
      isConnected: true,
      isLive: true,
      domain: SHOPIFY_DOMAIN,
      apiVersion,
      shopInfo: data.shop,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido de conexión';
    return {
      isConnected: false,
      isLive: false,
      domain: SHOPIFY_DOMAIN,
      apiVersion,
      shopInfo: MOCK_SHOP_INFO,
      error: message,
    };
  }
}

export async function getShopifyProducts(first = 20): Promise<{ products: ShopifyProduct[]; isLive: boolean }> {
  if (!isShopifyConfigured()) {
    return { products: MOCK_PRODUCTS, isLive: false };
  }

  try {
    const data = await shopifyFetch<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first },
    });

    const products = data.products.edges.map((edge) => edge.node);
    return { products, isLive: true };
  } catch {
    return { products: MOCK_PRODUCTS, isLive: false };
  }
}

export async function getShopifyProductByHandle(
  handle: string
): Promise<{ product: ShopifyProduct | null; isLive: boolean }> {
  if (!isShopifyConfigured()) {
    const found = MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
    return { product: found, isLive: false };
  }

  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    });

    return { product: data.product, isLive: true };
  } catch {
    const found = MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
    return { product: found, isLive: false };
  }
}
