import { ScrollHeroSection } from "@/components/scroll-hero";
import { InfoSection } from "@/components/info-section";

export default function Home() {
  return (
    <main>
      <ScrollHeroSection isAuthenticated={false} />
      <InfoSection />
    </main>
  );
}
