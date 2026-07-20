import React, { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";

interface NewsletterModalProps {
  openModal?: boolean;
  onClose?: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ openModal, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [emailError, setEmailError] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core modal logic using native HTMLDialogElement
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openModal) {
      if (!dialog.open) dialog.showModal();
    } else {
      // Check if modal has been shown before in localStorage
      const hasShown = localStorage.getItem("newsletterModalShown");
      if (!hasShown) {
        const timer = setTimeout(() => {
          if (!dialog.open) {
            dialog.showModal();
            localStorage.setItem("newsletterModalShown", "true");
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [openModal]);

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
      setEmailError("");
      setAlreadyRegistered(false);
      setIsSubmitting(false);
      if (onClose) onClose();
    }, 400); // Wait for the ease-out-quart animation
  };

  // Close when clicking directly on the backdrop (the dialog element itself)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setAlreadyRegistered(false);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!validateEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido.");
      setIsSubmitting(false);
      return;
    }

    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails") || "[]");
    if (registeredEmails.includes(email.toLowerCase())) {
      setAlreadyRegistered(true);
      setIsSubmitting(false);
      return;
    }

    const formUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdCSWPFUb-wv-ImBUdXt-3ZlyCxQQrgNMrawXlriogwFlcWNw/formResponse";

    const submitData = new URLSearchParams();
    submitData.append("entry.1758925023", name);
    submitData.append("entry.411074703", email);

    try {
      fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: submitData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
        }
      });

      registeredEmails.push(email.toLowerCase());
      localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
      
      setIsSuccess(true);
      
      setTimeout(() => {
        handleClose();
      }, 2500);
      
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setIsSubmitting(false);
    }
  };

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
      `}</style>

      {/* Native HTML5 Dialog automatically escapes stacking contexts (z-index bugs) */}
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
          <div className="w-full aspect-[4/3] md:w-1/2 md:aspect-auto md:min-h-[500px] relative overflow-hidden bg-[#8B6B58]">
            <img
              src="/images/newsLetterModal/newsLetter.webp"
              alt="Promoción Bruto Atelier"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
            />
          </div>

          {/* Form side - Committed Color Strategy (#9C7B66) */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center relative overflow-hidden">
            
            {/* Success State */}
            <div className={`absolute inset-0 bg-[#9C7B66] flex flex-col items-center justify-center transition-all duration-700 z-10 p-8 ${isSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <Check className="w-10 h-10 mb-6 text-[#F7F5F0]/90" strokeWidth={1} />
              <h2 className="text-3xl font-light text-center mb-3 tracking-[-0.02em] text-balance">
                ¡Gracias por suscribirte!
              </h2>
              <p className="text-center text-sm font-light text-[#F7F5F0]/70 leading-relaxed max-w-[280px]">
                Revisa tu bandeja de entrada para disfrutar tu beneficio exclusivo.
              </p>
            </div>

            {/* Form State */}
            <div className={`transition-all duration-700 flex flex-col justify-center ${isSuccess ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
              <h2 className="text-3xl md:text-4xl font-light mb-3 tracking-[-0.02em] text-balance">
                ¡10% en tu primera compra!
              </h2>
              <p className="mb-10 text-sm font-light text-[#F7F5F0]/80 tracking-wide">
                Únete a nuestra comunidad.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-b border-[#F7F5F0]/30 py-3 text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/40 focus:outline-none focus:border-[#F7F5F0]/80 transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    required
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border-b py-3 text-sm font-light text-[#F7F5F0] placeholder:text-[#F7F5F0]/40 focus:outline-none transition-colors disabled:opacity-50 ${
                      emailError || alreadyRegistered 
                        ? 'border-red-400/60 focus:border-red-400' 
                        : 'border-[#F7F5F0]/30 focus:border-[#F7F5F0]/80'
                    }`}
                  />
                  <div className={`overflow-hidden transition-all duration-400 ease-out ${emailError || alreadyRegistered ? 'max-h-12 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                    <p className="text-xs text-red-300/90 font-light tracking-wide">
                      {emailError || (alreadyRegistered && "Este correo ya se encuentra registrado.")}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F7F5F0] text-[#3D261C] py-4 mt-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Suscribirme"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NewsletterModal;
