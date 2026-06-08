"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Visión general", href: "/dashboard/cobertura" },
  { label: "Forward OTC", href: "/dashboard/cobertura/forward" },
  { label: "Opción Vanilla", href: "/dashboard/cobertura/vanilla" },
  { label: "Bull Call Spread", href: "/dashboard/cobertura/bull-call-spread" },
  { label: "Sintético", href: "/dashboard/cobertura/sintetico" },
];

export default function CoberturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      {/* Sub-navigation */}
      <nav className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/dashboard/cobertura" &&
              pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-none text-xs font-semibold rounded-lg px-4 py-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
