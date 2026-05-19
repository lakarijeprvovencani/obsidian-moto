"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "./effects/Reveal";
import RevealWords from "./effects/RevealWords";
import Tilt3D from "./effects/Tilt3D";
import { cn } from "@/lib/utils";

interface Model {
  name: string;
  price: string;
  tag: string;
  /** Starting frame index. Hover cycles through frames around this anchor. */
  baseFrame: number;
}

const models: Model[] = [
  { name: "The Phantom", price: "€28,500", tag: "Street Tracker", baseFrame: 8 },
  { name: "Nightfall", price: "€31,200", tag: "Bobber", baseFrame: 24 },
  { name: "Eclipse", price: "€42,000", tag: "Cafe Racer", baseFrame: 42 },
  { name: "Reaper", price: "€38,900", tag: "Power Cruiser", baseFrame: 55 },
];

const HOVER_FRAMES = 6;

function ModelCard({ model, index }: { model: Model; index: number }) {
  const [frameOffset, setFrameOffset] = useState(0);
  const hovering = useRef(false);
  const rafId = useRef<number | null>(null);

  // While hovered, advance the frame offset every ~80ms for a mini-rotation.
  useEffect(() => {
    const tick = () => {
      if (!hovering.current) {
        rafId.current = null;
        return;
      }
      setFrameOffset((o) => (o + 1) % HOVER_FRAMES);
      rafId.current = window.setTimeout(tick, 80) as unknown as number;
    };
    if (hovering.current && rafId.current === null) {
      rafId.current = window.setTimeout(tick, 80) as unknown as number;
    }
    return () => {
      if (rafId.current !== null) clearTimeout(rafId.current);
    };
  }, [frameOffset]);

  const onEnter = () => {
    hovering.current = true;
    setFrameOffset(1); // kick the loop
  };
  const onLeave = () => {
    hovering.current = false;
    setFrameOffset(0);
  };

  // Compute visible frame (1..60) by wrapping
  const f = ((model.baseFrame - 1 + frameOffset) % 60) + 1;
  const src = `/frames/f${String(f).padStart(3, "0")}.jpg`;

  return (
    <Reveal delay={index * 0.08} style={{ perspective: 1200 }}>
      <Tilt3D
        max={6}
        className="group cursor-pointer"
      >
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="bg-black rounded-2xl aspect-[4/3] mb-6 overflow-hidden relative flex items-center justify-center border border-white/8 group-hover:border-accent/30 transition-colors duration-500"
        >
          {/* All HOVER_FRAMES preloaded as overlapping img layers — opacity-toggled by frameOffset. Keeps swaps decode-free and flicker-free. */}
          {Array.from({ length: HOVER_FRAMES }).map((_, off) => {
            const frame = ((model.baseFrame - 1 + off) % 60) + 1;
            return (
              <img
                key={off}
                src={`/frames/f${String(frame).padStart(3, "0")}.jpg`}
                alt={off === 0 ? model.name : ""}
                aria-hidden={off !== frameOffset}
                className="absolute inset-0 w-full h-full object-contain scale-110 group-hover:scale-[1.18] transition-transform duration-700 ease-out"
                style={{ opacity: off === frameOffset ? 1 : 0 }}
                draggable={false}
              />
            );
          })}

          {/* Type tag */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase tracking-[0.2em] border border-white/10">
            {model.tag}
          </div>

          {/* Hint on hover that the bike rotates */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/70">
              360°
            </span>
          </div>

          {/* Bottom fade for legibility */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium mb-1 group-hover:text-accent transition-colors duration-300">
              {model.name}
            </h3>
            <div className="font-serif italic text-white/60 text-lg">
              {model.price}
            </div>
          </div>
          <button
            aria-label={`View ${model.name}`}
            className={cn(
              "w-10 h-10 rounded-full border border-white/20 flex items-center justify-center",
              "group-hover:bg-accent group-hover:text-white group-hover:border-accent",
              "group-hover:rotate-[-45deg] transition-all duration-300"
            )}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Tilt3D>
    </Reveal>
  );
}

export default function ModelsGrid() {
  return (
    <section
      id="models"
      className="relative py-28 md:py-44 bg-[#0d0d0d] border-t border-white/5 overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12">
        <Reveal className="mb-4 flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
            06 · Range
          </span>
          <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-accent/40 to-transparent" />
        </Reveal>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
          <h2 className="text-5xl md:text-6xl font-serif italic tracking-[-0.04em] leading-[0.95] max-w-2xl">
            <RevealWords text={"Other"} />
            <span className="block text-white/40">
              <RevealWords text={"machines."} delay={0.15} />
            </span>
          </h2>
          <Reveal delay={0.2}>
            <button className="hidden md:flex items-center gap-2 text-sm font-medium tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group">
              View All Models
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {models.map((model, i) => (
            <ModelCard key={model.name} model={model} index={i} />
          ))}
        </div>

        <Reveal delay={0.2} className="md:hidden mt-12">
          <button className="w-full py-4 border border-white/20 flex items-center justify-center gap-2 text-sm font-medium tracking-[0.15em] uppercase">
            View All Models <ArrowRight className="w-4 h-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
