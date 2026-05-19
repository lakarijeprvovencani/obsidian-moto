"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    quote: "A masterclass in modern custom building. It doesn't just look aggressive, it rides like a nightmare in the best way possible.",
    author: "Motor Trend",
    rating: 5,
  },
  {
    quote: "The attention to detail is staggering. Every bolt, every weld, every finish is perfect. Worth every penny of its asking price.",
    author: "RIDE Magazine",
    rating: 5,
  },
  {
    quote: "Obsidian Moto has created something truly special here. A machine that commands respect the moment you turn the key.",
    author: "Cycle World",
    rating: 5,
  },
];

const awards = [
  "2024 Custom of the Year",
  "RIDE Magazine Editor's Pick",
  "Design Excellence Award",
];

export default function ReviewsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl"
          >
            Press & <span className="text-white/40">Reviews.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {reviews.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#141414] border border-white/5 rounded-2xl p-8 md:p-10 flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed mb-8 flex-grow">
                "{review.quote}"
              </p>
              <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                — {review.author}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-12">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm md:text-base text-white/40 font-medium tracking-wide">
            {awards.map((award, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                {award}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
