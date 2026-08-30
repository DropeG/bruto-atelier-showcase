import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export interface NewsletterModalProps {
  openModal?: boolean;
  onClose?: () => void;
  initialMode?: "login" | "register";
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ 
  openModal, 
  onClose,
  initialMode = "register" 
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, login, signup, isLoading, error: authError, isAuthModalOpen, closeAuthModal } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Touch swipe handling for mobile bottom sheet
  const touchStartY = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);

  // Sync mode if initialMode changes
  useEffect(() => {
    if (initialMode) {
      setIsLoginMode(initialMode === "login");
    }
  }, [initialMode]);

  // Core modal logic using native HTMLDialogElement
  useEffect(() => {
    const isDemoMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demoMode") === "true";
    if (isDemoMode) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const shouldOpen = openModal !== undefined ? openModal : isAuthModalOpen;

    if (shouldOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent body background scrolling when modal is active
        document.body.style.overflow = "hidden";
      }
    } else {
      // Check if modal has been shown before in localStorage and user is not logged in
      const hasShown = localStorage.getItem("newsletterModalShown");
      if (!hasShown && !user) {
        const timer = setTimeout(() => {
          if (!dialog.open && !user) {
            dialog.showModal();
            document.body.style.overflow = "hidden";
            localStorage.setItem("newsletterModalShown", "true");
          }
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [openModal, isAuthModalOpen, user]);

  const handleClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    // Add closing class for exit animation before native close
    dialog.classList.add("is-closing");
    
    setTimeout(() => {
      if (dialog.open) dialog.close();
      dialog.classList.remove("is-closing");
      document.body.style.overflow = "";
      
      // Reset states
      setIsSuccess(false);
      setFormError("");
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      closeAuthModal();
      if (onClose) onClose();
    }, 380);
  }, [onClose, closeAuthModal]);

  // Close when clicking directly on the backdrop (the dialog element itself)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  // Swipe-down touch handlers for mobile drawer
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchCurrentY.current - touchStartY.current;
    
    // Only allow downward drag
    if (deltaY > 0 && containerRef.current && window.innerWidth < 768) {
      containerRef.current.style.transform = `translateY(${Math.min(deltaY, 150)}px)`;
      containerRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current !== null && touchCurrentY.current !== null) {
      const deltaY = touchCurrentY.current - touchStartY.current;
      if (deltaY > 80 && window.innerWidth < 768) {
        if (containerRef.current) {
          containerRef.current.style.transform = "";
          containerRef.current.style.transition = "";
        }
        handleClose();
      } else if (containerRef.current) {
        containerRef.current.style.transform = "";
        containerRef.current.style.transition = "transform 0.25s ease-out";
      }
    }
    touchStartY.current = null;
    touchCurrentY.current = null;
  };

  const validateEmail = (emailStr: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr.trim());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!validateEmail(email)) {
      setFormError("Ingresa un correo electrónico válido.");
      return;
    }

    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      if (isLoginMode) {
        await login(email.trim(), password);
      } else {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "Socio";
        const lastName = nameParts.slice(1).join(" ") || "Bruto";
        await signup(firstName, lastName, email.trim(), password);
      }
      
      // If auth succeeded, show confirmation screen
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al procesar la solicitud.";
      setFormError(message);
    }
  };

  const displayedError = formError || authError;

  return (
    <>
      <style>{`
        /* Impeccable Motion: Ease out curves with smooth transitions */
        dialog.circulo-dialog {
          padding: 0;
          background: transparent;
          border: none;
          outline: none;
          overflow: visible;
          max-width: 90vw;
          margin: auto;
        }

        dialog.circulo-dialog::backdrop {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        dialog.circulo-dialog[open]::backdrop {
          opacity: 1;
        }

        dialog.circulo-dialog.is-closing::backdrop {
          opacity: 0;
        }

        /* Desktop dialog animations */
        @media (min-width: 768px) {
          dialog.circulo-dialog[open] {
            animation: modal-enter 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          dialog.circulo-dialog.is-closing {
            animation: modal-exit 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }

        @keyframes modal-enter {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modal-exit {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(16px) scale(0.98); }
        }

        /* Mobile Bottom Sheet Drawer */
        @media (max-width: 767px) {
          dialog.circulo-dialog {
            margin: 0 !important;
            margin-top: auto !important;
            margin-bottom: 0 !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            max-height: 90dvh !important;
            border-radius: 1.5rem 1.5rem 0 0 !important;
          }

          dialog.circulo-dialog[open] {
            animation: sheet-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          dialog.circulo-dialog.is-closing {
            animation: sheet-exit 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }

        @keyframes sheet-enter {
          from { transform: translateY(100%); opacity: 0.8; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes sheet-exit {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }

        /* Autofill luxury styling fix for Chrome / Safari */
        .circulo-dialog input:-webkit-autofill,
        .circulo-dialog input:-webkit-autofill:hover, 
        .circulo-dialog input:-webkit-autofill:focus,
        .circulo-dialog input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 40px #9C7B66 inset !important;
          -webkit-text-fill-color: #F7F5F0 !important;
          caret-color: #F7F5F0 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Native HTML5 Dialog */}
      <dialog 
        ref={dialogRef}
        onClick={handleBackdropClick}
        onCancel={(e) => {
          e.preventDefault();
          handleClose();
        }}
        className="circulo-dialog w-full md:max-w-4xl"
      >
        <div 
          ref={containerRef}
          className="bg-[#9C7B66] text-[#F7F5F0] overflow-hidden flex flex-col md:flex-row shadow-2xl relative rounded-t-3xl md:rounded-none max-h-[90dvh] md:max-h-none overflow-y-auto md:overflow-visible overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Drag Handle (Swipe down to dismiss) */}
          <div 
            className="md:hidden pt-3 pb-1 w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-1 bg-[#F7F5F0]/30 rounded-full mx-auto" />
          </div>

          {/* Close button with accessible >=44px touch target */}
          <button
            onClick={handleClose}
            disabled={isSuccess}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-30 text-[#F7F5F0]/80 hover:text-[#F7F5F0] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/10 active:scale-95 disabled:opacity-0"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>

          {/* Desktop Editorial Image Column (Hidden on mobile for 100% thumb-zone focus) */}
          <div className="hidden md:block w-1/2 min-h-[540px] relative overflow-hidden bg-[#8B6B58]">
            <img
              src="/images/newsLetterModal/newsLetter.webp"
              alt="Bruto Atelier Círculo Privado"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-95 contrast-[1.03]"
              loading="lazy"
            />
          </div>

          {/* Form Side / Thumb Zone Area */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            
            {/* Success State Overlay */}
            <div 
              className={`absolute inset-0 bg-[#9C7B66] flex flex-col items-center justify-center transition-all duration-500 z-20 p-8 text-center ${
                isSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F7F5F0]/10 flex items-center justify-center mb-6 border border-[#F7F5F0]/20">
                <Check className="w-8 h-8 text-[#F7F5F0]" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-light text-center mb-3 tracking-[-0.02em] font-serif">
                {isLoginMode ? "¡Bienvenido de vuelta!" : "¡Bienvenido al Círculo Privado!"}
              </h2>
              
              <p className="text-sm font-light text-[#F7F5F0]/90 leading-relaxed max-w-[320px] mx-auto mb-6">
                {isLoginMode 
                  ? "Has iniciado sesión correctamente. Tus beneficios y tarifas preferenciales están activos."
                  : "Tu 10% de descuento ha sido activado automáticamente y se aplicará en tu carrito de compras."}
              </p>

              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#F7F5F0]/80 font-sans border border-[#F7F5F0]/30 rounded-full px-4 py-1.5 bg-black/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Beneficio Socio Bruto Activo</span>
              </div>
            </div>

            {/* Main Interactive Form Area */}
            <div className={`transition-all duration-500 flex flex-col justify-center ${isSuccess ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
              
              {/* Eyebrow */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#F7F5F0]/75 font-sans font-medium">
                  CÍRCULO PRIVADO • BRUTO ATELIER
                </span>
              </div>

              {/* Segmented Tab Switcher (Min 44px ergonomics) */}
              <div className="bg-black/20 p-1 rounded-full flex relative items-center mb-6 min-h-[44px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(false);
                    setFormError("");
                  }}
                  className={`w-1/2 min-h-[38px] flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider rounded-full transition-all duration-300 font-medium ${
                    !isLoginMode 
                      ? "bg-[#EAD0B9] text-[#3D261C] font-semibold shadow-sm" 
                      : "text-[#F7F5F0]/80 hover:text-[#F7F5F0]"
                  }`}
                >
                  <span>Unirme</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-tight ${
                    !isLoginMode ? "bg-[#9C7B66] text-[#F7F5F0]" : "bg-white/20 text-[#F7F5F0]"
                  }`}>
                    10% OFF
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(true);
                    setFormError("");
                  }}
                  className={`w-1/2 min-h-[38px] flex items-center justify-center text-xs uppercase tracking-wider rounded-full transition-all duration-300 font-medium ${
                    isLoginMode 
                      ? "bg-[#EAD0B9] text-[#3D261C] font-semibold shadow-sm" 
                      : "text-[#F7F5F0]/80 hover:text-[#F7F5F0]"
                  }`}
                >
                  <span>Iniciar Sesión</span>
                </button>
              </div>

              {/* Dynamic Header */}
              <h2 className="text-2xl sm:text-3xl font-light mb-1.5 tracking-[-0.02em] font-serif leading-tight">
                {isLoginMode ? "Acceso de Socios" : "10% en tu primera compra"}
              </h2>
              
              <p className="mb-6 text-xs sm:text-sm font-light text-[#F7F5F0]/80 leading-normal">
                {isLoginMode 
                  ? "Inicia sesión para acceder a tus tarifas preferenciales y pedidos." 
                  : "Únete al Círculo Privado para disfrutar de asesoría personalizada y descuentos exclusivos."}
              </p>

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div className="relative">
                    <label className="block text-[11px] uppercase tracking-wider text-[#F7F5F0]/70 mb-1 font-sans">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Matías Edwards"
                      required={!isLoginMode}
                      disabled={isLoading}
                      className="w-full bg-white/5 md:bg-transparent border-b border-[#F7F5F0]/40 px-3 py-3 md:py-2 text-base md:text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/60 focus:outline-none focus:border-[#F7F5F0] focus:bg-white/10 transition-colors disabled:opacity-50 rounded-t-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <label className="block text-[11px] uppercase tracking-wider text-[#F7F5F0]/70 mb-1 font-sans">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@bruto-atelier.com"
                    required
                    disabled={isLoading}
                    className="w-full bg-white/5 md:bg-transparent border-b border-[#F7F5F0]/40 px-3 py-3 md:py-2 text-base md:text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/60 focus:outline-none focus:border-[#F7F5F0] focus:bg-white/10 transition-colors disabled:opacity-50 rounded-t-sm"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[11px] uppercase tracking-wider text-[#F7F5F0]/70 mb-1 font-sans">
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete={isLoginMode ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      disabled={isLoading}
                      className="w-full bg-white/5 md:bg-transparent border-b border-[#F7F5F0]/40 px-3 py-3 md:py-2 pr-12 text-base md:text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/60 focus:outline-none focus:border-[#F7F5F0] focus:bg-white/10 transition-colors disabled:opacity-50 rounded-t-sm"
                    />
                    
                    {/* Password Visibility Toggle (44px target) */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#F7F5F0]/70 hover:text-[#F7F5F0] transition-colors focus:outline-none"
                      aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password recovery link for login mode */}
                {isLoginMode && (
                  <div className="flex justify-end pt-0.5">
                    <a
                      href="https://bruto-atelier-spzrd2zq.myshopify.com/account/login#recover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#F7F5F0]/80 hover:text-[#F7F5F0] underline underline-offset-4 transition-colors font-light py-1 inline-flex items-center min-h-[32px]"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                )}

                {/* Error feedback badge */}
                {displayedError && (
                  <div className="py-1">
                    <p className="text-xs text-red-100 font-light tracking-wide bg-red-950/40 border border-red-400/30 px-3 py-2 rounded">
                      {displayedError}
                    </p>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#EAD0B9] text-[#3D261C] py-3.5 mt-2 min-h-[48px] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#dfc4ac] hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] rounded-sm flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#3D261C]/30 border-t-[#3D261C] rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : isLoginMode ? (
                    "Iniciar Sesión"
                  ) : (
                    "Unirme y Activar 10% OFF"
                  )}
                </button>
              </form>

              {/* Discreet Footer Security Notice */}
              <div className="mt-5 pt-3 border-t border-[#F7F5F0]/15 flex items-center justify-center text-[11px] text-[#F7F5F0]/70 gap-1.5 font-light">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F7F5F0]/60" />
                <span>Autenticación segura y cifrada vía Shopify Storefront</span>
              </div>

            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NewsletterModal;
