import { CartActionResult, ShopifyCart, ShopifyCartLine, ShopifyProduct, ShopifyProductVariant } from '@/types/shopify';
import { MOCK_ID_MARKER, MOCK_PRODUCTS } from './mockData';

const DEMO_CART_ID = `gid://shopify/Cart/${MOCK_ID_MARKER}local`;
const DEMO_CART_STORAGE_KEY = 'bruto_demo_shopify_cart';

function findDemoVariant(
  merchandiseId: string,
): { product: ShopifyProduct; variant: ShopifyProductVariant } | null {
  for (const product of MOCK_PRODUCTS) {
    const match = product.variants.edges.find((edge) => edge.node.id === merchandiseId);
    if (match) {
      return { product, variant: match.node };
    }
  }
  return null;
}

function buildDemoCart(lines: ShopifyCartLine[]): ShopifyCart {
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, line) => sum + Number(line.merchandise.price.amount) * line.quantity,
    0,
  );

  return {
    id: DEMO_CART_ID,
    checkoutUrl: '',
    totalQuantity,
    cost: {
      totalAmount: { amount: String(totalAmount), currencyCode: 'CLP' },
      subtotalAmount: { amount: String(totalAmount), currencyCode: 'CLP' },
    },
    lines: {
      edges: lines.map((node) => ({ node })),
    },
  };
}

function readStoredLines(): ShopifyCartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DEMO_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShopifyCartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredLines(lines: ShopifyCartLine[]): void {
  if (typeof window === 'undefined') return;
  try {
    if (lines.length === 0) {
      window.localStorage.removeItem(DEMO_CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(DEMO_CART_STORAGE_KEY, JSON.stringify(lines));
    }
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function isDemoCartId(cartId: string): boolean {
  return cartId === DEMO_CART_ID;
}

export function getDemoCart(): CartActionResult {
  const lines = readStoredLines();
  return {
    ok: true,
    data: buildDemoCart(lines),
    errors: [],
    warnings: [],
    action: 'restore',
  };
}

function mergeDemoLines(
  existing: ShopifyCartLine[],
  incoming: Array<{ merchandiseId: string; quantity: number }>,
): ShopifyCartLine[] {
  const next = [...existing];
  for (const item of incoming) {
    const resolved = findDemoVariant(item.merchandiseId);
    if (!resolved) continue;
    const { product, variant } = resolved;
    const existingIndex = next.findIndex((line) => line.merchandise.id === item.merchandiseId);
    if (existingIndex !== -1) {
      const current = next[existingIndex];
      next[existingIndex] = { ...current, quantity: current.quantity + item.quantity };
    } else {
      next.push({
        id: `gid://shopify/CartLine/${MOCK_ID_MARKER}${variant.id.split('/').pop() ?? next.length + 1}`,
        quantity: item.quantity,
        merchandise: {
          id: variant.id,
          title: variant.title,
          price: variant.price,
          product: {
            title: product.title,
            handle: product.handle,
          },
          image: variant.image ?? product.featuredImage ?? null,
        },
      });
    }
  }
  return next;
}

export function createDemoCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
): CartActionResult {
  const nextLines = mergeDemoLines([], lines);
  writeStoredLines(nextLines);
  return {
    ok: true,
    data: buildDemoCart(nextLines),
    errors: [],
    warnings: [],
    action: 'create',
  };
}

export function addLinesToDemoCart(
  lines: Array<{ merchandiseId: string; quantity: number }>,
): CartActionResult {
  const existing = readStoredLines();
  const nextLines = mergeDemoLines(existing, lines);
  writeStoredLines(nextLines);
  return {
    ok: true,
    data: buildDemoCart(nextLines),
    errors: [],
    warnings: [],
    action: 'add',
  };
}

export function updateDemoCartLines(
  lines: Array<{ id: string; quantity: number }>,
): CartActionResult {
  const existing = readStoredLines();
  const nextLines = existing
    .map((line) => {
      const update = lines.find((item) => item.id === line.id);
      return update ? { ...line, quantity: update.quantity } : line;
    })
    .filter((line) => line.quantity > 0);
  writeStoredLines(nextLines);
  return {
    ok: true,
    data: buildDemoCart(nextLines),
    errors: [],
    warnings: [],
    action: 'update',
  };
}

export function removeDemoCartLines(lineIds: string[]): CartActionResult {
  const existing = readStoredLines();
  const nextLines = existing.filter((line) => !lineIds.includes(line.id));
  writeStoredLines(nextLines);
  return {
    ok: true,
    data: buildDemoCart(nextLines),
    errors: [],
    warnings: [],
    action: 'remove',
  };
}
