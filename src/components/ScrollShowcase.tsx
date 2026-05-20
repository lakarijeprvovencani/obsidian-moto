"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const VIDEO_SRC = "/bike-rotation.mp4";

const captions = [
  {
    range: [0, 0.05, 0.28, 0.38] as [number, number, number, number],
    side: "left" as const,
    eyebrow: "Obsidian K7 · 2024",
    title: "The blackest\nride.",
    body: "Hand-built custom. Matte black on dark chrome. Limited to 24 units worldwide.",
  },
  {
    range: [0.36, 0.46, 0.58, 0.68] as [number, number, number, number],
    side: "right" as const,
    eyebrow: "01 · Powertrain",
    title: "1923cc.\nHand-tuned.",
    body: "An air-cooled V-Twin built for torque you feel in your chest.",
  },
  {
    range: [0.64, 0.74, 0.86, 0.96] as [number, number, number, number],
    side: "left" as const,
    eyebrow: "02 · Finish",
    title: "Matte. Black.\nForever.",
    body: "Ceramic coating that drinks light. The blackest ride you'll ever see.",
  },
] as const;

function Caption({
  scrollYProgress,
  caption,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  caption: (typeof captions)[number];
}) {
  const opacity = useTransform(scrollYProgress, caption.range, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, caption.range, [40, 0, 0, -40]);
  const isLeftSide = caption.side === "left";
  return (
    <motion.div
      style={{ opacity, y }}
      // Mobile-first: caption stacks at the TOP of the sticky stage with full
      // viewport width (minus padding) so the bike video below has the rest
      // of the screen to itself — no more empty band above and a tiny bike
      // in the middle. Desktop reverts to the original side-placement at
      // vertical center, exactly as before.
      className={[
        "absolute z-10",
        // Mobile placement
        "inset-x-6 top-[12%] max-w-none",
        // Desktop placement (md:+)
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

export default function ScrollShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const duration = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Pump the video's currentTime to follow scroll. The video is encoded with
  // every frame as a keyframe so seeking is effectively free — no decode work
  // wasted on B-frames the way a normal H.264 stream would do for scrubbing.
  // We coalesce updates through requestAnimationFrame so we issue at most one
  // seek per browser repaint instead of per scroll event.
  const tickSeek = () => {
    const video = videoRef.current;
    rafId.current = null;
    if (!video || !duration.current) return;
    // The browser may still be servicing a previous seek. Setting currentTime
    // again while seeking just replaces the target, which is what we want.
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
    // 80% of section travel maps to the full video — front/back 10% are static.
    const t = Math.max(0, Math.min(1, (p - 0.1) / 0.8));
    targetTime.current = t * duration.current;
    scheduleSeek();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      duration.current = video.duration || 0;
      // Paint the initial frame at the current scroll position.
      const p = scrollYProgress.get();
      const t = Math.max(0, Math.min(1, (p - 0.1) / 0.8));
      targetTime.current = t * duration.current;
      video.currentTime = targetTime.current;
    };

    if (video.readyState >= 1 && video.duration) {
      onMeta();
    } else {
      video.addEventListener("loadedmetadata", onMeta);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subtle scale tied to scroll so the bike "breathes" through the section.
  const bikeScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.95, 1.02, 0.97]
  );

  return (
    <section
      ref={sectionRef}
      // Shorter section on mobile so the user doesn't scroll through a long
      // mostly-empty stretch (260vh felt vast on a 9:16 viewport because the
      // 3:2 video letterboxes into the middle). 200vh still gives the scroll
      // narrative + 3 captions plenty of room to breathe.
      className="relative bg-black h-[200vh] md:h-[260vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div
          style={{ scale: bikeScale }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Mobile bike scale-up: the source is 3:2 (1764×1176) with a lot
              of empty matte black around the bike, so on portrait phones we
              scale the video container 1.45× and let the safe black margins
              flow off-screen. Net result: the bike actually fills the frame
              instead of sitting tiny in the middle. Desktop unchanged. */}
          <div className="absolute inset-0 scale-[1.45] md:scale-100">
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

        {captions.map((c, i) => (
          <Caption key={i} scrollYProgress={scrollYProgress} caption={c} />
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/40">
            SCROLL TO ROTATE
          </span>
          <div className="w-24 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="absolute inset-0 bg-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
