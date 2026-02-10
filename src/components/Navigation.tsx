import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";

const navLinks = [
  { label: "Arquitectura", href: "#arquitectura" },
  { label: "Interior", href: "#interior" },
  { label: "Mobiliario", href: "#mobiliario" },
  { label: "Tienda", href: "#tienda" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Preguntas frecuentes", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
  { label: "Rebajas", href: "#rebajas" },
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

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);
    document.documentElement.classList.toggle("menu-open", isMenuOpen);
    return () => {
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

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
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="absolute top-24 left-6 w-[220px] md:w-[260px] bg-[#9C7B66] text-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.ul className="flex flex-col gap-3 text-sm tracking-wide">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
