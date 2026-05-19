"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. Default 8. */
  max?: number;
  /** Spring stiffness. Higher = snappier. */
  stiffness?: number;
}

/**
 * Smoothly tilts its content along X/Y based on cursor position over the
 * element. Springs settle back to flat when the cursor leaves. Adds a glossy
 * highlight that tracks the cursor for extra depth.
 */
export default function Tilt3D({
  children,
  className,
  max = 8,
  stiffness = 200,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness, damping: 25, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const glossX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glossY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("relative", className)}
    >
      {children}
      <motion.div
        aria-hidden
        style={
          {
            // CSS variable approach so the radial-gradient can interpolate live
            "--gx": glossX,
            "--gy": glossY,
          } as React.CSSProperties
        }
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_var(--gx)_var(--gy),rgba(255,255,255,0.08),transparent_50%)]"
      />
    </motion.div>
  );
}
