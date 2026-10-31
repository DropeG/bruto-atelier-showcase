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
const PRODUCT_LIMIT = 2;
const COLLECTION_HANDLES = ["silla-coleccion", "accesorios-cuero"];

let cachedCollectionProducts: ShopifyProduct[] | null = null;

function selectHomepageCollections(products: ShopifyProduct[]) {
  return COLLECTION_HANDLES.flatMap(handle => {
    const product = products.find(item => item.handle === handle);
    return product ? [product] : [];
  });
}

/**
 * Keeps the homepage's editorial selection separate from the general product feed.
 * While the Shopify collection helper is being introduced, the context's verified
 * live products are a safe temporary source (never its mock fallback).
 */
export function useHomepageProducts(): HomepageProductsResult {
  const { products: contextProducts, status, isLoading: contextIsLoading } = useShopify();
  const [collectionProducts, setCollectionProducts] = useState<ShopifyProduct[] | null>(
    () => cachedCollectionProducts,
  );
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
      cachedCollectionProducts = null;
      setCollectionProducts(null);
      setCollectionLoading(false);
      return;
    }

    if (cachedCollectionProducts !== null) {
      setCollectionProducts(cachedCollectionProducts);
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

    loader(COLLECTION_HANDLE, 12)
      .then((result) => {
        if (!active) return;
        const selected = selectHomepageCollections(result.products).slice(0, PRODUCT_LIMIT);
        cachedCollectionProducts = selected;
        setCollectionProducts(selected);
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
      products: selectHomepageCollections(MOCK_PRODUCTS),
      isLoading: false,
      isDemo: true,
    };
  }

  if (collectionProducts !== null) {
    return {
      products: selectHomepageCollections(collectionProducts),
      isLoading: collectionLoading,
      isDemo: false,
    };
  }

  return {
    products: status.isLive ? selectHomepageCollections(contextProducts) : [],
    isLoading: contextIsLoading || collectionLoading,
    isDemo: false,
  };
}
