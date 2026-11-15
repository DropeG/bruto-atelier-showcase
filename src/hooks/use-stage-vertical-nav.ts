import { useEffect, useRef } from 'react';

export type VerticalSlideDirection = -1 | 0 | 1;

interface UseStageVerticalNavOptions {
  enabled: boolean;
  itemCount: number;
  onNavigate: (direction: -1 | 1) => void;
  cooldownMs?: number;
  wheelThreshold?: number;
  swipeThreshold?: number;
}

const DEFAULT_COOLDOWN_MS = 600;
const DEFAULT_WHEEL_THRESHOLD = 18;
const DEFAULT_SWIPE_THRESHOLD = 42;

export function useStageVerticalNav({
  enabled,
  itemCount,
  onNavigate,
  cooldownMs = DEFAULT_COOLDOWN_MS,
  wheelThreshold = DEFAULT_WHEEL_THRESHOLD,
  swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
}: UseStageVerticalNavOptions) {
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const lastTriggerAtRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) {
      touchStartRef.current = null;
      return;
    }

    const canNavigate = itemCount > 1;

    const canTrigger = () => {
      const now = Date.now();
      if (now - lastTriggerAtRef.current < cooldownMs) {
        return false;
      }
      lastTriggerAtRef.current = now;
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      const absY = Math.abs(event.deltaY);
      const absX = Math.abs(event.deltaX);

      if (absY === 0 || absX > absY) return;

      if (event.cancelable) {
        event.preventDefault();
      }

      if (!canNavigate || absY < wheelThreshold) return;
      if (!canTrigger()) return;

      const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1;
      onNavigateRef.current(direction);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!canNavigate || !start || event.changedTouches.length === 0) return;

      const touch = event.changedTouches[0];
      const deltaY = start.y - touch.clientY;
      const deltaX = start.x - touch.clientX;
      const absY = Math.abs(deltaY);
      const absX = Math.abs(deltaX);

      if (absY < swipeThreshold || absY <= absX * 1.2) return;
      if (!canTrigger()) return;

      const direction: -1 | 1 = deltaY > 0 ? 1 : -1;
      onNavigateRef.current(direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!canNavigate || event.defaultPrevented) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!canTrigger()) return;
        onNavigateRef.current(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!canTrigger()) return;
        onNavigateRef.current(-1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, itemCount, cooldownMs, wheelThreshold, swipeThreshold]);
}
