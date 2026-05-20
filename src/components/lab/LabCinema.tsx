"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

const VIDEO_SRC = "/bike-rotation.mp4";

type ChapterPosition = "top-left" | "top-right" | "bottom";

const chapters = [
  {
    range: [0, 0.05, 0.38, 0.44] as [number, number, number, number],
    position: "top-left" as ChapterPosition,
    tag: "K7 · 2024",
    title: "Born in darkness.",
    body: "Matte black. Electric rim light. Twenty-four units. One silhouette.",
  },
  {
    range: [0.38, 0.44, 0.52, 0.58] as [number, number, number, number],
    position: "top-right" as ChapterPosition,
    tag: "Powertrain",
    title: "Torque you feel.",
    body: "1923cc air-cooled V-Twin. Hand-tuned for the chest, not the spec sheet.",
  },
  {
    range: [0.52, 0.58, 0.95, 1] as [number, number, number, number],
    position: "bottom" as ChapterPosition,
    tag: "Finish",
    title: "Light dies here.",
    body: "Ceramic coating that drinks photons. The blackest ride on earth.",
  },
] as const;

function ChapterCard({
  scrollYProgress,
  chapter,
  index,
  total,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  chapter: (typeof chapters)[number];
  index: number;
  total: number;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const opacityOut: [number, number, number, number] = isFirst
    ? [1, 1, 1, 0]
    : isLast
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0];
  const yOut: [number, number, number, number] = isFirst
    ? [0, 0, 0, 24]
    : isLast
      ? [24, 0, 0, 0]
      : [24, 0, 0, 24];

  const opacity = useTransform(scrollYProgress, chapter.range, opacityOut);
  const y = useTransform(scrollYProgress, chapter.range, yOut);

  const isTopLeft = chapter.position === "top-left";
  const isTopRight = chapter.position === "top-right";
  const isTop = isTopLeft || isTopRight;

  // Mobile baseline: always anchored at the bottom of the sticky stage. On
  // md+ each chapter takes its assigned anchor so the three chapters chase
  // around the viewport instead of all stacking in the bottom corner.
  const wrapperClasses = cn(
    "absolute pointer-events-none px-6 md:px-12",
    "inset-x-0 bottom-0 pb-28",
    isTopLeft &&
      "md:bottom-auto md:right-auto md:top-[22%] md:left-12 lg:left-20 md:max-w-md lg:max-w-lg md:pb-0",
    isTopRight &&
      "md:bottom-auto md:left-auto md:top-[22%] md:right-12 lg:right-20 md:max-w-md lg:max-w-lg md:pb-0",
    !isTop && "md:pb-32"
  );

  const innerClasses = cn(
    "text-center",
    isTopLeft && "md:text-left",
    isTopRight && "md:text-right md:ml-auto",
    !isTop && "max-w-3xl mx-auto md:text-left"
  );

  const titleClasses = cn(
    "font-serif italic tracking-[-0.04em] leading-[0.92] mb-4",
    "text-4xl sm:text-5xl",
    isTop ? "md:text-5xl lg:text-6xl" : "md:text-7xl lg:text-8xl"
  );

  const bodyClasses = cn(
    "text-sm md:text-base text-white/50 font-light leading-relaxed",
    isTopRight
      ? "max-w-md mx-auto md:mx-0 md:ml-auto"
      : "max-w-lg mx-auto md:mx-0"
  );

  return (
    <motion.article
      style={{ opacity, y }}
      className={wrapperClasses}
    >
      <div className={innerClasses}>
        <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-accent font-mono mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
          {chapter.tag}
        </span>
        <h1 className={titleClasses}>{chapter.title}</h1>
        <p className={bodyClasses}>{chapter.body}</p>
      </div>
    </motion.article>
  );
}

export default function LabCinema() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const duration = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ringProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.9, 0.5, 0.5, 0.9]
  );

  const tickSeek = () => {
    const video = videoRef.current;
    rafId.current = null;
    if (!video || !duration.current) return;
    if (Math.abs(video.currentTime - targetTime.current) > 0.01) {
      video.currentTime = targetTime.current;
    }
  };

  const scheduleSeek = () => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(tickSeek);
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!duration.current) return;
    const t = Math.max(0, Math.min(1, (p - 0.08) / 0.84));
    targetTime.current = t * duration.current;
    scheduleSeek();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      duration.current = video.duration || 0;
      const p = scrollYProgress.get();
      const t = Math.max(0, Math.min(1, (p - 0.08) / 0.84));
      targetTime.current = t * duration.current;
      video.currentTime = targetTime.current;
    };

    if (video.readyState >= 1 && video.duration) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bikeScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.08, 1, 1.05]
  );

  return (
    <section
      ref={sectionRef}
      id="cinema"
      className="relative bg-black h-[220vh] md:h-[280vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{ scale: bikeScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 scale-[1.3] md:scale-100">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Vignette + scanline texture */}
        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,#000_85%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_3px)]"
        />

        {/* Circular scrub ring — kept tight to the corner on desktop so the
            top-right chapter card has room. */}
        <div className="absolute top-24 right-6 md:top-24 md:right-4 lg:right-6 z-20 flex flex-col items-center gap-2">
          <div className="relative w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={1}
                style={{
                  pathLength: ringProgress,
                  strokeDasharray: "1 1",
                }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono tracking-[0.15em] text-white/50">
              360°
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-white/35 uppercase">
            Scroll
          </span>
        </div>

        {/* Eyebrow top-left — small accent inside the top-left chapter
            quadrant on desktop. Mobile keeps it as a standalone tag. */}
        <div className="absolute top-24 left-6 md:top-24 md:left-4 lg:left-6 z-20 md:hidden">
          <p className="text-[10px] font-mono tracking-[0.35em] text-white/40 uppercase mb-2">
            01 · Cinema
          </p>
          <p className="font-serif italic text-lg text-white/70">
            Obsidian K7
          </p>
        </div>

        {chapters.map((c, i) => (
          <ChapterCard
            key={c.tag}
            scrollYProgress={scrollYProgress}
            chapter={c}
            index={i}
            total={chapters.length}
          />
        ))}

        {/* Chapter progress strip */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 z-20">
          <div className="h-px bg-white/10 overflow-hidden rounded-full">
            <motion.div
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="h-full bg-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
