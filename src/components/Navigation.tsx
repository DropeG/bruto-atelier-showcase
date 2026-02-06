import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";

const navLinks = [
  { label: "Colección", href: "#coleccion" },
  { label: "Atelier", href: "#atelier" },
  { label: "Contacto", href: "#contacto" },
];

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsAtTop(currentScrollY < 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isAtTop ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 section-padding py-6 transition-colors duration-300 ${
          isAtTop ? "bg-transparent" : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <nav className="flex items-center justify-between">
          {/* Left side - Hamburger */}
          <div className="flex items-center gap-4 order-1">
            {/* Hamburger always left */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Desktop Navigation - Right side elements like Studio Jadad */}
          <div className="hidden md:flex items-center gap-2 order-2 ml-auto">
            {/* Currency selector */}
            {/* <CurrencyDropdown /> */}

            {/* User/Login icon */}
            <button
              onClick={() => navigate("/auth")}
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="User account"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* Shopping cart icon */}
            <button
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="Shopping cart"
            >
              <img src="/bag.svg" alt="Carrito" className="w-12 h-12" />
            </button>
          </div>

          {/* Right side icons - mobile only */}
          <div className="flex md:hidden items-center gap-4 order-3">
            {/* Shopping bag - mobile */}
            <button
              className="relative z-50 p-2"
              aria-label="Shopping cart"
            >
              <img src="/bag.svg" alt="Carrito" className="w-14 h-14" />
            </button>
          </div>

          {/* Spacer removed - ml-auto handles alignment */}
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background flex items-center justify-center"
          >
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center gap-8"
            >
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-3xl text-foreground hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
