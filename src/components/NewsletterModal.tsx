import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NewsletterModalProps {
  openModal?: boolean;
  onClose?: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ openModal, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before
    const hasShown = localStorage.getItem('newsletterModalShown');
    
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('newsletterModalShown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (openModal) {
      setIsOpen(true);
    }
  }, [openModal]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    
    console.log("Newsletter signup:", { name, email });
    
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-lg overflow-hidden w-[320px] md:max-w-2xl md:w-full flex flex-col md:flex-row relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-gray-600 hover:text-black transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image side */}
          <div className="md:w-1/2 h-56 md:h-auto bg-gray-100">
            <img
              src="/images/newsLetterModal/newsLetter.webp"
              alt="Promoción"
              className="w-full h-full object-cover object-center md:object-cover"
            />
          </div>

          {/* Form side */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-[#9C7B66]">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-white">
              10% en tu primera compra!
            </h2>
            <p className="text-center mb-4 md:mb-6 text-sm text-white">
              Ingresa tus datos
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  required
                  className="w-full px-3 py-2 md:px-4 md:py-3 border-0 text-sm focus:outline-none focus:border-black bg-white"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 md:px-4 md:py-3 border-0 text-sm focus:outline-none focus:border-black bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 md:py-3 text-sm font-medium hover:bg-[#EAD0B9] transition-colors"
              >
                Ok
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsletterModal;
