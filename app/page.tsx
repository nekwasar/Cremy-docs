import { HeroSection } from './_components/HeroSection';
import { QuickActionsGrid } from './_components/QuickActionsGrid';
import { FeaturesSection } from './_components/FeaturesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickActionsGrid />
      <FeaturesSection />
    </>
  );
}