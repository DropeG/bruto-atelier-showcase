import { useEffect, useRef } from "react";

export const SingleVideoBanner = ({ src, label }: { src: string; label?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="md:hidden h-[60vh] w-full bg-black relative flex items-center justify-center overflow-hidden my-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta video HTML5
      </video>
      {label && (
        <div className="absolute bottom-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/10">
          <span className="text-editorial text-[9px] text-white/80 tracking-[0.2em]">
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
    <div className="hidden md:flex h-screen w-full bg-black md:snap-center overflow-hidden">
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