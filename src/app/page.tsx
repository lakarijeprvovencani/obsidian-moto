import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import BuildSection from "@/components/BuildSection";
import LabHeader from "@/components/lab/LabHeader";
import LabCinema from "@/components/lab/LabCinema";
import LabSpectrum from "@/components/lab/LabSpectrum";
import LabAtelier from "@/components/lab/LabAtelier";
import LabSignals from "@/components/lab/LabSignals";
import LabIgnitionSequence from "@/components/lab/LabIgnitionSequence";
import LabIgnite from "@/components/lab/LabIgnite";
import LabClose from "@/components/lab/LabClose";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent/30 selection:text-white">
        <LabHeader />
        <LabCinema />
        {/* Full 3-column product page from the original — left listing card,
            bike viewer in the middle, specs panel on the right. */}
        <Hero />
        {/* "Built by hand. Not by machine." — craft benefits. */}
        <BuildSection />
        <LabSpectrum />
        <LabAtelier />
        <LabSignals />
        <LabIgnitionSequence />
        <LabIgnite />
        <LabClose />
      </main>
    </SmoothScroll>
  );
}
