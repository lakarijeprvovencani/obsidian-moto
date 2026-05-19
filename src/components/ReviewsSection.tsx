"use client";

import { motion } from "framer-motion";
import { Star, Trophy, Award, Medal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./effects/Reveal";
import RevealWords from "./effects/RevealWords";
import Tilt3D from "./effects/Tilt3D";

const reviews = [
  {
    quote:
      "A masterclass in modern custom building. It doesn't just look aggressive, it rides like a nightmare in the best way possible.",
    author: "Motor Trend",
    role: "Cover Feature, Vol. 76",
    rating: 5,
  },
  {
    quote:
      "The attention to detail is staggering. Every bolt, every weld, every finish is perfect. Worth every penny of its asking price.",
    author: "RIDE Magazine",
    role: "Long-term Review",
    rating: 5,
  },
  {
    quote:
      "Obsidian Moto has created something truly special here. A machine that commands respect the moment you turn the key.",
    author: "Cycle World",
    role: "Editor's Pick",
    rating: 5,
  },
] as const;

const awards: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Trophy, title: "Custom of the Year", sub: "2024 · Bike EXIF" },
  { icon: Award, title: "Editor's Pick", sub: "RIDE Magazine · 2024" },
  { icon: Medal, title: "Design Excellence", sub: "Red Dot · 2024" },
];

const pressLogos = [
  "MOTOR TREND",
  "RIDE MAGAZINE",
  "CYCLE WORLD",
  "BIKE EXIF",
  "ASPHALT & RUBBER",
  "ROBB REPORT",
  "GQ",
  "WALLPAPER*",
];

function StarRow({ rating }: { rating: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
      className="flex gap-1 mb-6"
    >
      {Array.from({ length: rating }).map((_, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, scale: 0.4, rotate: -45 },
            visible: { opacity: 1, scale: 1, rotate: 0 },
          }}
          transition={{ type: "spring", stiffness: 240, damping: 14 }}
        >
          <Star className="w-4 h-4 fill-accent text-accent" />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function ReviewsSection() {
  return (
    <section
      id="press"
      className="relative py-28 md:py-44 bg-[#0a0a0a] overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12">
        <Reveal className="mb-4 flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
            05 · Press
          </span>
          <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-accent/40 to-transparent" />
        </Reveal>

        <h2 className="text-5xl md:text-6xl font-serif italic tracking-[-0.04em] leading-[0.95] mb-20 max-w-3xl">
          <RevealWords text={"What they're saying."} />
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24"
          style={{ perspective: 1200 }}
        >
          {reviews.map((review, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Tilt3D className="group">
                <div className="relative bg-[#121212] border border-white/8 rounded-2xl p-8 md:p-10 flex flex-col overflow-hidden h-full">
                  {/* Decorative big quote mark */}
                  <span
                    aria-hidden
                    className="absolute -top-6 -right-2 font-serif italic text-[160px] leading-none text-white/[0.04] select-none pointer-events-none"
                  >
                    &ldquo;
                  </span>
                  <StarRow rating={review.rating} />
                  <p className="font-serif italic text-xl md:text-2xl leading-relaxed mb-8 flex-grow relative">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-accent mb-1">
                      {review.author}
                    </div>
                    <div className="text-xs text-white/40">{review.role}</div>
                  </div>
                  {/* Hover gradient accent */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        {/* Awards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
          {awards.map((award, i) => (
            <Reveal
              key={award.title}
              delay={0.1 + i * 0.08}
              className="flex items-center gap-4 p-6 border border-white/8 rounded-2xl hover:border-accent/30 hover:bg-white/[0.02] transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <award.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-serif italic text-lg leading-tight">
                  {award.title}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
                  {award.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Infinite marquee of press logos. The track is doubled so the loop is seamless. */}
      <div className="relative w-full overflow-hidden border-y border-white/5 py-8 bg-black/30">
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"
        />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...pressLogos, ...pressLogos].map((logo, i) => (
            <span
              key={i}
              className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
