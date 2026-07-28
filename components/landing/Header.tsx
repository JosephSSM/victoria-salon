"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { manrope } from "@/lib/fonts";
import { whatsappHref } from "@/lib/data";
import MagneticButton from "./MagneticButton";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#arsenal", label: "Nuestro arsenal" },
  { href: "#galeria", label: "Galería" },
  { href: "#testimonios", label: "Testimonios" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 140], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 140], [0, 0.08]);

  return (
    <motion.header className={`${manrope.className} fixed top-0 left-0 right-0 z-50`}>
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          opacity: bgOpacity,
          background: "#FAF6F0",
          borderBottom: "1px solid rgba(26,22,20,1)",
        }}
      />
      <motion.div className="absolute inset-x-0 bottom-0 h-px bg-[#1A1614]" style={{ opacity: borderOpacity }} />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/brand/logo-principal.png"
            alt="Victoria Salón — Perruqueria & Estètica"
            width={140}
            height={140}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#1A1614]">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="opacity-70 transition-opacity hover:opacity-100">
              {link.label}
            </a>
          ))}
          <Link href="/mi-cuenta" className="opacity-50 transition-opacity hover:opacity-100">
            Mi cuenta
          </Link>
        </nav>

        <MagneticButton
          href={whatsappHref("Hola! Me gustaría reservar una cita en Victoria Salón 💇‍♀️")}
          target="_blank"
          rel="noopener noreferrer"
          background="#1A1614"
          className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#FAF6F0]"
        >
          Reservar cita
        </MagneticButton>
      </div>
    </motion.header>
  );
}
