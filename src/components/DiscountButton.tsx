import { User } from "lucide-react";

interface DiscountButtonProps {
  onClick: () => void;
  isVisible?: boolean;
}

const DiscountButton: React.FC<DiscountButtonProps> = ({ onClick, isVisible = true }) => {
  return (
    <button
      onClick={onClick}
      className={`floating-discount fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 flex items-center gap-2 
                 px-3 py-2 md:px-5 md:py-2.5 bg-white text-foreground 
                 border border-foreground/20 rounded-full shadow-lg 
                 hover:bg-foreground hover:text-white hover:border-foreground hover:shadow-2xl hover:scale-105
                 transition-all duration-300 group
                 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
      aria-label="Inicia sesión y obtén 10% descuento"
    >
      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
      <span className="text-[10px] md:text-xs font-medium tracking-wide">-10%</span>
    </button>
  );
};

export default DiscountButton;
