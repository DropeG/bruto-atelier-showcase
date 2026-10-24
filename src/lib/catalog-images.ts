import manifest from '@/data/catalog-images.json';

/** Responsive, uncropped copies; unknown/live URLs retain their original source. */
export function catalogImageProps(source: string, sizes: string) {
  const entry = manifest[source as keyof typeof manifest];
  if (!entry) return { src: source };
  const fallback = entry.variants.find(variant => variant.width >= 800) || entry.variants.at(-1)!;
  return {
    src: fallback.src,
    srcSet: entry.variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
    sizes,
    width: entry.width,
    height: entry.height,
  };
}
