"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Macroeconomía", href: "/dashboard/macroeconomia" },
  { label: "Riesgos", href: "/dashboard/riesgos" },
  { label: "Cobertura", href: "/dashboard/cobertura" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-7">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors whitespace-nowrap ${
              isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
