import type { ShopifyMoney } from '@/types/shopify';

export function formatShopifyMoney(
  money: ShopifyMoney,
  options: Intl.NumberFormatOptions = {},
): string {
  const digits = money.currencyCode === 'CLP' ? 0 : undefined;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: money.currencyCode,
    maximumFractionDigits: digits,
    ...options,
  }).format(Number(money.amount));
}
