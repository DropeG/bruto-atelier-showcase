import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { catalogImageProps } from '@/lib/catalog-images';
import { Link } from 'react-router-dom';
import { useShopify } from '@/contexts/ShopifyContext';
import '@/styles/wachi-collection.css';

const pieces = [
  { name: 'Set', image: '/images/shopify-demo/coleccion/wachi-fondo-blanco.png', kind: 'ensemble' },
  { name: 'Mesa', image: '/images/shopify-demo/coleccion/mesa-fondo-blanco.png', kind: 'table' },
  { name: 'Silla', image: '/images/shopify-demo/coleccion/silla-fondo-blanco.png', kind: 'chair' },
  { name: 'Banqueta', image: '/images/shopify-demo/coleccion/banqueta-fondo-blanco.png', kind: 'bench' },
] as const;

const WachiCollection = () => {
  const { cart, openCart } = useShopify();
  const galleryUrl = new URLSearchParams(window.location.search).get('demoMode') === 'true' ? '/?demoMode=true' : '/';

  return (
    <main className="wachi-collection">
      <header className="wachi-collection__header">
        <Link to={galleryUrl} className="wachi-collection__icon" aria-label="Volver a la galería"><ArrowLeft size={23} strokeWidth={1.45} /></Link>
        <Link to={galleryUrl} className="wachi-collection__wordmark">BRUTO Atelier SCL</Link>
        <button type="button" className="wachi-collection__icon wachi-collection__bag" onClick={openCart} aria-label={`Abrir bolsa${cart?.totalQuantity ? `, ${cart.totalQuantity} piezas` : ''}`}>
          <ShoppingBag size={22} strokeWidth={1.45} />
          {cart?.totalQuantity ? <span>{cart.totalQuantity}</span> : null}
        </button>
      </header>

      <section className="wachi-collection__content" aria-labelledby="wachi-collection-title">
        <div className="wachi-collection__intro">
          <p>Colección</p>
          <h1 id="wachi-collection-title">WACHI</h1>
        </div>
        <div className="wachi-collection__grid">
          {pieces.map((piece) => (
            <article key={piece.kind} className={`wachi-collection__piece wachi-collection__piece--${piece.kind}`}>
              <div className="wachi-collection__image">
                <img {...catalogImageProps(piece.image, "(max-width: 850px) 44vw, 22vw")} alt={piece.name} loading={piece.kind === 'ensemble' ? 'eager' : 'lazy'} decoding="async" fetchPriority={piece.kind === 'ensemble' ? 'high' : undefined} />
              </div>
              <h2>{piece.name}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default WachiCollection;
