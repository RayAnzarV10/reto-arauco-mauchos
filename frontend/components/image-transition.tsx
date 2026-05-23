"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface ImageTransitionHeroProps {
  images: {
    src: string;
    alt: string;
  }[];
  interval?: number;
  children?: React.ReactNode;
}

export function ImageTransitionHero({
  images,
  interval = 5000,
  children,
}: ImageTransitionHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 700);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(nextImage, interval);
    return () => clearInterval(timer);
  }, [nextImage, interval]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images with Crossfade */}
      {images.map((image, index) => (
        <div
          key={image.src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 0 : -1,
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className={`object-cover transition-transform duration-[8000ms] ease-out ${
              index === currentIndex && !isTransitioning ? "scale-105" : "scale-100"
            }`}
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 z-[1]" />

      {/* Content */}
      <div className="relative z-[2] h-full">{children}</div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}