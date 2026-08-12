import { useShopify } from '@/contexts/ShopifyContext';
import { ShopifyProduct } from '@/types/shopify';

export function useShopifyProducts(): {
  products: ShopifyProduct[];
  isLoading: boolean;
  isLive: boolean;
  refetchProducts: () => Promise<void>;
} {
  const { products, status, isLoading, refetchProducts } = useShopify();
  return {
    products,
    isLoading,
    isLive: status.isLive,
    refetchProducts,
  };
}
