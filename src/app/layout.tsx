import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/effects/CustomCursor";
import BootSplash from "@/components/effects/BootSplash";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OBSIDIAN MOTO | Premium Custom Motorcycles",
  description: "Hand-built custom motorcycles. Matte black on dark chrome. The blackest ride.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans bg-[#0a0a0a] text-white antialiased selection:bg-blue-500/30`}
      >
        <BootSplash />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
