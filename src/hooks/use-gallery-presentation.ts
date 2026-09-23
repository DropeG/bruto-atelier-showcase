import { useCallback, useEffect, useRef, useState } from 'react';
import { backgroundFor, canSpeculate, detailSources, GalleryImageItem, prepareDetails, prepareImage, retainImages } from '@/lib/gallery-images';

export const GALLERY_ENTRANCE_MS = 1000;
export const GALLERY_TRANSITION_MS = 2500;
type Prepared = { detail: boolean; background: string | null; backgroundSettled: boolean };

export function useGalleryPresentation(items: GalleryImageItem[], autoPlay: boolean, interval: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [staged, setStaged] = useState<number | null>(null);
  const [prepared, setPrepared] = useState<Record<number, Prepared>>({});
  const [settled, setSettled] = useState(false);
  const [request, setRequest] = useState({ index: 0, revision: 0, automatic: false });
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const current = useRef(0);
  const presented = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const select = useCallback((index: number, automatic = false) => {
    setFailed(false);
    setRequest(previous => ({ index, revision: previous.revision + 1, automatic }));
  }, []);

  useEffect(() => {
    if (!visible && request.automatic && request.index !== currentIndex) {
      select(currentIndex);
    }
  }, [visible, request.automatic, request.index, currentIndex, select]);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    const item = itemsRef.current[request.index];
    if (!item) return;
    setStaged(null);
    let cancelled = false;
    let frame = 0;
    let secondFrame = 0;
    let backgroundTimer: ReturnType<typeof setTimeout>;
    const background = backgroundFor(item.thumbnail).src;
    const release = retainImages([...detailSources(item), background]);
    const update = (value: Partial<Prepared>) => {
      if (!cancelled) setPrepared(previous => ({
        ...previous,
        [request.index]: { detail: false, background: null, backgroundSettled: false, ...previous[request.index], ...value },
      }));
    };
    async function prepare() {
      // Start the visible background alongside the detail. The detail keeps the
      // higher fetch priority, while the background no longer waits behind it.
      const backgroundPromise = prepareImage(background, 'auto').then(() => {
        if (cancelled) return;
        update({ background, backgroundSettled: reduced });
        if (!reduced) backgroundTimer = setTimeout(() => update({ backgroundSettled: true }), 240);
      }).catch(() => {
        if (!cancelled) update({ backgroundSettled: true });
      });
      try {
        await prepareDetails(item);
        if (cancelled) return;
        update({ detail: true });
        if (!presented.current) {
          current.current = request.index;
          setCurrentIndex(request.index);
          presented.current = true;
          setSettled(false);
        }
        if (current.current !== request.index) {
          setStaged(request.index);
          // Paint the decoded incoming layer at zero opacity before starting the crossfade.
          frame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => {
              if (cancelled) return;
              setOutgoing(current.current);
              current.current = request.index;
              setCurrentIndex(request.index);
              setStaged(null);
              setSettled(false);
            });
          });
        }
      } catch {
        if (cancelled) return;
        setFailed(true);
      }
      await backgroundPromise;
    }
    void prepare();
    return () => { cancelled = true; clearTimeout(backgroundTimer); cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame); release(); };
  }, [request, reduced]);

  const detailReady = prepared[currentIndex]?.detail;
  const backgroundSettled = prepared[currentIndex]?.backgroundSettled;
  useEffect(() => {
    if (!detailReady) return;
    const timer = window.setTimeout(() => { setSettled(true); setOutgoing(null); },
      reduced ? 0 : outgoing === null ? GALLERY_ENTRANCE_MS : GALLERY_TRANSITION_MS);
    return () => clearTimeout(timer);
    // outgoing is captured at the start; clearing it must not restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, detailReady, reduced]);

  // Keep displayed layers decoded even when speculative work fills the bounded cache.
  useEffect(() => {
    const sources = [currentIndex, outgoing, staged].filter((i): i is number => i !== null)
      .filter(i => items[i])
      .flatMap(i => [...detailSources(items[i]), ...(prepared[i]?.background ? [prepared[i].background!] : [])]);
    return retainImages(sources);
  }, [currentIndex, outgoing, staged, items, prepared]);

  useEffect(() => {
    if (!visible || !detailReady || !backgroundSettled || !canSpeculate() || items.length < 2 || request.index !== currentIndex || failed) return;
    let cancelled = false;
    const next = items[(currentIndex + 1) % items.length];
    void prepareDetails(next, 'low').then(async () => {
      if (!cancelled) await prepareImage(backgroundFor(next.thumbnail).src, 'low');
    }).catch(() => { /* A deliberate selection retries a failed preparation. */ });
    return () => { cancelled = true; };
  }, [currentIndex, detailReady, backgroundSettled, visible, items, request.index, failed]);

  useEffect(() => {
    if (!detailReady) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const resize = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const src = backgroundFor(itemsRef.current[currentIndex].thumbnail).src;
        try {
          await prepareImage(src);
          if (!cancelled) setPrepared(previous => ({ ...previous,
            [currentIndex]: { ...previous[currentIndex], background: src, backgroundSettled: true },
          }));
        } catch { /* Keep the already displayed variant on resize failure. */ }
      }, 150);
    };
    window.addEventListener('resize', resize);
    return () => { cancelled = true; clearTimeout(timer); window.removeEventListener('resize', resize); };
  }, [currentIndex, detailReady]);

  useEffect(() => {
    if (!autoPlay || items.length < 2 || !visible || !settled || !backgroundSettled || failed || request.index !== currentIndex) return;
    const timer = window.setTimeout(() => select((currentIndex + 1) % items.length, true), interval);
    return () => clearTimeout(timer);
  }, [autoPlay, items.length, currentIndex, request, settled, backgroundSettled, failed, visible, interval, select]);

  return { currentIndex, outgoing, staged, prepared, select, requestedIndex: request.index, reduced };
}
