import Image from "next/image";
import Link from "next/link";
import UserButtonWrapper from "@/components/UserButtonWrapper";
import { DashboardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-8 h-16 max-w-screen-2xl mx-auto">
          <div className="flex flex-1 items-center gap-3">
            <Image src="/mauchos_logo.png" alt="Mauchos" width={80} height={20} />
            <div className="w-px h-5 bg-gray-200" />
            <Image src="/Logo-Arauco.png" alt="ARAUCO" width={100} height={30} priority />
          </div>

          <DashboardNav />

          <div className="flex flex-1 items-center justify-end gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              Inicio
            </Link>
            <UserButtonWrapper />
          </div>
        </div>
      </header>

      <main className="p-6 max-w-screen-2xl mx-auto">{children}</main>
    </div>
  );
}
