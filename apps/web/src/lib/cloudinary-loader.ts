/**
 * Cloudinary Image Loader for Next.js
 * Provides optimized image delivery with automatic format negotiation
 */

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({
  src,
  width,
  quality = 75,
}: CloudinaryLoaderProps): string {
  // Handle Unsplash URLs and other external sources
  if (src.includes("unsplash.com")) {
    return `${src}?w=${width}&q=${quality}&auto=format`;
  }

  // Handle local public paths (fallback for development)
  if (src.startsWith("/")) {
    return src;
  }

  const cloudinaryBaseUrl = "https://res.cloudinary.com/carkid0/image/upload";

  // Build transformation string
  const transforms = [
    `w_${width}`, // Width
    `c_fill`, // Crop to fill
    `q_auto`, // Auto quality
    `f_auto`, // Auto format (WebP, AVIF, etc.)
    `g_auto`, // Auto gravity/focus (AI-powered)
  ];

  // Add fetch format for better compatibility
  return `${cloudinaryBaseUrl}/${transforms.join(",")}/${src}`;
}
