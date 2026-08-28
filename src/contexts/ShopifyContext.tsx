import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ShopifyConnectionStatus, ShopifyProduct, ShopifyCart } from '@/types/shopify';
import { 
  testShopifyConnection, 
  getShopifyProducts,
  createCart,
  addLinesToCart,
  updateCartLines,
  removeCartLines,
  applyCartDiscountCode
} from '@/lib/shopify/client';
import { useAuth } from '@/contexts/AuthContext';

interface ShopifyContextType {
  status: ShopifyConnectionStatus;
  products: ShopifyProduct[];
  cart: ShopifyCart | null;
  isLoading: boolean;
  isCartLoading: boolean;
  refetchStatus: () => Promise<void>;
  refetchProducts: () => Promise<void>;
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>;
  updateCartItem: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
}

const defaultStatus: ShopifyConnectionStatus = {
  isConnected: false,
  isLive: false,
  domain: '',
  apiVersion: '',
  shopInfo: null,
  error: null,
};

const ShopifyContext = createContext<ShopifyContextType>({
  status: defaultStatus,
  products: [],
  cart: null,
  isLoading: true,
  isCartLoading: false,
  refetchStatus: async () => {},
  refetchProducts: async () => {},
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
});

export const ShopifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ShopifyConnectionStatus>(defaultStatus);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(() => localStorage.getItem('shopify_cart_id'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);

  const loadShopifyData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [connStatus, productsRes] = await Promise.all([
        testShopifyConnection(),
        getShopifyProducts(20),
      ]);
      setStatus(connStatus);
      setProducts(productsRes.products);
    } catch {
      setStatus((prev) => ({
        ...prev,
        isConnected: false,
        error: 'Error al inicializar Shopify Context',
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShopifyData();
  }, [loadShopifyData]);

  const refetchStatus = async () => {
    const connStatus = await testShopifyConnection();
    setStatus(connStatus);
  };

  const refetchProducts = async () => {
    const productsRes = await getShopifyProducts(20);
    setProducts(productsRes.products);
  };

  // --- Cart Methods ---
  
  const initCart = useCallback(async () => {
    if (!cartId) {
      const newCart = await createCart();
      if (newCart) {
        setCart(newCart);
        setCartId(newCart.id);
        localStorage.setItem('shopify_cart_id', newCart.id);
      }
    }
    // Note: If we had a fetchCart method, we would call it here if cartId exists. 
    // For now, if cartId exists, we assume operations will use it or it will be populated on first action.
  }, [cartId]);

  useEffect(() => {
    // We only initialize a cart if there isn't one already.
    // In a real app, you might only initialize when they add the first item, 
    // but initializing early gives us the checkoutUrl.
    if (status.isLive && !cartId) {
       initCart();
    }
  }, [status.isLive, cartId, initCart]);

  // Apply discount when user logs in and already has a cart
  useEffect(() => {
    if (user && cartId) {
      applyCartDiscountCode(cartId, ['BRUTO_SOCIO_10']).then(updatedCart => {
        if (updatedCart) setCart(updatedCart);
      });
    }
  }, [user, cartId]);

  const addToCart = async (merchandiseId: string, quantity: number) => {
    setIsCartLoading(true);
    try {
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await createCart();
        if (newCart) {
          setCartId(newCart.id);
          localStorage.setItem('shopify_cart_id', newCart.id);
          currentCartId = newCart.id;
        }
      }

      if (currentCartId) {
        let updatedCart = await addLinesToCart(currentCartId, [{ merchandiseId, quantity }]);
        if (updatedCart && user) {
          const discountedCart = await applyCartDiscountCode(currentCartId, ['BRUTO_SOCIO_10']);
          if (discountedCart) updatedCart = discountedCart;
        }
        if (updatedCart) setCart(updatedCart);
      }
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    setIsCartLoading(true);
    try {
      const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
      if (updatedCart) setCart(updatedCart);
    } finally {
      setIsCartLoading(false);
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;
    setIsCartLoading(true);
    try {
      const updatedCart = await removeCartLines(cartId, [lineId]);
      if (updatedCart) setCart(updatedCart);
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <ShopifyContext.Provider
      value={{
        status,
        products,
        cart,
        isLoading,
        isCartLoading,
        refetchStatus,
        refetchProducts,
        addToCart,
        updateCartItem,
        removeFromCart,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

export function useShopify(): ShopifyContextType {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
}
