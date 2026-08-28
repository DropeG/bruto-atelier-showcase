import {
  ShopifyGraphQLResponse,
  ShopInfo,
  ShopifyProduct,
  ShopifyConnectionStatus,
  ShopifyCart,
} from '@/types/shopify';
import {
  GET_SHOP_INFO_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  GET_CUSTOMER_QUERY,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
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

// --- Cart API Methods ---

export async function createCart(): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
      query: CART_CREATE_MUTATION,
      variables: { input: {} },
    });
    return data.cartCreate?.cart || null;
  } catch {
    return null;
  }
}

export async function addLinesToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
      query: CART_LINES_ADD_MUTATION,
      variables: { cartId, lines },
    });
    return data.cartLinesAdd?.cart || null;
  } catch {
    return null;
  }
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
      query: CART_LINES_UPDATE_MUTATION,
      variables: { cartId, lines },
    });
    return data.cartLinesUpdate?.cart || null;
  } catch {
    return null;
  }
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds },
    });
    return data.cartLinesRemove?.cart || null;
  } catch {
    return null;
  }
}

// --- Customer API Methods ---

export async function createCustomer(input: any): Promise<any | null> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify no está configurado con credenciales válidas en .env.local');
  }
  try {
    const data = await shopifyFetch<{ customerCreate: any }>({
      query: CUSTOMER_CREATE_MUTATION,
      variables: { input },
    });
    return data.customerCreate || null;
  } catch (err: any) {
    console.error('Error en createCustomer:', err);
    throw err;
  }
}

export async function createCustomerAccessToken(input: any): Promise<{ token: string | null; errors?: Array<{ field?: string[]; message: string }> }> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify no está configurado');
  }
  try {
    const data = await shopifyFetch<{ customerAccessTokenCreate: any }>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      variables: { input },
    });
    const result = data.customerAccessTokenCreate;
    return {
      token: result?.customerAccessToken?.accessToken || null,
      errors: result?.customerUserErrors || [],
    };
  } catch (err: any) {
    console.error('Error en createCustomerAccessToken:', err);
    throw err;
  }
}

export async function getCustomer(customerAccessToken: string): Promise<any | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ customer: any }>({
      query: GET_CUSTOMER_QUERY,
      variables: { customerAccessToken },
    });
    return data.customer || null;
  } catch (err: any) {
    console.error('Error en getCustomer:', err);
    return null;
  }
}

export async function applyCartDiscountCode(
  cartId: string,
  discountCodes: string[]
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ cartDiscountCodesUpdate: { cart: ShopifyCart } }>({
      query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
      variables: { cartId, discountCodes },
    });
    return data.cartDiscountCodesUpdate?.cart || null;
  } catch {
    return null;
  }
}
