"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const TOTAL_SLIDES = 5;

interface PresentationCtx {
  isPresenting: boolean;
  currentSlide: number;
  totalSlides: number;
  startPresentation: () => void;
  exitPresentation: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

const Ctx = createContext<PresentationCtx | null>(null);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const startPresentation = useCallback(() => {
    setCurrentSlide(0);
    setIsPresenting(true);
  }, []);

  const exitPresentation = useCallback(() => setIsPresenting(false), []);

  const nextSlide = useCallback(
    () => setCurrentSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1)),
    []
  );

  const prevSlide = useCallback(
    () => setCurrentSlide((s) => Math.max(s - 1, 0)),
    []
  );

  // Lock scroll + keyboard navigation
  useEffect(() => {
    document.body.style.overflow = isPresenting ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isPresenting]);

  useEffect(() => {
    if (!isPresenting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide();
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide();
      else if (e.key === "Escape") exitPresentation();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPresenting, nextSlide, prevSlide, exitPresentation]);

  return (
    <Ctx.Provider
      value={{
        isPresenting,
        currentSlide,
        totalSlides: TOTAL_SLIDES,
        startPresentation,
        exitPresentation,
        nextSlide,
        prevSlide,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePresentationCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePresentationCtx must be inside PresentationProvider");
  return ctx;
}
