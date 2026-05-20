"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import RevealWords from "@/components/effects/RevealWords";
import Tilt3D from "@/components/effects/Tilt3D";

const reviews = [
  {
    quote:
      "The Obsidian K7 doesn't reflect light — it annihilates it. The most dramatic motorcycle we've shot in a decade.",
    author: "M. Torres",
    role: "Editor-in-Chief · Ride Magazine",
  },
  {
    quote:
      "Berlin's answer to the custom bobber renaissance. Hand-built, brutally minimal, and terrifyingly fast.",
    author: "J. Whitfield",
    role: "Senior Writer · Cycle World",
  },
  {
    quote:
      "Twenty-four units is not scarcity marketing — it's a promise. Every bolt tells you someone cared.",
    author: "A. Bergström",
    role: "Design · Wallpaper*",
  },
] as const;

const awards = [
  { icon: Trophy, title: "Design of Year", sub: "Custom Moto Awards 2024" },
  { icon: Award, title: "Best Build", sub: "Berlin Motor Show" },
  { icon: Medal, title: "Editors' Choice", sub: "Bike Exif Annual" },
] as const;

const logos = [
  "MOTOR TREND",
  "RIDE MAGAZINE",
  "CYCLE WORLD",
  "BIKE EXIF",
  "ASPHALT & RUBBER",
  "ROBB REPORT",
  "GQ",
  "WALLPAPER*",
] as const;

export default function LabSignals() {
  return (
    <section id="signals" className="py-24 md:py-40 bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal className="mb-12 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
              05 · Signals
            </span>
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-accent/40 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
            <RevealWords text="What they're saying." />
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
          {reviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.08}>
              <Tilt3D className="group h-full">
                <article className="relative h-full bg-[#121212] border border-white/8 rounded-2xl p-8 md:p-10 overflow-hidden">
                  <span
                    aria-hidden
                    className="absolute top-2 right-4 text-[120px] leading-none font-serif text-white/[0.04] select-none"
                  >
                    &ldquo;
                  </span>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <motion.span
                        key={si}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.1 + si * 0.05,
                          type: "spring",
                          stiffness: 240,
                          damping: 14,
                        }}
                        className="text-accent text-sm"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="font-serif italic text-lg md:text-xl text-white/90 leading-relaxed relative z-10">
                    {r.quote}
                  </p>
                  <p className="mt-8 text-[10px] font-mono tracking-[0.2em] text-accent uppercase">
                    {r.author}
                  </p>
                  <p className="text-xs text-white/40 mt-1">{r.role}</p>
                </article>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          {awards.map((a, i) => (
            <Reveal key={a.title} delay={0.1 + i * 0.06}>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#121212]/80 border border-white/8">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                  <a.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-serif italic text-lg">{a.title}</p>
                  <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 mt-0.5">
                    {a.sub}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="relative overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap w-max"
          >
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="text-[11px] font-mono tracking-[0.35em] text-white/25 uppercase"
              >
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
