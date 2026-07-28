"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { playfairDisplay, manrope } from "@/lib/fonts";
import { BUSINESS, whatsappHref } from "@/lib/data";
import { BRAND } from "@/lib/theme";
import MeshBackground from "./MeshBackground";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={{ y: bgY }}>
        <Image
          src="/images/gallery/salon-hero.png"
          alt="Interior de Victoria Salón, Sant Cugat del Vallès"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${BRAND.ink}cc 0%, ${BRAND.ink}88 35%, ${BRAND.ink}aa 75%, ${BRAND.ink}e6 100%)`,
        }}
      />
      <MeshBackground className="mix-blend-screen opacity-70" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className={`${manrope.className} relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 text-center text-[#FAF6F0]`}
      >
        <Image
          src="/images/brand/logo-principal.png"
          alt="Victoria Salón"
          width={220}
          height={220}
          priority
          className="mb-6 h-40 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
        />

        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
          <MapPin size={13} /> Sant Cugat del Vallès
        </p>

        <h1 className={`${playfairDisplay.className} text-4xl leading-tight sm:text-5xl md:text-6xl`}>
          Belleza con oficio,
          <br />
          cuidado con cariño
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed opacity-80 sm:text-base">
          Un espacio cálido donde cada corte, color y ritual se piensa a tu medida. Desde{" "}
          {BUSINESS.foundedYear} cuidando el cabello y la piel de Sant Cugat.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <MagneticButton
            href={whatsappHref("Hola! Me gustaría reservar una cita en Victoria Salón 💇‍♀️")}
            target="_blank"
            rel="noopener noreferrer"
            background={`linear-gradient(120deg, ${BRAND.gold}, ${BRAND.lavender})`}
            className="rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#1A1614]"
          >
            Reservar cita por WhatsApp
          </MagneticButton>

          <div className="flex items-center gap-1.5 text-sm opacity-90">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill={BRAND.gold} color={BRAND.gold} />
            ))}
            <span className="ml-1 font-medium">
              {BUSINESS.rating} · {BUSINESS.reviewCount} reseñas en Google
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
