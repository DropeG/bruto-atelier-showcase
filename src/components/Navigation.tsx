import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";
import NewsletterModal from "./NewsletterModal";
import NosotrosModal from "./NosotrosModal";
import { comingSoonCategories } from "@/data/ComingSoon";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Arquitectura", href: "/showcase/arquitectura" },
  { label: "Interiorismo", href: "/showcase/interiorismo" },
  { label: "Mobiliario", href: "#mobiliario" },
  { label: "Iluminación", href: "/showcase/iluminacion" },
  { label: "Esenciales", href: "/showcase/esenciales" },
  { label: "Joyería", href: "/showcase/joyeria" },
  { label: "Vestuario", href: "/showcase/vestuario" },
  { label: "Accesorios", href: "/showcase/accesorios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" }
];

type NavigationProps = {
  position?: "fixed" | "absolute";
  hideIcons?: boolean;
};

const Navigation = ({ position = "fixed", hideIcons = false }: NavigationProps) => {
  const { user, logout, openAuthModal } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [activePanel, setActivePanel] = useState<"mobiliario" | "contacto" | "vestuario" | string | null>(null);
  const [isNosotrosOpen, setIsNosotrosOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const whatsappNumber = "56949569887";
  const defaultContactMessage = "¿Qué tal, me resuelven una duda?";

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsAtTop(currentScrollY < 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isAnyOpen = isMenuOpen || activePanel !== null;
    document.body.classList.toggle("menu-open", isAnyOpen);
    document.documentElement.classList.toggle("menu-open", isAnyOpen);
    return () => {
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("menu-open");
    };
  }, [isMenuOpen, activePanel]);

  useEffect(() => {
    if (!isMenuOpen) {
      setActivePanel(null);
    }
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isAtTop ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${position} top-0 left-0 right-0 z-50 section-padding py-6 transition-colors duration-300 ${
          isAtTop ? "bg-transparent" : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <nav className="flex items-center justify-between">
          {/* Left side - Hamburger */}
          <div className="flex items-center gap-4 order-1">
            {/* Hamburger always left */}
            {!hideIcons && (
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
            )}
          </div>

          {/* Desktop Navigation - Right side elements like Studio Jadad */}
          {!hideIcons && (
            <div className="hidden md:flex items-center gap-2 order-2 ml-auto">
              {/* Currency selector */}
              {/* <CurrencyDropdown /> */}

              {/* Shopping cart icon */}
              <button
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Shopping cart"
              >
                <img src="/bag.svg" alt="Carrito" className="w-12 h-12" />
              </button>

              {/* User/Login icon (to the right of the cart) */}
              {user ? (
                <div ref={userMenuRef} className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-xs uppercase tracking-wider px-2.5 py-1.5 rounded-sm hover:bg-foreground/10 active:scale-95 transition-all font-sans text-foreground cursor-pointer"
                    aria-label="Perfil de socio"
                    aria-expanded={isUserMenuOpen}
                  >
                    <User className="w-4 h-4 text-foreground" />
                    <span className="font-medium truncate max-w-[100px]">{user.firstName || "Socio"}</span>
                  </button>
                  
                  {/* Dropdown Menu on Click */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-52 bg-[#9C7B66] text-[#F7F5F0] p-4 shadow-2xl rounded-sm text-xs font-serif z-50 border border-white/10"
                      >
                        <p className="font-sans text-[9px] text-[#F7F5F0]/70 uppercase tracking-widest mb-1">Socio Bruto</p>
                        <p className="truncate font-medium mb-1 text-sm">{user.firstName} {user.lastName}</p>
                        <p className="truncate text-[11px] text-[#F7F5F0]/70 mb-3 font-sans">{user.email}</p>
                        <div className="text-[10px] text-[#F7F5F0] bg-white/15 px-2.5 py-1.5 rounded-sm mb-3 font-sans flex items-center gap-1.5">
                          <span>✓ 10% Descuento activo</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left py-2 text-xs text-[#F7F5F0]/90 hover:text-white border-t border-[#F7F5F0]/20 transition-colors cursor-pointer font-sans uppercase tracking-wider font-medium flex items-center justify-between"
                        >
                          <span>Cerrar sesión</span>
                          <span>→</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="p-2 hover:opacity-60 transition-opacity"
                  aria-label="Iniciar sesión"
                >
                  <User className="w-5 h-5 text-foreground" />
                </button>
              )}
            </div>
          )}

          {/* Right side icons - mobile only */}
          {!hideIcons && (
            <div className="flex md:hidden items-center gap-4 order-3">
              {/* Shopping bag - mobile */}
              <button
                className="relative z-50 p-2"
                aria-label="Shopping cart"
              >
                <img src="/bag.svg" alt="Carrito" className="w-14 h-14" />
              </button>
            </div>
          )}

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
              className="absolute top-24 left-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hidden md:flex items-start gap-4 font-serif">
                <div className="w-[260px] md:w-[300px] bg-[#9C7B66] text-white p-6">
                  <motion.ul className="flex flex-col gap-1 text-sm tracking-wide overflow-y-auto max-h-[75vh] pr-1">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                      >
                        {link.label === "Arquitectura" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate("/showcase/arquitectura");
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Interiorismo" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate("/showcase/interiorismo");
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Mobiliario" ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePanel((prev) =>
                                prev === "mobiliario" ? null : "mobiliario"
                              )
                            }
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Nosotros" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setActivePanel(null);
                              setIsNosotrosOpen(true);
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Contacto" ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePanel((prev) =>
                                prev === "contacto" ? null : "contacto"
                              )
                            }
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : (link.href.split("/").pop()?.toLowerCase() && comingSoonCategories[link.href.split("/").pop()!.toLowerCase()]) ? (
                          (() => {
                            const csKey = link.href.split("/").pop()!.toLowerCase();
                            return (
                              <button
                                type="button"
                                onClick={() =>
                                  setActivePanel((prev) =>
                                    prev === csKey ? null : csKey
                                  )
                                }
                                className="w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center justify-between hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                              >
                                <span>{link.label}</span>
                                <span className="text-[9px] uppercase tracking-wider text-white/80 bg-white/20 px-1.5 py-0.5 rounded font-sans">
                                  Next Season
                                </span>
                              </button>
                            );
                          })()
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate(link.href);
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:opacity-100 hover:bg-[#EAD0B9] transition-colors rounded-sm"
                          >
                            {link.label}
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <AnimatePresence>
                  {activePanel && (
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={
                        activePanel === "mobiliario"
                          ? "w-[200px] bg-[#9C7B66] text-white py-3 px-4 self-start"
                          : activePanel === "contacto"
                            ? "w-fit bg-[#9C7B66] text-white p-6 font-serif"
                            : activePanel && comingSoonCategories[activePanel]
                              ? "w-[320px] bg-[#9C7B66] text-white p-6 font-serif"
                              : "w-[800px] bg-[#9C7B66] text-white p-6 md:max-lg:bg-transparent md:max-lg:p-0"
                      }
                    >
                      {activePanel === "mobiliario" ? (
                        <>
                          <div className="space-y-1 text-sm">
                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                navigate("/showcase/mobiliario/coleccion");
                              }}
                              className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:bg-[#EAD0B9] transition-colors rounded-sm"
                            >
                              Colección
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                navigate("/showcase/mobiliario/series");
                              }}
                              className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:bg-[#EAD0B9] transition-colors rounded-sm"
                            >
                              Serie
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                navigate("/showcase/mobiliario/piezas");
                              }}
                              className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center hover:bg-[#EAD0B9] transition-colors rounded-sm"
                            >
                              Piezas
                            </button>
                          </div>
                        </>
                      ) : activePanel === "contacto" ? (
                        <>
                          <div className="flex items-start">
                            <div className="w-[320px] max-w-full md:max-lg:w-[250px] font-serif">
                              <div className="text-xs tracking-wide uppercase">Contacto</div>
                              <div className="mt-4 space-y-4 text-sm leading-relaxed">
                                <div className="text-lg font-semibold">Hablemos</div>
                                <p>Simple y directo.</p>
                                <form
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    const message = contactMessage.trim() || defaultContactMessage;
                                    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                                    window.open(url, "_blank", "noopener,noreferrer");
                                  }}
                                  className="space-y-3 w-[300px] max-w-full md:max-lg:w-[230px]"
                                >
                                  <input
                                    type="text"
                                    value={contactMessage}
                                    onChange={(event) => setContactMessage(event.target.value)}
                                    placeholder={defaultContactMessage}
                                    className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white text-left placeholder:text-center placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                                  />
                                  <button
                                    type="submit"
                                    className="w-full rounded-md bg-white text-[#9C7B66] px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/90 transition-colors"
                                  >
                                    Enviar
                                  </button>
                                </form>
                              </div>
                            </div>
                            <div className="ml-8 flex items-center justify-center md:max-lg:ml-5">
                              <img
                                src="/images/contacto/contacto.webp"
                                alt="Foto Contacto"
                                className="w-[190px] h-[190px] object-contain rounded-md mx-auto md:max-lg:w-[200px] md:max-lg:h-[200px]"
                              />
                            </div>
                          </div>
                        </>
                      ) : activePanel && comingSoonCategories[activePanel] ? (
                        (() => {
                          const cat = comingSoonCategories[activePanel];
                          return (
                            <div className="w-[280px] max-w-full font-serif space-y-3">
                              <div className="text-[10px] tracking-[0.25em] uppercase text-white/70 font-sans font-medium">
                                NEXT SEASON • BRUTO ATELIER
                              </div>
                              <div className="text-xl font-semibold tracking-wide">
                                {cat.title}
                              </div>
                              <div className="relative aspect-[4/5] w-full max-w-[220px] rounded-md overflow-hidden border border-white/20 shadow-md my-2">
                                <img
                                  src={cat.bgImage}
                                  alt={cat.title}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>
                              <div className="pt-1 text-[10px] font-sans tracking-widest text-white/60 uppercase">
                                Disponible Próximamente · 2026
                              </div>
                            </div>
                          );
                        })()
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="md:hidden w-[300px] bg-[#9C7B66] text-white p-6 font-serif max-h-[85vh] overflow-y-auto">
                {activePanel === "contacto" || (activePanel && comingSoonCategories[activePanel]) ? (
                  <div>
                    <div className="relative flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setActivePanel(null)}
                        aria-label="Volver"
                        className="absolute left-0 inline-flex items-center p-1.5 -ml-1.5 hover:opacity-80 transition-opacity min-w-[44px] min-h-[44px] justify-center"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="text-sm font-medium tracking-[0.15em] uppercase text-white/90">
                        {activePanel === "contacto" ? "Contacto" : "Next Season"}
                      </div>
                    </div>
                    <div className="mt-5">
                      {activePanel === "contacto" ? (
                        <>
                          <div className="space-y-4 text-sm leading-relaxed">
                            <div className="text-lg font-semibold">Hablemos</div>
                            <p>Simple y directo.</p>
                            <form
                              onSubmit={(event) => {
                                event.preventDefault();
                                const message = contactMessage.trim() || defaultContactMessage;
                                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                                window.open(url, "_blank", "noopener,noreferrer");
                              }}
                              className="space-y-3"
                            >
                              <input
                                type="text"
                                value={contactMessage}
                                onChange={(event) => setContactMessage(event.target.value)}
                                placeholder={defaultContactMessage}
                                className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white text-left placeholder:text-center placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                              />
                              <button
                                type="submit"
                                className="w-full rounded-md bg-white text-[#9C7B66] px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/90 transition-colors"
                              >
                                Enviar
                              </button>
                            </form>
                          </div>
                        </>
                      ) : activePanel && comingSoonCategories[activePanel] ? (
                        (() => {
                          const cat = comingSoonCategories[activePanel];
                          return (
                            <div className="space-y-3 text-sm leading-relaxed font-serif">
                              <div className="text-[11px] tracking-[0.25em] uppercase text-white/75 font-sans font-medium">
                                BRUTO ATELIER
                              </div>
                              <div className="text-2xl font-serif font-medium tracking-wide">{cat.title}</div>
                              <div className="relative aspect-[4/5] w-[210px] max-w-full rounded-md overflow-hidden border border-white/20 shadow-md my-2">
                                <img
                                  src={cat.bgImage}
                                  alt={cat.title}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>
                              <div className="text-[11px] font-sans tracking-[0.15em] text-white/70 uppercase text-left pt-1">
                                Disponible Próximamente · 2026
                              </div>
                            </div>
                          );
                        })()
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <motion.ul className="flex flex-col gap-1 text-sm tracking-wide overflow-visible">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                        className="relative w-full"
                      >
                        {link.label === "Arquitectura" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate("/showcase/arquitectura");
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center transition-colors focus:outline-none active:bg-white/10 rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Interiorismo" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate("/showcase/interiorismo");
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center transition-colors focus:outline-none active:bg-white/10 rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Mobiliario" ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setActivePanel((prev) =>
                                  prev === "mobiliario" ? null : "mobiliario"
                                )
                              }
                              className="w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center justify-between transition-colors focus:outline-none active:bg-white/10 rounded-sm"
                            >
                              <span>{link.label}</span>
                              <span className={`text-xs transition-transform duration-200 ${activePanel === "mobiliario" ? "rotate-90" : ""}`}>
                                ‹
                              </span>
                            </button>
                            <AnimatePresence>
                              {activePanel === "mobiliario" && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  className="overflow-hidden pl-3 border-l border-white/25 ml-1 my-1 space-y-0.5 text-sm"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      navigate("/showcase/mobiliario/coleccion");
                                    }}
                                    className="block w-full text-left px-3 py-2.5 min-h-[44px] flex items-center hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none rounded-sm"
                                  >
                                    Colección
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      navigate("/showcase/mobiliario/series");
                                    }}
                                    className="block w-full text-left px-3 py-2.5 min-h-[44px] flex items-center hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none rounded-sm"
                                  >
                                    Serie
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      navigate("/showcase/mobiliario/piezas");
                                    }}
                                    className="block w-full text-left px-3 py-2.5 min-h-[44px] flex items-center hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none rounded-sm"
                                  >
                                    Piezas
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : link.label === "Nosotros" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setActivePanel(null);
                              setIsNosotrosOpen(true);
                            }}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center transition-colors focus:outline-none active:bg-white/10 rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Contacto" ? (
                          <button
                            type="button"
                            onClick={() => setActivePanel("contacto")}
                            className="block w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center transition-colors focus:outline-none active:bg-white/10 rounded-sm"
                          >
                            {link.label}
                          </button>
                        ) : (link.href.split("/").pop()?.toLowerCase() && comingSoonCategories[link.href.split("/").pop()!.toLowerCase()]) ? (
                          (() => {
                            const csKey = link.href.split("/").pop()!.toLowerCase();
                            return (
                              <button
                                type="button"
                                onClick={() => setActivePanel(csKey)}
                                className="w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center justify-between transition-colors focus:outline-none active:bg-white/10 rounded-sm"
                              >
                                <span>{link.label}</span>
                                <span className="text-[9px] uppercase tracking-wider text-white/80 bg-white/20 px-1.5 py-0.5 rounded font-sans">
                                  Next Season
                                </span>
                              </button>
                            );
                          })()
                        ) : (
                          <a
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2.5 -mx-3 min-h-[44px] flex items-center transition-colors rounded-sm"
                          >
                            {link.label}
                          </a>
                        )}
                      </motion.li>
                    ))}

                    {/* Mobile User Account / 10% Off item */}
                    {user ? (
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-4 mt-2 border-t border-white/20"
                      >
                        <div className="px-1 text-xs text-white/90 font-medium">
                          Hola, {user.firstName || "Socio"}
                        </div>
                        <div className="text-[10px] text-white/70 tracking-wider font-sans uppercase mb-2">
                          ✓ 10% Descuento activo
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="block text-left py-1 text-xs text-white/75 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Cerrar sesión
                        </button>
                      </motion.li>
                    ) : (
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-4 mt-2 border-t border-white/20"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            openAuthModal();
                          }}
                          className="w-full text-left px-3 py-2.5 -mx-3 min-h-[44px] flex items-center justify-between hover:bg-[#EAD0B9] transition-colors rounded-sm text-white font-medium"
                        >
                          <span>Iniciar Sesión / Registro</span>
                          <span className="text-[9px] uppercase tracking-wider text-white/90 bg-white/20 px-1.5 py-0.5 rounded font-sans">
                            10% OFF
                          </span>
                        </button>
                      </motion.li>
                    )}
                  </motion.ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NosotrosModal isOpen={isNosotrosOpen} onClose={() => setIsNosotrosOpen(false)} />

      <NewsletterModal />
    </>
  );
};

export default Navigation;
