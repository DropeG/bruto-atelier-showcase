import { useMemo, useState } from "react";
import type { ShopifyImage as ShopifyImageType } from "@/types/shopify";

interface ShopifyImageProps {
  image?: ShopifyImageType | null;
  alt: string;
  sizes: string;
  className?: string;
  fit?: "cover" | "contain";
}

const SHOPIFY_WIDTHS = [480, 720, 960, 1280, 1600, 2000];

function isShopifyCdn(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "cdn.shopify.com" || host.endsWith(".myshopify.com");
  } catch {
    return false;
  }
}

function withWidth(url: string, width: number): string {
  try {
    const next = new URL(url);
    next.searchParams.set("width", String(width));
    return next.toString();
  } catch {
    return url;
  }
}

const ShopifyImage = ({ image, alt, sizes, className = "", fit = "cover" }: ShopifyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const responsive = useMemo(() => {
    if (!image?.url || !isShopifyCdn(image.url)) return undefined;
    return SHOPIFY_WIDTHS.map((width) => `${withWidth(image.url, width)} ${width}w`).join(", ");
  }, [image?.url]);

  const placeholder = useMemo(() => {
    if (!image?.url || !isShopifyCdn(image.url)) return undefined;
    return withWidth(image.url, 80);
  }, [image?.url]);

  if (!image?.url || failed) {
    return (
      <div
        className={`shopify-image shopify-image--empty ${className}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div
      className={`shopify-image ${loaded ? "is-loaded" : "is-loading"} ${className}`}
      style={placeholder ? { backgroundImage: `url(${placeholder})` } : undefined}
    >
      <img
        src={responsive ? withWidth(image.url, 1600) : image.url}
        srcSet={responsive}
        sizes={responsive ? sizes : undefined}
        alt={image.altText || alt}
        width={image.width || undefined}
        height={image.height || undefined}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{ objectFit: fit }}
      />
    </div>
  );
};

export default ShopifyImage;

