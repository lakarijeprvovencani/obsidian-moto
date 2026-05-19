import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollShowcase from "@/components/ScrollShowcase";
import BuildSection from "@/components/BuildSection";
import ConfigSection from "@/components/ConfigSection";
import ReviewsSection from "@/components/ReviewsSection";
import StartEngine from "@/components/StartEngine";
import RideAway from "@/components/RideAway";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent/30 selection:text-white">
        <Header />
        <ScrollShowcase />
        <Hero />
        <BuildSection />
        <ConfigSection />
        <ReviewsSection />
        <StartEngine />
        <RideAway />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
