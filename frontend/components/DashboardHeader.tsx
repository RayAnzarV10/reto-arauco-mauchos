"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import UserButtonWrapper from "@/components/UserButtonWrapper";
import { usePresentationCtx } from "@/components/PresentationContext";

export function DashboardHeader() {
  const { isPresenting, startPresentation } = usePresentationCtx();

  if (isPresenting) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-8 h-16 max-w-screen-2xl mx-auto">
        {/* Logos */}
        <div className="flex flex-1 items-center gap-3">
          <Image src="/mauchos_logo.png" alt="Mauchos" width={80} height={20} />
          <div className="w-px h-5 bg-gray-200" />
          <Image src="/Logo-Arauco.png" alt="ARAUCO" width={100} height={30} priority />
        </div>

        {/* Nav */}
        <DashboardNav />

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            onClick={startPresentation}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            Modo Presentación
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Inicio
          </Link>
          <UserButtonWrapper />
        </div>
      </div>
    </header>
  );
}
