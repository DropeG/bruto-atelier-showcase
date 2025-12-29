import { createContext, useContext, useState, ReactNode } from "react";

export interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  rate: number; // Conversion rate from USD base price
}

export const countries: Country[] = [
  { code: "CL", name: "Chile", currency: "CLP", symbol: "$", rate: 950 },
  { code: "AR", name: "Argentina", currency: "ARS", symbol: "$", rate: 850 },
  { code: "CO", name: "Colombia", currency: "COP", symbol: "$", rate: 4200 },
  { code: "MX", name: "México", currency: "MXN", symbol: "$", rate: 17 },
  { code: "PE", name: "Perú", currency: "PEN", symbol: "S/", rate: 3.7 },
  { code: "CR", name: "Costa Rica", currency: "CRC", symbol: "₡", rate: 520 },
  { code: "EC", name: "Ecuador", currency: "USD", symbol: "$", rate: 1 },
  { code: "UY", name: "Uruguay", currency: "UYU", symbol: "$", rate: 39 },
  { code: "BO", name: "Bolivia", currency: "BOB", symbol: "Bs", rate: 6.9 },
  { code: "PY", name: "Paraguay", currency: "PYG", symbol: "₲", rate: 7300 },
  { code: "US", name: "Estados Unidos", currency: "USD", symbol: "$", rate: 1 },
  { code: "ES", name: "España", currency: "EUR", symbol: "€", rate: 0.92 },
];

interface CurrencyContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  convertPrice: (basePrice: number) => number;
  formatPrice: (basePrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Chile default

  const convertPrice = (basePrice: number): number => {
    return basePrice * selectedCountry.rate;
  };

  const formatPrice = (basePrice: number): string => {
    const converted = convertPrice(basePrice);
    const formatted = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
    
    return `${selectedCountry.symbol}${formatted} ${selectedCountry.currency}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};
