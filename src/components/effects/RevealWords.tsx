"use client";

import { motion } from "framer-motion";

interface RevealWordsProps {
  /** Text to split. Newline characters preserve line breaks. */
  text: string;
  className?: string;
  /** Per-word delay multiplier (seconds). Default 0.07. */
  stagger?: number;
  /** Starting delay before the first word. */
  delay?: number;
}

/**
 * Splits text into words and reveals each with a small stagger when the
 * element scrolls into view. Newlines become explicit line breaks. Whitespace
 * is preserved between words.
 */
export default function RevealWords({
  text,
  className,
  stagger = 0.07,
  delay = 0,
}: RevealWordsProps) {
  const lines = text.split("\n");
  let wordIndex = 0;

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className={className}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi) => {
            const idx = wordIndex++;
            return (
              <span
                key={`${li}-${wi}`}
                className="inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                  transition={{
                    duration: 0.7,
                    delay: delay + idx * stagger,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word}
                  {wi < line.split(" ").length - 1 ? " " : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}
