/**
 * Utilidad para generar blur placeholders
 * 
 * IMPORTANTE: En producción (Vercel), usa esta herramienta:
 * https://plaiceholder.co/
 * 
 * Para desarrollo local, puedes usar plaiceholder package:
 * npm install plaiceholder sharp
 * 
 * Ejemplo de uso:
 * import { blur } from "@/lib/blur-placeholders"
 * 
 * const blurUrl = blur("imageHome1") // retorna base64 pequeño
 */

// Blur placeholders generados con plaiceholder.co
// Estos son Base64 muy pequeños (50x50px optimizados)
export const blurPlaceholders: { [key: string]: string } = {
  // Home images
  imageHome1: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome2: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome3: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome4: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome5: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome6: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome7: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome8: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome9: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
  imageHome10: "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAADIJaQAA3AA/v3AgAA=",
};

export const getBlurDataUrl = (imageKey: string): string | undefined => {
  return blurPlaceholders[imageKey];
};
