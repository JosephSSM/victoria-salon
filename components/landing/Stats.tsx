"use client";

import { Star, CalendarHeart, Layers } from "lucide-react";
import { playfairDisplay, manrope } from "@/lib/fonts";
import { BUSINESS, SERVICES } from "@/lib/data";
import { BRAND } from "@/lib/theme";
import Reveal from "./Reveal";
import CountUp from "./CountUp";

const currentYear = new Date().getFullYear();

const STATS = [
  {
    icon: Star,
    value: BUSINESS.rating,
    decimals: 1,
    suffix: "",
    label: `Valoración media · ${BUSINESS.reviewCount} reseñas en Google`,
  },
  {
    icon: CalendarHeart,
    value: currentYear - BUSINESS.foundedYear,
    prefix: "+",
    label: `Años cuidando Sant Cugat desde ${BUSINESS.foundedYear}`,
  },
  {
    icon: Layers,
    value: SERVICES.length,
    label: "Áreas de servicio, de la raíz a la piel",
  },
];

export default function Stats() {
  return (
    <section className="relative py-16" style={{ background: BRAND.ivory }}>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.label} delay={i * 0.12} className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: `${BRAND.gold}1a` }}
              >
                <Icon size={20} color={BRAND.gold} />
              </div>
              <div className={`${playfairDisplay.className} text-4xl`} style={{ color: BRAND.ink }}>
                <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className={`${manrope.className} mt-2 max-w-[220px] text-sm opacity-60`} style={{ color: BRAND.ink }}>
                {stat.label}
              </p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
