"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Settings,
  Bike,
  Heart,
  Share2,
  Eye,
  CheckCircle2,
} from "lucide-react";
import BikeViewer from "./BikeViewer";
import SpecsPanel from "./SpecsPanel";
import { cn } from "@/lib/utils";

const TABS = ["Exterior", "Details", "Engine"] as const;
type Tab = (typeof TABS)[number];

// 8 evenly spread frames around the bike for the thumbnail strip.
const ANGLE_THUMBS = [1, 9, 17, 24, 31, 38, 45, 53];

const KEY_INFO = [
  { icon: Calendar, label: "Year", value: "2024" },
  { icon: Bike, label: "Build", value: "Custom Bobber" },
  { icon: Fuel, label: "Fuel", value: "Premium 18.9 L" },
  { icon: Settings, label: "Transmission", value: "6-Speed" },
];

export default function Hero() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Exterior");

  return (
    <section className="relative pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-5 lg:gap-6">
          {/* ─────────── LEFT: Listing card ─────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/8 rounded-2xl p-6 flex flex-col"
          >
            <button className="self-start flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-colors mb-6">
              <ArrowLeft className="w-3 h-3" />
              Back to Models
            </button>

            <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-accent">
                New Arrival · 2024
              </span>
            </div>

            <h1 className="font-serif italic text-4xl md:text-5xl leading-[0.95] tracking-[-0.03em] mb-2">
              Obsidian K7
            </h1>
            <p className="text-sm text-white/50 mb-6">The blackest ride.</p>

            <div className="flex items-end gap-3 mb-3">
              <span className="font-serif italic text-4xl tracking-tight">€34,900</span>
              <span className="inline-flex items-center gap-1.5 mb-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-[9px] uppercase tracking-[0.2em] font-medium text-green-400">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Available
              </span>
            </div>
            <p className="text-xs text-white/40 mb-7">Ships in 2 weeks · Hand-built, one of 24</p>

            <div className="space-y-3 mb-7 py-5 border-y border-white/5">
              {KEY_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                  <span className="text-xs text-white/40 w-24 flex-shrink-0">{label}</span>
                  <span className="text-xs text-white/85 font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <button className="w-full bg-gradient-to-r from-accent to-blue-600 text-white py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] transition-all">
                Reserve Now
              </button>
              <button className="w-full border border-white/15 text-white/85 py-3 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Book a Viewing
              </button>
              <button className="w-full border border-white/15 text-white/85 py-3 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
                <Heart className="w-3.5 h-3.5" /> Add to Favorites
              </button>
              <button className="w-full border border-white/15 text-white/85 py-3 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-3.5 h-3.5" /> Share this Build
              </button>
            </div>
          </motion.aside>

          {/* ─────────── CENTER: Bike viewer + tabs + thumbnails ─────────── */}
          <div className="order-1 lg:order-2 flex flex-col">
            {/* Viewer stage */}
            <div className="relative w-full h-[56vh] md:h-[70vh] rounded-2xl overflow-hidden bg-black border border-white/5">

              <BikeViewer currentFrame={currentFrame} setCurrentFrame={setCurrentFrame} />

              {/* 360° pill at bottom of stage */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/70">360°</span>
              </div>
            </div>

            {/* Tab row */}
            <div className="mt-5 flex items-center justify-center gap-1 p-1 bg-[#0f0f0f]/60 border border-white/5 rounded-full self-center">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 text-[10px] uppercase tracking-[0.25em] font-medium rounded-full transition-all",
                    activeTab === tab
                      ? "bg-accent/15 text-accent border border-accent/40"
                      : "text-white/40 hover:text-white/80 border border-transparent"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Thumbnail strip */}
            <div className="mt-5 grid grid-cols-4 md:grid-cols-8 gap-2.5">
              {ANGLE_THUMBS.map((frame, i) => {
                const active = currentFrame === frame;
                return (
                  <button
                    key={frame}
                    onClick={() => setCurrentFrame(frame)}
                    aria-label={`View angle ${i + 1}`}
                    className={cn(
                      "group relative aspect-[3/2] rounded-lg overflow-hidden border transition-all bg-black",
                      active
                        ? "border-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-[#0a0a0a]"
                        : "border-white/8 hover:border-white/30 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={`/frames/f${String(frame).padStart(3, "0")}.jpg`}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      draggable={false}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────── RIGHT: Specifications ─────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-3 lg:order-3"
          >
            <SpecsPanel />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
