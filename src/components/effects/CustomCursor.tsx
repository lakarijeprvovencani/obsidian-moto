"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Agency-style custom cursor:
 *  - Native cursor hidden globally on hover-capable devices.
 *  - A 6px dot tracks the mouse 1:1 (instant).
 *  - A 32px outer ring follows on a spring (a beat behind, premium feel).
 *  - When hovering an interactive element (button, link, draggable bike, etc),
 *    the ring blooms to 56px and turns into a thin outline + the dot recedes —
 *    industry-standard agency cursor language.
 *  - Disabled on touch / coarse-pointer devices entirely.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 380, damping: 32, mass: 0.6 });

  const rafId = useRef<number | null>(null);
  const pendingPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Skip touch / coarse-pointer devices entirely — they don't have a cursor.
    const supported =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supported) return;
    setEnabled(true);

    const flush = () => {
      if (pendingPos.current) {
        dotX.set(pendingPos.current.x);
        dotY.set(pendingPos.current.y);
        pendingPos.current = null;
      }
      rafId.current = null;
    };

    const onMove = (e: PointerEvent) => {
      pendingPos.current = { x: e.clientX, y: e.clientY };
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(flush);
      }
      // Detect whether the element under the cursor is interactive by reading
      // its computed cursor style — covers Tailwind's cursor-grab/pointer/text
      // classes, native buttons/links, and anything we explicitly opt in.
      const target = e.target as HTMLElement | null;
      if (target) {
        const style = window.getComputedStyle(target).cursor;
        const interactive =
          style === "pointer" ||
          style === "grab" ||
          style === "grabbing" ||
          target.closest("button, a, [role='button'], [data-cursor='hover']") !==
            null;
        setHovering(interactive);
      }
    };
    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);
    const onLeave = () => {
      dotX.set(-100);
      dotY.set(-100);
      setHovering(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      {/* Inner dot — tracks 1:1 */}
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      >
        <motion.div
          animate={{ scale: hovering ? 0.4 : pressing ? 0.7 : 1, opacity: hovering ? 0.6 : 1 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="w-1.5 h-1.5 rounded-full bg-white"
        />
      </motion.div>

      {/* Outer ring — follows on spring */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.8 : pressing ? 0.85 : 1,
            borderColor: hovering ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 h-8 rounded-full border"
        />
      </motion.div>
    </>
  );
}
