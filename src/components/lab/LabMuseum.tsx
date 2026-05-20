"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Cog,
  Zap,
  Weight,
  Heart,
  Share2,
  Eye,
} from "lucide-react";
import BikeViewer from "@/components/BikeViewer";
import Reveal from "@/components/effects/Reveal";
import RevealWords from "@/components/effects/RevealWords";
import { cn } from "@/lib/utils";

const THUMB_FRAMES = [1, 9, 17, 24, 31, 38, 45, 53];

const specs = [
  { icon: Cog, label: "Engine", value: "1923cc V-Twin" },
  { icon: Zap, label: "Power", value: "86 HP @ 7,200 rpm" },
  { icon: Gauge, label: "Torque", value: "142 Nm" },
  { icon: Weight, label: "Dry weight", value: "218 kg" },
  { icon: Fuel, label: "Tank", value: "14 L" },
  { icon: Calendar, label: "Edition", value: "24 units · 2024" },
] as const;

const infoRows = [
  { icon: Calendar, label: "Year", value: "2024" },
  { icon: Settings, label: "Build", value: "Hand-assembled" },
  { icon: Fuel, label: "Fuel", value: "Premium 98" },
] as const;

export default function LabMuseum() {
  const [currentFrame, setCurrentFrame] = useState(1);

  return (
    <section
      id="museum"
      className="relative py-20 md:py-32 bg-[#0a0a0a] border-t border-white/5"
    >
      <div className="container mx-auto px-6 md:px-12">
        <Reveal className="mb-12 md:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
                  02 · Museum
                </span>
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-accent/40 to-transparent" />
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
                <RevealWords text="Walk the machine." />
                <span className="block text-white/40">
                  <RevealWords text="Every angle." delay={0.15} />
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:justify-end">
              <div className="text-right">
                <p className="font-serif italic text-3xl md:text-4xl">€34,900</p>
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 mt-1">
                  23 / 24 claimed · Ships in 2 weeks
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] bg-green-500/10 text-green-400 border border-green-500/30">
                ● AVAILABLE
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 lg:gap-8">
          {/* Main stage */}
          <Reveal delay={0.1}>
            <div className="relative w-full h-[52vh] md:h-[68vh] rounded-3xl overflow-hidden bg-black border border-white/8">
              <BikeViewer
                currentFrame={currentFrame}
                setCurrentFrame={setCurrentFrame}
                autoRotateSpeed={100}
                idleDelay={4000}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono tracking-[0.25em] text-white/50 pointer-events-none">
                DRAG · ROTATE · 360°
              </div>
            </div>

            {/* Thumbnail rail */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
              {THUMB_FRAMES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCurrentFrame(f)}
                  data-cursor="hover"
                  className={cn(
                    "shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-black",
                    currentFrame === f
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={`/frames/f${String(f).padStart(3, "0")}.jpg`}
                    alt=""
                    className="w-full h-full object-cover object-center scale-150"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </Reveal>

          {/* Right rail — specs + CTAs */}
          <div className="flex flex-col gap-4">
            <Reveal delay={0.15} className="bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
              <p className="text-[10px] font-mono tracking-[0.3em] text-accent mb-6">
                SPECIFICATIONS
              </p>
              <ul className="space-y-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <Icon className="w-4 h-4 text-accent/80 shrink-0" />
                    <span className="text-white/40 font-mono text-[10px] uppercase tracking-[0.15em] flex-1">
                      {label}
                    </span>
                    <span className="text-white/90 font-light text-right">{value}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="bg-[#0f0f0f]/80 border border-white/8 rounded-2xl p-6">
              <ul className="space-y-3 mb-6">
                {infoRows.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center gap-3 text-xs text-white/60">
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                    <span className="font-mono uppercase tracking-[0.15em]">{label}</span>
                    <span className="ml-auto">{value}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <button
                  type="button"
                  data-cursor="hover"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-sm font-medium tracking-wide hover:brightness-110 transition-all"
                >
                  Reserve Now
                </button>
                <button
                  type="button"
                  data-cursor="hover"
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-white/15 text-sm text-white/80 hover:border-accent/40 transition-colors"
                >
                  <Eye className="w-4 h-4" /> Book Viewing
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    data-cursor="hover"
                    className="py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    type="button"
                    data-cursor="hover"
                    className="py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
