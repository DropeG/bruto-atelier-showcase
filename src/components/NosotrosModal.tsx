import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { blurPlaceholders } from "../lib/blur-placeholders";

interface NosotrosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NosotrosModal: React.FC<NosotrosModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Pre-warm the photo into the browser cache during idle cycles
  useEffect(() => {
    if (typeof window === "undefined") return;

    const warmup = () => {
      const img = new Image();
      img.src = "/images/nosotros/nosotros.webp";
      img.onload = () => setIsImageLoaded(true);
    };

    if ("requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(warmup, { timeout: 2500 });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
      };
    } else {
      const timer = setTimeout(warmup, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Modal open/close lifecycle, scroll locking, and Safari focus suppression
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent body and html background scrolling
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        // Suppress accidental auto-focus / blue ring in WebKit/Safari
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    } else {
      if (dialog.open) {
        dialog.classList.add("is-closing");
        setTimeout(() => {
          dialog.close();
          dialog.classList.remove("is-closing");
          // Restore background scrolling
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
        }, 400);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <>
      <style>{`
        dialog[open].nosotros-dialog {
          animation: modal-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        dialog.nosotros-dialog.is-closing {
          animation: modal-exit 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        dialog.nosotros-dialog::backdrop {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        dialog.nosotros-dialog[open]::backdrop {
          opacity: 1;
        }
        dialog.nosotros-dialog.is-closing::backdrop {
          opacity: 0;
        }

        @keyframes modal-enter {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modal-exit {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.97); }
        }

        /* Suppress WebKit/Safari blue focus ring & tap highlight */
        .nosotros-dialog button,
        .nosotros-dialog button:focus,
        .nosotros-dialog button:focus-visible,
        .nosotros-dialog button:active {
          outline: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        .text-balance {
          text-wrap: balance;
        }
      `}</style>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onCancel={(e) => {
          e.preventDefault();
          handleClose();
        }}
        className="nosotros-dialog p-0 bg-transparent rounded-none outline-none m-auto overflow-hidden backdrop:bg-black/65 w-full max-w-[88vw] sm:max-w-lg md:max-w-4xl lg:max-w-5xl max-h-[85vh] md:max-h-[88vh]"
      >
        <div
          className="bg-[#9C7B66] text-[#F7F5F0] overflow-y-auto max-h-[85vh] md:max-h-none flex flex-col md:flex-row shadow-2xl relative border border-white/10 rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            tabIndex={-1}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 text-[#F7F5F0]/80 md:hover:text-[#F7F5F0] transition-colors p-2 bg-black/30 backdrop-blur-md rounded-full active:scale-95 shadow-md focus:outline-none focus:ring-0 focus-visible:outline-none select-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
          </button>

          {/* Left Side: Photo */}
          <div 
            className="w-full aspect-[4/3] sm:aspect-square md:aspect-auto md:w-1/2 relative overflow-hidden bg-[#8B6B58] shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${blurPlaceholders.nosotrosModal})` }}
          >
            <img
              src="/images/nosotros/nosotros.webp"
              alt="Mladen Marinovic - BRUTO Atelier"
              onLoad={() => setIsImageLoaded(true)}
              loading="eager"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-[11px] sm:text-xs font-serif italic text-white/90 pointer-events-none">
              Mladen Marinovic' — Creative Director
            </div>
          </div>

          {/* Right Side: Editorial Content */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-center relative font-serif">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#F7F5F0]/60 font-sans block mb-2 sm:mb-3">
                Manifiesto & Visión
              </span>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide mb-4 sm:mb-6 text-balance text-[#F7F5F0]">
                BRUTO Atelier
              </h2>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-light leading-relaxed text-[#F7F5F0]/90 text-justify">
                <p>
                  Nuestra marca resuelve diseño en un amplio espectro. Creamos visión, resolvemos espacio y sus componentes: El habitar, la presencia.
                </p>
                <p>
                  Creemos en lo que se diferencia en silencio y trasciende en el tiempo, lo que perdura con elegancia y desarrolla carácter. Diseñamos singularidad, fabricando de manera local e internacional con materiales y artesanos seleccionados.
                </p>
                <p className="italic">
                  Buscamos ser nosotros, generar una experiencia brutalmente delicada que se entiende al conocernos, usarnos, vivirnos.
                </p>
                <p className="font-medium pt-1 text-xs sm:text-base">Pruébanos.</p>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NosotrosModal;
