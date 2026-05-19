"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="py-32 md:py-48 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl mb-6"
          >
            Yours / <br />
            <span className="text-white/40">for the taking.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl mb-12 font-light"
          >
            Subscribe to be first when new builds drop. We only make 50 bikes a year.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-20"
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-[#141414] border border-white/20 rounded-none px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-white text-black px-8 py-4 font-medium text-sm tracking-wide hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Notify Me
            </button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 border-t border-white/10 pt-12"
          >
            {[
              { label: "Builds Shipped", value: "124" },
              { label: "Countries", value: "18" },
              { label: "Rating", value: "5.0" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif italic text-3xl md:text-4xl mb-2">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
