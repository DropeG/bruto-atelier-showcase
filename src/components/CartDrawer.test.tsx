import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import Navigation from './Navigation';
import type { ShopifyCart } from '@/types/shopify';

const mockUseShopify = vi.fn();

vi.mock('@/contexts/ShopifyContext', () => ({
  useShopify: () => mockUseShopify(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
    openAuthModal: vi.fn(),
    authModalMode: 'login',
  }),
}));

const sampleCart: ShopifyCart = {
  id: 'gid://shopify/Cart/abc123',
  checkoutUrl: 'https://bruto-atelier-spzrd2zq.myshopify.com/checkouts/cn/abc123',
  totalQuantity: 1,
  cost: {
    subtotalAmount: { amount: '150000', currencyCode: 'CLP' },
    totalAmount: { amount: '150000', currencyCode: 'CLP' },
  },
  lines: {
    edges: [
      {
        node: {
          id: 'gid://shopify/CartLine/1',
          quantity: 1,
          merchandise: {
            id: 'gid://shopify/ProductVariant/1',
            title: 'Default Title',
            availableForSale: true,
            price: { amount: '150000', currencyCode: 'CLP' },
            product: { title: 'Silla Cuoro', handle: 'silla-cuoro' },
            image: { url: '/images/silla-cuoro.png', altText: 'Silla Cuoro' },
          },
        },
      },
    ],
  },
};

describe('CartDrawer (Direct Shopify Checkout Summary)', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders only RESUMEN DE COMPRA and PASAR A CHECKOUT without contact or shipping inputs', () => {
    mockUseShopify.mockReturnValue({
      cart: sampleCart,
      cartError: null,
      cartState: 'ready',
      closeCart: vi.fn(),
      isCartOpen: true,
      refreshCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateCartItem: vi.fn(),
    });

    render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>,
    );

    expect(screen.getByText('RESUMEN DE COMPRA')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'PASAR A CHECKOUT' })).toBeTruthy();
    expect(screen.queryByText('INFORMACIÓN DE CONTACTO')).toBeNull();
    expect(screen.queryByText('DIRECCIÓN DE DESPACHO')).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('refreshes cart and redirects directly to checkoutUrl when clicking PASAR A CHECKOUT', async () => {
    const freshUrl = 'https://bruto-atelier-spzrd2zq.myshopify.com/checkouts/cn/fresh999';
    const refreshCart = vi.fn().mockResolvedValue({
      ok: true,
      data: { ...sampleCart, checkoutUrl: freshUrl },
      errors: [],
      warnings: [],
      action: 'restore',
    });

    const assignMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign: assignMock },
      writable: true,
    });

    mockUseShopify.mockReturnValue({
      cart: sampleCart,
      cartError: null,
      cartState: 'ready',
      closeCart: vi.fn(),
      isCartOpen: true,
      refreshCart,
      removeFromCart: vi.fn(),
      updateCartItem: vi.fn(),
    });

    render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'PASAR A CHECKOUT' }));

    await waitFor(() => {
      expect(refreshCart).toHaveBeenCalledTimes(1);
      expect(assignMock).toHaveBeenCalledWith(freshUrl);
    });
  });

  it('connects Hero Navigation cart buttons to ShopifyContext (openCart + totalQuantity) and omits the redundant bag button inside CartDrawer', () => {
    const openCart = vi.fn();
    const closeCart = vi.fn();

    mockUseShopify.mockReturnValue({
      cart: { ...sampleCart, totalQuantity: 3 },
      cartError: null,
      cartState: 'ready',
      openCart,
      closeCart,
      isCartOpen: true,
      refreshCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateCartItem: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navigation />
        <CartDrawer />
      </MemoryRouter>,
    );

    const openButtons = screen.getAllByRole('button', { name: 'Abrir bolsa, 3 piezas' });
    expect(openButtons.length).toBe(2);
    openButtons.forEach((btn) => {
      expect(btn.querySelector('img[src="/bag.svg"]')).toBeTruthy();
      expect(btn.textContent).toContain('3');
    });

    fireEvent.click(openButtons[0]);
    expect(openCart).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole('button', { name: /Cerrar bolsa/i })).toBeNull();
    const backBtn = screen.getByRole('button', { name: 'Volver' });
    fireEvent.click(backBtn);
    expect(closeCart).toHaveBeenCalledTimes(1);
  });
});
