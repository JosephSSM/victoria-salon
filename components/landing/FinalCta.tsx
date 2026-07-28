"use client";

import Image from "next/image";
import { playfairDisplay, manrope } from "@/lib/fonts";
import { BUSINESS, whatsappHref } from "@/lib/data";
import { BRAND } from "@/lib/theme";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28" style={{ background: BRAND.ink }}>
      <Image
        src="/images/brand/emblema.png"
        alt=""
        aria-hidden
        width={900}
        height={900}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
      />

      <Reveal className="relative mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <h2 className={`${playfairDisplay.className} text-3xl sm:text-4xl`} style={{ color: BRAND.ivory }}>
          Reserva tu próxima cita
        </h2>
        <p className={`${manrope.className} mt-4 text-sm leading-relaxed opacity-70`} style={{ color: BRAND.ivory }}>
          Escríbenos por WhatsApp y te confirmamos hueco lo antes posible. Estamos en el corazón de
          Sant Cugat del Vallès.
        </p>

        <MagneticButton
          href={whatsappHref("Hola! Me gustaría reservar una cita en Victoria Salón 💇‍♀️")}
          target="_blank"
          rel="noopener noreferrer"
          background={`linear-gradient(120deg, ${BRAND.gold}, ${BRAND.lavender})`}
          className="mt-8 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[#1A1614]"
        >
          Escribir por WhatsApp · {BUSINESS.phoneDisplay}
        </MagneticButton>
      </Reveal>
    </section>
  );
}
