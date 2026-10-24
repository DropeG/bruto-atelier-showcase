import manifest from '@/data/catalog-images.json';

/** Match the framed gallery's CSS width so preparation and display share one download. */
export function galleryDetailSource(source: string) {
  const entry = manifest[source as keyof typeof manifest];
  if (!entry || typeof window === 'undefined') return source;
  const width = window.innerWidth < 768
    ? Math.min(window.innerWidth * .88, 390)
    : Math.min(window.innerWidth * .7, window.innerHeight * .64);
  const target = width * Math.min(window.devicePixelRatio || 1, 3);
  return (entry.variants.find(variant => variant.width >= target) || entry.variants.at(-1)!).src;
}

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
