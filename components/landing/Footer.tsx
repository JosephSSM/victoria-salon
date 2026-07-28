import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Star } from "lucide-react";
import { playfairDisplay, manrope } from "@/lib/fonts";
import { BUSINESS, whatsappHref } from "@/lib/data";
import { BRAND } from "@/lib/theme";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address)}`;

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#arsenal", label: "Nuestro arsenal" },
  { href: "#galeria", label: "Galería" },
  { href: "#testimonios", label: "Testimonios" },
];

export default function Footer() {
  return (
    <footer className={`${manrope.className} relative`} style={{ background: BRAND.ink, color: BRAND.ivory }}>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div>
            <Image
              src="/images/brand/emblema.png"
              alt="Victoria Salón"
              width={80}
              height={80}
              className="mb-4 h-16 w-16"
            />
            <p className={`${playfairDisplay.className} text-lg`}>{BUSINESS.fullName}</p>
            <p className="mt-1 text-xs uppercase tracking-widest opacity-50">{BUSINESS.tagline}</p>
            <div className="mt-4 flex items-center gap-1.5 text-sm opacity-80">
              <Star size={14} fill={BRAND.gold} color={BRAND.gold} />
              {BUSINESS.rating} · {BUSINESS.reviewCount} reseñas en Google
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-50">Visítanos</p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm leading-relaxed opacity-80 transition-opacity hover:opacity-100"
            >
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {BUSINESS.address}
            </a>
            <a
              href={whatsappHref("Hola! Me gustaría reservar una cita en Victoria Salón 💇‍♀️")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
            >
              <Phone size={16} />
              {BUSINESS.phoneDisplay}
            </a>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Horario</p>
            <ul className="space-y-1 text-sm opacity-80">
              {BUSINESS.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className={h.time === "Cerrado" ? "opacity-50" : ""}>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-50">Enlaces</p>
            <ul className="space-y-2 text-sm">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/mi-cuenta" className="opacity-60 transition-opacity hover:opacity-100">
                  Área de clientas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t pt-6 text-center text-xs opacity-40" style={{ borderColor: `${BRAND.ivory}22` }}>
          © {new Date().getFullYear()} {BUSINESS.fullName} — {BUSINESS.tagline}
        </div>
      </div>
    </footer>
  );
}
