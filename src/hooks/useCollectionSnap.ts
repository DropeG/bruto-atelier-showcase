import { useEffect, type RefObject } from 'react';

/** One deliberate phone swipe per complete collection; the rest of the home scrolls freely. */
export function useCollectionSnap(ref: RefObject<HTMLElement>, revision: string) {
  useEffect(() => {
    const gallery = ref.current;
    const container = gallery?.closest<HTMLElement>('#coleccion');
    if (!gallery || !container) return;
    const phone = window.matchMedia('(max-width: 600px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const offset = (element: Element) => element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    const stops = () => [container.querySelector('#section-hero'), ...gallery.querySelectorAll('.catalog-piece'), gallery.querySelector('.shoppable-gallery__exit')]
      .filter((element): element is Element => Boolean(element))
      .map(offset);
    let gesture: { x: number; y: number; top: number; index: number; dy: number; dragging: boolean } | null = null;
    const update = () => {
      const end = offset(gallery) + gallery.getBoundingClientRect().height;
      container.dataset.collectionSnap = container.scrollTop < end - 2 ? 'active' : 'free';
    };
    const start = (event: TouchEvent) => {
      gesture = null;
      // Short viewports and enlarged content retain ordinary scrolling for readability.
      if (!phone.matches || container.clientHeight < 600 || event.touches.length !== 1) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, [role="dialog"]')) return;
      const positions = stops();
      const index = positions.findIndex(top => Math.abs(top - container.scrollTop) < 12);
      if (index < 0 || index === positions.length - 1) return;
      const piece = index > 0 ? gallery.querySelectorAll('.catalog-piece')[index - 1] : null;
      if (piece && piece.getBoundingClientRect().height > container.clientHeight + 2) return;
      const touch = event.touches[0];
      gesture = { x: touch.clientX, y: touch.clientY, top: container.scrollTop, index, dy: 0, dragging: false };
    };
    const move = (event: TouchEvent) => {
      if (!gesture) return;
      if (event.touches.length !== 1) { cancel(); return; }
      const touch = event.touches[0];
      const dy = gesture.y - touch.clientY;
      const dx = Math.abs(gesture.x - touch.clientX);
      if (!gesture.dragging && dx > 12 && dx > Math.abs(dy)) { gesture = null; return; }
      if (!gesture.dragging && Math.abs(dy) <= 12) return;
      if (!event.cancelable) { cancel(); return; }
      event.preventDefault();
      gesture.dragging = true;
      gesture.dy = dy;
      container.dataset.collectionDragging = 'true';
      container.scrollTop = gesture.top + Math.max(-container.clientHeight * .4, Math.min(container.clientHeight * .4, dy * .65));
    };
    const finish = (cancelled = false) => {
      const previous = gesture;
      gesture = null;
      delete container.dataset.collectionDragging;
      if (!previous?.dragging) return;
      const positions = stops();
      const direction = !cancelled && Math.abs(previous.dy) >= 28 ? Math.sign(previous.dy) : 0;
      const index = Math.max(0, Math.min(positions.length - 1, previous.index + direction));
      container.scrollTo({ top: positions[index], behavior: reduced.matches ? 'instant' : 'smooth' });
    };
    const end = () => finish();
    const cancel = () => finish(true);
    update();
    container.addEventListener('scroll', update, { passive: true });
    container.addEventListener('touchstart', start, { passive: true });
    container.addEventListener('touchmove', move, { passive: false });
    container.addEventListener('touchend', end);
    container.addEventListener('touchcancel', cancel);
    const observer = new ResizeObserver(update);
    observer.observe(gallery);
    return () => {
      container.removeEventListener('scroll', update);
      container.removeEventListener('touchstart', start);
      container.removeEventListener('touchmove', move);
      container.removeEventListener('touchend', end);
      container.removeEventListener('touchcancel', cancel);
      observer.disconnect();
      delete container.dataset.collectionSnap;
      delete container.dataset.collectionDragging;
    };
  }, [ref, revision]);
}
