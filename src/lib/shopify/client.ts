import {
  CartActionResult,
  CommerceError,
  CommerceResult,
  ShopInfo,
  ShopifyCart,
  ShopifyConnectionStatus,
  ShopifyCustomer,
  ShopifyCustomerAccessTokenCreatePayload,
  ShopifyCustomerCreatePayload,
  ShopifyGraphQLResponse,
  ShopifyProduct,
} from '@/types/shopify';
import {
  CART_CREATE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  GET_CART_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_CUSTOMER_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCTS_QUERY,
  GET_SHOP_INFO_QUERY,
} from './queries';
import { isDemoShopifyId, MOCK_PRODUCTS, MOCK_SHOP_INFO } from './mockData';

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2026-07';

type CartPayload = {
  cart: ShopifyCart | null;
  userErrors?: Array<{ code?: string | null; field?: string[] | null; message: string }>;
  warnings?: Array<{ code?: string | null; message: string; target?: string | null }>;
};

const emptyFeedback = {
  errors: [] as CommerceError[],
  warnings: [] as NonNullable<CommerceResult<unknown>['warnings']>,
};

function failure<T>(code: CommerceError['code'], message: string, field?: string[]): CommerceResult<T> {
  return { ok: false, data: null, errors: [{ code, message, field }], warnings: [] };
}

function cartFailure(
  action: CartActionResult['action'],
  code: CommerceError['code'],
  message: string,
  field?: string[],
): CartActionResult {
  return { ...failure<ShopifyCart>(code, message, field), action };
}

function cartFeedback(action: CartActionResult['action'], payload?: CartPayload | null): CartActionResult {
  const errors = (payload?.userErrors || []).map((error) => ({
    code: 'USER_ERROR' as const,
    message: error.message,
    field: error.field || undefined,
  }));
  const warnings = (payload?.warnings || []).map((warning) => ({
    code: warning.code || undefined,
    message: warning.message,
    target: warning.target || undefined,
  }));

  if (!payload?.cart || errors.length > 0) {
    return {
      ok: false,
      data: null,
      errors: errors.length ? errors : [{ code: 'UNKNOWN', message: 'Shopify no devolvió un carrito actualizado.' }],
      warnings,
      action,
    };
  }

  return { ok: true, data: payload.cart, errors: [], warnings, action };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No fue posible comunicarse con Shopify.';
}

function cartErrorCode(error: unknown): CommerceError['code'] {
  const message = errorMessage(error).toLowerCase();
  if (message.includes('not configured')) return 'CONFIGURATION';
  if (message.includes('http')) return 'HTTP';
  if (message.includes('graphql')) return 'GRAPHQL';
  if (message.includes('network') || message.includes('fetch')) return 'NETWORK';
  return 'UNKNOWN';
}

export function isShopifyConfigured(): boolean {
  return Boolean(
    SHOPIFY_DOMAIN &&
      SHOPIFY_DOMAIN !== 'tu_storefront_access_token_aqui' &&
      SHOPIFY_TOKEN &&
      SHOPIFY_TOKEN !== 'tu_storefront_access_token_aqui',
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
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL Error: ${json.errors.map((error) => error.message).join(', ')}`);
  }
  if (!json.data) throw new Error('Shopify GraphQL returned no data');
  return json.data;
}

export async function testShopifyConnection(): Promise<ShopifyConnectionStatus> {
  const domain = SHOPIFY_DOMAIN || 'bruto-atelier.myshopify.com (Demo)';
  if (!isShopifyConfigured()) {
    return {
      isConnected: true,
      isLive: false,
      domain,
      apiVersion: SHOPIFY_API_VERSION,
      shopInfo: MOCK_SHOP_INFO,
      error: 'Modo demostración activo. Conecta Shopify para vender productos reales.',
    };
  }

  try {
    const data = await shopifyFetch<{ shop: ShopInfo }>({ query: GET_SHOP_INFO_QUERY });
    return {
      isConnected: true,
      isLive: true,
      domain: SHOPIFY_DOMAIN,
      apiVersion: SHOPIFY_API_VERSION,
      shopInfo: data.shop,
      error: null,
    };
  } catch (error) {
    return {
      isConnected: false,
      isLive: false,
      domain: SHOPIFY_DOMAIN,
      apiVersion: SHOPIFY_API_VERSION,
      shopInfo: null,
      error: errorMessage(error),
    };
  }
}

export async function getShopifyProducts(first = 20): Promise<{ products: ShopifyProduct[]; isLive: boolean }> {
  if (!isShopifyConfigured()) return { products: MOCK_PRODUCTS, isLive: false };
  try {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first },
    });
    return { products: data.products.edges.map((edge) => edge.node), isLive: true };
  } catch {
    // A configured store must never degrade into fictitious purchasable products.
    return { products: [], isLive: false };
  }
}

export async function getHomepageCollectionProducts(
  handle = 'homepage-featured',
  first = 4,
): Promise<{ products: ShopifyProduct[]; isLive: boolean; collectionFound: boolean }> {
  if (!isShopifyConfigured()) {
    return { products: MOCK_PRODUCTS.slice(0, first), isLive: false, collectionFound: false };
  }
  try {
    const data = await shopifyFetch<{
      collection: { products: { edges: Array<{ node: ShopifyProduct }> } } | null;
    }>({ query: GET_COLLECTION_BY_HANDLE_QUERY, variables: { handle, first } });
    const products = data.collection?.products.edges.map((edge) => edge.node).slice(0, first) || [];
    // Keep the in-progress home review tangible without masking a missing
    // collection in production. The published site only renders Shopify data.
    if (import.meta.env.DEV && products.length === 0) {
      return { products: MOCK_PRODUCTS.slice(0, first), isLive: false, collectionFound: false };
    }
    return { products, isLive: true, collectionFound: Boolean(data.collection) };
  } catch {
    return { products: [], isLive: false, collectionFound: false };
  }
}

export async function getShopifyProductByHandle(
  handle: string,
): Promise<{ product: ShopifyProduct | null; isLive: boolean }> {
  if (!isShopifyConfigured()) {
    return { product: MOCK_PRODUCTS.find((product) => product.handle === handle) || null, isLive: false };
  }
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    });
    if (data.product) return { product: data.product, isLive: true };
    if (import.meta.env.DEV) {
      return { product: MOCK_PRODUCTS.find((product) => product.handle === handle) || null, isLive: false };
    }
    return { product: null, isLive: true };
  } catch {
    if (import.meta.env.DEV) {
      return { product: MOCK_PRODUCTS.find((product) => product.handle === handle) || null, isLive: false };
    }
    return { product: null, isLive: false };
  }
}

export async function getCart(cartId: string): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return cartFailure('restore', 'DEMO_MODE', 'El carrito no está disponible en modo demostración.');
  }
  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
      query: GET_CART_QUERY,
      variables: { cartId },
    });
    if (!data.cart) return cartFailure('restore', 'CART_EXPIRED', 'Tu carrito anterior ya no está disponible.');
    return { ok: true, data: data.cart, ...emptyFeedback, action: 'restore' };
  } catch (error) {
    return cartFailure('restore', cartErrorCode(error), errorMessage(error));
  }
}

export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }> = []): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return cartFailure('create', 'DEMO_MODE', 'Producto de demostración. Conecta Shopify para habilitar compras.');
  }
  if (lines.some((line) => isDemoShopifyId(line.merchandiseId))) {
    return cartFailure('create', 'DEMO_MODE', 'Los productos de demostración no se pueden añadir a Shopify.');
  }
  try {
    const data = await shopifyFetch<{ cartCreate: CartPayload }>({
      query: CART_CREATE_MUTATION,
      variables: { input: lines.length ? { lines } : {} },
    });
    return cartFeedback('create', data.cartCreate);
  } catch (error) {
    return cartFailure('create', cartErrorCode(error), errorMessage(error));
  }
}

export async function addLinesToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return cartFailure('add', 'DEMO_MODE', 'Producto de demostración. Conecta Shopify para habilitar compras.');
  }
  if (lines.some((line) => isDemoShopifyId(line.merchandiseId))) {
    return cartFailure('add', 'DEMO_MODE', 'Los productos de demostración no se pueden añadir a Shopify.');
  }
  try {
    const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
      query: CART_LINES_ADD_MUTATION,
      variables: { cartId, lines },
    });
    return cartFeedback('add', data.cartLinesAdd);
  } catch (error) {
    return cartFailure('add', cartErrorCode(error), errorMessage(error));
  }
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<CartActionResult> {
  if (!isShopifyConfigured()) return cartFailure('update', 'DEMO_MODE', 'El carrito no está disponible en modo demostración.');
  try {
    const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
      query: CART_LINES_UPDATE_MUTATION,
      variables: { cartId, lines },
    });
    return cartFeedback('update', data.cartLinesUpdate);
  } catch (error) {
    return cartFailure('update', cartErrorCode(error), errorMessage(error));
  }
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<CartActionResult> {
  if (!isShopifyConfigured()) return cartFailure('remove', 'DEMO_MODE', 'El carrito no está disponible en modo demostración.');
  try {
    const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds },
    });
    return cartFeedback('remove', data.cartLinesRemove);
  } catch (error) {
    return cartFailure('remove', cartErrorCode(error), errorMessage(error));
  }
}

export async function applyCartDiscountCode(cartId: string, discountCodes: string[]): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return cartFailure('discount', 'DEMO_MODE', 'El descuento se aplicará cuando Shopify esté conectado.');
  }
  try {
    const data = await shopifyFetch<{ cartDiscountCodesUpdate: CartPayload }>({
      query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
      variables: { cartId, discountCodes },
    });
    return cartFeedback('discount', data.cartDiscountCodesUpdate);
  } catch (error) {
    return cartFailure('discount', cartErrorCode(error), errorMessage(error));
  }
}

// Customer methods are maintained for the existing membership flow.
export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<ShopifyCustomerCreatePayload | null> {
  if (!isShopifyConfigured()) throw new Error('Shopify no está configurado con credenciales válidas en .env.local');
  const data = await shopifyFetch<{ customerCreate: ShopifyCustomerCreatePayload }>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input },
  });
  return data.customerCreate || null;
}

export async function createCustomerAccessToken(input: {
  email: string;
  password: string;
}): Promise<{ token: string | null; errors?: Array<{ field?: string[]; message: string }> }> {
  if (!isShopifyConfigured()) throw new Error('Shopify no está configurado');
  const data = await shopifyFetch<{ customerAccessTokenCreate: ShopifyCustomerAccessTokenCreatePayload }>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input },
  });
  const result = data.customerAccessTokenCreate;
  return { token: result?.customerAccessToken?.accessToken || null, errors: result?.customerUserErrors || [] };
}

export async function getCustomer(customerAccessToken: string): Promise<ShopifyCustomer | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const data = await shopifyFetch<{ customer: ShopifyCustomer | null }>({
      query: GET_CUSTOMER_QUERY,
      variables: { customerAccessToken },
    });
    return data.customer;
  } catch {
    return null;
  }
}
