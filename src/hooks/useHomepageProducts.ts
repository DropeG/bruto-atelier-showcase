import { useEffect, useMemo, useState } from "react";
import { useShopify } from "@/contexts/ShopifyContext";
import * as shopifyClient from "@/lib/shopify/client";
import { MOCK_COLLECTIONS } from "@/lib/shopify/mockData";
import type { ShopifyCollection } from "@/types/shopify";

type HomepageCollectionsResult = {
  collections: ShopifyCollection[];
  isLoading: boolean;
  isDemo: boolean;
};

const PREFERRED_HANDLES = ["wachi", "cuoro"];
const EXCLUDED_HANDLES = new Set(["frontpage", "homepage-featured"]);
const COLLECTION_LIMIT = 2;

let cachedCollections: ShopifyCollection[] | null = null;

function selectHomepageCollections(collections: ShopifyCollection[]): ShopifyCollection[] {
  const visible = collections.filter((item) => !EXCLUDED_HANDLES.has(item.handle));
  const prioritized = PREFERRED_HANDLES.flatMap((handle) => {
    const match = visible.find((item) => item.handle === handle);
    return match ? [match] : [];
  });
  const remaining = visible.filter((item) => !PREFERRED_HANDLES.includes(item.handle));
  return [...prioritized, ...remaining].slice(0, COLLECTION_LIMIT);
}

/**
 * Loads the real Shopify collections published to the BRUTO Atelier channel
 * (`wachi`, `cuoro`, and future collections) for the homepage showcase.
 */
export function useHomepageCollections(): HomepageCollectionsResult {
  const { status, isLoading: contextIsLoading } = useShopify();
  const [collections, setCollections] = useState<ShopifyCollection[] | null>(
    () => cachedCollections,
  );
  const [isFetching, setIsFetching] = useState(false);

  const forcedDemo = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("demoMode") === "true";
  }, []);

  const configured = shopifyClient.isShopifyConfigured();
  const developmentFallback = import.meta.env.DEV && !contextIsLoading && !status.isLive;
  const isDemo = forcedDemo || !configured || developmentFallback;

  useEffect(() => {
    if (isDemo) {
      cachedCollections = null;
      setCollections(null);
      setIsFetching(false);
      return;
    }

    if (cachedCollections !== null) {
      setCollections(cachedCollections);
      setIsFetching(false);
      return;
    }

    let active = true;
    setIsFetching(true);

    shopifyClient
      .getHomepageCollections(10)
      .then((result) => {
        if (!active) return;
        const selected = selectHomepageCollections(result.collections);
        cachedCollections = selected;
        setCollections(selected);
      })
      .catch(() => {
        if (active) setCollections([]);
      })
      .finally(() => {
        if (active) setIsFetching(false);
      });

    return () => {
      active = false;
    };
  }, [isDemo]);

  if (isDemo) {
    return {
      collections: selectHomepageCollections(MOCK_COLLECTIONS),
      isLoading: false,
      isDemo: true,
    };
  }

  return {
    collections: collections ?? [],
    isLoading: isFetching || (collections === null && contextIsLoading),
    isDemo: false,
  };
}
