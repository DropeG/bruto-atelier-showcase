import { useState, useEffect, useRef } from "react";
import { catalogImageProps } from "@/lib/catalog-images";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface NextSeasonItem {
  id: string;
  title: string;
  image: string;
}

export const NEXT_SEASON_ITEMS: NextSeasonItem[] = [
  {
    id: "vestuario",
    title: "VESTUARIO",
    image: "/images/next-season/vestuario.webp"
  },
  {
    id: "iluminacion",
    title: "ILUMINACIÓN",
    image: "/images/next-season/iluminacion-atelier-4x5.webp"
  },
  {
    id: "joyeria",
    title: "JOYERÍA",
    image: "/images/joyeria/joyeria-atelier-4x5.webp"
  },
  {
    id: "esenciales",
    title: "ESENCIALES",
    image: "/images/next-season/esenciales-fondo-texturado.webp"
  }
];

interface NextSeasonDepthCarouselProps {
  className?: string;
  expanded?: boolean;
}

export default function NextSeasonDepthCarousel({
  className = "",
  expanded = false
}: NextSeasonDepthCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());
  const touchStartX = useRef<number | null>(null);

  const total = NEXT_SEASON_ITEMS.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-advance every 4s (pauses on hover or touch)
  useEffect(() => {
    if (isPaused || !loadedImages.has(NEXT_SEASON_ITEMS[currentIndex].id)) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, loadedImages]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 40) {
      handlePrev();
    } else if (diff < -40) {
      handleNext();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const currentItem = NEXT_SEASON_ITEMS[currentIndex];

  return (
    <div
      className={`w-full ${expanded ? "" : "max-w-[320px]"} font-serif text-white space-y-2.5 select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category title aligned to the left */}
      <div className="flex justify-start items-center px-1">
        <span
          className={`${expanded ? "text-[22px]" : "text-[18px]"} tracking-[0.12em] text-[#EAD0B9] uppercase font-normal transition-all duration-300`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {currentItem.title}
        </span>
      </div>

      {/* 3D Depth Rail Stage: Pure photography hero without any overlays or bottom text */}
      <div
        className={`relative w-full mx-auto flex items-center justify-center overflow-hidden group ${expanded ? "h-[min(65dvh,560px)]" : "h-[320px] max-w-[310px]"}`}
        style={{ perspective: "900px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {NEXT_SEASON_ITEMS.map((item, idx) => {
            let offset = (idx - currentIndex) % total;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isRight = offset === 1;
            const isLeft = offset === -1;
            const isVisible = isCenter || isRight || isLeft;
            let transform = "translate3d(0, 0, -140px) scale(0.65)";
            let opacity = 0;
            let zIndex = 10;
            let filter = "blur(2px)";

            if (isCenter) {
              transform = "translate3d(0, 0, 40px) rotateY(0deg) scale(1)";
              opacity = 1;
              zIndex = 30;
              filter = "blur(0px)";
            } else if (isRight) {
              transform =
                "translate3d(58px, 0, -55px) rotateY(-22deg) scale(0.85)";
              opacity = 0.55;
              zIndex = 20;
              filter = "blur(0.8px)";
            } else if (isLeft) {
              transform =
                "translate3d(-58px, 0, -55px) rotateY(22deg) scale(0.85)";
              opacity = 0.55;
              zIndex = 20;
              filter = "blur(0.8px)";
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isRight) handleNext();
                  if (isLeft) handlePrev();
                }}
                className={`absolute transition-all duration-500 ease-out rounded-lg overflow-hidden border border-white/20 shadow-2xl ${
                  isVisible ? "cursor-pointer" : "pointer-events-none"
                }`}
                style={{
                  width: expanded ? "min(76%, 350px, 43dvh)" : "215px",
                  height: "auto",
                  aspectRatio: "4 / 5",
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  boxShadow: isCenter
                    ? "0 25px 40px -12px rgba(0,0,0,0.5)"
                    : "0 10px 22px -8px rgba(0,0,0,0.3)"
                }}
              >
                <img
                  {...catalogImageProps(item.image, expanded ? "(max-width: 767px) min(58vw, 350px, 43dvh), 215px" : "215px")}
                  alt={item.title}
                  loading={isVisible ? "eager" : "lazy"}
                  fetchPriority={isCenter ? "high" : "low"}
                  decoding="async"
                  onLoad={() => setLoadedImages(previous => {
                    if (previous.has(item.id)) return previous;
                    return new Set(previous).add(item.id);
                  })}
                  className="w-full h-full object-cover object-center"
                />
                {!isCenter && (
                  <div className="absolute inset-0 bg-[#3D261C]/30 transition-opacity" />
                )}
              </div>
            );
          })}
        </div>

        {/* Subtle navigation arrows appearing on hover */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Anterior"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-40 w-7 h-7 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 cursor-pointer backdrop-blur-[2px]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-40 w-7 h-7 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 cursor-pointer backdrop-blur-[2px]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
