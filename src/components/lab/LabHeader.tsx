"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function LabHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col">
          <span className="font-serif italic text-xl md:text-2xl tracking-tight">
            OBSIDIAN MOTO
          </span>
          <span className="text-[9px] font-mono tracking-[0.35em] text-accent uppercase">
            K7 · Berlin
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-[0.2em] text-white/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Berlin · <BerlinClock /> CET
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href="/original"
            className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 hover:text-accent transition-colors"
            data-cursor="hover"
          >
            ← v1
          </Link>
          <a
            href="#reserve"
            className="hidden md:inline-flex text-[10px] font-mono uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-accent/90 hover:bg-accent text-white transition-colors"
            data-cursor="hover"
          >
            Reserve K7
          </a>
        </div>
      </div>
    </motion.header>
  );
}
