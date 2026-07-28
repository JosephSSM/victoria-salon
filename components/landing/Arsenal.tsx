"use client";

import Image from "next/image";
import { useRef } from "react";
import { Scissors, Wind, Droplet, Brush, Palette } from "lucide-react";
import { playfairDisplay, manrope } from "@/lib/fonts";
import { BRAND } from "@/lib/theme";
import Reveal from "./Reveal";
import FloatingTool from "./FloatingTool";

const TOOLS = [
  { icon: Scissors, top: "8%", left: "6%", size: 38, duration: 6, color: BRAND.gold },
  { icon: Wind, top: "72%", left: "10%", size: 34, duration: 7.5, color: BRAND.lavender },
  { icon: Droplet, top: "16%", left: "88%", size: 28, duration: 5.5, color: BRAND.lavender },
  { icon: Brush, top: "80%", left: "84%", size: 32, duration: 6.8, color: BRAND.gold },
  { icon: Palette, top: "45%", left: "94%", size: 26, duration: 8, color: BRAND.wood },
];

export default function Arsenal() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="arsenal" className="relative overflow-hidden py-24" style={{ background: BRAND.ink }}>
      <div ref={containerRef} className="absolute inset-0">
        {TOOLS.map((tool, i) => (
          <FloatingTool key={i} containerRef={containerRef} {...tool} />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: BRAND.lavender }}>
            Nuestro arsenal
          </p>
          <h2 className={`${playfairDisplay.className} text-3xl sm:text-4xl`} style={{ color: BRAND.ivory }}>
            Más de 100 tonos, siempre a la vista
          </h2>
          <p className={`${manrope.className} mt-5 max-w-md text-sm leading-relaxed opacity-70`} style={{ color: BRAND.ivory }}>
            En nuestra pared de esmaltes en gel eliges el color con calma, sin prisas, mientras
            tomas algo relajada. Cada herramienta y cada producto se elige con el mismo criterio:
            que el resultado dure y que el proceso se disfrute.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div
            className="relative mx-auto max-w-sm -rotate-2 overflow-hidden rounded-2xl border shadow-2xl transition-transform duration-500 hover:rotate-0"
            style={{ borderColor: `${BRAND.gold}33` }}
          >
            <Image
              src="/images/gallery/pared-esmaltes.png"
              alt="Pared de más de 100 tonos de esmalte en Victoria Salón"
              width={800}
              height={1000}
              className="h-auto w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
