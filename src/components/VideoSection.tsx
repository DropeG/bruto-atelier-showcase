import { useEffect, useRef } from "react";

export const SingleVideoBanner = ({
  src,
  mobileSrc,
  poster,
}: {
  src: string;
  mobileSrc?: string;
  poster?: string;
  label?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSource = mobileSrc || src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forzar propiedades DOM explícitas para compatibilidad con iOS Safari / Chrome Mobile / iPadOS
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const attemptPlay = () => {
      if (!video) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si el navegador bloqueó el autoplay inicial (ej. Modo de bajo consumo de iOS),
          // se desbloquea al primer toque o scroll del usuario en la pantalla.
          const resumeOnInteraction = () => {
            if (video) {
              video.muted = true;
              video.play().catch(() => {});
            }
            window.removeEventListener("touchstart", resumeOnInteraction);
            window.removeEventListener("touchend", resumeOnInteraction);
            window.removeEventListener("scroll", resumeOnInteraction, true);
          };
          window.addEventListener("touchstart", resumeOnInteraction, { passive: true, once: true });
          window.addEventListener("touchend", resumeOnInteraction, { passive: true, once: true });
          window.addEventListener("scroll", resumeOnInteraction, { passive: true, capture: true, once: true });
        });
      }
    };

    attemptPlay();

    // Reintentar cuando el video esté listo para reproducir
    video.addEventListener("canplay", attemptPlay);
    video.addEventListener("loadeddata", attemptPlay);

    return () => {
      video.removeEventListener("canplay", attemptPlay);
      video.removeEventListener("loadeddata", attemptPlay);
    };
  }, []);

  return (
    <div className="lg:landscape:hidden relative w-full h-screen h-[100dvh] min-h-[100dvh] bg-black flex items-center justify-center overflow-hidden my-0">
      <video
        ref={videoRef}
        src={videoSource}
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
        <source src={videoSource} type="video/mp4" />
        Tu navegador no soporta video HTML5
      </video>
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
          <video
            src={video.src}
            autoPlay
            loop
            muted
            playsInline
            // @ts-expect-error - Atributo legacy requerido para iOS Safari auto-play
            webkit-playsinline="true"
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideoSection;