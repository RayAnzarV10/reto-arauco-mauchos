"use client";

import { useState } from "react";

interface Props {
  text: string;
  dark?: boolean;
}

export function MacroTooltip({ text, dark = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        className={`ml-1.5 flex-shrink-0 transition-colors ${
          dark
            ? "text-gray-600 hover:text-gray-400"
            : "text-gray-300 hover:text-gray-600"
        }`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-label="Más información"
        type="button"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm.75-8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM7.25 7h1.5v4.5h-1.5V7z" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[200] w-64 rounded-xl bg-gray-900 border border-white/10 p-3 shadow-xl">
          <p className="text-[11px] leading-relaxed text-gray-300">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
