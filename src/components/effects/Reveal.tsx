"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
}

/**
 * Fades + slides children up when they scroll into view. Triggers once.
 * Use as a drop-in wrapper around any block of content for entrance polish.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.8,
  amount = 0.3,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
