import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import { formatShopifyMoney } from '@/lib/shopify/money';
import '@/styles/wachi-collection.css';

function buildPrefilledCheckoutUrl(
  baseUrl: string,
  fields: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    country: string;
  },
): string {
  try {
    const url = new URL(baseUrl);
    if (fields.email.trim()) url.searchParams.set('checkout[email]', fields.email.trim());
    if (fields.firstName.trim()) {
      url.searchParams.set('checkout[shipping_address][first_name]', fields.firstName.trim());
    }
    if (fields.lastName.trim()) {
      url.searchParams.set('checkout[shipping_address][last_name]', fields.lastName.trim());
    }
    if (fields.address1.trim()) {
      url.searchParams.set('checkout[shipping_address][address1]', fields.address1.trim());
    }
    if (fields.address2.trim()) {
      url.searchParams.set('checkout[shipping_address][address2]', fields.address2.trim());
    }
    if (fields.city.trim()) {
      url.searchParams.set('checkout[shipping_address][city]', fields.city.trim());
    }
    if (fields.country.trim()) {
      url.searchParams.set('checkout[shipping_address][country]', fields.country.trim());
    }
    if (fields.phone.trim()) {
      url.searchParams.set('checkout[shipping_address][phone]', fields.phone.trim());
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

const CartDrawer = () => {
  const {
    cart,
    cartError,
    cartState,
    closeCart,
    isCartOpen,
    refreshCart,
    removeFromCart,
    updateCartItem,
  } = useShopify();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('CHILE');

  const lines = cart?.lines.edges || [];
  const isBusy = cartState === 'mutating' || cartState === 'restoring';
  const prevLineCountRef = useRef(lines.length);

  // Close automatically when the user removes the last item from an active cart view
  useEffect(() => {
    const prevCount = prevLineCountRef.current;
    prevLineCountRef.current = lines.length;
    if (isCartOpen && prevCount > 0 && lines.length === 0) {
      closeCart();
    }
  }, [isCartOpen, lines.length, closeCart]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fresh = await refreshCart();
    const checkoutUrl = fresh.data?.checkoutUrl || cart?.checkoutUrl;
    if (!checkoutUrl) return;

    const targetUrl = buildPrefilledCheckoutUrl(checkoutUrl, {
      email,
      phone,
      firstName,
      lastName,
      address1,
      address2,
      city,
      country,
    });
    window.location.assign(targetUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-white text-[#171715]"
      role="dialog"
      aria-modal="true"
      aria-label="Resumen de compra"
    >
      <header className="wachi-collection__header wachi-collection__header--compact">
        <button
          type="button"
          className="wachi-collection__icon"
          onClick={closeCart}
          aria-label="Volver"
        >
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>

        <Link
          to="/"
          onClick={closeCart}
          className="wachi-collection__wordmark wachi-collection__wordmark--hidden"
          tabIndex={-1}
        >
          BRUTO Atelier
        </Link>

        <button
          type="button"
          className="wachi-collection__icon wachi-collection__bag"
          onClick={closeCart}
          aria-label={`Cerrar bolsa${cart?.totalQuantity ? `, ${cart.totalQuantity} piezas` : ''}`}
        >
          {cart?.totalQuantity ? (
            <span className="wachi-collection__bag-count">{cart.totalQuantity}</span>
          ) : null}
          <ShoppingBag size={20} strokeWidth={1.45} />
        </button>
      </header>

      <section className="wachi-checkout wachi-checkout--compact" aria-label="Bolsa de compra">
        {lines.length === 0 ? (
          <div className="wachi-checkout__confirmation">
            <p className="wachi-checkout__kicker">BOLSA</p>
            <h2 className="wachi-checkout__confirmation-title">Aún no has añadido piezas</h2>
            <p className="wachi-checkout__confirmation-copy">
              Tu bolsa está vacía. Explora la colección para añadir una pieza.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="wachi-checkout__submit"
            >
              VOLVER A LA COLECCIÓN
            </button>
          </div>
        ) : (
          <div className="wachi-checkout__grid">
            <form onSubmit={handleCheckout} noValidate className="wachi-checkout__form">
              {cartError && (
                <p role="alert" className="wachi-checkout__alert">
                  {cartError.message}
                </p>
              )}

              <div className="wachi-checkout__section">
                <h2 className="wachi-checkout__heading">INFORMACIÓN DE CONTACTO</h2>

                <div className="wachi-checkout__field">
                  <label htmlFor="cart-checkout-email" className="wachi-checkout__label">
                    CORREO ELECTRÓNICO
                  </label>
                  <input
                    id="cart-checkout-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isBusy}
                    placeholder="CORREO@DOMINIO.CL"
                    className="wachi-checkout__input"
                  />
                </div>

                <div className="wachi-checkout__field">
                  <label htmlFor="cart-checkout-phone" className="wachi-checkout__label">
                    TELÉFONO
                  </label>
                  <input
                    id="cart-checkout-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    disabled={isBusy}
                    placeholder="+56 9 1234 5678"
                    className="wachi-checkout__input"
                  />
                </div>
              </div>

              <div className="wachi-checkout__section">
                <h2 className="wachi-checkout__heading">DIRECCIÓN DE DESPACHO</h2>

                <div className="wachi-checkout__row-2">
                  <div className="wachi-checkout__field">
                    <label htmlFor="cart-checkout-first-name" className="wachi-checkout__label">
                      NOMBRE
                    </label>
                    <input
                      id="cart-checkout-first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      disabled={isBusy}
                      className="wachi-checkout__input"
                    />
                  </div>

                  <div className="wachi-checkout__field">
                    <label htmlFor="cart-checkout-last-name" className="wachi-checkout__label">
                      APELLIDO
                    </label>
                    <input
                      id="cart-checkout-last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      disabled={isBusy}
                      className="wachi-checkout__input"
                    />
                  </div>
                </div>

                <div className="wachi-checkout__field">
                  <label htmlFor="cart-checkout-address1" className="wachi-checkout__label">
                    DIRECCIÓN
                  </label>
                  <input
                    id="cart-checkout-address1"
                    name="address1"
                    type="text"
                    autoComplete="address-line1"
                    value={address1}
                    onChange={(event) => setAddress1(event.target.value)}
                    disabled={isBusy}
                    placeholder="ESCRIBE TU DIRECCIÓN..."
                    className="wachi-checkout__input"
                  />
                </div>

                <div className="wachi-checkout__field">
                  <label htmlFor="cart-checkout-address2" className="wachi-checkout__label">
                    DEPARTAMENTO, CASA, OFICINA, ETC. (OPCIONAL)
                  </label>
                  <input
                    id="cart-checkout-address2"
                    name="address2"
                    type="text"
                    autoComplete="address-line2"
                    value={address2}
                    onChange={(event) => setAddress2(event.target.value)}
                    disabled={isBusy}
                    placeholder="DEPARTAMENTO, CASA, PISO, ETC."
                    className="wachi-checkout__input"
                  />
                </div>

                <div className="wachi-checkout__row-2">
                  <div className="wachi-checkout__field">
                    <label htmlFor="cart-checkout-city" className="wachi-checkout__label">
                      CIUDAD / COMUNA
                    </label>
                    <input
                      id="cart-checkout-city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      disabled={isBusy}
                      className="wachi-checkout__input"
                    />
                  </div>

                  <div className="wachi-checkout__field">
                    <label htmlFor="cart-checkout-country" className="wachi-checkout__label">
                      PAÍS
                    </label>
                    <input
                      id="cart-checkout-country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      disabled={isBusy}
                      className="wachi-checkout__input"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy || !cart?.checkoutUrl}
                className="wachi-checkout__submit"
              >
                {isBusy ? 'ACTUALIZANDO BOLSA…' : 'FINALIZAR COMPRA'}
              </button>
            </form>

            <aside className="wachi-checkout__summary" aria-label="Resumen de compra">
              <h2 className="wachi-checkout__heading">RESUMEN DE COMPRA</h2>

              <div className="wachi-checkout__items">
                {lines.map(({ node: line }) => {
                  const lineTotalAmount = String(Number(line.merchandise.price.amount) * line.quantity);
                  const hasOptionTitle = line.merchandise.title !== 'Default Title';
                  return (
                    <div key={line.id} className="wachi-checkout__item">
                      <div className="wachi-checkout__item-thumb">
                        {line.merchandise.image?.url && (
                          <img
                            src={line.merchandise.image.url}
                            alt={line.merchandise.product.title}
                            loading="lazy"
                          />
                        )}
                      </div>

                      <div className="wachi-checkout__item-details">
                        <div className="wachi-checkout__item-line">
                          <span>{line.merchandise.product.title.toUpperCase()}</span>
                          <span>
                            {formatShopifyMoney({
                              amount: lineTotalAmount,
                              currencyCode: line.merchandise.price.currencyCode,
                            })}
                          </span>
                        </div>

                        <div className="wachi-checkout__item-line">
                          <span>{hasOptionTitle ? 'OPCIÓN' : 'COLECCIÓN'}</span>
                          <span className="wachi-checkout__item-meta-value">
                            {hasOptionTitle ? line.merchandise.title.toUpperCase() : 'CUORO'}
                          </span>
                        </div>

                        <div className="wachi-checkout__item-line">
                          <span>CANTIDAD</span>
                          <div className="wachi-checkout__qty" aria-label={`Cantidad de ${line.merchandise.product.title}`}>
                            <button
                              type="button"
                              className="wachi-checkout__qty-btn"
                              onClick={() => void updateCartItem(line.id, line.quantity + 1)}
                              disabled={isBusy}
                              aria-label={`Aumentar cantidad de ${line.merchandise.product.title}`}
                            >
                              +
                            </button>
                            <span className="wachi-checkout__qty-value" aria-live="polite">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              className="wachi-checkout__qty-btn"
                              onClick={() => {
                                if (line.quantity <= 1) {
                                  void removeFromCart(line.id);
                                } else {
                                  void updateCartItem(line.id, line.quantity - 1);
                                }
                              }}
                              disabled={isBusy}
                              aria-label={`Disminuir cantidad de ${line.merchandise.product.title}`}
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
                  <span>{cart ? formatShopifyMoney(cart.cost.subtotalAmount) : ''}</span>
                </div>
                <div className="wachi-checkout__total-row">
                  <span>DESPACHO</span>
                  <span>CALCULADO EN EL SIGUIENTE PASO</span>
                </div>
                <div className="wachi-checkout__total-row wachi-checkout__total-row--final">
                  <span>TOTAL</span>
                  <span>{cart ? formatShopifyMoney(cart.cost.totalAmount) : ''}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
};

export default CartDrawer;
