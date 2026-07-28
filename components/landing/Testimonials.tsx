"use client";

import { Quote, Star } from "lucide-react";
import { playfairDisplay, manrope } from "@/lib/fonts";
import { TESTIMONIALS } from "@/lib/data";
import { BRAND } from "@/lib/theme";
import Reveal from "./Reveal";

const featured = TESTIMONIALS.find((t) => t.featured)!;
const rest = TESTIMONIALS.filter((t) => !t.featured);

function Stars({ muted = false }: { muted?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        muted ? (
          <Star key={i} size={13} color={`${BRAND.ink}55`} />
        ) : (
          <Star key={i} size={13} fill={BRAND.gold} color={BRAND.gold} />
        )
      )}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonios" className="relative py-24" style={{ background: BRAND.roseDust }}>
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: BRAND.ink }}>
            Lo que dicen de nosotras
          </p>
          <h2 className={`${playfairDisplay.className} text-3xl sm:text-4xl`} style={{ color: BRAND.ink }}>
            Testimonios
          </h2>
        </Reveal>

        <Reveal className="relative mx-auto mb-10 max-w-2xl">
          <div className="rounded-3xl p-10 text-center shadow-xl" style={{ background: BRAND.ivory }}>
            <Quote className="mx-auto mb-4" size={30} color={BRAND.gold} />
            <p className={`${playfairDisplay.className} text-xl leading-snug sm:text-2xl`} style={{ color: BRAND.ink }}>
              &ldquo;{featured.quote}&rdquo;
            </p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <Stars />
              <p className={`${manrope.className} text-sm font-semibold`} style={{ color: BRAND.ink }}>
                {featured.name}
              </p>
              <p className={`${manrope.className} text-xs opacity-50`} style={{ color: BRAND.ink }}>
                {featured.meta}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {rest.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-6 ${t.placeholder ? "border-2 border-dashed" : ""}`}
                style={{
                  background: t.placeholder ? "transparent" : BRAND.ivory,
                  borderColor: t.placeholder ? `${BRAND.ink}44` : undefined,
                }}
              >
                {t.placeholder && (
                  <span
                    className={`${manrope.className} absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide`}
                    style={{ background: BRAND.ink, color: BRAND.ivory }}
                  >
                    Muestra — reemplazar
                  </span>
                )}
                <Stars muted={t.placeholder} />
                <p
                  className={`${manrope.className} mt-4 flex-1 text-sm leading-relaxed ${t.placeholder ? "italic opacity-50" : "opacity-75"}`}
                  style={{ color: BRAND.ink }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5">
                  <p className={`${manrope.className} text-sm font-semibold ${t.placeholder ? "opacity-50" : ""}`} style={{ color: BRAND.ink }}>
                    {t.name}
                  </p>
                  <p className={`${manrope.className} text-xs opacity-50`} style={{ color: BRAND.ink }}>
                    {t.meta}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
