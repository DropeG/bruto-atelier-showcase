import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ShowcaseViewer from './ShowcaseViewer';
import { prepareImage, retainImages } from '@/lib/gallery-images';

const requests = new Map<string, MockImage[]>();
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  complete = false;
  naturalWidth = 0;
  private source = '';
  set src(value: string) {
    this.source = value;
    requests.set(value, [...(requests.get(value) || []), this]);
  }
  get src() { return this.source; }
  decode = vi.fn(() => Promise.resolve());
}
let sequence = 0;
let items: { id: number; title: string; thumbnail: string; detailImage: string }[];
async function load(src: string, fail = false) {
  await act(async () => {
    for (const image of requests.get(src) || []) {
      image.complete = true;
      image.naturalWidth = fail ? 0 : 100;
      if (fail) image.onerror?.(); else image.onload?.();
    }
  });
}
async function advance(ms: number) { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); }
function mount(autoPlay = true) {
  return render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ShowcaseViewer items={items} autoPlay={autoPlay} /></MemoryRouter>);
}
function active(index: number) {
  return screen.getByLabelText(`Ir a imagen ${index + 1}`).querySelector('span')!.className.includes('w-6');
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('Image', MockImage);
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  requests.clear();
  sequence++;
  items = [0, 1, 2].map(id => ({ id, title: `Photo ${id}`, detailImage: `/test-${sequence}-${id}.webp`, thumbnail: `/bg-${sequence}-${id}.webp` }));
});
afterEach(async () => {
  cleanup();
  // Let abandoned mock requests time out, as real requests do, before restoring the clock.
  await act(async () => { await vi.runOnlyPendingTimersAsync(); });
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('gallery presentation with delayed resources', () => {
  it('starts preparing the background without waiting for the detail image', () => {
    mount(false);
    expect(requests.has(items[0].detailImage)).toBe(true);
    expect(requests.has(items[0].thumbnail)).toBe(true);
  });

  it('shares one download and decode between preparation consumers', async () => {
    const src = items[0].detailImage;
    const first = prepareImage(src, 'low');
    const second = prepareImage(src, 'high');
    expect(first).toBe(second);
    expect(requests.get(src)).toHaveLength(1);
    await load(src);
    await Promise.all([first, second]);
    expect(requests.get(src)![0].decode).toHaveBeenCalledTimes(1);
  });

  it('retains active resources while evicting old decoded images', async () => {
    const src = items[0].detailImage;
    const release = retainImages([src]);
    const first = prepareImage(src);
    await load(src);
    await first;
    for (let i = 0; i < 12; i++) {
      const extra = `${src}?extra=${i}`;
      const prepared = prepareImage(extra);
      await load(extra);
      await prepared;
    }
    expect(prepareImage(src)).toBe(first);
    expect(requests.get(src)).toHaveLength(1);
    release();
  });

  it('reveals the selected detail while its background is still pending', async () => {
    mount();
    await load(items[0].detailImage);
    await advance(40);
    const image = document.querySelector(`img[src="${items[0].detailImage}"]`)!;
    expect(image).not.toBeNull();
    expect(image.className).toContain('opacity-100');
    expect(requests.has(items[1].detailImage)).toBe(false);
  });

  it('does not advance autoplay before the initial photo has been presented', async () => {
    mount();
    await advance(6000);
    expect(active(0)).toBe(true);
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1000);
    await load(items[1].detailImage);
    await load(items[1].thumbnail);
    await advance(4900);
    expect(active(0)).toBe(true);
    await advance(200);
    await advance(40);
    expect(active(1)).toBe(true);
  });

  it('keeps the current view during loading and ignores an obsolete selection', async () => {
    mount(false);
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1100);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    expect(active(0)).toBe(true);
    fireEvent.click(screen.getByLabelText('Ir a imagen 3'));
    await load(items[2].detailImage);
    await load(items[2].thumbnail);
    await advance(40);
    expect(active(2)).toBe(true);
    await load(items[1].detailImage);
    await load(items[1].thumbnail);
    await advance(100);
    expect(active(2)).toBe(true);
  });

  it('waits for decoding, not just the download event', async () => {
    mount(false);
    let decode!: () => void;
    requests.get(items[0].detailImage)![0].decode.mockImplementation(() => new Promise(resolve => { decode = resolve; }));
    await load(items[0].detailImage);
    expect(document.querySelector(`img[src="${items[0].detailImage}"]`)).toBeNull();
    await act(async () => decode());
    expect(document.querySelector(`img[src="${items[0].detailImage}"]`)).not.toBeNull();
  });

  it('starts a manual transition once the detail is decoded even with a delayed background', async () => {
    mount(false);
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1100);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    await load(items[1].detailImage);
    await advance(40);
    expect(active(1)).toBe(true);
    expect(document.querySelector(`img[src="${items[0].detailImage}"]`)).not.toBeNull();
  });

  it('preserves the entrance when the first selection changes before loading finishes', async () => {
    mount(false);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    await load(items[1].detailImage);
    const image = document.querySelector(`img[src="${items[1].detailImage}"]`)!;
    expect(image.closest('.animate-fade-in-up')).not.toBeNull();
    await load(items[0].detailImage);
    expect(active(1)).toBe(true);
  });

  it('does not cancel the outgoing entrance when a user advances immediately', async () => {
    mount(false);
    await load(items[0].detailImage);
    await advance(100);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    await load(items[1].detailImage);
    await advance(40);
    const outgoing = document.querySelector(`img[src="${items[0].detailImage}"]`)!;
    expect(outgoing.closest('.animate-fade-in-up')).not.toBeNull();
  });

  it('keeps the current photo after a failed target and permits a deliberate retry', async () => {
    mount(false);
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1100);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    await load(items[1].detailImage, true);
    expect(active(0)).toBe(true);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    await load(items[1].detailImage);
    await load(items[1].thumbnail);
    await advance(40);
    expect(active(1)).toBe(true);
  });

  it('uses the background fallback on error and still allows the next photo', async () => {
    mount(false);
    await load(items[0].detailImage);
    await load(items[0].thumbnail, true);
    await advance(1100);
    fireEvent.click(screen.getByLabelText('Ir a imagen 2'));
    await load(items[1].detailImage);
    await load(items[1].thumbnail, true);
    await advance(40);
    expect(active(1)).toBe(true);
  });

  it('pauses autoplay in a hidden tab and resumes with a full dwell', async () => {
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    mount();
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1100);
    await load(items[1].detailImage);
    await load(items[1].thumbnail);
    hidden.mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    await advance(10000);
    expect(active(0)).toBe(true);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    await advance(4900);
    expect(active(0)).toBe(true);
    await advance(200);
    await advance(40);
    expect(active(1)).toBe(true);
  });

  it('does not speculate when data saving is enabled', async () => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    mount();
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1100);
    expect(requests.has(items[1].detailImage)).toBe(false);
    Reflect.deleteProperty(navigator, 'connection');
  });

  it('cancels an automatic destination still downloading when the tab is hidden', async () => {
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    mount();
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(1100);
    await advance(5000);
    expect(requests.has(items[1].detailImage)).toBe(true);
    hidden.mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    await load(items[1].detailImage);
    await advance(100);
    expect(active(0)).toBe(true);
    Reflect.deleteProperty(navigator, 'connection');
  });

  it('handles a single image and empty collection without a carousel timer', async () => {
    items = items.slice(0, 1);
    const view = mount();
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    await advance(20000);
    expect(screen.queryByLabelText('Ir a imagen 2')).toBeNull();
    view.unmount();
    items = [];
    mount();
    expect(screen.getByText('No encontrado')).not.toBeNull();
  });

  it('ignores a pending completion after leaving the viewer', async () => {
    const view = mount();
    expect(requests.get(items[0].thumbnail)).toHaveLength(1);
    view.unmount();
    await load(items[0].detailImage);
    await load(items[0].thumbnail);
    expect(requests.get(items[0].thumbnail)).toHaveLength(1);
    expect(document.querySelector('img')).toBeNull();
  });
});
