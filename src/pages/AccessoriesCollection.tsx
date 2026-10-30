import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import '@/styles/wachi-collection.css';
import '@/styles/accessories-collection.css';

const pieces = [
  { name: 'Tabaquera', image: '/images/shopify-demo/accesorios/tabaquera-fondo-blanco.webp', width: 1326, height: 1187 },
  { name: 'Sleeve', image: '/images/shopify-demo/accesorios/sleev-fondo-blanco.webp', width: 1668, height: 943 },
  { name: 'Tarjetero', image: '/images/shopify-demo/accesorios/tarjetero-fondo-blanco.webp', width: 1290, height: 1219 },
] as const;

const AccessoriesCollection = () => {
  const { cart, openCart } = useShopify();
  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  return (
    <main className="wachi-collection accessories-collection">
      <header className="wachi-collection__header">
        <Link to={galleryUrl} className="wachi-collection__icon" aria-label="Volver a la galería"><ArrowLeft size={23} strokeWidth={1.45} /></Link>
        <Link to={galleryUrl} className="wachi-collection__wordmark">BRUTO Atelier</Link>
        <button type="button" className="wachi-collection__icon wachi-collection__bag" onClick={openCart} aria-label={`Abrir bolsa${cart?.totalQuantity ? `, ${cart.totalQuantity} piezas` : ''}`}>
          <ShoppingBag size={22} strokeWidth={1.45} />
          {cart?.totalQuantity ? <span>{cart.totalQuantity}</span> : null}
        </button>
      </header>

      <section className="wachi-collection__content" aria-labelledby="accessories-collection-title">
        <div className="wachi-collection__intro">
          <p>Colección</p>
          <h1 id="accessories-collection-title">CUORO</h1>
        </div>
        <div className="wachi-collection__grid">
          {pieces.map((piece, index) => (
            <article key={piece.name} className="wachi-collection__piece">
              <div className="wachi-collection__image">
                <img src={piece.image} alt={piece.name} width={piece.width} height={piece.height} decoding="async" fetchPriority={index === 0 ? 'high' : undefined} />
              </div>
              <h2>{piece.name}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AccessoriesCollection;
