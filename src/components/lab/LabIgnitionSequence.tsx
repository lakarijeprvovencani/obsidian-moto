"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";

const VIDEO_SRC = "/ignite-cinema.mp4";

/**
 * Same scrub philosophy as ScrollShowcase: section is 200vh (260vh on
 * desktop) with a single sticky stage that pins for the middle ~33%. We
 * map (progress - 0.1) / 0.8 so the front + back 10% are static and the
 * inner 80% drives the video frame-for-frame.
 *
 * The video itself only has useful footage up to ~76% of duration — past
 * that point the starter has already been pressed. So scroll 0→1 maps to
 * video 0→VIDEO_TIMELINE_END.
 */
const VIDEO_TIMELINE_END = 0.76;

/** Where in scroll progress the cinematic handoff fires (once per visit). */
const HANDOFF_AT = 0.95;
const HANDOFF_RESET_BELOW = 0.6;

const COUNTDOWN_STEP_MS = 220;
const INTRO_MS = 150;
const SCROLL_DURATION = 0.7;

const captions = [
  {
    range: [0, 0.05, 0.36, 0.42] as [number, number, number, number],
    side: "left" as const,
    eyebrow: "01 · The invitation",
    title: "This could\nbe you.",
    body: "Picture yourself on the K7 — matte black, Berlin nights, the road wide open.",
  },
  {
    range: [0.36, 0.42, 0.52, 0.58] as [number, number, number, number],
    side: "right" as const,
    eyebrow: "02 · Your machine",
    title: "Built for\nyour hands.",
    body: "Every gauge wakes for a single rider. Hand-assembled. One of twenty-four.",
  },
  {
    range: [0.52, 0.58, 0.72, 0.78] as [number, number, number, number],
    side: "left" as const,
    eyebrow: "03 · The moment",
    title: "Almost\nyours.",
    body: "The starter meets your thumb. One press between dreaming and owning.",
  },
  {
    range: [0.72, 0.78, 0.95, 1] as [number, number, number, number],
    side: "right" as const,
    eyebrow: "04 · Ready",
    title: "The seat\nis open.",
    body: "You're on the bike. Hold steady — we'll bring you to the ignition.",
  },
] as const;

function Caption({
  scrollYProgress,
  caption,
  index,
  total,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  caption: (typeof captions)[number];
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
    ? [0, 0, 0, -40]
    : isLast
      ? [40, 0, 0, 0]
      : [40, 0, 0, -40];

  const opacity = useTransform(scrollYProgress, caption.range, opacityOut);
  const y = useTransform(scrollYProgress, caption.range, yOut);
  const isLeftSide = caption.side === "left";
  return (
    <motion.div
      style={{ opacity, y }}
      className={[
        "absolute z-10",
        "inset-x-6 top-[12%] max-w-none",
        "md:inset-x-auto md:top-1/2 md:-translate-y-1/2 md:max-w-md",
        isLeftSide
          ? "md:left-12 lg:left-20"
          : "md:right-12 lg:right-20 md:text-right",
      ].join(" ")}
    >
      <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono mb-3 md:mb-4">
        {caption.eyebrow}
      </div>
      <h2 className="font-serif italic text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.03em] whitespace-pre-line mb-4 md:mb-6">
        {caption.title}
      </h2>
      <p className="text-sm md:text-base text-white/55 leading-relaxed font-light">
        {caption.body}
      </p>
    </motion.div>
  );
}

type HandoffPhase = "idle" | "complete";

function HandoffOverlay({ countdown }: { countdown: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/72 backdrop-blur-[3px] pointer-events-none"
    >
      <div className="text-center px-6 w-full max-w-3xl">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/35 bg-accent/10 text-[10px] font-mono tracking-[0.3em] text-accent uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          1 of 24 · Still available
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 font-serif italic text-[clamp(2rem,6vw,4.5rem)] tracking-[-0.04em] leading-[0.92] text-white"
        >
          You are ready
          <span className="block text-white/45">to ride.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-5 text-sm md:text-base text-white/50 font-light max-w-md mx-auto leading-relaxed"
        >
          The Obsidian K7 is waiting. Press start — then meet us in Berlin.
        </motion.p>

        <div className="mt-10 h-14 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {countdown !== null && (
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[10px] font-mono tracking-[0.35em] text-white/40 uppercase">
                  To your ignition
                </span>
                <span className="font-serif italic text-5xl md:text-6xl text-red-400 tabular-nums">
                  {countdown}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function LabIgnitionSequence() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const duration = useRef(0);

  const handoffPlayed = useRef(false);
  const handoffActive = useRef(false);
  const handoffTimers = useRef<number[]>([]);

  const [handoffPhase, setHandoffPhase] = useState<HandoffPhase>("idle");
  const [countdown, setCountdown] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Same scrub maths as ScrollShowcase: middle 80% of section travel maps
  // to the usable video timeline.
  const mapToVideo = (p: number) => {
    const t = Math.max(0, Math.min(1, (p - 0.1) / 0.8));
    return t * VIDEO_TIMELINE_END;
  };

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

  const clearHandoffTimers = useCallback(() => {
    handoffTimers.current.forEach((id) => window.clearTimeout(id));
    handoffTimers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    handoffTimers.current.push(id);
  }, []);

  const scrollToIgnite = useCallback(() => {
    const target = document.getElementById("ignite");
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -32,
        duration: SCROLL_DURATION,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [lenis]);

  const runHandoff = useCallback(() => {
    if (handoffPlayed.current) {
      // Already saw it — just jump straight to Ignite.
      scrollToIgnite();
      return;
    }
    handoffPlayed.current = true;
    handoffActive.current = true;
    clearHandoffTimers();
    setHandoffPhase("complete");
    setCountdown(null);

    schedule(() => setCountdown(3), INTRO_MS);
    schedule(() => setCountdown(2), INTRO_MS + COUNTDOWN_STEP_MS);
    schedule(() => setCountdown(1), INTRO_MS + COUNTDOWN_STEP_MS * 2);
    schedule(() => {
      setCountdown(null);
      setHandoffPhase("idle");
      handoffActive.current = false;
      scrollToIgnite();
    }, INTRO_MS + COUNTDOWN_STEP_MS * 3);
  }, [clearHandoffTimers, schedule, scrollToIgnite]);

  // Single scroll driver — straight from ScrollShowcase template.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!duration.current) return;
    const videoT = mapToVideo(p);
    targetTime.current = videoT * duration.current;
    scheduleSeek();

    // Re-arm handoff once the user has scrolled back near the top.
    if (p < 0.2) {
      handoffPlayed.current = false;
    }

    // Trigger handoff once when scroll passes the threshold going down.
    if (
      !handoffActive.current &&
      handoffPhase === "idle" &&
      p >= HANDOFF_AT &&
      !handoffPlayed.current
    ) {
      runHandoff();
    }

    // If overlay is up and the user scrolls back up significantly, cancel it.
    if (handoffActive.current && p < HANDOFF_RESET_BELOW) {
      clearHandoffTimers();
      setHandoffPhase("idle");
      setCountdown(null);
      handoffActive.current = false;
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      duration.current = video.duration || 0;
      const videoT = mapToVideo(scrollYProgress.get());
      targetTime.current = videoT * duration.current;
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

  useEffect(() => () => clearHandoffTimers(), [clearHandoffTimers]);

  // Same breathing scale as ScrollShowcase.
  const bikeScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.95, 1.02, 0.97]
  );

  const redGlow = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="pre-ignition"
      className="relative bg-black h-[140vh] md:h-[180vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div
          style={{ opacity: redGlow }}
          className="absolute inset-0 pointer-events-none z-[1]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_50%_62%,rgba(220,38,38,0.5)_0%,transparent_70%)] blur-2xl" />
        </motion.div>

        <motion.div
          style={{ scale: bikeScale }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div className="absolute inset-0 scale-[1.25] md:scale-100">
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

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_88%)] z-[3]" />

        {captions.map((c, i) => (
          <Caption
            key={c.eyebrow}
            scrollYProgress={scrollYProgress}
            caption={c}
            index={i}
            total={captions.length}
          />
        ))}

        <div className="absolute top-24 right-6 md:right-12 z-20 pointer-events-none text-right">
          <p className="text-[10px] font-mono tracking-[0.3em] text-accent uppercase mb-1">
            06 · Pre-ignition
          </p>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase">
            Scroll to advance
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/40">
            SCROLL · IGNITION
          </span>
          <div className="w-24 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-amber-500/80 via-accent to-red-500"
            />
          </div>
        </div>

        <AnimatePresence>
          {handoffPhase === "complete" && (
            <HandoffOverlay key="overlay" countdown={countdown} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
