import { useQuery } from '@tanstack/react-query';
import { getShopifyProductByHandle } from '@/lib/shopify/client';

export function useProduct(handle?: string) {
  return useQuery({
    queryKey: ['shopify', 'product', handle],
    enabled: Boolean(handle),
    staleTime: 60_000,
    queryFn: async () => {
      const result = await getShopifyProductByHandle(handle || '');
      return result;
    },
  });
}
