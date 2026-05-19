"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-gradient-to-b from-[#0a0a0a]/60 to-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-serif italic text-2xl tracking-tight leading-none">OBSIDIAN MOTO</span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 mt-1 font-sans">EST. 2018</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {["Models", "Custom Builds", "About", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="hover:text-accent transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <button className="text-sm font-medium tracking-wide hover:text-accent transition-colors">
          Cart (0)
        </button>
      </div>
    </motion.header>
  );
}
