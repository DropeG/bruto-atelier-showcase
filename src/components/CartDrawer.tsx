import { useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import { formatShopifyMoney } from '@/lib/shopify/money';
import '@/styles/wachi-collection.css';

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

  const handleCheckout = async () => {
    const fresh = await refreshCart();
    const checkoutUrl = fresh.data?.checkoutUrl || cart?.checkoutUrl;
    if (!checkoutUrl) return;
    window.location.assign(checkoutUrl);
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-white text-[#171715]"
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

        <span className="wachi-collection__icon" aria-hidden="true" />
      </header>

      <section className="wachi-checkout wachi-checkout--compact wachi-checkout--summary-only" aria-label="Bolsa de compra">
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
          <div className="wachi-checkout__summary wachi-checkout__summary--solo" aria-label="Resumen de compra">
            {cartError && (
              <p role="alert" className="wachi-checkout__alert">
                {cartError.message}
              </p>
            )}

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

              <button
                type="button"
                onClick={() => void handleCheckout()}
                disabled={isBusy || !cart?.checkoutUrl}
                className="wachi-checkout__submit"
              >
                {isBusy ? 'ACTUALIZANDO BOLSA…' : 'PASAR A CHECKOUT'}
              </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default CartDrawer;
