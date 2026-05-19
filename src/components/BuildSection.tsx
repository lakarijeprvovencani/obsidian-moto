"use client";

import { motion } from "framer-motion";

export default function BuildSection() {
  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
          
          {/* Left: Title */}
          <div className="w-full lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl"
            >
              Built by hand. <br />
              <span className="text-white/40">Not by machine.</span>
            </motion.h2>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/60 text-lg leading-relaxed mb-12"
            >
              Every Obsidian Moto is assembled by a single master builder from start to finish. 
              We source aerospace-grade titanium, hand-lay carbon fiber, and machine our own 
              aluminum billets to create a machine that feels alive. The matte black finish 
              isn't just paint—it's a proprietary ceramic coating that absorbs light and 
              resists heat.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Build time", value: "6 weeks" },
                { label: "Components", value: "312 parts" },
                { label: "Hand finished", value: "100%" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.3 + (i * 0.1) }}
                  className="bg-[#141414] border border-white/5 rounded-2xl p-6"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">{stat.label}</div>
                  <div className="font-serif italic text-3xl">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
