import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useShopify } from '@/contexts/ShopifyContext';
import { useProduct } from '@/hooks/useProduct';
import { formatShopifyMoney } from '@/lib/shopify/money';
import type { ShopifyProductVariant } from '@/types/shopify';
import '@/styles/product-page.css';

function initialVariant(variants: ShopifyProductVariant[]): ShopifyProductVariant | undefined {
  return variants.find((variant) => variant.availableForSale) || variants[0];
}

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data, isLoading } = useProduct(handle);
  const { addToCart, isCartLoading } = useShopify();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const product = data?.product || null;
  const isLive = data?.isLive ?? false;
  const variants = useMemo(() => product?.variants.edges.map(({ node }) => node) || [], [product]);
  const images = useMemo(() => product?.images.edges.map(({ node }) => node) || [], [product]);

  useEffect(() => {
    const variant = initialVariant(variants);
    if (!variant) return;
    setSelectedValues(Object.fromEntries(variant.selectedOptions.map((option) => [option.name, option.value])));
    const imageIndex = variant.image ? images.findIndex((image) => image.url === variant.image?.url) : 0;
    setSelectedImageIndex(Math.max(0, imageIndex));
  }, [product?.id, variants, images]);

  const selectedVariant = useMemo(() => {
    const exact = variants.find((variant) =>
      variant.selectedOptions.every((option) => selectedValues[option.name] === option.value),
    );
    return exact || initialVariant(variants);
  }, [selectedValues, variants]);

  const selectOption = (optionName: string, value: string) => {
    setPurchaseError(null);
    setSelectedValues((current) => ({ ...current, [optionName]: value }));
  };

  const addSelectedVariant = async () => {
    if (!selectedVariant) return;
    setPurchaseError(null);
    const result = await addToCart(selectedVariant.id, 1);
    if (!result.ok) setPurchaseError(result.errors[0]?.message || 'No fue posible añadir este objeto a la bolsa.');
  };

  if (isLoading) {
    return (
      <main className="min-h-[100svh] bg-[#F7F5F0] px-6 pt-32 text-[#141412]">
        <p className="font-sans text-sm">Cargando objeto…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-[100svh] bg-[#F7F5F0] px-6 pt-32 text-[#141412]">
        <Link to="/" className="product-page__back">
          <ArrowLeft size={17} /> Volver al atelier
        </Link>
        <h1 className="mt-16 max-w-[14ch] font-serif text-5xl leading-none tracking-[-0.025em]">
          Este objeto ya no está disponible.
        </h1>
      </main>
    );
  }

  const activeImage = images[selectedImageIndex] || product.featuredImage || images[0];
  const isAvailable = Boolean(selectedVariant?.availableForSale);

  return (
    <main className="product-page min-h-[100svh] bg-[#F7F5F0] text-[#141412]">
      <Navigation />
      <div className="product-page__topline">
        <Link to="/" className="product-page__back">
          <ArrowLeft size={17} /> Volver al atelier
        </Link>
        {isLive ? <span>Disponible en Shopify</span> : <span>Objeto de demostración</span>}
      </div>

      <div className="product-page__grid">
        <section className="product-page__gallery" aria-label={'Imágenes de ' + product.title}>
          <div className="product-page__main-image">
            {activeImage?.url ? (
              <img
                src={activeImage.url}
                alt={activeImage.altText || product.title}
                width={activeImage.width || undefined}
                height={activeImage.height || undefined}
                fetchPriority="high"
                decoding="async"
              />
            ) : null}
          </div>
          {images.length > 1 && (
            <div className="product-page__thumbnails" aria-label="Seleccionar imagen">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.id || image.url}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={'Ver imagen ' + (index + 1) + ' de ' + product.title}
                  aria-pressed={selectedImageIndex === index}
                  className={selectedImageIndex === index ? 'is-active' : ''}
                >
                  <img src={image.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="product-page__details">
          <div>
            <p className="product-page__type">{product.productType || product.vendor}</p>
            <h1>{product.title}</h1>
            <p className="product-page__price">
              {selectedVariant ? formatShopifyMoney(selectedVariant.price) : formatShopifyMoney(product.priceRange.minVariantPrice)}
            </p>
            <p className="product-page__description">{product.description}</p>
          </div>

          {product.options.map((option) => (
            <fieldset className="product-page__option" key={option.id}>
              <legend>{option.name}</legend>
              <div>
                {option.values.map((value) => {
                  const selected = selectedValues[option.name] === value;
                  const matching = variants.find((variant) =>
                    variant.selectedOptions.some((selectedOption) => selectedOption.name === option.name && selectedOption.value === value),
                  );
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectOption(option.name, value)}
                      aria-pressed={selected}
                      className={selected ? 'is-selected' : ''}
                      disabled={!matching}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {!isLive && (
            <p className="product-page__notice" role="status">
              Este es un objeto de prueba. Al conectar Shopify, aquí aparecerán los productos, variantes y stock reales.
            </p>
          )}
          {purchaseError && <p className="product-page__error" role="alert">{purchaseError}</p>}

          <button
            type="button"
            onClick={() => void addSelectedVariant()}
            className="product-page__add"
            disabled={!isLive || !isAvailable || isCartLoading || !selectedVariant}
          >
            {!isLive ? 'Producto de demostración' : !isAvailable ? 'Agotado' : isCartLoading ? 'Añadiendo a la bolsa…' : 'Añadir a la bolsa'}
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Product;
