"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, PlayCircle, AtSign, Mail } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import RevealWords from "@/components/effects/RevealWords";
import Counter from "@/components/effects/Counter";

export default function LabClose() {
  return (
    <>
      <section
        id="reserve"
        className="relative py-28 md:py-44 bg-[#0a0a0a] overflow-hidden border-t border-white/5"
      >
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            rotate: [0, 8, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[50vw] max-w-xl h-[50vw] max-h-xl rounded-full bg-accent/20 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -30, 25, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[40vw] max-w-lg h-[40vw] max-h-lg rounded-full bg-violet-600/15 blur-[100px] pointer-events-none"
        />

        <div className="container mx-auto px-6 md:px-12 relative text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-[0.25em] text-white/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              08 · Reserve
            </span>
          </Reveal>

          <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif italic tracking-[-0.04em] leading-[0.92] max-w-4xl mx-auto">
            <RevealWords text="Claim your darkness." />
          </h2>

          <Reveal delay={0.15} className="mt-6 text-white/50 font-light max-w-md mx-auto">
            One email per quarter. No resale lists. First access when the next cohort opens.
          </Reveal>

          <Reveal delay={0.25} className="mt-10 max-w-md mx-auto">
            <form
              className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none min-w-0"
                aria-label="Email"
              />
              <button
                type="submit"
                data-cursor="hover"
                className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-accent hover:text-white transition-colors shrink-0"
              >
                Notify Me
              </button>
            </form>
          </Reveal>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { to: 124, label: "Builds shipped" },
              { to: 18, label: "Countries" },
              { to: 5, label: "Owner rating", decimals: 1, suffix: "/5" },
            ].map((stat) => (
              <Reveal key={stat.label} delay={0.3}>
                <p className="font-serif italic text-2xl md:text-3xl">
                  <Counter
                    to={stat.to}
                    decimals={"decimals" in stat ? stat.decimals : 0}
                    suffix={"suffix" in stat ? stat.suffix : ""}
                  />
                </p>
                <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 mt-1 uppercase">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <p
            aria-hidden
            className="font-serif italic text-[12vw] md:text-[10vw] tracking-[-0.05em] leading-none bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent select-none mb-12"
          >
            OBSIDIAN
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="font-serif italic text-xl mb-1">Obsidian Moto</p>
              <p className="text-[10px] font-mono tracking-[0.25em] text-white/40">
                Est. 2018 · Berlin · Lab Experience
              </p>
              <div className="flex gap-3 mt-6">
                {[Camera, PlayCircle, AtSign, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    data-cursor="hover"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-accent/40 hover:text-accent transition-colors"
                    aria-label="Social"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
              <Link href="/original" className="hover:text-accent transition-colors" data-cursor="hover">
                ← v1 experience
              </Link>
              <a href="#cinema" className="hover:text-accent transition-colors" data-cursor="hover">
                Back to top
              </a>
            </div>
          </div>
          <p className="mt-12 text-[10px] font-mono text-white/30 tracking-[0.15em]">
            © {new Date().getFullYear()} Obsidian Moto · Craft over convention
          </p>
        </div>
      </footer>
    </>
  );
}
