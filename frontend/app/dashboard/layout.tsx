import { PresentationProvider } from "@/components/PresentationContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PresentationOverlay } from "@/components/PresentationOverlay";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PresentationProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <PresentationOverlay />
        <main className="p-6 max-w-screen-2xl mx-auto">{children}</main>
      </div>
    </PresentationProvider>
  );
}
