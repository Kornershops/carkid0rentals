"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Users } from "@phosphor-icons/react";

interface BlurImageProps extends ImageProps {
  shimmer?: boolean;
}

export function BlurImage({ src, alt, className, shimmer = true, fill, ...props }: BlurImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={`overflow-hidden bg-neutral-100 ${fill ? 'absolute inset-0' : 'relative w-full h-full'}`}>
      {shimmer && status === "loading" && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}
      
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-2">
          <Users size={32} weight="thin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Unavailable</span>
        </div>
      )}
      
      <Image
        {...props}
        fill={fill}
        src={src}
        alt={alt}
        className={`
          duration-700 ease-in-out
          ${className || ''}
        `}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
