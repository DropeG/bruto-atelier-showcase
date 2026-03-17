import * as React from "react"
import { useState } from "react"
import { HTMLMotionProps, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VideoHeroProps extends Omit<HTMLMotionProps<"video">, "src" | "poster"> {
  src: string
  poster: string
  priority?: boolean
}

export function VideoHero({
  src,
  poster,
  priority = true,
  className,
  ...props
}: VideoHeroProps) {
  const [isVideoReady, setIsVideoReady] = useState(false)

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
      {/* Poster Image (Visible while video loads/buffers) */}
      <motion.img
        src={poster}
        alt="Video Poster"
        loading={priority ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ opacity: isVideoReady ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Cinematic Video Player */}
      <motion.video
        src={src}
        poster={poster} // Native fallback
        playsInline
        autoPlay
        muted
        loop
        preload={priority ? "auto" : "metadata"}
        onLoadedData={() => setIsVideoReady(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoReady ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover"
        {...props}
      />
    </div>
  )
}
