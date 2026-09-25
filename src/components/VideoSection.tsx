import { useEffect, useRef, useState, useCallback } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSource = mobileSrc || src;
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const isIntersectingRef = useRef(false);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // En caso de bloqueo por modo de bajo consumo de iOS, reactivar al interactuar si está en pantalla
        const handleInteraction = () => {
          if (video && isIntersectingRef.current) {
            video.muted = true;
            video.play().catch(() => {});
          }
          window.removeEventListener("touchstart", handleInteraction);
          window.removeEventListener("click", handleInteraction);
        };
        window.addEventListener("touchstart", handleInteraction, { passive: true, once: true });
        window.addEventListener("click", handleInteraction, { passive: true, once: true });
      });
    }
  }, []);

  const attemptPause = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused) return;
    video.pause();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // Forzar atributos DOM explícitos requeridos por WebKit / iOS
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          attemptPause();
        }
      },
      {
        // 200px de margen anticipatorio para precargar e iniciar la reproducción antes de que sea visible
        rootMargin: "200px 0px 200px 0px",
        threshold: [0, 0.15],
      }
    );

    observer.observe(container);

    // Soporte para bfcache (retorno con botón atrás del navegador) y cambio de pestaña
    const handlePageShow = () => {
      if (isIntersectingRef.current) {
        attemptPlay();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isIntersectingRef.current) {
        attemptPlay();
      } else if (document.visibilityState === "hidden") {
        attemptPause();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [attemptPlay, attemptPause]);

  return (
    <div
      ref={containerRef}
      className="lg:landscape:hidden relative w-full h-screen h-[100dvh] min-h-[100dvh] bg-black flex items-center justify-center overflow-hidden my-0"
    >
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay
        loop
        muted
        playsInline
        // @ts-expect-error - Atributo legacy requerido para iOS Safari auto-play sin botón de play
        webkit-playsinline="true"
        preload="auto"
        onPlaying={() => setHasStartedPlaying(true)}
        onTimeUpdate={() => {
          if (!hasStartedPlaying && videoRef.current && videoRef.current.currentTime > 0) {
            setHasStartedPlaying(true);
          }
        }}
        className="w-full h-full object-cover block"
      >
        <source src={videoSource} type="video/mp4" />
        Tu navegador no soporta video HTML5
      </video>

      {/* Poster overlay con crossfade suave: 0ms de demora percibida y previene pantallas negras */}
      {poster && (
        <img
          src={poster}
          alt="Vista previa de video"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out pointer-events-none ${
            hasStartedPlaying ? "opacity-0" : "opacity-100"
          }`}
          loading="eager"
          decoding="async"
        />
      )}
    </div>
  );
};

const VideoSection = () => {
  const videos = [
    { src: "/videos/video1.mp4", alt: "Video 1", poster: "/videos/video1-poster.webp" },
    { src: "/videos/video2.mp4", alt: "Video 2", poster: "/videos/video2-poster.webp" },
    { src: "/videos/video3.mp4", alt: "Video 3", poster: "/videos/video3-poster.webp" },
  ];

  return (
    <div className="hidden lg:landscape:flex h-screen w-full bg-black lg:landscape:snap-center overflow-hidden">
      {/* Desktop View: 3 columns side by side */}
      {videos.map((video, index) => (
        <div key={index} className="h-full w-1/3 flex items-center justify-center border-r border-white/10 last:border-r-0">
          <video
            src={video.src}
            poster={video.poster}
            autoPlay
            loop
            muted
            playsInline
            // @ts-expect-error - Atributo legacy requerido para iOS Safari auto-play
            webkit-playsinline="true"
            preload="metadata"
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