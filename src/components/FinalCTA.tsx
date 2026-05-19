"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "./effects/Reveal";
import RevealWords from "./effects/RevealWords";
import Counter from "./effects/Counter";

const stats = [
  { label: "Builds shipped", to: 124 },
  { label: "Countries", to: 18 },
  { label: "Owner rating", to: 5, decimals: 1, suffix: "/5" },
] as const;

export default function FinalCTA() {
  return (
    <section className="relative py-32 md:py-48 bg-[#0a0a0a] overflow-hidden">
      {/* Aurora — two slow-rotating radial blurs that breathe a soft accent
         glow behind the headline. Pure CSS via framer animate. */}
      <motion.div
        aria-hidden
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["-5%", "5%", "-5%"],
          rotate: [0, 25, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[80vh] rounded-full opacity-60 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.08) 30%, transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        animate={{
          x: ["5%", "-8%", "5%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[60vh] rounded-full opacity-50 blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Tiny floating particles for sparkle */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {Array.from({ length: 18 }).map((_, i) => {
          // Deterministic-ish pseudo-random positions so SSR/CSR stay in sync.
          const x = ((i * 53) % 100);
          const y = ((i * 37) % 100);
          const delay = (i * 0.4) % 6;
          return (
            <motion.div
              key={i}
              animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -20, 0] }}
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 rounded-full bg-accent"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-mono">
              Drops Quarterly · 50 builds / year
            </span>
          </Reveal>

          <h2 className="text-6xl md:text-8xl font-serif italic tracking-[-0.04em] leading-[0.95] mb-8">
            <RevealWords text={"Yours"} />
            <span className="block text-white/40">
              <RevealWords text={"for the taking."} delay={0.2} />
            </span>
          </h2>

          <Reveal delay={0.4}>
            <p className="text-white/60 text-lg md:text-xl mb-14 font-light max-w-xl mx-auto">
              Subscribe to be first when new builds drop. No spam, no resale
              lists. One email per quarter.
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <form
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-20"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative w-full group">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-black/40 border border-white/15 px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors backdrop-blur-sm"
                  required
                />
                {/* Animated focus glow */}
                <div className="absolute -inset-px pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 shadow-[0_0_24px_rgba(59,130,246,0.35)]" />
              </div>
              <button
                type="submit"
                className="group bg-white text-black px-8 py-4 font-medium text-sm tracking-[0.2em] uppercase hover:bg-accent hover:text-white transition-colors whitespace-nowrap flex items-center justify-center gap-2"
              >
                Notify Me
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </Reveal>

          <Reveal
            delay={0.6}
            className="grid grid-cols-3 gap-4 border-t border-white/10 pt-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif italic text-3xl md:text-5xl mb-2 tracking-tight">
                  <Counter
                    to={stat.to}
                    decimals={"decimals" in stat ? stat.decimals : 0}
                    suffix={"suffix" in stat ? stat.suffix : ""}
                  />
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
                  {stat.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
