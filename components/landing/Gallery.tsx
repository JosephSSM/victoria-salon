"use client";

import Image from "next/image";
import { manrope, playfairDisplay } from "@/lib/fonts";
import { BRAND } from "@/lib/theme";
import Reveal from "./Reveal";

const PHOTOS = [
  { src: "/images/gallery/salon-hero.png", alt: "Zona de peinado de Victoria Salón", caption: "Zona de peinado", span: "md:row-span-2" },
  { src: "/images/gallery/estilista-trabajo.png", alt: "Estilista trabajando en Victoria Salón", caption: "En plena sesión", span: "" },
  { src: "/images/gallery/espejos-lavanda.png", alt: "Estaciones de peinado con luz de ambiente", caption: "Nuestras estaciones", span: "" },
  { src: "/images/gallery/zona-estetica.png", alt: "Sala de estética de Victoria Salón", caption: "Sala de estética", span: "" },
  { src: "/images/gallery/recepcion.png", alt: "Recepción de Victoria Salón", caption: "Recepción", span: "" },
  { src: "/images/gallery/zona-lavado.png", alt: "Zona de lavado de Victoria Salón", caption: "Zona de lavado", span: "md:row-span-2" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative py-24" style={{ background: BRAND.ivory }}>
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: BRAND.gold }}>
            El espacio
          </p>
          <h2 className={`${playfairDisplay.className} text-3xl sm:text-4xl`} style={{ color: BRAND.ink }}>
            Así es Victoria Salón por dentro
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-4">
          {PHOTOS.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 0.06} className={`group relative overflow-hidden rounded-xl ${photo.span}`}>
              <div className="relative h-full min-h-[160px] w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(0deg, ${BRAND.ink}cc 0%, transparent 60%)` }}
                >
                  <p className={`${manrope.className} text-sm font-medium text-[#FAF6F0]`}>{photo.caption}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
