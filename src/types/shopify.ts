export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  tags: string[];
  vendor: string;
  productType: string;
  priceRange: ShopifyPriceRange;
  featuredImage?: ShopifyImage | null;
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  options: ShopifyProductOption[];
  variants: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ShopifyImage | null;
  products?: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

export interface ShopInfo {
  name: string;
  description: string;
  primaryDomain: {
    url: string;
    host: string;
  };
  paymentSettings: {
    currencyCode: string;
  };
}

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export type CommerceErrorCode =
  | 'CONFIGURATION'
  | 'DEMO_MODE'
  | 'NETWORK'
  | 'HTTP'
  | 'GRAPHQL'
  | 'USER_ERROR'
  | 'CART_EXPIRED'
  | 'NOT_FOUND'
  | 'INVALID_INPUT'
  | 'UNKNOWN';

export interface CommerceError {
  code: CommerceErrorCode;
  message: string;
  field?: string[];
}

export interface CommerceWarning {
  code?: string;
  message: string;
  target?: string;
}

/** A non-throwing result for catalog and cart operations. */
export interface CommerceResult<T> {
  ok: boolean;
  data: T | null;
  errors: CommerceError[];
  warnings: CommerceWarning[];
}

export interface ShopifyConnectionStatus {
  isConnected: boolean;
  isLive: boolean; // true if using real Storefront API, false if fallback/mock
  domain: string;
  apiVersion: string;
  shopInfo?: ShopInfo | null;
  error?: string | null;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoney;
    product: {
      title: string;
      handle: string;
    };
    image?: ShopifyImage | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
  discountCodes?: Array<{
    applicable: boolean;
    code: string;
  }>;
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}

export type CartState = 'idle' | 'restoring' | 'ready' | 'mutating' | 'error';
export type ShopifyDataSource = 'shopify' | 'demo' | 'unavailable';

export interface CartActionResult extends CommerceResult<ShopifyCart> {
  action: 'create' | 'restore' | 'add' | 'update' | 'remove' | 'discount';
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface ShopifyCustomerUserError {
  code?: string;
  field?: string[];
  message: string;
}

export interface ShopifyCustomerCreatePayload {
  customer?: ShopifyCustomer | null;
  customerUserErrors: ShopifyCustomerUserError[];
}

export interface ShopifyCustomerAccessTokenCreatePayload {
  customerAccessToken?: {
    accessToken: string;
    expiresAt: string;
  } | null;
  customerUserErrors: ShopifyCustomerUserError[];
}
