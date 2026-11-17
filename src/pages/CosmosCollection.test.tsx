import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CosmosCollection from './CosmosCollection';
import CollectionShowcase, { type CollectionPiece } from '@/components/CollectionShowcase';
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

describe('CosmosCollection — Selector de Color Estilo Yeezy', () => {
  afterEach(() => {
    cleanup();
    addToCartMock.mockClear();
  });

  it('opens SELECCIONAR COLOR on + click, switches ring image between white and black, and adds selected variant', async () => {
    addToCartMock.mockResolvedValue({ ok: true, data: { totalQuantity: 1 } });
    render(
      <MemoryRouter>
        <CosmosCollection />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ver Anillo Cosmos' }));

    const openColorPickerBtn = screen.getByRole('button', { name: 'Seleccionar color de Anillo Cosmos' });
    fireEvent.click(openColorPickerBtn);

    expect(screen.getByText('SELECCIONAR COLOR')).toBeTruthy();

    const whiteSwatch = screen.getByRole('radio', { name: 'Blanco' });
    const blackSwatch = screen.getByRole('radio', { name: 'Negro' });
    expect(whiteSwatch.getAttribute('aria-checked')).toBe('true');
    expect(blackSwatch.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(blackSwatch);
    expect(blackSwatch.getAttribute('aria-checked')).toBe('true');
    const blackImg = screen.getByAltText('Anillo Cosmos — Vista 3/4 en plata cepillada y piedra negra');
    expect(blackImg.getAttribute('src')).toContain('anillo-negro-fondo-blanco');

    fireEvent.click(screen.getByRole('button', { name: 'Agregar Anillo Cosmos Negro a la bolsa' }));
    expect(addToCartMock).toHaveBeenCalledWith('gid://shopify/ProductVariant/demo-bruto-anillo-cosmos-2', 1);
    await screen.findByText('Agregado');

    fireEvent.click(whiteSwatch);
    expect(whiteSwatch.getAttribute('aria-checked')).toBe('true');
    const whiteImg = screen.getByAltText('Anillo Cosmos — Vista 3/4 en plata cepillada y piedra blanca');
    expect(whiteImg.getAttribute('src')).toContain('anillo-fondo-blanco');

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente perspectiva' }));
    const whiteP2Img = screen.getByAltText('Anillo Cosmos — Vista frontal macro de la constelación');
    expect(whiteP2Img.getAttribute('aria-hidden')).toBe('false');

    fireEvent.click(blackSwatch);
    const blackP2Img = screen.getByAltText('Anillo Cosmos — Vista frontal macro de la constelación en piedra negra');
    expect(blackP2Img.getAttribute('aria-hidden')).toBe('false');

    fireEvent.click(whiteSwatch);
    expect(
      screen.getByAltText('Anillo Cosmos — Vista frontal macro de la constelación').getAttribute('aria-hidden'),
    ).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar selector de color' }));
    expect(screen.queryByText('SELECCIONAR COLOR')).toBeNull();
    expect(screen.getAllByText('Anillo Cosmos').length).toBeGreaterThan(0);
  });

  it('exposes data-piece-count and data-piece-parity on grid and content for 1, 2, 3, and 4 pieces', () => {
    const { container } = render(
      <MemoryRouter>
        <CosmosCollection />
      </MemoryRouter>,
    );

    const content = container.querySelector('.wachi-collection__content');
    const grid = container.querySelector('.wachi-collection__grid');
    expect(content?.getAttribute('data-piece-count')).toBe('1');
    expect(content?.getAttribute('data-piece-parity')).toBe('odd');
    expect(grid?.getAttribute('data-piece-count')).toBe('1');
    expect(grid?.getAttribute('data-piece-parity')).toBe('odd');
    expect(grid?.classList.contains('wachi-collection__grid--single')).toBe(true);

    cleanup();

    const makePiece = (id: string, name: string): CollectionPiece => ({
      id,
      name,
      description: 'Pieza de prueba',
      image: '/images/shopify-demo/joyeria/anillo-fondo-blanco.webp',
      width: 896,
      height: 896,
      price: '$100.000',
      perspectives: [
        {
          src: '/images/shopify-demo/joyeria/anillo-fondo-blanco.webp',
          alt: name,
          width: 896,
          height: 896,
        },
      ],
    });

    for (const [count, expectedParity] of [
      [2, 'even'],
      [3, 'odd'],
      [4, 'even'],
    ] as const) {
      const pieces = Array.from({ length: count }, (_, idx) => makePiece(`pieza-${idx + 1}`, `Pieza ${idx + 1}`));
      const rendered = render(
        <MemoryRouter>
          <CollectionShowcase
            collectionId="cosmos"
            title="COSMOS"
            titleId={`cosmos-test-${count}`}
            layoutPrefix="cosmos"
            className="accessories-collection cosmos-collection"
            pieces={pieces}
          />
        </MemoryRouter>,
      );

      const multiContent = rendered.container.querySelector('.wachi-collection__content');
      const multiGrid = rendered.container.querySelector('.wachi-collection__grid');
      expect(multiContent?.getAttribute('data-piece-count')).toBe(String(count));
      expect(multiContent?.getAttribute('data-piece-parity')).toBe(expectedParity);
      expect(multiGrid?.getAttribute('data-piece-count')).toBe(String(count));
      expect(multiGrid?.getAttribute('data-piece-parity')).toBe(expectedParity);
      expect(multiGrid?.classList.contains('wachi-collection__grid--single')).toBe(false);
      cleanup();
    }
  });
});
