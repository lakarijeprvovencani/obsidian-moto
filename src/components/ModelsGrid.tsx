"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const models = [
  {
    name: "The Phantom",
    price: "€28,500",
    image: "/frames/f015.jpg",
    tag: "Street Tracker",
  },
  {
    name: "Nightfall",
    price: "€31,200",
    image: "/frames/f030.jpg",
    tag: "Bobber",
  },
  {
    name: "Eclipse",
    price: "€42,000",
    image: "/frames/f045.jpg",
    tag: "Cafe Racer",
  },
];

export default function ModelsGrid() {
  return (
    <section className="py-24 md:py-32 bg-[#141414] border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex justify-between items-end mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl"
          >
            Other <span className="text-white/40">Models.</span>
          </motion.h2>
          
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
          >
            View All Models <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-black rounded-2xl aspect-[4/3] mb-6 overflow-hidden relative flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase tracking-[0.2em]">
                  {model.tag}
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium mb-1">{model.name}</h3>
                  <div className="font-serif italic text-white/60 text-lg">{model.price}</div>
                </div>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden w-full mt-12 py-4 border border-white/20 rounded-none flex items-center justify-center gap-2 text-sm font-medium"
        >
          View All Models <ArrowRight className="w-4 h-4" />
        </motion.button>

      </div>
    </section>
  );
}
