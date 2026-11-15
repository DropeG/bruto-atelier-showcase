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

const PREFERRED_HANDLES = ["wachi", "cuoro", "cosmos"];
const EXCLUDED_HANDLES = new Set(["frontpage", "homepage-featured"]);
const COLLECTION_LIMIT = 3;
const SESSION_CACHE_KEY = "bruto_homepage_collections_v1";

let cachedCollections: ShopifyCollection[] | null = null;
let hasValidatedLiveCollections = false;

function readSessionCollections(): ShopifyCollection[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as ShopifyCollection[]) : null;
  } catch {
    return null;
  }
}

function writeSessionCollections(collections: ShopifyCollection[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(collections));
  } catch {
    // Ignore storage quota or private-mode restrictions.
  }
}

function getInitialCollections(): ShopifyCollection[] {
  if (cachedCollections !== null) return cachedCollections;
  const fromSession = readSessionCollections();
  if (fromSession) {
    cachedCollections = fromSession;
    return fromSession;
  }
  return selectHomepageCollections(MOCK_COLLECTIONS);
}

function selectHomepageCollections(collections: ShopifyCollection[]): ShopifyCollection[] {
  const visible = collections.filter((item) => !EXCLUDED_HANDLES.has(item.handle));
  const prioritized = PREFERRED_HANDLES.flatMap((handle) => {
    const match =
      visible.find((item) => item.handle === handle) ??
      MOCK_COLLECTIONS.find((item) => item.handle === handle);
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
  const [collections, setCollections] = useState<ShopifyCollection[]>(
    () => getInitialCollections(),
  );

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
      hasValidatedLiveCollections = false;
      return;
    }

    if (hasValidatedLiveCollections && cachedCollections !== null) {
      setCollections(cachedCollections);
      return;
    }

    let active = true;

    shopifyClient
      .getHomepageCollections(10)
      .then((result) => {
        if (!active) return;
        const selected = selectHomepageCollections(result.collections);
        cachedCollections = selected;
        hasValidatedLiveCollections = true;
        writeSessionCollections(selected);
        setCollections(selected);
      })
      .catch(() => {
        // Keep immediate fallback/session collections on network error.
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
    collections,
    isLoading: false,
    isDemo: false,
  };
}
