import { auth } from "@clerk/nextjs/server";
import { ScrollHeroSection } from "@/components/scroll-hero";
import { InfoSection } from "@/components/info-section";

export default async function Home() {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  return (
    <main>
      <ScrollHeroSection isAuthenticated={isAuthenticated} />
      <InfoSection />
    </main>
  );
}
