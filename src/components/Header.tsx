"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Models", href: "#craft" },
  { label: "Custom Builds", href: "#paint" },
  { label: "About", href: "#craft" },
  { label: "Contact", href: "#ignition" },
];

/** Berlin time, refreshes every minute. SSR renders the placeholder so we
 *  don't get a hydration mismatch on the first paint. */
function BerlinClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-DE", {
          timeZone: "Europe/Berlin",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-gradient-to-b from-[#0a0a0a]/60 to-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
        {/* Brand */}
        <a href="#showcase" className="flex flex-col group">
          <span className="font-serif italic text-2xl tracking-tight leading-none group-hover:text-white transition-colors">
            OBSIDIAN MOTO
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-1 font-sans">
            EST. 2018
          </span>
        </a>

        {/* Live studio status — pulse dot, location, real Berlin clock */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/8 backdrop-blur-md">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-green-400" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-mono">
            Studio open · Berlin
          </span>
          <span className="text-white/20">·</span>
          <span className="text-[10px] tracking-wider text-white/50 font-mono">
            <BerlinClock /> CET
          </span>
        </div>

        {/* Nav — underline-grow on hover */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative py-1 text-white/80 hover:text-white transition-colors"
            >
              <span>{item.label}</span>
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
            </a>
          ))}
        </nav>

        <a
          href="#paint"
          className="group flex items-center gap-2 text-sm font-medium tracking-wide text-white/85 hover:text-white transition-colors"
        >
          <span>Cart</span>
          <span className="font-mono text-[11px] text-white/40 group-hover:text-accent transition-colors">
            (0)
          </span>
        </a>
      </div>
    </motion.header>
  );
}
