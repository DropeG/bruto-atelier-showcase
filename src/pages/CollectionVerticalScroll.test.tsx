import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WachiCollection from './WachiCollection';
import AccessoriesCollection from './AccessoriesCollection';
import CosmosCollection from './CosmosCollection';
import { MOCK_PRODUCTS } from '@/lib/shopify/mockData';

const { addToCartMock } = vi.hoisted(() => ({
  addToCartMock: vi.fn().mockResolvedValue({ ok: true, data: { totalQuantity: 1 } }),
}));

vi.mock('@/contexts/ShopifyContext', () => ({
  useShopify: () => ({
    cart: { totalQuantity: 0 },
    isCartOpen: false,
    openCart: vi.fn(),
    products: MOCK_PRODUCTS,
    addToCart: addToCartMock,
    isCartLoading: false,
  }),
}));

describe('Collection Stage Vertical Scroll Navigation (Yeezy style)', () => {
  let currentNow = 1_700_000_000_000;

  beforeEach(() => {
    currentNow = 1_700_000_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => currentNow);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    addToCartMock.mockClear();
  });

  it('cycles circularly through WACHI pieces on downward wheel scroll (Set -> Mesa -> Silla -> Banqueta -> Set) and absorbs inertia during cooldown', () => {
    render(
      <MemoryRouter>
        <WachiCollection />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ver Set' }));
    const stageElement = screen.getByRole('region', { name: 'Vista detallada de Set' });
    expect(stageElement).toBeTruthy();

    // Scroll down -> Mesa (stage element stays mounted in place; only media slides)
    fireEvent.wheel(window, { deltaY: 60, deltaX: 0 });
    expect(screen.getByRole('region', { name: 'Vista detallada de Mesa' })).toBe(stageElement);
    expect(stageElement.querySelector('.wachi-stage__media-slot--sliding')).toBeTruthy();

    // Inertia event within cooldown (100ms later) is ignored
    currentNow += 100;
    fireEvent.wheel(window, { deltaY: 80, deltaX: 0 });
    expect(screen.queryByRole('region', { name: 'Vista detallada de Silla' })).toBeNull();

    // Open size picker on Mesa, then scroll down after cooldown -> closes size picker and advances to Silla
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar Mesa' }));
    expect(within(stageElement).getByRole('heading', { name: 'Medida:' })).toBeTruthy();

    currentNow += 650;
    fireEvent.wheel(window, { deltaY: 60, deltaX: 0 });
    const sillaStage = screen.getByRole('region', { name: 'Vista detallada de Silla' });
    expect(sillaStage).toBe(stageElement);
    expect(within(sillaStage).getByRole('heading', { name: 'Silla' })).toBeTruthy();
    expect(within(sillaStage).queryByRole('heading', { name: 'Medida:' })).toBeNull();

    // Scroll down -> Banqueta
    currentNow += 650;
    fireEvent.wheel(window, { deltaY: 60, deltaX: 0 });
    expect(screen.getByRole('region', { name: 'Vista detallada de Banqueta' })).toBeTruthy();

    // Scroll down from Banqueta wraps around to Set
    currentNow += 650;
    fireEvent.wheel(window, { deltaY: 60, deltaX: 0 });
    expect(
      screen
        .getAllByRole('region', { name: 'Vista detallada de Set' })
        .some((el) => el.getAttribute('data-slide-direction') === '1'),
    ).toBe(true);

    // Scroll up from Set wraps backwards to Banqueta
    currentNow += 650;
    fireEvent.wheel(window, { deltaY: -60, deltaX: 0 });
    expect(
      screen
        .getAllByRole('region', { name: 'Vista detallada de Banqueta' })
        .some((el) => el.getAttribute('data-slide-direction') === '-1'),
    ).toBe(true);
  });

  it('cycles circularly through CUORO pieces via wheel, touch swipe, and ArrowDown/ArrowUp without mixing other collections', () => {
    render(
      <MemoryRouter>
        <AccessoriesCollection />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Ver Tabaquera/i }));
    expect(screen.getByRole('region', { name: 'Vista detallada de Tabaquera' })).toBeTruthy();

    // ArrowDown -> Sleeve
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(screen.getByRole('region', { name: 'Vista detallada de Sleeve' })).toBeTruthy();

    // Touch swipe up -> Tarjetero (and touchmove calls preventDefault so background page never scrolls)
    currentNow += 650;
    fireEvent.touchStart(window, { touches: [{ clientX: 180, clientY: 420 }] });
    const touchMoveEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [{ clientX: 181, clientY: 360 } as unknown as Touch],
    });
    const notCancelled = window.dispatchEvent(touchMoveEvent);
    expect(notCancelled).toBe(false);
    expect(touchMoveEvent.defaultPrevented).toBe(true);
    fireEvent.touchEnd(window, { changedTouches: [{ clientX: 182, clientY: 310 }] });
    expect(screen.getByRole('region', { name: 'Vista detallada de Tarjetero' })).toBeTruthy();
    expect(document.querySelector('.wachi-collection--piece-stage')).toBeTruthy();

    // Wheel down -> wraps back to Tabaquera (never enters WACHI or COSMOS)
    currentNow += 650;
    fireEvent.wheel(window, { deltaY: 50, deltaX: 0 });
    expect(
      screen
        .getAllByRole('region', { name: 'Vista detallada de Tabaquera' })
        .some((el) => el.getAttribute('data-slide-direction') === '1'),
    ).toBe(true);

    // ArrowUp -> wraps backwards to Tarjetero
    currentNow += 650;
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(
      screen
        .getAllByRole('region', { name: 'Vista detallada de Tarjetero' })
        .some((el) => el.getAttribute('data-slide-direction') === '-1'),
    ).toBe(true);
  });

  it('does not trigger vertical piece transitions in single-piece collections like COSMOS', () => {
    render(
      <MemoryRouter>
        <CosmosCollection />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ver Anillo Cosmos' }));
    const stage = screen.getByRole('region', { name: 'Vista detallada de Anillo Cosmos' });
    expect(stage.getAttribute('data-slide-direction')).toBe('0');

    fireEvent.wheel(window, { deltaY: 80, deltaX: 0 });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(screen.getByRole('region', { name: 'Vista detallada de Anillo Cosmos' })).toBeTruthy();
    expect(
      screen.getByRole('region', { name: 'Vista detallada de Anillo Cosmos' }).getAttribute('data-slide-direction'),
    ).toBe('0');
  });
});
