"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FADE = 0.05;
const scenes = [
  {
    eyebrow: "Power",
    line1: "Raw",
    line2: "precision.",
    body: "An air-cooled V-Twin tuned for torque you feel in your chest — not numbers on a brochure.",
    stat: "86",
    suffix: "HP",
    caption: "Max output · 7,200 rpm",
    glow: "rgba(239,68,68,0.35)",
  },
  {
    eyebrow: "Craft",
    line1: "Built",
    line2: "by hand.",
    body: "Aerospace titanium, hand-laid carbon, proprietary ceramic — zero outsourcing on the critical path.",
    stat: "312",
    suffix: "parts",
    caption: "Hand-assembled · Berlin",
    glow: "rgba(59,130,246,0.35)",
  },
  {
    eyebrow: "Ownership",
    line1: "Yours",
    line2: "alone.",
    body: "Twenty-four allocations worldwide. When yours ships, the mold breaks — literally.",
    stat: "1/24",
    suffix: "",
    caption: "Lifetime allocation",
    glow: "rgba(16,185,129,0.35)",
  },
] as const;

function SpectrumDot({
  scrollYProgress,
  start,
  end,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const dotWidth = useTransform(
    scrollYProgress,
    [start - FADE, start + FADE, end - FADE, end + FADE],
    [8, 32, 32, 8]
  );
  const dotOpacity = useTransform(
    scrollYProgress,
    [start - FADE, start + FADE, end - FADE, end + FADE],
    [0.3, 1, 1, 0.3]
  );
  return (
    <motion.div
      style={{ width: dotWidth, opacity: dotOpacity }}
      className="h-2 rounded-full bg-accent"
    />
  );
}

function SceneLayer({
  scrollYProgress,
  scene,
  index,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  scene: (typeof scenes)[number];
  index: number;
}) {
  const slot = 1 / scenes.length;
  const start = index * slot;
  const end = (index + 1) * slot;
  const range = [
    start - FADE,
    start + FADE,
    end - FADE,
    end + FADE,
  ] as [number, number, number, number];

  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, range, [48, 0, 0, -48]);
  const glowOpacity = useTransform(scrollYProgress, range, [0, 0.6, 0.6, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center">
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70vw 50vh at 70% 40%, ${scene.glow} 0%, transparent 65%)`,
          }}
        />
      </motion.div>

      <motion.div
        style={{ y }}
        className="container mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-accent uppercase mb-6 block">
            0{index + 1} · {scene.eyebrow}
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic tracking-[-0.04em] leading-[0.92]">
            {scene.line1}
            <span className="block text-white/40">{scene.line2}</span>
          </h2>
          <p className="mt-8 text-base md:text-lg text-white/50 font-light max-w-md leading-relaxed">
            {scene.body}
          </p>
        </div>
        <div className="lg:text-right">
          <p className="font-serif italic text-[clamp(5rem,18vw,12rem)] leading-[0.85] tracking-[-0.05em] text-white/95">
            {scene.stat}
          </p>
          {scene.suffix ? (
            <p className="font-mono text-sm tracking-[0.3em] text-accent mt-2 uppercase">
              {scene.suffix}
            </p>
          ) : null}
          <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 mt-4 uppercase">
            {scene.caption}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LabSpectrum() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

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
      "#170a0a",
      "#170a0a",
      "#0a0c1a",
      "#0a0c1a",
      "#091a10",
      "#091a10",
      "#0a0a0a",
    ]
  );

  return (
    <motion.section
      ref={sectionRef}
      id="spectrum"
      style={{ backgroundColor: bgColor }}
      className="relative h-[280vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="container mx-auto px-6 md:px-12 pt-24 md:pt-28 flex items-center justify-between shrink-0">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
            03 · Spectrum
          </span>
          <div className="flex gap-2">
            {scenes.map((s, i) => (
              <SpectrumDot
                key={s.eyebrow}
                scrollYProgress={scrollYProgress}
                start={i * slot}
                end={(i + 1) * slot}
              />
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          {scenes.map((scene, i) => (
            <SceneLayer
              key={scene.eyebrow}
              scrollYProgress={scrollYProgress}
              scene={scene}
              index={i}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 md:px-12 pb-8 flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/35">
            SCROLL · SPECTRUM
          </span>
          <div className="flex-1 max-w-xs h-px bg-white/10 overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="h-full bg-accent"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
