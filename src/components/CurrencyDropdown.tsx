import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useCurrency, countries, Country } from "@/contexts/CurrencyContext";
import { AnimatePresence, motion } from "framer-motion";

const CurrencyDropdown = () => {
  const { selectedCountry, setSelectedCountry } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-foreground hover:opacity-60 transition-opacity"
        aria-label="Currency selector"
      >
        <span>
          {selectedCountry.name} | {selectedCountry.currency} {selectedCountry.symbol}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {/* Search Box */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    autoFocus
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleSelect(country)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${
                        selectedCountry.code === country.code
                          ? "bg-muted font-medium"
                          : ""
                      }`}
                    >
                      {country.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No se encontraron países
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencyDropdown;
