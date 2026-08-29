import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import { formatShopifyMoney } from '@/lib/shopify/money';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

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

  const startCheckout = async () => {
    const fresh = await refreshCart();
    const checkoutUrl = fresh.data?.checkoutUrl || cart?.checkoutUrl;
    if (checkoutUrl) window.location.assign(checkoutUrl);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent
        side="right"
        className="cart-drawer flex h-full w-full max-w-none flex-col border-0 bg-[#F7F5F0] p-0 text-[#141412] sm:w-[min(31rem,100vw)]"
      >
        <header className="flex items-start justify-between border-b border-[#3D261C]/20 px-6 py-7 sm:px-8">
          <div>
            <SheetTitle className="font-serif text-[2rem] font-normal leading-none tracking-[-0.02em] text-[#141412]">
              Bolsa
            </SheetTitle>
            <SheetDescription className="mt-2 font-sans text-sm text-[#3D261C]">
              {cart?.totalQuantity
                ? String(cart.totalQuantity) + ' ' + (cart.totalQuantity === 1 ? 'objeto' : 'objetos')
                : 'Aún no has añadido objetos'}
            </SheetDescription>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {cartError && (
            <p role="alert" className="mx-6 mt-5 bg-[#EAD0B9] px-4 py-3 font-sans text-sm leading-5 text-[#3D261C] sm:mx-8">
              {cartError.message}
            </p>
          )}

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col justify-between px-6 py-8 sm:px-8">
              <p className="max-w-[27ch] font-serif text-2xl leading-tight text-[#3D261C]">
                La bolsa está vacía. Vuelve a la galería para descubrir una pieza.
              </p>
              <Link to="/" onClick={closeCart} className="cart-drawer__text-link mt-8 self-start">
                Explorar el atelier <span>↗</span>
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-[#3D261C]/15 px-6 sm:px-8">
                {lines.map(({ node: line }) => (
                  <li key={line.id} className="grid grid-cols-[6.25rem_1fr] gap-4 py-6">
                    <div className="aspect-[4/5] overflow-hidden bg-[#EAD0B9]">
                      {line.merchandise.image?.url && (
                        <img
                          src={line.merchandise.image.url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-xl leading-tight tracking-[-0.01em]">
                            {line.merchandise.product.title}
                          </h3>
                          {line.merchandise.title !== 'Default Title' && (
                            <p className="mt-1 font-sans text-sm text-[#3D261C]">{line.merchandise.title}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="min-h-11 min-w-11 -mr-3 -mt-2 inline-flex items-center justify-center text-[#3D261C] transition-colors hover:bg-[#EAD0B9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D261C]"
                          onClick={() => void removeFromCart(line.id)}
                          disabled={isBusy}
                          aria-label={'Eliminar ' + line.merchandise.product.title}
                        >
                          <Trash2 size={17} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-4 font-sans text-sm font-medium tabular-nums">
                        {formatShopifyMoney(line.merchandise.price)}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <div className="inline-flex min-h-11 items-center border border-[#3D261C]/35">
                          <button
                            type="button"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center hover:bg-[#EAD0B9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D261C]"
                            onClick={() => void updateCartItem(line.id, line.quantity - 1)}
                            disabled={line.quantity <= 1 || isBusy}
                            aria-label={'Reducir cantidad de ' + line.merchandise.product.title}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-8 text-center font-sans text-sm tabular-nums" aria-live="polite">{line.quantity}</span>
                          <button
                            type="button"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center hover:bg-[#EAD0B9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D261C]"
                            onClick={() => void updateCartItem(line.id, line.quantity + 1)}
                            disabled={isBusy}
                            aria-label={'Aumentar cantidad de ' + line.merchandise.product.title}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <footer className="mt-auto border-t border-[#3D261C]/20 bg-[#9C7B66] px-6 py-7 text-[#141412] sm:px-8">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-sans text-sm font-medium">Subtotal</span>
                  <strong className="font-serif text-2xl font-normal tracking-[-0.01em]">
                    {cart ? formatShopifyMoney(cart.cost.subtotalAmount) : ''}
                  </strong>
                </div>
                <button
                  type="button"
                  className="mt-6 min-h-12 w-full bg-[#141412] px-5 py-3 font-sans text-sm font-medium tracking-[0.03em] text-[#F7F5F0] transition-colors hover:bg-[#3D261C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141412] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => void startCheckout()}
                  disabled={isBusy || !cart?.checkoutUrl}
                >
                  {isBusy ? 'Actualizando bolsa…' : 'Finalizar compra'}
                </button>
                <p className="mt-3 font-sans text-xs leading-5 text-[#3D261C]">
                  El pago y despacho se completan de forma segura en Shopify.
                </p>
              </footer>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
