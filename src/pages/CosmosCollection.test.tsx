import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar selector de color' }));
    expect(screen.queryByText('SELECCIONAR COLOR')).toBeNull();
    expect(screen.getAllByText('Anillo Cosmos').length).toBeGreaterThan(0);
  });
});
