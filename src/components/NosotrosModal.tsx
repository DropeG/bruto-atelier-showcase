import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface NosotrosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NosotrosModal: React.FC<NosotrosModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) {
        dialog.classList.add("is-closing");
        setTimeout(() => {
          dialog.close();
          dialog.classList.remove("is-closing");
        }, 400);
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (!isOpen && !dialogRef.current?.open) return null;

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

        .text-balance {
          text-wrap: balance;
        }
      `}</style>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="nosotros-dialog p-0 bg-transparent rounded-none outline-none m-auto overflow-hidden backdrop:bg-black/65 w-full max-w-[88vw] sm:max-w-lg md:max-w-4xl lg:max-w-5xl max-h-[85vh] md:max-h-[88vh]"
      >
        <div
          className="bg-[#9C7B66] text-[#F7F5F0] overflow-y-auto max-h-[85vh] md:max-h-none flex flex-col md:flex-row shadow-2xl relative border border-white/10 rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 text-[#F7F5F0]/80 md:hover:text-[#F7F5F0] transition-colors p-2 bg-black/30 backdrop-blur-md rounded-full active:scale-95 shadow-md"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
          </button>

          {/* Left Side: Photo */}
          <div className="w-full aspect-[4/3] sm:aspect-square md:aspect-auto md:w-1/2 relative overflow-hidden bg-[#8B6B58] shrink-0">
            <img
              src="/images/nosotros/nosotros.webp"
              alt="Mladen Marinovic - BRUTO Atelier"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-[11px] sm:text-xs font-serif italic text-white/90">
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
