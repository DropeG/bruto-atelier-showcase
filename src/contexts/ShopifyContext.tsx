import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  CartActionResult,
  CartState,
  CommerceError,
  ShopifyCart,
  ShopifyConnectionStatus,
  ShopifyDataSource,
  ShopifyProduct,
} from '@/types/shopify';
import {
  addLinesToCart,
  applyCartDiscountCode,
  createCart,
  getCart,
  getShopifyProducts,
  removeCartLines,
  testShopifyConnection,
  updateCartLines,
} from '@/lib/shopify/client';
import { useAuth } from '@/contexts/AuthContext';

const CART_STORAGE_KEY = 'shopify_cart_id';

interface ShopifyContextType {
  status: ShopifyConnectionStatus;
  source: ShopifyDataSource;
  products: ShopifyProduct[];
  cart: ShopifyCart | null;
  cartState: CartState;
  cartError: CommerceError | null;
  isLoading: boolean;
  isCartLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  refetchStatus: () => Promise<void>;
  refetchProducts: () => Promise<void>;
  refreshCart: () => Promise<CartActionResult>;
  addToCart: (merchandiseId: string, quantity?: number) => Promise<CartActionResult>;
  updateCartItem: (lineId: string, quantity: number) => Promise<CartActionResult>;
  removeFromCart: (lineId: string) => Promise<CartActionResult>;
}

const defaultStatus: ShopifyConnectionStatus = {
  isConnected: false,
  isLive: false,
  domain: '',
  apiVersion: '',
  shopInfo: null,
  error: null,
};

const emptyAction = (action: CartActionResult['action'], message: string): CartActionResult => ({
  ok: false,
  data: null,
  errors: [{ code: 'INVALID_INPUT', message }],
  warnings: [],
  action,
});

const ShopifyContext = createContext<ShopifyContextType | null>(null);

function storedCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CART_STORAGE_KEY);
}

export const ShopifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ShopifyConnectionStatus>(defaultStatus);
  const [source, setSource] = useState<ShopifyDataSource>('unavailable');
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(storedCartId);
  const [cartState, setCartState] = useState<CartState>('idle');
  const [cartError, setCartError] = useState<CommerceError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mutationQueue = useRef(Promise.resolve());
  const discountedCartId = useRef<string | null>(null);

  const persistCart = useCallback((nextCart: ShopifyCart | null) => {
    setCart(nextCart);
    setCartId(nextCart?.id || null);
    if (typeof window === 'undefined') return;
    if (nextCart?.id) window.localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
    else window.localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const loadShopifyData = useCallback(async () => {
    setIsLoading(true);
    const [connection, productResult] = await Promise.all([testShopifyConnection(), getShopifyProducts(20)]);
    setStatus(connection);
    setProducts(productResult.products);
    setSource(connection.isLive && productResult.isLive ? 'shopify' : connection.isLive ? 'unavailable' : 'demo');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadShopifyData();
  }, [loadShopifyData]);

  const refetchStatus = useCallback(async () => {
    const connection = await testShopifyConnection();
    setStatus(connection);
  }, []);

  const refetchProducts = useCallback(async () => {
    const productResult = await getShopifyProducts(20);
    setProducts(productResult.products);
    setSource(status.isLive && productResult.isLive ? 'shopify' : status.isLive ? 'unavailable' : 'demo');
  }, [status.isLive]);

  const saveResult = useCallback((result: CartActionResult) => {
    if (result.ok && result.data) {
      persistCart(result.data);
      setCartState('ready');
      setCartError(null);
    } else {
      setCartState('error');
      setCartError(result.errors[0] || { code: 'UNKNOWN', message: 'No fue posible actualizar el carrito.' });
    }
    return result;
  }, [persistCart]);

  const refreshCart = useCallback(async (): Promise<CartActionResult> => {
    if (!cartId) return emptyAction('restore', 'No hay productos en la bolsa todavía.');
    setCartState('restoring');
    const result = await getCart(cartId);
    if (result.ok) return saveResult(result);

    if (result.errors.some((error) => error.code === 'CART_EXPIRED')) {
      persistCart(null);
      setCartState('ready');
      setCartError(null);
    } else {
      saveResult(result);
    }
    return result;
  }, [cartId, persistCart, saveResult]);

  useEffect(() => {
    if (status.isLive && cartId) void refreshCart();
  }, [status.isLive, cartId, refreshCart]);

  const runMutation = useCallback(async (work: () => Promise<CartActionResult>) => {
    const next = mutationQueue.current.then(work, work);
    mutationQueue.current = next.then(() => undefined, () => undefined);
    return next;
  }, []);

  const addToCart = useCallback(async (merchandiseId: string, quantity = 1): Promise<CartActionResult> => {
    if (!merchandiseId || quantity < 1) return emptyAction('add', 'Selecciona una variante disponible para continuar.');
    return runMutation(async () => {
      setCartState('mutating');
      setCartError(null);
      const line = { merchandiseId, quantity };
      let result = cartId ? await addLinesToCart(cartId, [line]) : await createCart([line]);

      // A stale cart can be recovered once, without making the user repeat the action.
      if (!result.ok && result.errors.some((error) => error.code === 'CART_EXPIRED')) {
        persistCart(null);
        result = await createCart([line]);
      }

      const saved = saveResult(result);
      if (saved.ok) setIsCartOpen(true);
      return saved;
    });
  }, [cartId, persistCart, runMutation, saveResult]);

  const updateCartItem = useCallback(async (lineId: string, quantity: number): Promise<CartActionResult> => {
    if (!cartId) return emptyAction('update', 'No encontramos una bolsa activa.');
    if (quantity < 1) return emptyAction('update', 'La cantidad debe ser al menos uno.');
    return runMutation(async () => {
      setCartState('mutating');
      setCartError(null);
      return saveResult(await updateCartLines(cartId, [{ id: lineId, quantity }]));
    });
  }, [cartId, runMutation, saveResult]);

  const removeFromCart = useCallback(async (lineId: string): Promise<CartActionResult> => {
    if (!cartId) return emptyAction('remove', 'No encontramos una bolsa activa.');
    return runMutation(async () => {
      setCartState('mutating');
      setCartError(null);
      return saveResult(await removeCartLines(cartId, [lineId]));
    });
  }, [cartId, runMutation, saveResult]);

  // Keep the existing member benefit behaviour while preserving a complete cart payload.
  useEffect(() => {
    if (!user || !cartId || !cart) return;
    if (discountedCartId.current === cartId) return;
    discountedCartId.current = cartId;
    void runMutation(async () => {
      const result = await applyCartDiscountCode(cartId, ['BRUTO_SOCIO_10']);
      return result.ok ? saveResult(result) : result;
    });
  }, [user, cartId, cart, runMutation, saveResult]);

  const value = useMemo<ShopifyContextType>(() => ({
    status,
    source,
    products,
    cart,
    cartState,
    cartError,
    isLoading,
    isCartLoading: cartState === 'restoring' || cartState === 'mutating',
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    refetchStatus,
    refetchProducts,
    refreshCart,
    addToCart,
    updateCartItem,
    removeFromCart,
  }), [
    addToCart, cart, cartError, cartState, isCartOpen, isLoading,
    refreshCart, refetchProducts, refetchStatus, removeFromCart, source, status,
    updateCartItem, products,
  ]);

  return <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>;
};

export function useShopify(): ShopifyContextType {
  const context = useContext(ShopifyContext);
  if (!context) throw new Error('useShopify must be used within a ShopifyProvider');
  return context;
}
