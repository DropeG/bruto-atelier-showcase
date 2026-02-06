import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/56949569887", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-2 
                 px-3 py-2 md:px-5 md:py-2.5 bg-white text-foreground 
                 border border-foreground/20 rounded-full shadow-lg 
                 hover:bg-foreground hover:text-white hover:border-foreground hover:shadow-2xl hover:scale-105
                 transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
      <span className="text-[10px] md:text-xs font-medium tracking-wide">HABLEMOS</span>
    </button>
  );
};

export default WhatsAppButton;
