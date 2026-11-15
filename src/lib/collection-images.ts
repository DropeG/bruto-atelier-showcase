import { useEffect, useState } from 'react';
import { catalogImageProps } from '@/lib/catalog-images';

export type CollectionId = 'wachi' | 'cuoro' | 'cosmos';

interface CollectionImageConfig {
  gridSizes: string;
  gridSources: readonly string[];
}

/**
 * Registro declarativo de grillas de colección.
 * Agregar aquí cualquier nueva colección para habilitar precarga especulativa
 * desde el Home/menú y pintado sincronizado en su vista de grilla.
 */
export const COLLECTION_REGISTRY: Record<CollectionId, CollectionImageConfig> = {
  wachi: {
    gridSizes: '(max-width: 850px) 44vw, 22vw',
    gridSources: [
      '/images/shopify-demo/coleccion/wachi-fondo-blanco.png',
      '/images/shopify-demo/coleccion/mesa-fondo-blanco.png',
      '/images/shopify-demo/coleccion/silla-fondo-blanco.png',
      '/images/shopify-demo/coleccion/banqueta-fondo-blanco.png',
    ],
  },
  cuoro: {
    gridSizes: '(max-width: 700px) 44vw, 28vw',
    gridSources: [
      '/images/shopify-demo/accesorios/tabaquera-fondo-blanco.webp',
      '/images/shopify-demo/accesorios/sleev-fondo-blanco.webp',
      '/images/shopify-demo/accesorios/tarjetero-fondo-blanco.webp',
    ],
  },
  cosmos: {
    gridSizes: '(max-width: 700px) 62vw, 28vw',
    gridSources: [
      '/images/shopify-demo/joyeria/anillo-fondo-blanco.webp',
    ],
  },
};

const inflightCache = new Map<string, Promise<void>>();
const readyKeys = new Set<string>();

function cacheKey(source: string, sizes: string): string {
  return `${source}::${sizes}`;
}

export function areImagesReady(sources: readonly string[], sizes: string): boolean {
  if (typeof window === 'undefined') return true;
  return sources.every((src) => readyKeys.has(cacheKey(src, sizes)));
}

export function preloadResponsiveImage(
  source: string,
  sizes: string,
  priority: 'high' | 'low' | 'auto' = 'auto',
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const key = cacheKey(source, sizes);
  if (readyKeys.has(key)) return Promise.resolve();
  const existing = inflightCache.get(key);
  if (existing) return existing;

  const props = catalogImageProps(source, sizes);
  const img = new window.Image();
  img.decoding = 'async';
  img.fetchPriority = priority;
  if ('sizes' in props && props.sizes) img.sizes = props.sizes;
  if ('srcSet' in props && props.srcSet) img.srcset = props.srcSet;

  const promise = new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      readyKeys.add(key);
      resolve();
    };

    const decodeImage = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    };

    img.onload = decodeImage;
    img.onerror = finish;
    img.src = props.src;

    if (img.complete) {
      decodeImage();
    }
  });

  inflightCache.set(key, promise);
  return promise;
}

export function preloadResponsiveSources(
  sources: readonly string[],
  sizes: string,
  priority: 'high' | 'low' | 'auto' = 'low',
): Promise<void[]> {
  return Promise.all(sources.map((src) => preloadResponsiveImage(src, sizes, priority)));
}

export function preloadCollectionGrid(collectionId: CollectionId): Promise<void[]> {
  const config = COLLECTION_REGISTRY[collectionId];
  if (!config) return Promise.resolve([]);
  return preloadResponsiveSources(config.gridSources, config.gridSizes, 'high');
}

const GALLERY_COVER_SOURCES: readonly { src: string; sizes: string }[] = [
  { src: '/images/shopify-demo/coleccion/wachi-hero-horizontal.png', sizes: '(max-width: 850px) 100vw, 60vw' },
  { src: '/images/shopify-demo/coleccion/wachi-mobile-left.webp', sizes: '100vw' },
  { src: '/images/shopify-demo/accesorios-tarjetero.jpeg', sizes: '(max-width: 850px) 100vw, 50vw' },
  { src: '/images/shopify-demo/joyeria/cosmos-hero.webp', sizes: '(max-width: 850px) 100vw, 50vw' },
];

export function preloadShoppableGalleryCovers(priority: 'high' | 'low' = 'low'): Promise<void[]> {
  return Promise.all(
    GALLERY_COVER_SOURCES.map(({ src, sizes }) => preloadResponsiveImage(src, sizes, priority)),
  );
}

interface UseCollectionGridReadyOptions {
  gridSources: readonly string[];
  gridSizes: string;
  perspectiveSources: readonly string[];
  perspectiveSizes: string;
  maxWaitMs?: number;
}

/**
 * Sincroniza la entrada de la grilla de una colección esperando a que sus imágenes
 * principales estén decodificadas (con tope `maxWaitMs`) y difiere la precarga de
 * perspectivas secundarias a tiempo libre (`requestIdleCallback`).
 */
export function useCollectionGridReady({
  gridSources,
  gridSizes,
  perspectiveSources,
  perspectiveSizes,
  maxWaitMs = 160,
}: UseCollectionGridReadyOptions): boolean {
  const [isGridReady, setIsGridReady] = useState<boolean>(() =>
    areImagesReady(gridSources, gridSizes),
  );

  useEffect(() => {
    if (isGridReady) return;
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (!cancelled) setIsGridReady(true);
    }, maxWaitMs);

    preloadResponsiveSources(gridSources, gridSizes, 'high').then(() => {
      if (!cancelled) {
        window.clearTimeout(timer);
        setIsGridReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isGridReady, gridSources, gridSizes, maxWaitMs]);

  useEffect(() => {
    if (!isGridReady || perspectiveSources.length === 0) return;

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(
        () => {
          void preloadResponsiveSources(perspectiveSources, perspectiveSizes, 'low');
        },
        { timeout: 600 },
      );
      return () => {
        win.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(() => {
      void preloadResponsiveSources(perspectiveSources, perspectiveSizes, 'low');
    }, 120);
    return () => window.clearTimeout(timeoutId);
  }, [isGridReady, perspectiveSources, perspectiveSizes]);

  return isGridReady;
}
