import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";

const navLinks = [
  { label: "Arquitectura", href: "#arquitectura" },
  { label: "Interiorismo", href: "#interiorismo" },
  { label: "Mobiliario", href: "#mobiliario" },
  { label: "Iluminación", href: "#iluminacion" },
  { label: "Esenciales", href: "#esenciales" },
  { label: "Joyeria", href: "#joyeria" },
  { label: "Vestuario", href: "#vestuario" },
  { label: "Accesorios", href: "#accesorios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" }
];

type NavigationProps = {
  position?: "fixed" | "absolute";
};

const Navigation = ({ position = "fixed" }: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [activePanel, setActivePanel] = useState<"mobiliario" | "nosotros" | "contacto" | null>(null);
  const [contactMessage, setContactMessage] = useState(
    "Qué tal, me resuelven una duda?"
  );
  const navigate = useNavigate();
  const whatsappNumber = "56949569887";

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
              className="absolute top-24 left-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hidden md:flex items-start">
                <div className="w-[260px] md:w-[300px] min-h-[40vh] bg-[#9C7B66] text-white p-6">
                  <motion.ul className="flex flex-col gap-3 text-sm tracking-wide">
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
                              navigate("/categoria/cabina/bespoke/10");
                            }}
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Interiorismo" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              navigate("/categoria/morar/bespoke/1");
                            }}
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
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
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Nosotros" ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePanel((prev) =>
                                prev === "nosotros" ? null : "nosotros"
                              )
                            }
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
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
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <a
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </a>
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
                          ? "w-[200px] bg-[#9C7B66] text-white py-3 px-4 border-l border-white/20 self-start"
                          : activePanel === "contacto"
                            ? "w-[800px] bg-[#9C7B66] text-white p-6 border-l border-white/20"
                            : "w-[800px] bg-[#9C7B66] text-white p-6 border-l border-white/20"
                      }
                    >
                      {activePanel === "mobiliario" ? (
                        <>
                          <div className="space-y-1 text-sm">
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="block w-full text-left px-2 py-1.5 -mx-2 hover:bg-[#EAD0B9] transition-colors"
                            >
                              Colección
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="block w-full text-left px-2 py-1.5 -mx-2 hover:bg-[#EAD0B9] transition-colors"
                            >
                              Serie
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="block w-full text-left px-2 py-1.5 -mx-2 hover:bg-[#EAD0B9] transition-colors"
                            >
                              Pieza
                            </button>
                          </div>
                        </>
                      ) : activePanel === "nosotros" ? (
                        <>
                          <div className="flex">
                            <div className="w-[440px]">
                              <div className="text-xs tracking-wide uppercase">Nosotros</div>
                              <div className="mt-2 flex gap-4">
                                <div className="space-y-2 text-sm leading-tight flex-1 pr-2 text-justify">
                                  <div className="text-lg font-semibold">BRUTO ATELIER</div>
                                  <p>
                                    Nuestra marca se enfoca en la solucion de encargos de diseno de un amplio
                                    espectro. Creamos vision, resolvemos espacio y sus componentes: el habitar
                                    completo.
                                  </p>
                                  <p>
                                    Creemos en lo que se diferencia en silencio y trasciende en el tiempo, lo que
                                    perdura con elegancia y desarrolla caracter. Disenamos singularidad, fabricando
                                    de manera local con materiales y artesanos seleccionados.
                                  </p>
                                  <p>
                                    Nuestra visión busca entregar una experiencia al trabajar con el
                                    Atelier, que se entiende al conocerla.
                                  </p>
                                  <p>Pruebanos.</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center ml-8">
                              <img
                                src="/images/nosotros/nosotros.webp"
                                alt="Foto Nosotros"
                                className="w-[360px] aspect-square object-cover rounded-md shadow"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex">
                            <div className="w-[440px]">
                              <div className="text-xs tracking-wide uppercase">Contacto</div>
                              <div className="mt-4 space-y-4 text-sm leading-relaxed">
                                <div className="text-lg font-semibold">Hablemos</div>
                                <p>Simple y directo.</p>
                                <form
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    const message = contactMessage.trim();
                                    if (!message) {
                                      return;
                                    }
                                    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                                    window.open(url, "_blank", "noopener,noreferrer");
                                  }}
                                  className="space-y-3"
                                >
                                  <input
                                    type="text"
                                    value={contactMessage}
                                    onChange={(event) => setContactMessage(event.target.value)}
                                    placeholder="Escribe tu mensaje"
                                    className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                                  />
                                  <button
                                    type="submit"
                                    className="w-full rounded-md bg-white text-[#9C7B66] px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/90 transition-colors"
                                  >
                                    Enviar por WhatsApp
                                  </button>
                                </form>
                              </div>
                            </div>
                            <div className="flex items-center justify-center ml-8">
                              <img
                                src="/images/contacto/contacto.webp"
                                alt="Foto Contacto"
                                className="w-[360px] aspect-square object-cover rounded-md shadow"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="md:hidden w-[300px] bg-[#9C7B66] text-white p-6">
                {activePanel ? (
                  <div>
                    <div className="relative flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setActivePanel(null)}
                        aria-label="Volver"
                        className="absolute left-0 inline-flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="text-xs tracking-wide uppercase">
                        {activePanel === "mobiliario"
                          ? ""
                          : activePanel === "nosotros"
                            ? "Nosotros"
                            : "Contacto"}
                      </div>
                    </div>
                    <div className="mt-5">
                      {activePanel === "mobiliario" ? (
                        <>
                          <div className="space-y-1 text-sm leading-relaxed">
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="block w-full text-left px-2 py-1.5 -mx-2 hover:bg-[#EAD0B9] transition-colors"
                            >
                              Colección
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="block w-full text-left px-2 py-1.5 -mx-2 hover:bg-[#EAD0B9] transition-colors"
                            >
                              Serie
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsMenuOpen(false)}
                              className="block w-full text-left px-2 py-1.5 -mx-2 hover:bg-[#EAD0B9] transition-colors"
                            >
                              Pieza
                            </button>
                          </div>
                        </>
                      ) : activePanel === "nosotros" ? (
                        <>
                          <div className="space-y-5 text-sm leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
                            <div className="text-lg font-semibold">BRUTO ATELIER</div>
                            <p>
                              Nuestra marca se enfoca en la solucion de encargos de diseno de un amplio
                              espectro. Creamos vision, resolvemos espacio y sus componentes: el habitar
                              completo.
                            </p>
                            <p>
                              Creemos en lo que se diferencia en silencio y trasciende en el tiempo, lo que
                              perdura con elegancia y desarrolla caracter. Disenamos singularidad, fabricando
                              de manera local con materiales y artesanos seleccionados.
                            </p>
                            <p>
                              Nuestra vision busca entregar una experiencia, que se entiende al conocerla.
                            </p>
                            <p>Pruebanos.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-4 text-sm leading-relaxed">
                            <div className="text-lg font-semibold">Hablemos</div>
                            <p>Simple y directo.</p>
                            <form
                              onSubmit={(event) => {
                                event.preventDefault();
                                const message = contactMessage.trim();
                                if (!message) {
                                  return;
                                }
                                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                                window.open(url, "_blank", "noopener,noreferrer");
                              }}
                              className="space-y-3"
                            >
                              <input
                                type="text"
                                value={contactMessage}
                                onChange={(event) => setContactMessage(event.target.value)}
                                placeholder="Escribe tu mensaje"
                                className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                              />
                              <button
                                type="submit"
                                className="w-full rounded-md bg-white text-[#9C7B66] px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/90 transition-colors"
                              >
                                Enviar por WhatsApp
                              </button>
                            </form>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.ul className="flex flex-col gap-3 text-sm tracking-wide">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                      >
                        {link.label === "Mobiliario" ? (
                          <button
                            type="button"
                            onClick={() => setActivePanel("mobiliario")}
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Nosotros" ? (
                          <button
                            type="button"
                            onClick={() => setActivePanel("nosotros")}
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : link.label === "Contacto" ? (
                          <button
                            type="button"
                            onClick={() => setActivePanel("contacto")}
                            className="block w-full text-left px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <a
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-2 py-1 -mx-2 hover:opacity-100 hover:bg-[#EAD0B9] transition-colors"
                          >
                            {link.label}
                          </a>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
