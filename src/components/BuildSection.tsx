"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hammer, Layers, Sparkles } from "lucide-react";
import Reveal from "./effects/Reveal";
import RevealWords from "./effects/RevealWords";
import Counter from "./effects/Counter";

const stats = [
  {
    icon: Hammer,
    label: "Build time",
    to: 6,
    suffix: " weeks",
  },
  {
    icon: Layers,
    label: "Components",
    to: 312,
    suffix: " parts",
  },
  {
    icon: Sparkles,
    label: "Hand finished",
    to: 100,
    suffix: "%",
  },
] as const;

export default function BuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Cards rise slightly as the section scrolls — gentle parallax.
  const cardsY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  // A faint vertical accent line draws itself in across the section.
  const lineScale = useTransform(scrollYProgress, [0.05, 0.6], [0, 1]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 md:py-44 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Animated vertical accent line on the left */}
      <motion.div
        style={{ scaleY: lineScale, originY: 0 }}
        className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent"
        aria-hidden
      />
      {/* Soft section eyebrow number */}
      <div className="absolute left-6 md:left-12 top-28 md:top-36 -translate-x-1/2 rotate-180 [writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
        03 · The Craft
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
          {/* Left: italic title with word stagger reveal */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
              <RevealWords text={"Built by hand."} />
              <span className="block text-white/40">
                <RevealWords text={"Not by machine."} delay={0.2} />
              </span>
            </h2>
          </div>

          {/* Right: prose + stat cards */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <Reveal delay={0.15}>
              <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-xl">
                Every Obsidian Moto is assembled by a single master builder
                from start to finish. We source aerospace-grade titanium,
                hand-lay carbon fiber, and machine our own aluminum billets to
                create a machine that feels alive. The matte black finish
                isn&apos;t just paint—it&apos;s a proprietary ceramic coating
                that absorbs light and resists heat.
              </p>
            </Reveal>

            <motion.div
              style={{ y: cardsY }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={0.3 + i * 0.1}
                  className="group relative bg-[#121212] border border-white/8 rounded-2xl p-6 overflow-hidden hover:border-accent/40 transition-colors duration-500"
                >
                  {/* hover halo */}
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <stat.icon className="w-4 h-4 text-accent/70 mb-4" />
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
                    {stat.label}
                  </div>
                  <div className="font-serif italic text-3xl md:text-4xl tracking-tight">
                    <Counter to={stat.to} suffix={stat.suffix} />
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
