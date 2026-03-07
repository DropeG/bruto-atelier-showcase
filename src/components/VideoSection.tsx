const VideoSection = () => {
  const videos = [
    { src: "/videos/video2.webm", alt: "Video 1" },
    { src: "/videos/video1.webm", alt: "Video 2" },
    { src: "/videos/video3.webm", alt: "Video 3" },
  ];

  return (
    <div className="hidden md:flex h-screen w-full bg-black md:snap-center">
      {videos.map((video, index) => (
        <div key={index} className="h-screen w-1/3 flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={video.src} type="video/webm" />
            Tu navegador no soporta video HTML5
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideoSection;
