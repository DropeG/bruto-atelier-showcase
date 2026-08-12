import { useShopify } from '@/contexts/ShopifyContext';
import { ShopifyConnectionStatus } from '@/types/shopify';

export function useShopifyStatus(): {
  status: ShopifyConnectionStatus;
  isLoading: boolean;
  refetchStatus: () => Promise<void>;
} {
  const { status, isLoading, refetchStatus } = useShopify();
  return { status, isLoading, refetchStatus };
}
