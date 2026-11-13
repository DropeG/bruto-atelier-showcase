import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';

export interface WachiRequestPiece {
  name: string;
  description: string;
  image: string;
  kind: 'ensemble' | 'table' | 'chair' | 'bench';
  price: string;
  sizes?: readonly string[];
}

export interface WachiRequestLineItem {
  key: string;
  piece: WachiRequestPiece;
  selectedSize: string | null;
  quantity: number;
}

interface WachiRequestDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  piece: WachiRequestPiece | null;
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  items?: WachiRequestLineItem[];
  onUpdateItemQuantity?: (key: string, delta: number) => void;
  onClearItems?: () => void;
}

interface DraftOrderConfirmation {
  id: string;
  name: string;
  customerEmail: string;
  items: WachiRequestLineItem[];
  totalAmount: number;
}

const CLIENT_PROFILES = [
  'PARTICULAR',
  'ARQUITECTO / DISEÑADOR',
  'PROYECTO COMERCIAL',
] as const;

type ClientProfile = (typeof CLIENT_PROFILES)[number];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseClpAmount(priceLabel: string): number {
  const digits = priceLabel.replace(/[^\d]/g, '');
  return Number(digits) || 0;
}

export function formatClpCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString('es-CL')}`;
}

const WachiRequestDrawer = ({
  open,
  onOpenChange,
  piece,
  selectedSize,
  items,
  onUpdateItemQuantity,
  onClearItems,
}: WachiRequestDrawerProps) => {
  const [clientProfile, setClientProfile] = useState<ClientProfile>('PARTICULAR');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('CHILE');
  const [comments, setComments] = useState('');
  const [fallbackQuantity, setFallbackQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<DraftOrderConfirmation | null>(null);

  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
      setIsSubmitting(false);
      setConfirmation(null);
      setFallbackQuantity(1);
    }
  }, [open]);

  if (!open) return null;

  const activeItems: WachiRequestLineItem[] =
    items && items.length > 0
      ? items
      : piece
        ? [
            {
              key: `${piece.kind}::${selectedSize ?? 'default'}`,
              piece,
              selectedSize,
              quantity: fallbackQuantity,
            },
          ]
        : [];

  if (activeItems.length === 0 && !confirmation) return null;

  const subtotalAmount = activeItems.reduce(
    (sum, item) => sum + parseClpAmount(item.piece.price) * item.quantity,
    0,
  );

  const handleAdjustQuantity = (item: WachiRequestLineItem, delta: number) => {
    if (onUpdateItemQuantity) {
      onUpdateItemQuantity(item.key, delta);
      return;
    }
    const next = fallbackQuantity + delta;
    if (next <= 0) {
      onOpenChange(false);
    } else {
      setFallbackQuantity(next);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = customerEmail.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedAddress1 = address1.trim();
    const trimmedAddress2 = address2.trim();
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim() || 'Chile';
    const trimmedComments = comments.trim();
    const fullName = [trimmedFirstName, trimmedLastName].filter(Boolean).join(' ').trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }
    if (trimmedPhone.replace(/[^\d]/g, '').length < 7) {
      setErrorMessage('Ingresa un teléfono de contacto válido.');
      return;
    }
    if (trimmedFirstName.length < 2) {
      setErrorMessage('Ingresa tu nombre.');
      return;
    }
    if (trimmedLastName.length < 2) {
      setErrorMessage('Ingresa tu apellido.');
      return;
    }
    if (trimmedAddress1.length < 3) {
      setErrorMessage('Ingresa tu dirección de despacho.');
      return;
    }
    if (trimmedCity.length < 2) {
      setErrorMessage('Ingresa tu ciudad o comuna.');
      return;
    }

    const snapshotItems = activeItems.map((item) => ({ ...item }));

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/wachi-draft-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: snapshotItems.map((item) => ({
            pieceName: item.piece.name,
            pieceKind: item.piece.kind,
            priceAmount: parseClpAmount(item.piece.price),
            selectedSize: item.selectedSize,
            quantity: item.quantity,
          })),
          pieceName: snapshotItems[0]?.piece.name,
          pieceKind: snapshotItems[0]?.piece.kind,
          priceAmount: parseClpAmount(snapshotItems[0]?.piece.price || '0'),
          selectedSize: snapshotItems[0]?.selectedSize || null,
          quantity: snapshotItems[0]?.quantity || 1,
          clientProfile,
          customerFirstName: trimmedFirstName,
          customerLastName: trimmedLastName,
          customerName: fullName,
          customerEmail: trimmedEmail,
          customerPhone: trimmedPhone,
          address1: trimmedAddress1,
          address2: trimmedAddress2,
          city: trimmedCity,
          country: trimmedCountry,
          comments: trimmedComments,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        draftOrder?: { id: string; name: string };
      } | null;

      if (!response.ok || !data?.ok || !data.draftOrder) {
        setErrorMessage(
          data?.error || 'No pudimos registrar tu solicitud en este momento. Intenta nuevamente.',
        );
        return;
      }

      setConfirmation({
        id: data.draftOrder.id,
        name: data.draftOrder.name,
        customerEmail: trimmedEmail,
        items: snapshotItems,
        totalAmount: subtotalAmount,
      });
      onClearItems?.();
      setComments('');
    } catch {
      setErrorMessage('Error de conexión al enviar tu solicitud. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <section className="wachi-checkout" aria-label="Confirmación de solicitud WACHI">
        <div className="wachi-checkout__confirmation">
          <div className="wachi-checkout__confirmation-badge">
            <Check size={18} strokeWidth={1.5} />
          </div>
          <p className="wachi-checkout__kicker">
            PEDIDO PRELIMINAR {confirmation.name}
          </p>
          <h2 className="wachi-checkout__confirmation-title">Solicitud recibida</h2>
          <p className="wachi-checkout__confirmation-copy">
            Hemos registrado tus datos y las piezas seleccionadas. Nuestro equipo te contactará a{' '}
            <strong>{confirmation.customerEmail}</strong> para coordinar medidas, despacho y gestionar el pago.
          </p>

          <div className="wachi-checkout__confirmation-summary">
            {confirmation.items.map((item) => (
              <div key={item.key} className="wachi-checkout__confirmation-row">
                <span>
                  {item.quantity}x WACHI — {item.piece.name}
                  {item.selectedSize ? ` (${item.selectedSize})` : ''}
                </span>
                <span>
                  {formatClpCurrency(parseClpAmount(item.piece.price) * item.quantity)}
                </span>
              </div>
            ))}
            <div className="wachi-checkout__confirmation-row wachi-checkout__confirmation-row--total">
              <span>TOTAL</span>
              <span>{formatClpCurrency(confirmation.totalAmount)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="wachi-checkout__submit"
          >
            VOLVER A WACHI
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="wachi-checkout" aria-label="Solicitud de compra WACHI">
      <div className="wachi-checkout__grid">
        <form onSubmit={handleSubmit} noValidate className="wachi-checkout__form">
          {errorMessage && (
            <p role="alert" className="wachi-checkout__alert">
              {errorMessage}
            </p>
          )}

          <div className="wachi-checkout__section">
            <h2 className="wachi-checkout__heading">INFORMACIÓN DE CONTACTO</h2>

            <div className="wachi-checkout__field">
              <span className="wachi-checkout__label">PERFIL DEL SOLICITANTE</span>
              <div
                className="wachi-checkout__profile-group"
                role="radiogroup"
                aria-label="Perfil del solicitante"
              >
                {CLIENT_PROFILES.map((profile) => {
                  const isActive = clientProfile === profile;
                  return (
                    <button
                      key={profile}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      disabled={isSubmitting}
                      onClick={() => setClientProfile(profile)}
                      className={`wachi-checkout__profile-btn${
                        isActive ? ' wachi-checkout__profile-btn--active' : ''
                      }`}
                    >
                      {profile}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="wachi-checkout__field">
              <label htmlFor="wachi-checkout-email" className="wachi-checkout__label">
                CORREO ELECTRÓNICO
              </label>
              <input
                id="wachi-checkout-email"
                name="customerEmail"
                type="email"
                required
                autoComplete="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                disabled={isSubmitting}
                placeholder="CORREO@DOMINIO.CL"
                className="wachi-checkout__input"
              />
            </div>

            <div className="wachi-checkout__field">
              <label htmlFor="wachi-checkout-phone" className="wachi-checkout__label">
                TELÉFONO
              </label>
              <input
                id="wachi-checkout-phone"
                name="customerPhone"
                type="tel"
                required
                autoComplete="tel"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                disabled={isSubmitting}
                placeholder="+56 9 1234 5678"
                className="wachi-checkout__input"
              />
            </div>
          </div>

          <div className="wachi-checkout__section">
            <h2 className="wachi-checkout__heading">DIRECCIÓN DE DESPACHO</h2>

            <div className="wachi-checkout__row-2">
              <div className="wachi-checkout__field">
                <label htmlFor="wachi-checkout-first-name" className="wachi-checkout__label">
                  NOMBRE
                </label>
                <input
                  id="wachi-checkout-first-name"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  disabled={isSubmitting}
                  className="wachi-checkout__input"
                />
              </div>

              <div className="wachi-checkout__field">
                <label htmlFor="wachi-checkout-last-name" className="wachi-checkout__label">
                  APELLIDO
                </label>
                <input
                  id="wachi-checkout-last-name"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  disabled={isSubmitting}
                  className="wachi-checkout__input"
                />
              </div>
            </div>

            <div className="wachi-checkout__field">
              <label htmlFor="wachi-checkout-address1" className="wachi-checkout__label">
                DIRECCIÓN
              </label>
              <input
                id="wachi-checkout-address1"
                name="address1"
                type="text"
                required
                autoComplete="address-line1"
                value={address1}
                onChange={(event) => setAddress1(event.target.value)}
                disabled={isSubmitting}
                placeholder="ESCRIBE TU DIRECCIÓN..."
                className="wachi-checkout__input"
              />
            </div>

            <div className="wachi-checkout__field">
              <label htmlFor="wachi-checkout-address2" className="wachi-checkout__label">
                DEPARTAMENTO, CASA, OFICINA, ETC. (OPCIONAL)
              </label>
              <input
                id="wachi-checkout-address2"
                name="address2"
                type="text"
                autoComplete="address-line2"
                value={address2}
                onChange={(event) => setAddress2(event.target.value)}
                disabled={isSubmitting}
                placeholder="DEPARTAMENTO, CASA, PISO, ETC."
                className="wachi-checkout__input"
              />
            </div>

            <div className="wachi-checkout__row-2">
              <div className="wachi-checkout__field">
                <label htmlFor="wachi-checkout-city" className="wachi-checkout__label">
                  CIUDAD / COMUNA
                </label>
                <input
                  id="wachi-checkout-city"
                  name="city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  disabled={isSubmitting}
                  className="wachi-checkout__input"
                />
              </div>

              <div className="wachi-checkout__field">
                <label htmlFor="wachi-checkout-country" className="wachi-checkout__label">
                  PAÍS
                </label>
                <input
                  id="wachi-checkout-country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  disabled={isSubmitting}
                  className="wachi-checkout__input"
                />
              </div>
            </div>

            <div className="wachi-checkout__field">
              <label htmlFor="wachi-checkout-comments" className="wachi-checkout__label">
                COMENTARIOS / MEDIDAS EXACTAS (OPCIONAL)
              </label>
              <textarea
                id="wachi-checkout-comments"
                name="comments"
                rows={3}
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                disabled={isSubmitting}
                placeholder="MEDIDAS EXACTAS DESEADAS, DETALLES DE ACCESO O COMENTARIOS..."
                className="wachi-checkout__textarea"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="wachi-checkout__submit"
          >
            {isSubmitting ? 'ENVIANDO SOLICITUD…' : 'SOLICITAR PIEZA A MEDIDA'}
          </button>
        </form>

        <aside className="wachi-checkout__summary" aria-label="Resumen de solicitud">
          <h2 className="wachi-checkout__heading">RESUMEN DE SOLICITUD</h2>

          <div className="wachi-checkout__items">
            {activeItems.map((item) => {
              const unitPrice = parseClpAmount(item.piece.price);
              const lineTotal = unitPrice * item.quantity;
              return (
                <div key={item.key} className="wachi-checkout__item">
                  <div className="wachi-checkout__item-thumb">
                    <img src={item.piece.image} alt={item.piece.name} />
                  </div>

                  <div className="wachi-checkout__item-details">
                    <div className="wachi-checkout__item-line">
                      <span>WACHI — {item.piece.name.toUpperCase()}</span>
                      <span>{formatClpCurrency(lineTotal)}</span>
                    </div>

                    <div className="wachi-checkout__item-line">
                      <span>{item.selectedSize ? 'MEDIDA' : 'MATERIAL'}</span>
                      <span className="wachi-checkout__item-meta-value">
                        {item.selectedSize ? item.selectedSize.toUpperCase() : 'LENGA MACIZA'}
                      </span>
                    </div>

                    <div className="wachi-checkout__item-line">
                      <span>CANTIDAD</span>
                      <div className="wachi-checkout__qty" aria-label={`Cantidad de ${item.piece.name}`}>
                        <button
                          type="button"
                          className="wachi-checkout__qty-btn"
                          onClick={() => handleAdjustQuantity(item, 1)}
                          aria-label={`Aumentar cantidad de ${item.piece.name}`}
                        >
                          +
                        </button>
                        <span className="wachi-checkout__qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="wachi-checkout__qty-btn"
                          onClick={() => handleAdjustQuantity(item, -1)}
                          aria-label={`Disminuir cantidad de ${item.piece.name}`}
                        >
                          −
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wachi-checkout__totals">
            <div className="wachi-checkout__total-row">
              <span>SUBTOTAL</span>
              <span>{formatClpCurrency(subtotalAmount)}</span>
            </div>
            <div className="wachi-checkout__total-row">
              <span>DESPACHO</span>
              <span>POR COORDINAR</span>
            </div>
            <div className="wachi-checkout__total-row wachi-checkout__total-row--final">
              <span>TOTAL</span>
              <span>{formatClpCurrency(subtotalAmount)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default WachiRequestDrawer;
