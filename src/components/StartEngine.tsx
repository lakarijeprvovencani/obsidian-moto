"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Power,
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Reveal from "./effects/Reveal";
import RevealWords from "./effects/RevealWords";
import { cn } from "@/lib/utils";

type EngineState = "idle" | "starting" | "running";

const dealerCards = [
  {
    icon: MapPin,
    label: "Visit the workshop",
    value: "Köpenicker Straße 41",
    sub: "10179 Berlin · Mon–Sat 10:00–19:00",
  },
  {
    icon: Phone,
    label: "Talk to the builder",
    value: "+49 30 5557 2018",
    sub: "Mr. Stein answers personally.",
  },
  {
    icon: Mail,
    label: "Send a request",
    value: "build@obsidianmoto.com",
    sub: "Reply within the hour, every hour.",
  },
] as const;

const startupLog = [
  "INITIATING IGNITION SEQUENCE",
  "FUEL PUMP · OK",
  "OIL PRESSURE · 4.2 BAR",
  "ECU HANDSHAKE · OK",
  "ENGINE RUNNING",
] as const;

export default function StartEngine() {
  const [state, setState] = useState<EngineState>("idle");
  const [logStep, setLogStep] = useState(0);

  const handleStart = () => {
    if (state !== "idle") return;
    setState("starting");
  };

  // Drive the startup log forward; flip to "running" on the final line.
  useEffect(() => {
    if (state !== "starting") return;
    setLogStep(0);
    const interval = setInterval(() => {
      setLogStep((s) => {
        const next = s + 1;
        if (next >= startupLog.length) {
          clearInterval(interval);
          // Hold the last log line briefly, then unlock the running state.
          setTimeout(() => setState("running"), 450);
          return s;
        }
        return next;
      });
    }, 420);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <section
      id="ignition"
      className="relative py-28 md:py-44 bg-[#0a0a0a] overflow-hidden"
    >
      {/* State-driven ambient glow behind the button — cool blue while idle,
         warm red once the engine catches. */}
      <motion.div
        animate={{
          opacity: state === "running" ? 0.5 : state === "starting" ? 0.35 : 0.2,
          background:
            state === "idle"
              ? "radial-gradient(ellipse at 50% 55%, rgba(59,130,246,0.4) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 50% 55%, rgba(220,38,38,0.55) 0%, transparent 60%)",
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none blur-[80px]"
      />

      <div className="container mx-auto px-6 md:px-12 relative">
        <Reveal className="mb-4 flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono">
            06 · Ignition
          </span>
          <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-accent/40 to-transparent" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center mb-16">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif italic tracking-[-0.04em] leading-[0.95] mb-8">
              <RevealWords text={"Start"} />
              <span className="block text-white/40">
                <RevealWords text={"your engine."} delay={0.2} />
              </span>
            </h2>
            <Reveal delay={0.35}>
              <p className="text-white/55 text-lg leading-relaxed max-w-xl">
                One push of the button is the only paperwork. We&apos;ll line
                up financing, a test ride at the workshop, and a build slot
                in the next quarterly cohort.
              </p>
            </Reveal>
          </div>

          {/* Ignition button — physical-feeling chrome ring + red dome */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={
                state === "running"
                  ? { x: [0, -1.5, 1.5, -1, 1, 0], y: [0, 1, -1, 1, -1, 0] }
                  : { x: 0, y: 0 }
              }
              transition={
                state === "running"
                  ? { duration: 0.45, repeat: Infinity, ease: "linear" }
                  : undefined
              }
              className="relative"
            >
              {/* Halo glow — pulses while idle, blooms big during start, steady once running */}
              <motion.div
                aria-hidden
                animate={
                  state === "idle"
                    ? { opacity: [0.4, 0.75, 0.4], scale: [1, 1.05, 1] }
                    : state === "starting"
                    ? { opacity: [0.7, 1, 0.7], scale: [1.05, 1.18, 1.05] }
                    : { opacity: 0.9, scale: 1.1 }
                }
                transition={
                  state === "idle"
                    ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                    : state === "starting"
                    ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.6 }
                }
                className={cn(
                  "absolute inset-0 rounded-full blur-2xl -z-10",
                  state === "idle" ? "bg-accent/40" : "bg-red-500/55"
                )}
              />

              <motion.button
                onClick={handleStart}
                disabled={state !== "idle"}
                aria-label={state === "idle" ? "Press to start engine" : "Engine state indicator"}
                whileHover={state === "idle" ? { scale: 1.04 } : undefined}
                whileTap={state === "idle" ? { scale: 0.92 } : undefined}
                animate={
                  state === "idle"
                    ? { scale: [1, 1.025, 1] }
                    : { scale: 1 }
                }
                transition={
                  state === "idle"
                    ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                className={cn(
                  "relative w-48 h-48 md:w-56 md:h-56 rounded-full",
                  state === "idle"
                    ? "cursor-pointer"
                    : "cursor-default disabled:opacity-100"
                )}
              >
                {/* Outer chrome bezel */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-300/30 via-zinc-500/20 to-black/60 p-[6px]">
                  {/* Inner barrel */}
                  <span className="block w-full h-full rounded-full bg-gradient-to-br from-zinc-900 to-zinc-950 p-3 shadow-[inset_0_8px_16px_rgba(0,0,0,0.7),inset_0_-2px_4px_rgba(255,255,255,0.05)]">
                    {/* Dome — color animates between cool idle blue-tinted red and bright running red */}
                    <motion.span
                      animate={{
                        boxShadow:
                          state === "running"
                            ? "inset 0 -14px 28px rgba(0,0,0,0.45), inset 0 10px 18px rgba(255,255,255,0.28), 0 0 56px rgba(248,113,113,0.85)"
                            : state === "starting"
                            ? "inset 0 -14px 28px rgba(0,0,0,0.5), inset 0 10px 18px rgba(255,255,255,0.22), 0 0 40px rgba(220,38,38,0.7)"
                            : "inset 0 -14px 28px rgba(0,0,0,0.5), inset 0 10px 18px rgba(255,255,255,0.18), 0 0 30px rgba(185,28,28,0.45)",
                        background:
                          state === "running"
                            ? "linear-gradient(180deg, #fb7185 0%, #ef4444 45%, #991b1b 100%)"
                            : "linear-gradient(180deg, #ef4444 0%, #dc2626 45%, #7f1d1d 100%)",
                      }}
                      transition={{ duration: 0.4 }}
                      className="block w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                    >
                      {/* Specular highlight at top */}
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-1/3 rounded-full bg-white/25 blur-md pointer-events-none" />
                      <Power
                        className="w-12 h-12 md:w-14 md:h-14 text-red-950 relative z-10"
                        strokeWidth={2.5}
                      />
                    </motion.span>
                  </span>
                </span>
              </motion.button>
            </motion.div>

            {/* State label below the button */}
            <div className="mt-8 h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {state === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-mono text-white/50"
                  >
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      ●
                    </motion.span>
                    Press to start
                  </motion.div>
                )}
                {state === "starting" && (
                  <motion.div
                    key="starting"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-[10px] uppercase tracking-[0.4em] font-mono text-red-400"
                  >
                    Igniting…
                  </motion.div>
                )}
                {state === "running" && (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-mono text-red-400"
                  >
                    <Sparkles className="w-3 h-3" />
                    Engine running
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Diagnostic terminal — fills with startup log lines during 'starting' */}
        <Reveal delay={0.4}>
          <div className="mb-10 p-5 rounded-xl bg-black/50 border border-white/8 font-mono text-[11px] tracking-wider min-h-[140px]">
            <div className="flex items-center gap-2 mb-3 text-white/30 text-[9px] uppercase">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              ECU · LIVE TELEMETRY
            </div>
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {state === "idle" && (
                  <motion.div
                    key="idle-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/30"
                  >
                    &gt; awaiting ignition input…
                  </motion.div>
                )}
                {(state === "starting" || state === "running") &&
                  startupLog
                    .slice(0, state === "running" ? startupLog.length : logStep + 1)
                    .map((line, i) => {
                      const isFinal = i === startupLog.length - 1;
                      return (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className={cn(
                            "flex items-center gap-2",
                            isFinal ? "text-red-400" : "text-white/70"
                          )}
                        >
                          <Check className="w-3 h-3 text-accent/80" />
                          <span>&gt; {line}</span>
                        </motion.div>
                      );
                    })}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* Dealer contact reveal — only visible once engine is running */}
        <AnimatePresence>
          {state === "running" && (
            <motion.div
              key="dealer-cards"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {dealerCards.map((card, i) => (
                <motion.a
                  key={card.label}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative flex flex-col p-6 rounded-2xl bg-[#121212] border border-white/10 hover:border-accent/40 transition-colors overflow-hidden"
                >
                  <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                    <card.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                    {card.label}
                  </div>
                  <div className="font-serif italic text-2xl tracking-tight mb-1">
                    {card.value}
                  </div>
                  <div className="text-xs text-white/45 mb-6">{card.sub}</div>
                  <div className="mt-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60 group-hover:text-accent transition-colors">
                    Continue
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
