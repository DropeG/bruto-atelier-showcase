import { useEffect, useRef } from "react";

export const SingleVideoBanner = ({
  src,
  mobileSrc,
  poster,
  label,
}: {
  src: string;
  mobileSrc?: string;
  poster?: string;
  label?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forzar propiedades explícitas en JS para compatibilidad total con iOS Safari / Chrome Mobile
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const attemptPlay = () => {
      video.play().catch(() => {});
    };

    // Reproducción inmediata al cargar/montar
    attemptPlay();

    // IntersectionObserver con rootMargin de 350px para pre-cargar antes del scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attemptPlay();
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "350px 0px 350px 0px", threshold: 0 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lg:landscape:hidden relative w-full h-screen h-[100dvh] min-h-[100dvh] bg-black flex items-center justify-center overflow-hidden my-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        // @ts-expect-error - Atributo legacy requerido para iOS Safari auto-play sin botón de play
        webkit-playsinline="true"
        preload="auto"
        className="w-full h-full object-cover block"
      >
        <source src={mobileSrc || src} type="video/mp4" />
        Tu navegador no soporta video HTML5
      </video>

      {/* Bottom-left label badge */}
      {label && (
        <div className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-md px-3.5 py-1.5 border border-white/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
          <span className="text-editorial text-[10px] text-white/90 tracking-[0.25em] uppercase font-light">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

const VideoSection = () => {
  const videos = [
    { src: "/videos/video1.mp4", alt: "Video 1" },
    { src: "/videos/video2.mp4", alt: "Video 2" },
    { src: "/videos/video3.mp4", alt: "Video 3" },
  ];

  return (
    <div className="hidden lg:landscape:flex h-screen w-full bg-black lg:landscape:snap-center overflow-hidden">
      {/* Desktop View: 3 columns side by side */}
      {videos.map((video, index) => (
        <div key={index} className="h-full w-1/3 flex items-center justify-center border-r border-white/10 last:border-r-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideoSection;