"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sections = [
  { id: "showcase", label: "Showcase" },
  { id: "configurator-hero", label: "Listing" },
  { id: "craft", label: "Craft" },
  { id: "paint", label: "Configurator" },
  { id: "press", label: "Press" },
  { id: "ignition", label: "Ignition" },
  { id: "subscribe", label: "Subscribe" },
] as const;

/**
 * Vertical section navigator pinned to the right edge.
 *  - Each pip = one section. Active section has a longer accent line + visible label.
 *  - Click = smooth-scroll to the section.
 *  - Uses IntersectionObserver so the active state tracks the user's scroll.
 *  - Hidden on screens narrower than the lg breakpoint (would crowd the layout).
 */
export default function SectionNav() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios = new Map<string, number>();

    const update = () => {
      let best: { id: string; ratio: number } | null = null;
      ratios.forEach((ratio, id) => {
        if (!best || ratio > best.ratio) best = { id, ratio };
      });
      if (best && (best as { id: string; ratio: number }).ratio > 0) {
        setActive((best as { id: string; ratio: number }).id);
      }
    };

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });
          update();
        },
        // Multiple thresholds so we get smooth ratio updates as the user scrolls.
        { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="hidden lg:flex fixed right-6 xl:right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4"
    >
      {sections.map((s, i) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            aria-label={`Jump to ${s.label}`}
            className="group flex items-center gap-3 self-end"
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-[0.25em] font-mono transition-all duration-300",
                isActive
                  ? "text-white/80 opacity-100 translate-x-0"
                  : "text-white/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              )}
            >
              {String(i + 1).padStart(2, "0")} · {s.label}
            </span>
            <motion.span
              animate={{
                width: isActive ? 28 : 12,
                backgroundColor: isActive
                  ? "rgba(59,130,246,0.95)"
                  : "rgba(255,255,255,0.3)",
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px rounded-full group-hover:bg-white"
            />
          </button>
        );
      })}
    </nav>
  );
}
