"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import RevealWords from "@/components/effects/RevealWords";
import { cn } from "@/lib/utils";

const colors = [
  {
    name: "Obsidian Matte",
    hex: "#111111",
    price: 0,
    filter: "none",
    glow: "rgba(59,130,246,0.18)",
    bg: "#0d0d0d",
    ring: "rgba(255,255,255,0.55)",
  },
  {
    name: "Cobalt Blue",
    hex: "#1e3a8a",
    price: 1500,
    filter: "hue-rotate(15deg) saturate(2.2) brightness(0.95)",
    glow: "rgba(37,99,235,0.42)",
    bg: "#0a0e1a",
    ring: "rgba(59,130,246,0.95)",
  },
  {
    name: "Phantom Green",
    hex: "#0d3a26",
    price: 1800,
    filter: "hue-rotate(-80deg) saturate(2.0) brightness(0.95)",
    glow: "rgba(16,185,129,0.38)",
    bg: "#0a1410",
    ring: "rgba(16,185,129,0.95)",
  },
  {
    name: "Crimson Red",
    hex: "#7a1c1c",
    price: 1800,
    filter: "hue-rotate(140deg) saturate(2.2) brightness(0.95)",
    glow: "rgba(239,68,68,0.42)",
    bg: "#140a0a",
    ring: "rgba(239,68,68,0.95)",
  },
] as const;

const exhausts = [
  { name: "Standard Dual", price: 0 },
  { name: "Titanium Slash-cut", price: 2400 },
  { name: "Carbon Fiber Racing", price: 3100 },
] as const;

const seats = [
  { name: "Premium Leather", price: 0 },
  { name: "Alcantara Sport", price: 450 },
] as const;

function AnimatedPrice({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) =>
    Math.round(v).toLocaleString("de-DE")
  );
  const [display, setDisplay] = useState(rounded.get());

  useMotionValueEvent(rounded, "change", setDisplay);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, mv]);

  return <span>€{display}</span>;
}

export default function LabAtelier() {
  const [color, setColor] = useState<(typeof colors)[number]>(colors[0]);
  const [exhaust, setExhaust] =
    useState<(typeof exhausts)[number]>(exhausts[0]);
  const [seat, setSeat] = useState<(typeof seats)[number]>(seats[0]);
  const total = 34900 + color.price + exhaust.price + seat.price;

  return (
    <motion.section
      id="atelier"
      animate={{ backgroundColor: color.bg }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-24 md:py-40 border-y border-white/5"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={color.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 80% at 20% 50%, ${color.glow} 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 relative">
        <Reveal className="mb-12 md:mb-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
              04 · Atelier
            </span>
            <div className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-accent/40 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
            <RevealWords text="Paint your silence." />
            <span className="block text-white/40">
              <RevealWords text="In colour." delay={0.2} />
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-stretch">
          {/* Bike stage */}
          <Reveal delay={0.1} className="relative min-h-[40vh] md:min-h-[55vh] rounded-3xl overflow-hidden bg-black border border-white/8 flex items-end justify-center">
            <motion.img
              src="/hero-bike.jpg"
              alt="Obsidian K7"
              animate={{ filter: color.filter }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl object-contain object-bottom px-4 pb-4 md:pb-8"
            />
            <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/50">
                LIVE PREVIEW
              </span>
            </div>
          </Reveal>

          {/* Controls panel */}
          <Reveal delay={0.15} className="flex flex-col gap-6 bg-[#0f0f0f]/70 backdrop-blur-md border border-white/8 rounded-3xl p-6 md:p-8">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 mb-4 uppercase">
                Finish
              </p>
              <div className="flex flex-wrap gap-4">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    data-cursor="hover"
                    onClick={() => setColor(c)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <span
                      className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all duration-300",
                        color.name === c.name ? "scale-110" : "scale-100 opacity-70"
                      )}
                      style={{
                        backgroundColor: c.hex,
                        borderColor: color.name === c.name ? c.ring : "rgba(255,255,255,0.15)",
                        boxShadow:
                          color.name === c.name
                            ? `0 0 20px ${c.ring}`
                            : "none",
                      }}
                    />
                    <span className="text-[9px] font-mono tracking-[0.1em] text-white/50 text-center max-w-[72px]">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 mb-3 uppercase">
                Exhaust
              </p>
              <div className="flex flex-col gap-2 relative">
                {exhausts.map((e) => (
                  <button
                    key={e.name}
                    type="button"
                    data-cursor="hover"
                    onClick={() => setExhaust(e)}
                    className={cn(
                      "relative text-left px-4 py-3 rounded-xl border text-sm transition-colors",
                      exhaust.name === e.name
                        ? "border-accent/40 text-white"
                        : "border-white/10 text-white/60 hover:border-white/20"
                    )}
                  >
                    {exhaust.name === e.name && (
                      <motion.div
                        layoutId="lab-exhaust"
                        className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/30"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex justify-between gap-2">
                      <span>{e.name}</span>
                      {e.price > 0 && (
                        <span className="font-mono text-[10px] text-accent">
                          +€{e.price.toLocaleString()}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 mb-3 uppercase">
                Seat
              </p>
              <div className="grid grid-cols-2 gap-2 relative">
                {seats.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    data-cursor="hover"
                    onClick={() => setSeat(s)}
                    className={cn(
                      "relative px-3 py-3 rounded-xl border text-xs text-left transition-colors",
                      seat.name === s.name
                        ? "border-accent/40 text-white"
                        : "border-white/10 text-white/60"
                    )}
                  >
                    {seat.name === s.name && (
                      <motion.div
                        layoutId="lab-seat"
                        className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/30"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 block">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase">
                  Total
                </p>
                <p className="font-serif italic text-3xl md:text-4xl mt-1">
                  <AnimatedPrice value={total} />
                </p>
              </div>
              <button
                type="button"
                data-cursor="hover"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-accent hover:text-white transition-colors group"
              >
                Proceed
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </motion.section>
  );
}
