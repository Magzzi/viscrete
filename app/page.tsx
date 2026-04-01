
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TechnologySection from "@/components/TechnologySection";
import AlgorithmSection from "@/components/AlgorithmSection";
import StrategySection from "@/components/StrategySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#14171e] flex flex-col items-center">
      <HeroSection />
      <StatsSection />
      <TechnologySection />
      <AlgorithmSection />
      <StrategySection />
      <Footer />
    </div>
  );
}