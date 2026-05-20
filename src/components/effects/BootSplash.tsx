"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TOTAL_FRAMES = 60;
const VIDEO_PATH = "/bike-rotation.mp4";

/**
 * Cinematic boot screen.
 *  - Fills the viewport above the page.
 *  - Real preload progress: counts every successfully decoded hero frame
 *    + the rotation MP4 reaching readyState >= HAVE_FUTURE_DATA.
 *  - When all 61 assets are ready (or a 4s timeout fires, whichever comes
 *    first — so a slow network never strands the visitor), the wordmark
 *    slips up, a thin accent line shoots across, and the curtain wipes
 *    apart top + bottom to reveal the page underneath.
 *  - Once dismissed, the component unmounts. It only ever runs once per
 *    page load.
 */
export default function BootSplash() {
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(0);
  const [pct, setPct] = useState(0);
  const target = TOTAL_FRAMES + 1; // frames + video
  const startedAt = useRef<number>(0);

  // Smooth progress out toward whatever's actually loaded — avoids a janky
  // jump from 0% to 80% when the browser cache hits everything at once.
  useEffect(() => {
    const desired = Math.min(1, loaded / target);
    let rafId: number;
    const tick = () => {
      setPct((p) => {
        const next = p + (desired - p) * 0.12;
        if (Math.abs(next - desired) < 0.001) return desired;
        rafId = requestAnimationFrame(tick);
        return next;
      });
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loaded, target]);

  useEffect(() => {
    startedAt.current = performance.now();

    // Preload all 60 frames in parallel.
    let cancelled = false;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = `/frames/f${String(i).padStart(3, "0")}.jpg`;
      const done = () => {
        if (!cancelled) setLoaded((n) => n + 1);
      };
      img.onload = done;
      img.onerror = done;
    }

    // Preload the scroll-scrubbing video to a usable state.
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    video.src = VIDEO_PATH;
    const onVideoReady = () => {
      if (!cancelled) setLoaded((n) => n + 1);
    };
    video.addEventListener("loadeddata", onVideoReady, { once: true });
    video.addEventListener("error", onVideoReady, { once: true });

    // Safety: dismiss after 4s even if a few assets are slow.
    const timeout = setTimeout(() => {
      if (!cancelled) setLoaded(target);
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      video.removeEventListener("loadeddata", onVideoReady);
      video.removeEventListener("error", onVideoReady);
    };
  }, [target]);

  // When everything's loaded, hold the splash on screen long enough to read
  // (minimum 1100ms total), then dismiss.
  useEffect(() => {
    if (loaded < target) return;
    const elapsed = performance.now() - startedAt.current;
    const remaining = Math.max(0, 1100 - elapsed);
    const t = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(t);
  }, [loaded, target]);

  // Lock body scroll while splash is up.
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          exit={{ pointerEvents: "none" }}
          className="fixed inset-0 z-[10000] pointer-events-auto"
          aria-hidden
        >
          {/* Top curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.95, ease: [0.85, 0, 0.15, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-black border-b border-accent/20"
          />
          {/* Bottom curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.95, ease: [0.85, 0, 0.15, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black border-t border-accent/20"
          />

          {/* Centerline accent that shoots across just as the curtains begin to part */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ originX: 0 }}
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-accent to-transparent z-10"
          />

          {/* Brand mark + progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-mono mb-6">
              Est. 2018 · Berlin
            </div>
            <div className="font-serif italic text-6xl md:text-8xl tracking-[-0.04em] leading-[0.9] text-white mb-10">
              Obsidian Moto
            </div>

            {/* Progress bar */}
            <div className="w-64 md:w-80 h-px bg-white/10 relative overflow-hidden mb-4">
              <motion.div
                style={{ scaleX: pct, originX: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-accent/40 via-accent to-blue-300"
              />
            </div>

            <div className="flex items-center justify-between w-64 md:w-80 text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
              <span>Preparing studio</span>
              <span>{Math.round(pct * 100)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
