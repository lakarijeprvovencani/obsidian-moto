"use client";

import {
  Cog,
  Zap,
  TrendingUp,
  Gauge,
  Weight,
  Fuel,
  Calendar,
  Paintbrush,
  Hash,
  Download,
  Activity,
  GitCompare,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const specs: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: Cog, label: "Engine", value: "1923cc V-Twin" },
  { icon: Zap, label: "Power", value: "86 HP" },
  { icon: TrendingUp, label: "Torque", value: "142 Nm" },
  { icon: Gauge, label: "Top Speed", value: "195 km/h" },
  { icon: Weight, label: "Weight", value: "308 kg" },
  { icon: Fuel, label: "Fuel", value: "18.9 L" },
  { icon: Calendar, label: "Year", value: "2024" },
  { icon: Paintbrush, label: "Color", value: "Obsidian Matte" },
  { icon: Hash, label: "VIN", value: "OB24-K7-001" },
];

const UNITS_CLAIMED = 23;
const UNITS_TOTAL = 24;
const PROGRESS_PCT = (UNITS_CLAIMED / UNITS_TOTAL) * 100;

export default function SpecsPanel() {
  return (
    <div className="w-full bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/8 rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/60">
          Specifications
        </h3>
        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <ul className="space-y-3 mb-5">
        {specs.map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex items-center gap-3 text-xs">
            <Icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            <span className="text-white/45 w-20 flex-shrink-0">{label}</span>
            <span className="ml-auto text-white/90 font-medium text-right">
              {value}
            </span>
          </li>
        ))}
      </ul>

      {/* Live build status — tech block */}
      <div className="mt-2 mb-5 p-4 rounded-xl bg-black/40 border border-accent/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-3 h-3 rounded-full bg-accent/30 animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-accent">
            Live · Build Status
          </span>
        </div>

        <div className="flex items-end justify-between mb-2">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
            Production
          </span>
          <span className="font-mono text-[11px] text-white/90">
            <span className="text-accent">{UNITS_CLAIMED}</span>
            <span className="text-white/30"> / {UNITS_TOTAL}</span>
            <span className="text-white/40 ml-1">claimed</span>
          </span>
        </div>

        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-accent/50 via-accent to-blue-300 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            style={{ width: `${PROGRESS_PCT}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-white/40">
            <ShieldCheck className="w-3 h-3 text-green-400" />
            <span>Auth · Verified</span>
          </div>
          <span className="text-white/30">Sig 0xA4F2…91C</span>
        </div>
      </div>

      {/* Tech CTAs — matching the left card's stacked-button depth */}
      <div className="space-y-2.5">
        <button className="w-full bg-gradient-to-r from-accent to-blue-600 text-white py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          Open Configurator
        </button>
        <button className="w-full border border-white/15 text-white/85 py-3 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
          <GitCompare className="w-3.5 h-3.5" /> Compare Specs
        </button>
        <button className="w-full border border-white/15 text-white/85 py-3 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
          <Download className="w-3.5 h-3.5" /> Technical Datasheet
        </button>
      </div>
    </div>
  );
}
