import type { IncomingMessage, ServerResponse } from 'node:http';

export type WachiPieceKind = 'ensemble' | 'table' | 'chair' | 'bench';

export interface WachiDraftOrderItemInput {
  pieceName: string;
  pieceKind: WachiPieceKind;
  priceAmount: number | string;
  selectedSize?: string | null;
  quantity?: number;
}

export interface WachiDraftOrderPayload {
  items: Array<{
    pieceName: string;
    pieceKind: WachiPieceKind;
    priceAmount: number;
    selectedSize: string | null;
    quantity: number;
  }>;
  customerFirstName: string;
  customerLastName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  clientProfile: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  comments: string;
}

export interface WachiDraftOrderResult {
  ok: boolean;
  status: number;
  draftOrder?: {
    id: string;
    name: string;
    invoiceUrl: string | null;
    status: string;
  };
  code?: string;
  error?: string;
}

const VALID_KINDS = new Set<WachiPieceKind>(['ensemble', 'table', 'chair', 'bench']);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation wachiDraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function normalizePhoneForShopify(rawPhone: string): string | null {
  const trimmed = rawPhone.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/[^\d]/g, '');
  if (trimmed.startsWith('+') && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  if (digits.length === 9 && digits.startsWith('9')) {
    return `+56${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('569')) {
    return `+${digits}`;
  }
  return null;
}

function splitCustomerName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Cliente', lastName: 'WACHI' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function formatClp(amount: number): string {
  return `$${Math.round(amount).toLocaleString('es-CL')}`;
}

function buildDraftOrderNote(payload: WachiDraftOrderPayload): string {
  const itemLines = payload.items.map((item) => {
    const sizeInfo = item.selectedSize ? ` (${item.selectedSize})` : '';
    const lineTotal = item.priceAmount * item.quantity;
    return `- ${item.quantity}x WACHI — ${item.pieceName}${sizeInfo} · ${formatClp(lineTotal)}`;
  });

  const addressParts = [
    payload.address1,
    payload.address2,
    payload.city,
    payload.country,
  ].filter(Boolean);

  const lines = [
    'Solicitud de Compra WACHI — Pedido Preliminar',
    ...itemLines,
    '',
    ...(payload.clientProfile ? [`Perfil: ${payload.clientProfile}`] : []),
    `Cliente: ${payload.customerName}`,
    `Email: ${payload.customerEmail}`,
    `Teléfono: ${payload.customerPhone}`,
  ];

  if (addressParts.length > 0) {
    lines.push(`Dirección: ${addressParts.join(', ')}`);
  }

  lines.push(`Comentarios: ${payload.comments || 'Sin comentarios adicionales'}`);
  return lines.join('\n');
}

export function validateWachiPayload(body: unknown): {
  valid: true;
  data: WachiDraftOrderPayload;
} | {
  valid: false;
  error: string;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Solicitud inválida.' };
  }

  const input = body as Record<string, unknown>;

  const rawItems: unknown[] = Array.isArray(input.items)
    ? input.items
    : input.pieceName
      ? [
          {
            pieceName: input.pieceName,
            pieceKind: input.pieceKind,
            priceAmount: input.priceAmount,
            selectedSize: input.selectedSize,
            quantity: input.quantity ?? 1,
          },
        ]
      : [];

  if (rawItems.length === 0) {
    return { valid: false, error: 'Debes seleccionar al menos una pieza WACHI.' };
  }

  const validatedItems: WachiDraftOrderPayload['items'] = [];
  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== 'object') {
      return { valid: false, error: 'La pieza WACHI seleccionada no es válida.' };
    }
    const item = rawItem as Record<string, unknown>;
    const pieceName = typeof item.pieceName === 'string' ? item.pieceName.trim() : '';
    const pieceKind = typeof item.pieceKind === 'string' ? (item.pieceKind as WachiPieceKind) : null;
    const priceNumber = Number(item.priceAmount);
    const selectedSize = typeof item.selectedSize === 'string' && item.selectedSize.trim()
      ? item.selectedSize.trim()
      : null;
    const quantity = Math.max(1, Math.round(Number(item.quantity ?? 1)));

    if (!pieceName || !pieceKind || !VALID_KINDS.has(pieceKind)) {
      return { valid: false, error: 'La pieza WACHI seleccionada no es válida.' };
    }
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      return { valid: false, error: 'El precio referencial de la pieza no es válido.' };
    }

    validatedItems.push({
      pieceName,
      pieceKind,
      priceAmount: Math.round(priceNumber),
      selectedSize,
      quantity: Number.isFinite(quantity) ? quantity : 1,
    });
  }

  const rawFirstName = typeof input.customerFirstName === 'string' ? input.customerFirstName.trim() : '';
  const rawLastName = typeof input.customerLastName === 'string' ? input.customerLastName.trim() : '';
  const rawFullName = typeof input.customerName === 'string' ? input.customerName.trim() : '';

  const customerName = rawFullName || [rawFirstName, rawLastName].filter(Boolean).join(' ').trim();
  const { firstName, lastName } = rawFirstName
    ? { firstName: rawFirstName, lastName: rawLastName }
    : splitCustomerName(customerName);

  const customerEmail = typeof input.customerEmail === 'string' ? input.customerEmail.trim() : '';
  const customerPhone = typeof input.customerPhone === 'string' ? input.customerPhone.trim() : '';
  const clientProfile = typeof input.clientProfile === 'string' ? input.clientProfile.trim() : '';
  const address1 = typeof input.address1 === 'string' ? input.address1.trim() : '';
  const address2 = typeof input.address2 === 'string' ? input.address2.trim() : '';
  const city = typeof input.city === 'string' ? input.city.trim() : '';
  const country = typeof input.country === 'string' && input.country.trim() ? input.country.trim() : 'Chile';
  const comments = typeof input.comments === 'string' ? input.comments.trim() : '';

  if (!customerEmail || !EMAIL_REGEX.test(customerEmail)) {
    return { valid: false, error: 'Ingresa un correo electrónico válido.' };
  }
  if (!customerPhone || customerPhone.replace(/[^\d]/g, '').length < 7) {
    return { valid: false, error: 'Ingresa un teléfono de contacto válido.' };
  }
  if (!customerName || customerName.length < 2) {
    return { valid: false, error: 'Ingresa tu nombre y apellido.' };
  }

  return {
    valid: true,
    data: {
      items: validatedItems,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerName,
      customerEmail,
      customerPhone,
      clientProfile,
      address1,
      address2,
      city,
      country,
      comments,
    },
  };
}

async function callShopifyAdminDraftOrder(
  endpoint: string,
  adminToken: string,
  input: Record<string, unknown>,
) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({
      query: DRAFT_ORDER_CREATE_MUTATION,
      variables: { input },
    }),
  });

  const json = (await response.json()) as {
    data?: {
      draftOrderCreate?: {
        draftOrder?: {
          id: string;
          name: string;
          invoiceUrl: string | null;
          status: string;
        } | null;
        userErrors?: Array<{ field?: string[] | null; message: string }>;
      };
    };
    errors?: Array<{ message: string; extensions?: { code?: string } }>;
  };

  return { response, json };
}

export async function createWachiDraftOrder(
  rawBody: unknown,
  env: Record<string, string | undefined> = process.env,
): Promise<WachiDraftOrderResult> {
  const validation = validateWachiPayload(rawBody);
  if (!validation.valid) {
    return { ok: false, status: 400, code: 'INVALID_INPUT', error: validation.error };
  }

  const domain = env.SHOPIFY_STORE_DOMAIN || env.VITE_SHOPIFY_STORE_DOMAIN || '';
  const adminToken = env.SHOPIFY_ADMIN_TOKEN || '';
  const apiVersion = env.SHOPIFY_API_VERSION || env.VITE_SHOPIFY_API_VERSION || '2024-07';

  if (!domain || !adminToken) {
    return {
      ok: false,
      status: 500,
      code: 'CONFIGURATION',
      error: 'Configuración de Shopify Admin incompleta en el servidor.',
    };
  }

  const payload = validation.data;
  const e164Phone = normalizePhoneForShopify(payload.customerPhone);
  const address: Record<string, string> = {
    firstName: payload.customerFirstName,
    ...(payload.customerLastName ? { lastName: payload.customerLastName } : {}),
    ...(payload.address1 ? { address1: payload.address1 } : {}),
    ...(payload.address2 ? { address2: payload.address2 } : {}),
    ...(payload.city ? { city: payload.city } : {}),
    ...(payload.country ? { country: payload.country } : {}),
    phone: payload.customerPhone,
  };

  const lineItems = payload.items.map((item) => {
    const customAttributes = [
      { key: 'Colección', value: 'WACHI' },
      { key: 'Material', value: 'Lenga maciza' },
    ];
    if (item.selectedSize) {
      customAttributes.push({ key: 'Medida seleccionada', value: item.selectedSize });
    }
    if (payload.clientProfile) {
      customAttributes.push({ key: 'Perfil', value: payload.clientProfile });
    }
    return {
      title: `WACHI — ${item.pieceName}`,
      quantity: item.quantity,
      originalUnitPrice: String(item.priceAmount),
      customAttributes,
    };
  });

  const baseInput: Record<string, unknown> = {
    email: payload.customerEmail,
    ...(e164Phone ? { phone: e164Phone } : {}),
    note: buildDraftOrderNote(payload),
    tags: ['WACHI', 'Pedido Preliminar', 'Lenga a Medida'],
    shippingAddress: address,
    billingAddress: address,
    lineItems,
  };

  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  try {
    let { response, json } = await callShopifyAdminDraftOrder(endpoint, adminToken, baseInput);

    // Retry without top-level phone or strict country field if Shopify rejects either in DraftOrderInput.
    const userErrors = json.data?.draftOrderCreate?.userErrors || [];
    const hasFieldError = userErrors.some((err) => {
      const msg = err.message.toLowerCase();
      return (
        err.field?.includes('phone') ||
        err.field?.includes('shippingAddress') ||
        err.field?.includes('billingAddress') ||
        msg.includes('phone') ||
        msg.includes('country')
      );
    });
    if (hasFieldError) {
      const safeAddress: Record<string, string> = {
        firstName: payload.customerFirstName,
        ...(payload.customerLastName ? { lastName: payload.customerLastName } : {}),
        ...(payload.address1 ? { address1: payload.address1 } : {}),
        ...(payload.address2 ? { address2: payload.address2 } : {}),
        ...(payload.city ? { city: payload.city } : {}),
        phone: payload.customerPhone,
      };
      const retryInput: Record<string, unknown> = {
        ...baseInput,
        shippingAddress: safeAddress,
        billingAddress: safeAddress,
      };
      delete retryInput.phone;
      ({ response, json } = await callShopifyAdminDraftOrder(endpoint, adminToken, retryInput));
    }

    const graphqlErrors = json.errors || [];
    if (graphqlErrors.length > 0) {
      const missingScope = graphqlErrors.some(
        (err) =>
          err.extensions?.code === 'ACCESS_DENIED' ||
          err.message.toLowerCase().includes('write_draft_orders') ||
          err.message.toLowerCase().includes('access denied'),
      );
      if (missingScope) {
        return {
          ok: false,
          status: 403,
          code: 'MISSING_SCOPE',
          error:
            'Shopify Admin requiere activar el permiso "write_draft_orders" en Configuración → Apps → Desarrollar aplicaciones.',
        };
      }
      return {
        ok: false,
        status: response.ok ? 400 : response.status,
        code: 'GRAPHQL_ERROR',
        error: graphqlErrors.map((err) => err.message).join(' '),
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        code: 'HTTP_ERROR',
        error: `Error de comunicación con Shopify Admin (${response.status}).`,
      };
    }

    const result = json.data?.draftOrderCreate;
    if (result?.userErrors?.length) {
      return {
        ok: false,
        status: 400,
        code: 'USER_ERROR',
        error: result.userErrors.map((err) => err.message).join(' '),
      };
    }

    if (!result?.draftOrder) {
      return {
        ok: false,
        status: 502,
        code: 'EMPTY_RESPONSE',
        error: 'Shopify no devolvió el pedido preliminar creado.',
      };
    }

    return {
      ok: true,
      status: 200,
      draftOrder: result.draftOrder,
    };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      code: 'NETWORK_ERROR',
      error: error instanceof Error ? error.message : 'No fue posible conectar con Shopify Admin.',
    };
  }
}

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      return req.body ? JSON.parse(req.body) : {};
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'Método no permitido. Usa POST.' }));
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'El cuerpo de la solicitud no es un JSON válido.' }));
    return;
  }

  const result = await createWachiDraftOrder(body);
  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(result));
}
