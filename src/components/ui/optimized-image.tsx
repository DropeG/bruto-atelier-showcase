import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

import { HTMLMotionProps } from "framer-motion"

interface OptimizedImageProps extends Omit<HTMLMotionProps<"img">, "src" | "alt"> {
  src: string
  alt: string
  ratio?: number
  blurDataURL?: string
  priority?: boolean // If true, skips lazy loading
}

export function OptimizedImage({
  src,
  alt,
  ratio,
  blurDataURL,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const ImageContent = (
    <>
      {/* Blur Placeholder */}
      {blurDataURL && (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          style={{ backgroundImage: `url(${blurDataURL})`, filter: 'blur(20px)' }}
        />
      )}
      
      {/* Main Image */}
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        {...props}
      />
    </>
  )

  if (ratio) {
    return (
      <div className="relative overflow-hidden w-full h-full">
        <AspectRatio ratio={ratio}>
          {ImageContent}
        </AspectRatio>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {ImageContent}
    </div>
  )
}
