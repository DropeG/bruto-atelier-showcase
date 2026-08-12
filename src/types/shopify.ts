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

export interface ShopifyConnectionStatus {
  isConnected: boolean;
  isLive: boolean; // true if using real Storefront API, false if fallback/mock
  domain: string;
  apiVersion: string;
  shopInfo?: ShopInfo | null;
  error?: string | null;
}
