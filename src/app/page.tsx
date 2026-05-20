import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollShowcase from "@/components/ScrollShowcase";
import BuildSection from "@/components/BuildSection";
import ConfigSection from "@/components/ConfigSection";
import ReviewsSection from "@/components/ReviewsSection";
import Pillars from "@/components/Pillars";
import StartEngine from "@/components/StartEngine";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SectionNav from "@/components/effects/SectionNav";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent/30 selection:text-white">
        <Header />
        {/* SectionNav reads these ids via IntersectionObserver to highlight
           the active pip + power the smooth-scroll-to-section clicks. We add
           the ids on wrapper divs so the locked Hero + ScrollShowcase
           components stay untouched. */}
        <div id="showcase">
          <ScrollShowcase />
        </div>
        <div id="configurator-hero">
          <Hero />
        </div>
        <div id="craft">
          <BuildSection />
        </div>
        <div id="paint">
          <ConfigSection />
        </div>
        <div id="press">
          <ReviewsSection />
        </div>
        <div id="pillars">
          <Pillars />
        </div>
        <div id="ignition">
          <StartEngine />
        </div>
        <div id="subscribe">
          <FinalCTA />
        </div>
        <Footer />
        <SectionNav />
      </main>
    </SmoothScroll>
  );
}
