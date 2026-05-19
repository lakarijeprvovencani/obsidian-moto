"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import RevealWords from "./effects/RevealWords";

// Section narrative: the customer just pressed the ignition above.
// Now the bike rolls out into the world — speed lines streak past and the
// bike pulls toward the horizon and recedes.

export default function RideAway() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Bike: stays roughly centered, then drifts right and recedes as we scroll
  // toward the end of the section — like it's riding off into the distance.
  const bikeX = useTransform(scrollYProgress, [0.15, 0.85], ["-2%", "32%"]);
  const bikeY = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "-6%"]);
  const bikeScale = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.55]);
  const bikeOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.78, 0.95],
    [0, 1, 1, 0.35]
  );
  const bikeRotate = useTransform(scrollYProgress, [0.15, 0.85], [0, -1.5]);
  // Slight motion blur while the bike is moving; clears at start and end.
  const bikeBlurPx = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.7, 0.85],
    [0, 1.4, 1.4, 0]
  );
  const bikeFilter = useMotionTemplate`blur(${bikeBlurPx}px)`;

  // Two parallax layers of speed lines — far/slow and near/fast — sell depth.
  const farX = useTransform(scrollYProgress, [0, 1], [0, -1400]);
  const nearX = useTransform(scrollYProgress, [0, 1], [0, -3400]);

  // Headline timing: fades in early, pinned through the middle, fades out
  // near the end so it doesn't fight the receding bike.
  const headOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.18, 0.55, 0.7],
    [0, 1, 1, 0]
  );
  const headY = useTransform(
    scrollYProgress,
    [0.05, 0.18, 0.55, 0.7],
    [30, 0, 0, -30]
  );

  // Final tail-light glow: a small accent halo appears when the bike has
  // shrunk into the horizon, like a brake light winking out.
  const tailOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.85, 1],
    [0, 0.7, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Atmosphere — slight upward gradient adds depth to the void */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 pointer-events-none" />

        {/* Vignette so the action concentrates around the bike */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_45%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

        {/* Headline */}
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 z-20 text-center max-w-3xl px-6 pointer-events-none"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
              07 · Ride away
            </span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
            <RevealWords text={"Twist the throttle."} />
            <span className="block text-white/40">
              <RevealWords text={"Disappear."} delay={0.2} />
            </span>
          </h2>
        </motion.div>

        {/* Speed lines, far parallax layer */}
        <motion.div
          aria-hidden
          style={{ x: farX }}
          className="absolute inset-0 pointer-events-none"
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const top = 18 + ((i * 53) % 60);
            const left = (i * 17) % 110;
            const width = 80 + ((i * 31) % 140);
            return (
              <div
                key={`far-${i}`}
                className="absolute h-[2px] bg-gradient-to-r from-transparent via-accent/25 to-transparent"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${width}px`,
                }}
              />
            );
          })}
        </motion.div>

        {/* Speed lines, near parallax layer */}
        <motion.div
          aria-hidden
          style={{ x: nearX }}
          className="absolute inset-0 pointer-events-none"
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const top = 14 + ((i * 41) % 72);
            const left = (i * 23) % 120;
            const width = 110 + ((i * 37) % 200);
            return (
              <div
                key={`near-${i}`}
                className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${width}px`,
                }}
              />
            );
          })}
        </motion.div>

        {/* Bike — side view, drifts to the right and recedes */}
        <motion.div
          style={{
            x: bikeX,
            y: bikeY,
            scale: bikeScale,
            opacity: bikeOpacity,
            rotate: bikeRotate,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.img
            src="/frames/f001.jpg"
            alt=""
            style={{
              filter: bikeFilter,
              // User asked to mask the studio-floor reflection baked into
              // the source frame so the bottom of the bike doesn't show
              // a second mirrored bike.
              maskImage:
                "linear-gradient(to bottom, black 0%, black 64%, transparent 86%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 64%, transparent 86%)",
            }}
            className="w-[60vw] max-w-[1100px] aspect-[3/2] object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Tail-light glow at the horizon — winks once when the bike has
           shrunk into the distance. */}
        <motion.div
          style={{ opacity: tailOpacity }}
          className="absolute top-[44%] left-[80%] w-24 h-24 rounded-full bg-red-500/60 blur-2xl pointer-events-none"
        />

        {/* Scroll hint at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/40">
            SCROLL · RIDE OUT
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
