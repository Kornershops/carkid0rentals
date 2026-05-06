"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface BlurImageProps extends ImageProps {
  shimmer?: boolean;
}

export function BlurImage({ src, alt, className, shimmer = true, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      {shimmer && isLoading && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}
      
      <Image
        {...props}
        src={src}
        alt={alt}
        className={`
          duration-700 ease-in-out
          ${isLoading ? "scale-105 blur-lg grayscale" : "scale-100 blur-0 grayscale-0"}
        `}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
