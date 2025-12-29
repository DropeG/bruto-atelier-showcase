import { useCurrency } from "@/contexts/CurrencyContext";

interface PriceProps {
  basePrice: number; // Price in USD
  className?: string;
  showCurrency?: boolean;
}

const Price = ({ basePrice, className = "", showCurrency = true }: PriceProps) => {
  const { formatPrice, convertPrice, selectedCountry } = useCurrency();

  if (showCurrency) {
    return <span className={className}>{formatPrice(basePrice)}</span>;
  }

  // Only show number with symbol
  const converted = convertPrice(basePrice);
  const formatted = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);

  return (
    <span className={className}>
      {selectedCountry.symbol}
      {formatted}
    </span>
  );
};

export default Price;
