"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const colors = [
  { name: "Obsidian Matte", hex: "#111111", price: 0 },
  { name: "Vantablack", hex: "#000000", price: 1200 },
  { name: "Gunmetal", hex: "#2a2a2a", price: 800 },
  { name: "Cobalt Blue", hex: "#1e3a8a", price: 1500 },
];

const exhausts = [
  { name: "Standard Dual", price: 0 },
  { name: "Titanium Slash-cut", price: 2400 },
  { name: "Carbon Fiber Racing", price: 3100 },
];

const seats = [
  { name: "Premium Leather", price: 0 },
  { name: "Alcantara Sport", price: 450 },
];

export default function ConfigSection() {
  const [color, setColor] = useState(colors[0]);
  const [exhaust, setExhaust] = useState(exhausts[0]);
  const [seat, setSeat] = useState(seats[0]);

  const totalPrice = 34900 + color.price + exhaust.price + seat.price;

  return (
    <section className="py-24 md:py-40 bg-[#141414] border-y border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Image Placeholder */}
          <div className="w-full lg:w-3/5 h-[400px] md:h-[600px] relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="w-full h-full rounded-2xl overflow-hidden bg-black border border-white/10 relative flex items-center justify-center"
            >
              <img
                src="/hero-bike.jpg"
                alt="Configurator"
                className="w-full h-full object-contain scale-110"
              />
            </motion.div>
          </div>

          {/* Right: Configurator */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl mb-12"
            >
              Configure <br />
              <span className="text-white/40">Yours.</span>
            </motion.h2>

            {/* Colors */}
            <div className="mb-10">
              <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">Color</div>
              <div className="flex gap-4">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all",
                      color.name === c.name ? "border-accent scale-110" : "border-transparent hover:border-white/30"
                    )}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
              <div className="mt-3 text-sm text-white/70 flex justify-between">
                <span>{color.name}</span>
                <span>{color.price > 0 ? `+€${color.price}` : "Included"}</span>
              </div>
            </div>

            {/* Exhaust */}
            <div className="mb-10">
              <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">Exhaust System</div>
              <div className="space-y-3">
                {exhausts.map((e) => (
                  <button
                    key={e.name}
                    onClick={() => setExhaust(e)}
                    className={cn(
                      "w-full flex justify-between items-center p-4 rounded-xl border transition-all text-left",
                      exhaust.name === e.name 
                        ? "border-accent bg-accent/5 text-white" 
                        : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    )}
                  >
                    <span className="text-sm font-medium">{e.name}</span>
                    <span className="text-sm font-mono">{e.price > 0 ? `+€${e.price}` : "Included"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seat */}
            <div className="mb-12">
              <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">Seat Material</div>
              <div className="space-y-3">
                {seats.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSeat(s)}
                    className={cn(
                      "w-full flex justify-between items-center p-4 rounded-xl border transition-all text-left",
                      seat.name === s.name 
                        ? "border-accent bg-accent/5 text-white" 
                        : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    )}
                  >
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-sm font-mono">{s.price > 0 ? `+€${s.price}` : "Included"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total & CTA */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm text-white/50 uppercase tracking-[0.2em]">Total Price</span>
                <span className="font-serif italic text-4xl">€{totalPrice.toLocaleString()}</span>
              </div>
              <button className="w-full bg-white text-black hover:bg-white/90 transition-colors py-5 rounded-none font-medium text-sm tracking-wide">
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
