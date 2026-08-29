import { useEffect, useMemo, useState } from "react";
import { useShopify } from "@/contexts/ShopifyContext";
import * as shopifyClient from "@/lib/shopify/client";
import { MOCK_PRODUCTS } from "@/lib/shopify/mockData";
import type { ShopifyProduct } from "@/types/shopify";

type HomepageProductsResult = {
  products: ShopifyProduct[];
  isLoading: boolean;
  isDemo: boolean;
};

type HomepageCollectionLoader = (
  handle?: string,
  first?: number,
) => Promise<{ products: ShopifyProduct[]; isLive?: boolean }>;

const COLLECTION_HANDLE = "homepage-featured";
const PRODUCT_LIMIT = 4;

/**
 * Keeps the homepage's editorial selection separate from the general product feed.
 * While the Shopify collection helper is being introduced, the context's verified
 * live products are a safe temporary source (never its mock fallback).
 */
export function useHomepageProducts(): HomepageProductsResult {
  const { products: contextProducts, status, isLoading: contextIsLoading } = useShopify();
  const [collectionProducts, setCollectionProducts] = useState<ShopifyProduct[] | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(false);

  const forcedDemo = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("demoMode") === "true";
  }, []);

  const configured = shopifyClient.isShopifyConfigured();
  // A local preview should remain reviewable when credentials are absent or
  // temporarily invalid. Production never converts a failed live store into
  // fictitious purchasable inventory.
  const developmentFallback = import.meta.env.DEV && !contextIsLoading && !status.isLive;
  const isDemo = forcedDemo || !configured || developmentFallback;

  useEffect(() => {
    if (isDemo) {
      setCollectionProducts(null);
      setCollectionLoading(false);
      return;
    }

    const loader = (
      shopifyClient as unknown as {
        getHomepageCollectionProducts?: HomepageCollectionLoader;
      }
    ).getHomepageCollectionProducts;

    if (!loader) return;

    let active = true;
    setCollectionLoading(true);

    loader(COLLECTION_HANDLE, PRODUCT_LIMIT)
      .then((result) => {
        if (!active) return;
        setCollectionProducts(result.products.slice(0, PRODUCT_LIMIT));
      })
      .catch(() => {
        if (active) setCollectionProducts([]);
      })
      .finally(() => {
        if (active) setCollectionLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isDemo]);

  if (isDemo) {
    return {
      products: MOCK_PRODUCTS.slice(0, PRODUCT_LIMIT),
      isLoading: false,
      isDemo: true,
    };
  }

  if (collectionProducts !== null) {
    return {
      products: collectionProducts,
      isLoading: collectionLoading,
      isDemo: false,
    };
  }

  return {
    products: status.isLive ? contextProducts.slice(0, PRODUCT_LIMIT) : [],
    isLoading: contextIsLoading || collectionLoading,
    isDemo: false,
  };
}
