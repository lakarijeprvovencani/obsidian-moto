"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Power,
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import RevealWords from "@/components/effects/RevealWords";
import { cn } from "@/lib/utils";

type EngineState = "idle" | "starting" | "running" | "stopping";

const dealerCards = [
  {
    icon: MapPin,
    label: "Workshop",
    value: "Köpenicker Straße 41",
    sub: "10179 Berlin",
  },
  {
    icon: Phone,
    label: "Builder line",
    value: "+49 30 5557 2018",
    sub: "Mr. Stein · direct",
  },
  {
    icon: Mail,
    label: "Build desk",
    value: "build@obsidianmoto.com",
    sub: "Reply within the hour",
  },
] as const;

const startupLog = [
  "IGNITION SEQUENCE",
  "FUEL PUMP · OK",
  "OIL · 4.2 BAR",
  "ECU · OK",
  "ENGINE LIVE",
] as const;

export default function LabIgnite() {
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<EngineState>("idle");
  const [logStep, setLogStep] = useState(0);

  useEffect(() => {
    if (state !== "starting") return;
    setLogStep(0);
    const interval = setInterval(() => {
      setLogStep((s) => {
        const next = s + 1;
        if (next >= startupLog.length) {
          clearInterval(interval);
          setTimeout(() => setState("running"), 400);
          return s;
        }
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [state]);

  // Stopping → step the log backwards, then return to idle.
  useEffect(() => {
    if (state !== "stopping") return;
    const interval = setInterval(() => {
      setLogStep((s) => {
        if (s <= 0) {
          clearInterval(interval);
          setTimeout(() => setState("idle"), 250);
          return 0;
        }
        return s - 1;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [state]);

  const handleButton = () => {
    if (state === "idle") setState("starting");
    else if (state === "running") setState("stopping");
  };

  const dealersVisible = state === "running";

  // Scroll-driven anchor animation: as the section enters the viewport the
  // button scales/un-blurs into focus so the handoff from the rider-on-bike
  // scene feels continuous — without using a tall sticky stage that would
  // leave empty space below the button when the engine isn't started.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const focusScale = useTransform(scrollYProgress, [0.15, 0.7], [0.92, 1]);
  const focusOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0.4, 1]);
  const focusBlurPx = useTransform(scrollYProgress, [0.15, 0.55], [6, 0]);
  const focusBlur = useTransform(focusBlurPx, (b) => `blur(${b}px)`);

  return (
    <section
      ref={sectionRef}
      id="ignite"
      className="relative bg-[#0a0a0a] overflow-hidden border-t border-red-950/30 py-20 md:py-28"
    >
      <motion.div
        animate={{
          opacity:
            state === "running"
              ? 0.55
              : state === "stopping"
                ? 0.35
                : 0.25,
          background:
            state === "idle" || state === "stopping"
              ? "radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.35) 0%, transparent 55%)"
              : "radial-gradient(ellipse at 50% 45%, rgba(220,38,38,0.55) 0%, transparent 55%)",
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none blur-[100px]"
      />

      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <Reveal className="mb-4 flex items-center justify-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
              07 · Ignite
            </span>
          </Reveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95]">
            <RevealWords text="Start the engine." />
            <span className="block text-white/40">
              <RevealWords text="Claim the road." delay={0.15} />
            </span>
          </h2>
          <Reveal
            delay={0.2}
            className="mt-5 text-white/50 font-light max-w-lg mx-auto text-sm md:text-base"
          >
            One push reserves your conversation — financing, a test ride at
            the workshop, and a build slot in the next cohort.
          </Reveal>
        </div>

        <motion.div
          style={{
            scale: focusScale,
            opacity: focusOpacity,
            filter: focusBlur,
          }}
          className="flex flex-col items-center gap-7 md:gap-8 will-change-transform"
        >
          <button
            type="button"
            data-cursor="hover"
            onClick={handleButton}
            disabled={state === "starting" || state === "stopping"}
            className="relative group"
            aria-label={state === "running" ? "Stop engine" : "Start engine"}
          >
            <motion.div
              animate={
                state === "idle"
                  ? { scale: [1, 1.03, 1] }
                  : state === "starting"
                    ? { scale: [1.02, 1.1, 1.02] }
                    : state === "running"
                      ? { x: [0, -1, 1, -1, 0], y: [0, 1, -1, 1, 0] }
                      : { scale: [1, 0.97, 1] }
              }
              transition={
                state === "running"
                  ? { repeat: Infinity, duration: 0.45, ease: "linear" }
                  : {
                      repeat: Infinity,
                      duration:
                        state === "idle"
                          ? 2.4
                          : state === "stopping"
                            ? 1.4
                            : 0.6,
                    }
              }
              className="w-44 h-44 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-br from-zinc-300/25 via-zinc-600/20 to-black/50"
            >
              <div className="w-full h-full rounded-full p-3 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-[inset_0_8px_20px_rgba(0,0,0,0.8)]">
                <div
                  className={cn(
                    "w-full h-full rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500",
                    "bg-gradient-to-b from-red-500 via-red-600 to-red-900",
                    state === "running" && "from-red-400 via-red-500 to-red-800",
                    state === "stopping" && "from-red-700 via-red-800 to-red-950 brightness-75",
                    "shadow-[0_0_40px_rgba(185,28,28,0.5),inset_0_4px_12px_rgba(255,255,255,0.15)]"
                  )}
                >
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-full bg-white/20 blur-md" />
                  <Power className="w-10 h-10 text-red-950 relative z-10" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>
            <p className="mt-5 text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase">
              {state === "idle" && "● Press to start"}
              {state === "starting" && "Igniting…"}
              {state === "running" && (
                <span className="inline-flex items-center gap-1.5 text-red-400">
                  <Sparkles className="w-3 h-3" /> Engine running · press to stop
                </span>
              )}
              {state === "stopping" && (
                <span className="text-white/60">Cooling down…</span>
              )}
            </p>
          </button>

          <div className="w-full max-w-md">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 md:p-5 font-mono text-[11px] text-left">
              <p className="text-accent/80 mb-3 tracking-[0.2em]">● ECU · TELEMETRY</p>
              {state === "idle" ? (
                <p className="text-white/30">&gt; awaiting input…</p>
              ) : (
                <ul className="space-y-2">
                  {startupLog
                    .slice(
                      0,
                      logStep +
                        (state === "running" || state === "stopping" ? 1 : 0)
                    )
                    .map((line, i) => (
                      <li
                        key={line}
                        className={cn(
                          "flex items-center gap-2 transition-opacity duration-300",
                          i === startupLog.length - 1 && state === "running"
                            ? "text-red-400"
                            : "text-white/70",
                          state === "stopping" && "text-white/40"
                        )}
                      >
                        <Check className="w-3 h-3 shrink-0" />
                        {line}
                      </li>
                    ))}
                  {state === "stopping" && (
                    <li className="flex items-center gap-2 text-white/40">
                      <span className="inline-block w-3 h-3 shrink-0">·</span>
                      ENGINE STOP REQUESTED
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {dealersVisible && (
            <motion.div
              key="dealer-cards"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, height: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-14 md:mt-20"
            >
              {dealerCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#121212] border border-white/10 rounded-2xl p-6 group hover:border-accent/30 transition-colors"
                  data-cursor="hover"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                    <card.icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-2">
                    {card.label}
                  </p>
                  <p className="font-serif italic text-xl mb-1">{card.value}</p>
                  <p className="text-xs text-white/40">{card.sub}</p>
                  <p className="mt-4 text-[10px] font-mono text-accent/80 group-hover:text-accent flex items-center gap-1">
                    Continue <ArrowRight className="w-3 h-3" />
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
