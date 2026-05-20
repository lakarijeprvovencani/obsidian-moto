"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface SceneData {
  eyebrow: string;
  /** First headline line — rendered in white italic. */
  titleLine1: string;
  /** Second headline line — rendered in `text-white/40` italic, the brand's signature muted echo. */
  titleLine2: string;
  body: string;
  statValue: string;
  statSuffix: string;
  statCaption: string;
  glow: string;
  accent: string;
}

const scenes: SceneData[] = [
  {
    eyebrow: "01 · Power",
    titleLine1: "Power",
    titleLine2: "you can feel.",
    body:
      "1923cc of air-cooled V-Twin. 142 newton-metres of torque you feel in your chest before you hear it. Tuned by hand on the dyno, signed off by the builder.",
    statValue: "86",
    statSuffix: "HP",
    statCaption: "Max output · 7,200 rpm",
    glow: "rgba(220,38,38,0.22)",
    accent: "#ef4444",
  },
  {
    eyebrow: "02 · Refined",
    titleLine1: "Refined",
    titleLine2: "by hand.",
    body:
      "Aerospace-grade titanium. Hand-laid carbon fiber. A proprietary matte ceramic coating that drinks light. Six weeks per build, one master builder, no shortcuts.",
    statValue: "312",
    statSuffix: "parts",
    statCaption: "Hand-assembled · zero outsourcing",
    glow: "rgba(59,130,246,0.24)",
    accent: "#3b82f6",
  },
  {
    eyebrow: "03 · Yours",
    titleLine1: "Yours",
    titleLine2: "alone.",
    body:
      "Twenty-four units worldwide. Twenty-four VINs engraved by the builder. Every delivery comes with a signed manifest, lifetime service at the Berlin workshop, and a key only the owner ever holds.",
    statValue: "1 / 24",
    statSuffix: "",
    statCaption: "Lifetime allocation",
    glow: "rgba(16,185,129,0.22)",
    accent: "#10b981",
  },
];

// Single source of truth for the crossfade overlap between adjacent scenes.
// Same constant is used to compute (a) per-scene opacity / y / glow ranges
// and (b) the section's animated background-color stops, so the bg morph
// peaks at the exact same scroll position where each scene is fully visible.
// Pre-fix: bg stops and scene ranges were misaligned, which read as "lag".
const FADE = 0.05;

// Each scene owns one third of the section's vertical travel, plus tiny
// fade zones at each border so adjacent scenes crossfade rather than snap.
// Returned as a 4-tuple so the call sites can hand it straight to
// `useTransform` without any casts.
type SceneRange = [number, number, number, number];

function getRange(index: number, total: number): SceneRange {
  const slot = 1 / total;
  const start = index * slot;
  const end = (index + 1) * slot;
  return [
    Math.max(0, start - FADE),
    start + FADE,
    end - FADE,
    Math.min(1, end + FADE),
  ];
}

function Scene({
  scene,
  index,
  total,
  scrollYProgress,
}: {
  scene: SceneData;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = getRange(index, total);
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, range, [60, 0, 0, -60]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center px-6 md:px-12 pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 max-w-6xl w-full items-center">
        {/* Left: text */}
        <div className="max-w-xl pointer-events-auto">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] uppercase tracking-[0.3em] font-mono"
              style={{ color: scene.accent }}
            >
              {scene.eyebrow}
            </span>
            <div
              className="h-px flex-1 max-w-[120px]"
              style={{
                background: `linear-gradient(to right, ${scene.accent}66, transparent)`,
              }}
            />
          </div>

          {/*
            Two-line italic headline with a muted second line — the brand's
            signature h2 rhythm. We deliberately skip <RevealWords /> here
            because every scene shares this sticky stage; whileInView would
            fire all three word staggers simultaneously the moment the
            section enters the viewport, long before scenes 2 and 3 are
            actually visible. The crossfade IS the entrance animation: the
            parent motion.div ramps opacity + y as each scene takes its
            scroll dwell window.
          */}
          <h3 className="text-5xl md:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95] mb-8">
            {scene.titleLine1}
            <span className="block text-white/40">{scene.titleLine2}</span>
          </h3>

          <p className="text-base md:text-lg text-white/55 leading-relaxed font-light">
            {scene.body}
          </p>
        </div>

        {/* Right: large stat block */}
        <div className="flex flex-col items-start lg:items-end pointer-events-auto">
          <div
            className="font-serif italic leading-[0.85] tracking-[-0.05em] text-[7rem] md:text-[10rem]"
            style={{ color: "#fff" }}
          >
            {scene.statValue}
          </div>

          {scene.statSuffix && (
            <div className="text-2xl md:text-3xl font-mono uppercase tracking-[0.3em] text-white/40 mt-1 lg:-mt-2">
              {scene.statSuffix}
            </div>
          )}

          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-4 font-mono">
            {scene.statCaption}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GlowLayer({
  scene,
  index,
  total,
  scrollYProgress,
}: {
  scene: SceneData;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = getRange(index, total);
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);

  return (
    <motion.div
      aria-hidden
      style={{
        opacity,
        background: `radial-gradient(ellipse 80vw 60vh at 50% 50%, ${scene.glow} 0%, transparent 65%)`,
      }}
      className="absolute inset-0 pointer-events-none mix-blend-screen"
    />
  );
}

function Dot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = getRange(index, total);
  const w = useTransform(scrollYProgress, range, [8, 28, 28, 8]);
  const opacity = useTransform(scrollYProgress, range, [0.3, 1, 1, 0.3]);
  return (
    <motion.div
      style={{ width: w, opacity }}
      className="h-px bg-white/80 rounded-full"
    />
  );
}

export default function Pillars() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 8-stop bg color morph derived from the same FADE constant the scenes
  // use, so each tint peaks exactly while its scene is fully visible and
  // the crossfade between tints lines up frame-for-frame with the
  // crossfade between scenes. This is what kills the perceived "lag".
  //
  //   0       FADE     slot−FADE  slot+FADE   2·slot−FADE  2·slot+FADE  1−FADE   1
  //   ├ fade ─┼ scene0 ┼ fade-out ┼ scene1   ┼ fade-out   ┼ scene2     ┼ fade ─┤
  //   black     tint1                 tint2                   tint3        black
  const slot = 1 / scenes.length;
  const bgColor = useTransform(
    scrollYProgress,
    [
      0,
      FADE,
      slot - FADE,
      slot + FADE,
      2 * slot - FADE,
      2 * slot + FADE,
      1 - FADE,
      1,
    ],
    [
      "#0a0a0a",
      "#170a0a", // scene 1 — warm crimson tint
      "#170a0a",
      "#0a0c1a", // scene 2 — cool navy tint
      "#0a0c1a",
      "#091a10", // scene 3 — deep emerald tint
      "#091a10",
      "#0a0a0a",
    ]
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor: bgColor }}
      // NOTE: do NOT put `overflow-hidden` here — it creates a block formatting
      // context that breaks `position: sticky` on the child stage (the text
      // would scroll away instead of pinning). The inner sticky stage already
      // clips its own contents.
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Color-themed ambient glow per scene */}
        {scenes.map((s, i) => (
          <GlowLayer
            key={`glow-${i}`}
            scene={s}
            index={i}
            total={scenes.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Section eyebrow pinned to the top */}
        <div className="absolute top-24 md:top-28 left-6 md:left-12 right-6 md:right-12 z-10 flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-mono">
              06 · Pillars
            </span>
            <div className="h-px w-12 bg-white/20" />
          </div>

          {/* Scene-progress dots */}
          <div className="flex items-center gap-2">
            {scenes.map((_, i) => (
              <Dot
                key={`dot-${i}`}
                index={i}
                total={scenes.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Stacked scenes — exactly one visible at any scroll position */}
        {scenes.map((s, i) => (
          <Scene
            key={i}
            scene={s}
            index={i}
            total={scenes.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Subtle bottom progress bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-none">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/35">
            SCROLL · PILLARS
          </span>
          <div className="w-24 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="absolute inset-0 bg-white/60"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
