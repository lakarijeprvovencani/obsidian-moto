"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";

const TOTAL_FRAMES = 60;
const framePath = (i: number) => `/frames/f${String(i).padStart(3, "0")}.jpg`;

interface BikeViewerProps {
  currentFrame: number;
  setCurrentFrame: Dispatch<SetStateAction<number>>;
  /** ms between frames during idle auto-rotate. Default 80. */
  autoRotateSpeed?: number;
  /** ms of inactivity before auto-rotate kicks in. Default 3000. */
  idleDelay?: number;
}

export default function BikeViewer({
  currentFrame,
  setCurrentFrame,
  autoRotateSpeed = 80,
  idleDelay = 3000,
}: BikeViewerProps) {
  const [loaded, setLoaded] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startFrame = useRef(1);
  const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // RAF-throttled state setter — collapses pointermove bursts (~200Hz) to the
  // browser's repaint rate so React + compositor never fall behind the cursor.
  const rafId = useRef<number | null>(null);
  const pendingFrame = useRef<number | null>(null);
  const setFrameThrottled = useCallback(
    (next: number) => {
      pendingFrame.current = next;
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        if (pendingFrame.current !== null) {
          setCurrentFrame(pendingFrame.current);
          pendingFrame.current = null;
        }
        rafId.current = null;
      });
    },
    [setCurrentFrame]
  );

  // Preload all frames into browser cache so opacity swaps never block on decode.
  useEffect(() => {
    let cancelled = false;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = framePath(i);
      const done = () => {
        if (!cancelled) setLoaded((n) => n + 1);
      };
      img.onload = done;
      img.onerror = done;
    }
    return () => {
      cancelled = true;
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const stopAuto = () => {
    if (autoInterval.current) {
      clearInterval(autoInterval.current);
      autoInterval.current = null;
    }
  };

  const resetIdleTimer = useCallback(() => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    stopAuto();
    idleTimeout.current = setTimeout(() => {
      autoInterval.current = setInterval(() => {
        setCurrentFrame((prev) => (prev % TOTAL_FRAMES) + 1);
      }, autoRotateSpeed);
    }, idleDelay);
  }, [setCurrentFrame, autoRotateSpeed, idleDelay]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      stopAuto();
    };
  }, [resetIdleTimer]);

  // External frame changes (thumbnail clicks) also reset the idle timer.
  useEffect(() => {
    resetIdleTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startFrame.current = currentFrame;
    stopAuto();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const frameDelta = Math.round(deltaX / 8);
    let next = startFrame.current - frameDelta;
    next = ((next - 1) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES + 1;
    setFrameThrottled(next);
    resetIdleTimer();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    resetIdleTimer();
  };

  const loadingPct = Math.round((loaded / TOTAL_FRAMES) * 100);
  const isReady = loaded >= TOTAL_FRAMES;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Drag badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md z-10 pointer-events-none"
      >
        <RotateCw className="w-3.5 h-3.5 text-accent" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Drag to Rotate</span>
      </motion.div>

      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#0a0a0a]/60 backdrop-blur-sm pointer-events-none">
          <div className="text-xs font-mono tracking-[0.2em] text-white/60">
            LOADING · {loadingPct}%
          </div>
        </div>
      )}

      {/* Stacked frame layers.
         Scale lives on the container so the compositor does one transform
         per repaint, not sixty. No blend mode: the stage bg is pure black and
         so is the source frame bg, so rendering the bike untouched keeps the
         matte finish and rim lighting exactly as authored. */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none scale-105 md:scale-110">
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1).map((f) => (
          <img
            key={f}
            src={framePath(f)}
            alt=""
            aria-hidden={f !== currentFrame}
            className="absolute inset-0 w-full h-full object-contain object-center"
            style={{ opacity: f === currentFrame ? 1 : 0 }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
