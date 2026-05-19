"use client";

// lucide-react 1.16 strips trademarked brand icons (Instagram/YouTube/etc).
// Use generic Lucide glyphs that read as the same channels semantically.
import { Camera, PlayCircle, AtSign, Mail } from "lucide-react";
import Reveal from "./effects/Reveal";

const columns = [
  {
    title: "Shop",
    links: ["All Models", "Apparel", "Parts & Accessories", "Gift Cards"],
  },
  {
    title: "Custom",
    links: ["Start a Build", "Gallery", "Process", "FAQ"],
  },
  {
    title: "Studio",
    links: ["About", "Press Kit", "Careers", "Contact"],
  },
];

const socials = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: PlayCircle, label: "YouTube", href: "#" },
  { icon: AtSign, label: "Twitter / X", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

/** Underline-grow link — animated underline that wipes in on hover. */
function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="group relative inline-block text-sm text-white/55 hover:text-white transition-colors duration-300"
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-px w-full bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 pt-24 pb-10 overflow-hidden">
      {/* Giant brand mark, intentionally low-contrast — a final visual signature */}
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <Reveal>
          <h3
            aria-hidden
            className="font-serif italic text-[18vw] md:text-[14vw] lg:text-[180px] leading-[0.85] tracking-[-0.05em] bg-gradient-to-b from-white/8 to-white/[0.02] bg-clip-text text-transparent select-none -mb-6"
          >
            OBSIDIAN
          </h3>
        </Reveal>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 mb-16 pb-16 border-b border-white/8">
          <Reveal className="col-span-2 md:col-span-2">
            <div className="font-serif italic text-2xl tracking-tight leading-none mb-2">
              Obsidian Moto
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5 font-mono">
              Est. 2018 · Berlin
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Hand-built custom motorcycles for those who demand the absolute
              pinnacle of design, performance, and craftsmanship.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-accent hover:bg-accent/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </Reveal>

          {columns.map((col, i) => (
            <Reveal key={col.title} delay={0.1 + i * 0.08}>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium mb-6 text-white/80">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <FooterLink>{link}</FooterLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Obsidian Moto. All rights reserved.</p>
          <div className="flex items-center gap-2 font-mono uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Made with craft
          </div>
          <div className="flex gap-6">
            <FooterLink>Privacy</FooterLink>
            <FooterLink>Terms</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
