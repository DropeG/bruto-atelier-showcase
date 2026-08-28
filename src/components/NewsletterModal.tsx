import React, { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NewsletterModalProps {
  openModal?: boolean;
  onClose?: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ openModal, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { user, login, signup, isLoading, error: authError } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Core modal logic using native HTMLDialogElement
  useEffect(() => {
    const isDemoMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demoMode") === "true";
    if (isDemoMode) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openModal) {
      if (!dialog.open) dialog.showModal();
    } else {
      // Check if modal has been shown before in localStorage and user is not logged in
      const hasShown = localStorage.getItem("newsletterModalShown");
      if (!hasShown && !user) {
        const timer = setTimeout(() => {
          if (!dialog.open && !user) {
            dialog.showModal();
            localStorage.setItem("newsletterModalShown", "true");
          }
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [openModal, user]);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    // Add a closing class for exit animation before actual close
    dialog.classList.add("is-closing");
    
    setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
      // Reset states
      setIsSuccess(false);
      setFormError("");
      setName("");
      setEmail("");
      setPassword("");
      if (onClose) onClose();
    }, 400); // Wait for the ease-out-quart animation
  };

  // Close when clicking directly on the backdrop (the dialog element itself)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const validateEmail = (emailStr: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
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
        await login(email, password);
      } else {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "Socio";
        const lastName = nameParts.slice(1).join(" ") || "Bruto";
        await signup(firstName, lastName, email, password);
      }
      
      // If auth did not throw, show success
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al procesar la solicitud.";
      setFormError(message);
    }
  };

  const displayedError = formError || authError;

  return (
    <>
      <style>{`
        /* Impeccable Motion: Ease out with exponential curves. No bounce. */
        dialog[open] {
          animation: modal-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        dialog.is-closing {
          animation: modal-exit 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        dialog[open]::backdrop {
          opacity: 1;
        }
        dialog.is-closing::backdrop {
          opacity: 0;
        }
        
        @keyframes modal-enter {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modal-exit {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(16px) scale(0.98); }
        }

        /* Typography & Rhythm */
        .text-balance {
          text-wrap: balance;
        }

        /* Autofill luxury styling fix for Chrome / Safari */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 40px #9C7B66 inset !important;
          -webkit-text-fill-color: #F7F5F0 !important;
          caret-color: #F7F5F0 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Native HTML5 Dialog automatically escapes stacking contexts */}
      <dialog 
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="p-0 bg-transparent rounded-none outline-none m-auto overflow-visible backdrop:bg-black/60 w-full max-w-[90vw] md:max-w-4xl"
      >
        <div 
          className="bg-[#9C7B66] text-[#F7F5F0] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={isSuccess}
            className="absolute top-4 right-4 z-20 text-[#F7F5F0]/80 md:hover:text-[#F7F5F0] transition-colors p-2 disabled:opacity-0 active:scale-95"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Image side */}
          <div className="w-full aspect-[4/3] md:w-1/2 md:aspect-auto md:min-h-[520px] relative overflow-hidden bg-[#8B6B58]">
            <img
              src="/images/newsLetterModal/newsLetter.webp"
              alt="Bruto Atelier Club"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
            />
          </div>

          {/* Form side - Committed Color Strategy (#9C7B66) */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            
            {/* Success State */}
            <div className={`absolute inset-0 bg-[#9C7B66] flex flex-col items-center justify-center transition-all duration-700 z-10 p-8 ${isSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <Check className="w-12 h-12 mb-6 text-[#F7F5F0]" strokeWidth={1.5} />
              <h2 className="text-2xl md:text-3xl font-light text-center mb-3 tracking-[-0.02em] text-balance">
                {isLoginMode ? "¡Sesión iniciada!" : "¡Bienvenido a Bruto Atelier!"}
              </h2>
              <p className="text-center text-sm font-light text-[#F7F5F0]/80 leading-relaxed max-w-[280px]">
                Tu beneficio del 10% de descuento ha sido activado automáticamente en tu carrito.
              </p>
            </div>

            {/* Form State */}
            <div className={`transition-all duration-700 flex flex-col justify-center ${isSuccess ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
              <div className="mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#F7F5F0]/70 font-sans font-medium">
                  BRUTO ATELIER • SOCIO PRIVADO
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-light mb-2 tracking-[-0.02em] text-balance font-serif">
                {isLoginMode ? "Acceso de Socios" : "10% en tu primera compra"}
              </h2>
              <p className="mb-6 text-xs md:text-sm font-light text-[#F7F5F0]/80 tracking-wide">
                {isLoginMode 
                  ? "Inicia sesión para disfrutar tu tarifa preferencial." 
                  : "Crea tu cuenta y accede a descuentos exclusivos en mobiliario."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLoginMode && (
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      required={!isLoginMode}
                      disabled={isLoading}
                      className="w-full bg-transparent border-b border-[#F7F5F0]/30 py-2.5 text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/40 focus:outline-none focus:border-[#F7F5F0]/80 transition-colors disabled:opacity-50"
                    />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico (ej: usuario@gmail.com)"
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent border-b border-[#F7F5F0]/30 py-2.5 text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/40 focus:outline-none focus:border-[#F7F5F0]/80 transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent border-b border-[#F7F5F0]/30 py-2.5 text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/40 focus:outline-none focus:border-[#F7F5F0]/80 transition-colors disabled:opacity-50"
                  />
                </div>

                {displayedError && (
                  <div className="py-1">
                    <p className="text-xs text-red-200 font-light tracking-wide bg-red-900/30 px-3 py-1.5 rounded">
                      {displayedError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#F7F5F0] text-[#3D261C] py-3.5 mt-2 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isLoading 
                    ? "Conectando..." 
                    : isLoginMode 
                      ? "Iniciar Sesión" 
                      : "Obtener 10% y Registrarme"}
                </button>
              </form>

              {/* Mode switch toggle */}
              <div className="mt-6 pt-4 border-t border-[#F7F5F0]/15 flex items-center justify-between text-xs text-[#F7F5F0]/70">
                <span>
                  {isLoginMode ? "¿No tienes cuenta?" : "¿Ya eres miembro?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setFormError("");
                  }}
                  className="text-[#F7F5F0] underline underline-offset-4 hover:text-white transition-colors font-medium ml-2"
                >
                  {isLoginMode ? "Crear cuenta (10% OFF)" : "Iniciar Sesión"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NewsletterModal;
