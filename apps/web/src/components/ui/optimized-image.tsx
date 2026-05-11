'use client';

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { Image as ImageIcon } from '@phosphor-icons/react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  fallback?: string;
  lazy?: boolean;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/placeholder.png',
  lazy = true,
  aspectRatio,
  objectFit = 'cover',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(lazy ? '' : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, lazy]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
  };

  const containerStyle = aspectRatio
    ? { aspectRatio, position: 'relative' as const }
    : {};

  return (
    <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <ImageIcon size={32} className="text-gray-300" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Image unavailable</p>
          </div>
        </div>
      )}

      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectFit }}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />
    </div>
  );
}
