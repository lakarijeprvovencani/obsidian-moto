import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OBSIDIAN MOTO · Original Experience",
  description:
    "The original Obsidian K7 product page — scroll showcase, listing layout, configurator, pillars, ignition.",
};

export default function OriginalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
