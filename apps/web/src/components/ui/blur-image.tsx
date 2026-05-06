"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface BlurImageProps extends ImageProps {
  shimmer?: boolean;
}

import { Users } from "@phosphor-icons/react";

export function BlurImage({ src, alt, className, shimmer = true, ...props }: BlurImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className}`}>
      {shimmer && status === "loading" && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}
      
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-2">
          <Users size={32} weight="thin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Asset Unavailable</span>
        </div>
      )}
      
      <Image
        {...props}
        src={src}
        alt={alt}
        className={`
          duration-700 ease-in-out
          ${status === "loading" ? "scale-105 blur-lg grayscale opacity-0" : "scale-100 blur-0 grayscale-0 opacity-100"}
        `}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
