"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "./effects/Reveal";
import RevealWords from "./effects/RevealWords";
import { cn } from "@/lib/utils";

// Each color carries a CSS filter that re-tints the bike image — the same
// matte black silhouette, shifted in hue + saturation to suggest the swatch.
const colors = [
  {
    name: "Obsidian Matte",
    hex: "#111111",
    price: 0,
    filter: "none",
    glow: "rgba(59,130,246,0.25)",
  },
  {
    name: "Vantablack",
    hex: "#000000",
    price: 1200,
    filter: "brightness(0.55) saturate(0)",
    glow: "rgba(255,255,255,0.08)",
  },
  {
    name: "Gunmetal",
    hex: "#3a3f48",
    price: 800,
    filter: "brightness(1.18) saturate(0.4) contrast(0.95)",
    glow: "rgba(180,200,220,0.18)",
  },
  {
    name: "Cobalt Blue",
    hex: "#1e3a8a",
    price: 1500,
    filter: "hue-rotate(15deg) saturate(2.2) brightness(0.95)",
    glow: "rgba(37,99,235,0.4)",
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

/** Animates between previous and new total smoothly whenever it changes. */
function AnimatedPrice({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, mv]);

  return <motion.span>{rounded}</motion.span>;
}

export default function ConfigSection() {
  const [color, setColor] = useState<(typeof colors)[number]>(colors[0]);
  const [exhaust, setExhaust] =
    useState<(typeof exhausts)[number]>(exhausts[0]);
  const [seat, setSeat] = useState<(typeof seats)[number]>(seats[0]);

  const totalPrice = 34900 + color.price + exhaust.price + seat.price;

  return (
    <section
      id="custom-builds"
      className="relative py-28 md:py-44 bg-[#0d0d0d] border-y border-white/5 overflow-hidden"
    >
      {/* Color-aware ambient glow tracks the selected paint */}
      <AnimatePresence mode="sync">
        <motion.div
          key={color.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            background: `radial-gradient(ellipse at 30% 60%, ${color.glow} 0%, transparent 65%)`,
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 relative">
        {/* Section eyebrow */}
        <Reveal className="mb-10 flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
            04 · Configurator
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent" />
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left: live preview bike */}
          <div className="w-full lg:w-3/5 h-[400px] md:h-[600px] relative">
            <Reveal y={0} className="w-full h-full">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-white/10 relative flex items-center justify-center">
                <motion.img
                  src="/hero-bike.jpg"
                  alt="Configurator preview"
                  className="w-full h-full object-contain scale-110"
                  animate={{ filter: color.filter }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* color readout pill */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  <motion.div
                    layout
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-white/70">
                    {color.name}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: configurator */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-serif italic tracking-[-0.04em] leading-[0.95] mb-14">
              <RevealWords text={"Configure"} />
              <span className="block text-white/40">
                <RevealWords text={"yours."} delay={0.2} />
              </span>
            </h2>

            {/* Colors */}
            <Reveal delay={0.2} className="mb-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-5">
                Paint
              </div>
              <div className="flex gap-4 mb-3">
                {colors.map((c) => {
                  const active = color.name === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setColor(c)}
                      aria-label={c.name}
                      className={cn(
                        "relative w-12 h-12 rounded-full transition-transform duration-300",
                        active ? "scale-110" : "hover:scale-105"
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span
                        className={cn(
                          "absolute -inset-1.5 rounded-full border transition-all",
                          active
                            ? "border-accent shadow-[0_0_16px_rgba(59,130,246,0.5)]"
                            : "border-transparent"
                        )}
                      />
                      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-white/70 flex justify-between">
                <span>{color.name}</span>
                <span className="font-mono text-white/50">
                  {color.price > 0 ? `+€${color.price}` : "Included"}
                </span>
              </div>
            </Reveal>

            {/* Exhaust */}
            <Reveal delay={0.3} className="mb-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-5">
                Exhaust System
              </div>
              <div className="space-y-3">
                {exhausts.map((e) => {
                  const active = exhaust.name === e.name;
                  return (
                    <button
                      key={e.name}
                      onClick={() => setExhaust(e)}
                      className={cn(
                        "relative w-full flex justify-between items-center p-4 rounded-xl border transition-all text-left overflow-hidden",
                        active
                          ? "border-accent/60 text-white"
                          : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="config-pill-glow"
                          className="absolute inset-0 bg-accent/8"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="text-sm font-medium relative">{e.name}</span>
                      <span className="text-sm font-mono relative text-white/70">
                        {e.price > 0 ? `+€${e.price}` : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Seat */}
            <Reveal delay={0.4} className="mb-12">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-5">
                Seat Material
              </div>
              <div className="space-y-3">
                {seats.map((s) => {
                  const active = seat.name === s.name;
                  return (
                    <button
                      key={s.name}
                      onClick={() => setSeat(s)}
                      className={cn(
                        "relative w-full flex justify-between items-center p-4 rounded-xl border transition-all text-left overflow-hidden",
                        active
                          ? "border-accent/60 text-white"
                          : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="seat-pill-glow"
                          className="absolute inset-0 bg-accent/8"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="text-sm font-medium relative">{s.name}</span>
                      <span className="text-sm font-mono relative text-white/70">
                        {s.price > 0 ? `+€${s.price}` : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Total + animated checkout */}
            <Reveal delay={0.5} className="pt-8 border-t border-white/10">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm text-white/50 uppercase tracking-[0.2em]">
                  Total
                </span>
                <span className="font-serif italic text-4xl tracking-tight">
                  €<AnimatedPrice value={totalPrice} />
                </span>
              </div>
              <button className="group w-full bg-white text-black py-5 font-medium text-sm tracking-[0.2em] uppercase hover:bg-accent hover:text-white transition-colors duration-300 flex items-center justify-center gap-3">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
