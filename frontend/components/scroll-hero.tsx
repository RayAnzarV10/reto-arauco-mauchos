"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import UserButtonWrapper from "@/components/UserButtonWrapper";

const sideImages = [
  { src: "/arauco-es-mexico4-990Wx500H.jpeg", alt: "ARAUCO operación México", position: "left" },
  { src: "/6-1-1024x678.jpg", alt: "Operación forestal ARAUCO", position: "left" },
  { src: "/ARAUCO-GraylingPB-TFL-line-990Wx500H.jpeg", alt: "Línea de producción ARAUCO", position: "right" },
  { src: "/iir_industry_news_pulp_paper_wood_article_thumbnail_04.webp", alt: "Industria forestal", position: "right" },
];

interface ScrollHeroSectionProps {
  isAuthenticated: boolean;
}

export function ScrollHeroSection({ isAuthenticated }: ScrollHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 1.5;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text fades out in the first 15% of scroll
  const textOpacity = Math.max(0, 1 - scrollProgress / 0.15);

  // Bento grid builds from 15% to 45% of scroll, then holds until end
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.30));

  const centerWidth = 100 - imageProgress * 56;   // 100% → 44%
  const centerHeight = 100 - imageProgress * 28;  // 100% → 72%
  const sideWidth = imageProgress * 22;            // 0%   → 22%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + imageProgress * 100;
  const sideTranslateRight = 100 - imageProgress * 100;
  const borderRadius = imageProgress * 20;
  const gap = imageProgress * 14;
  const sideTranslateY = -(imageProgress * 12);

  return (
    <section ref={sectionRef} className="relative bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header — always visible */}
        <header className="absolute top-0 left-0 w-full px-12 py-6 flex justify-between items-center z-50">
          <div className="flex items-center gap-3">
            <Image src="/mauchos_logo.png" alt="Mauchos" width={90} height={22} className="brightness-0 invert" />
            <div className="w-px h-6 bg-white/40" />
            <Image
              src="/Logo-Arauco.png"
              alt="Logo Arauco"
              width={120}
              height={40}
              className="brightness-0 invert"
            />
          </div>
          {!isAuthenticated ? (
            <div className="flex items-center">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white cursor-pointer hover:bg-white/20">
                  Iniciar Sesión
                </Button>
              </Link>
              <div className="w-px h-4 bg-white/40 mx-1" />
              <Link href="/sign-up">
                <Button variant="ghost" className="text-white cursor-pointer hover:bg-white/20">
                  Regístrate
                </Button>
              </Link>
            </div>
          ) : (
            <UserButtonWrapper />
          )}
        </header>

        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{
              gap: `${gap}px`,
              padding: `${imageProgress * 14}px`,
              paddingBottom: `${56 + imageProgress * 36}px`,
            }}
          >
            {/* Left column */}
            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((img) => img.position === "left")
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden will-change-transform"
                    style={{ flex: 1, borderRadius: `${borderRadius}px` }}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </div>
                ))}
            </div>

            {/* Center — video */}
            <div
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/background 2.mp4" type="video/mp4" />
              </video>

              {/* Gradient fades with text */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10"
                style={{ opacity: textOpacity }}
              />

              {/* Hero content — fades out first */}
              <div
                className="absolute inset-0 flex items-center"
                style={{ opacity: textOpacity, pointerEvents: textOpacity < 0.05 ? "none" : "auto" }}
              >
                <div className="max-w-2xl px-8 md:px-12 text-left">
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Cambiamos la incertidumbre en estrategia.
                  </h1>
                  <p className="mt-4 text-lg md:text-xl text-gray-200 leading-relaxed">
                    Análisis macroeconómico, riesgos y cobertura en un solo lugar.<br />
                    Del contexto global a la decisión local.<br />
                    Inteligencia financiera para anticipar, no reaccionar.
                  </p>
                  <div className="mt-8">
                    {!isAuthenticated ? (
                      <Link
                        href="/dashboard/macroeconomia"
                        className="inline-block px-6 py-3 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-semibold"
                      >
                        Empezar ahora
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="inline-block px-6 py-3 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-semibold"
                      >
                        Ir al Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((img) => img.position === "right")
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden will-change-transform"
                    style={{ flex: 1, borderRadius: `${borderRadius}px` }}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[150vh]" />
    </section>
  );
}
