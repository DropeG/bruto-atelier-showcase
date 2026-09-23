import backgrounds from '@/data/gallery-backgrounds.json';

type ImagePriority = 'high' | 'low' | 'auto';
type Entry = { image: HTMLImageElement; promise: Promise<void>; ready: boolean };
const cache = new Map<string, Entry>();
const retained = new Map<string, number>();
const MAX_CACHED_IMAGES = 8;

function trimCache() {
  for (const [src, entry] of cache) {
    if (cache.size <= MAX_CACHED_IMAGES) break;
    if (entry.ready && !retained.has(src)) cache.delete(src);
  }
}

export function retainImages(sources: string[]) {
  sources.forEach(src => retained.set(src, (retained.get(src) || 0) + 1));
  return () => {
    sources.forEach(src => {
      const count = (retained.get(src) || 1) - 1;
      if (count) retained.set(src, count); else retained.delete(src);
    });
    trimCache();
  };
}

/** Shares one download/decode across intent, viewer and adjacent preparation. */
export function prepareImage(src: string, priority: ImagePriority = 'high'): Promise<void> {
  const existing = cache.get(src);
  if (existing) {
    if (priority === 'high') existing.image.fetchPriority = 'high';
    cache.delete(src);
    cache.set(src, existing);
    return existing.promise;
  }
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = priority;
  const entry: Entry = { image, ready: false, promise: null! };
  cache.set(src, entry);
  entry.promise = new Promise<void>((resolve, reject) => {
    let settled = false;
    let decoding = false;
    const timeout = window.setTimeout(() => finish(new Error(`Image timed out: ${src}`)), 15000);
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      if (error) {
        if (cache.get(src) === entry) cache.delete(src);
        reject(error);
      } else {
        entry.ready = true;
        resolve();
        trimCache();
      }
    };
    const decode = async () => {
      if (decoding || settled) return;
      decoding = true;
      try {
        if (!image.naturalWidth) throw new Error(`Image unavailable: ${src}`);
        await image.decode();
        finish();
      } catch { finish(new Error(`Image decode failed: ${src}`)); }
    };
    image.onload = decode;
    image.onerror = () => finish(new Error(`Image unavailable: ${src}`));
    image.src = src;
    if (image.complete) void decode();
  });
  return entry.promise;
}

export function canSpeculate() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType || '');
}

export function backgroundFor(thumbnail: string) {
  const metadata = backgrounds[thumbnail as keyof typeof backgrounds];
  if (!metadata) return { src: thumbnail, placeholder: thumbnail };
  // Account for portrait cover cropping and the existing 1.12 background scale.
  const width = Math.max(window.innerWidth, window.innerHeight * metadata.width / metadata.height) * 1.12;
  const required = width * (window.devicePixelRatio || 1);
  const variant = metadata.variants.find(v => v.width >= required) || metadata.variants[metadata.variants.length - 1];
  return { src: variant.src, placeholder: metadata.placeholder };
}

export type GalleryImageItem = { detailImage: string; secondaryImage?: string; thumbnail: string };
export function detailSources(item: GalleryImageItem) {
  return [item.detailImage, item.secondaryImage].filter((src): src is string => Boolean(src));
}

export async function prepareDetails(item: GalleryImageItem, priority: ImagePriority = 'high') {
  await Promise.all(detailSources(item).map(src => prepareImage(src, priority)));
}

let intentPending = false;
export async function prepareGalleryIntent(item: GalleryImageItem) {
  if (!canSpeculate() || intentPending) return;
  intentPending = true;
  try {
    await prepareDetails(item, 'low');
    await prepareImage(backgroundFor(item.thumbnail).src, 'low');
  } catch { /* Intent is optional. A click may retry a failed resource. */ }
  finally { intentPending = false; }
}
