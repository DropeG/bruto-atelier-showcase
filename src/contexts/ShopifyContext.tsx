import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ShopifyConnectionStatus, ShopifyProduct } from '@/types/shopify';
import { testShopifyConnection, getShopifyProducts } from '@/lib/shopify/client';

interface ShopifyContextType {
  status: ShopifyConnectionStatus;
  products: ShopifyProduct[];
  isLoading: boolean;
  refetchStatus: () => Promise<void>;
  refetchProducts: () => Promise<void>;
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
  isLoading: true,
  refetchStatus: async () => {},
  refetchProducts: async () => {},
});

export const ShopifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ShopifyConnectionStatus>(defaultStatus);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  return (
    <ShopifyContext.Provider
      value={{
        status,
        products,
        isLoading,
        refetchStatus,
        refetchProducts,
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
