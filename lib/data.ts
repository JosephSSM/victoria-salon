import { Scissors, Hand, Sparkles, Flower2, Droplets, type LucideIcon } from "lucide-react";

export const BUSINESS = {
  name: "Victoria",
  fullName: "Victoria Salón",
  tagline: "Perruqueria | Estètica",
  address: "Carrer de Sant Bonaventura, 39 bis, 08172 Sant Cugat del Vallès, Barcelona",
  phoneDisplay: "640 63 64 76",
  whatsappNumber: "34640636476",
  rating: 4.7,
  reviewCount: 45,
  foundedYear: 2018,
  hours: [
    { days: "Martes – Viernes", time: "10:00 – 18:00" },
    { days: "Sábado", time: "10:00 – 14:00" },
    { days: "Domingo y Lunes", time: "Cerrado" },
  ],
};

export function whatsappHref(message: string) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type ServiceKey = "peluqueria" | "manospies" | "facial" | "corporal" | "depilacion";

export const SERVICES: {
  key: ServiceKey;
  label: string;
  icon: LucideIcon;
  description: string;
  items: string[];
}[] = [
  {
    key: "peluqueria",
    label: "Peluquería",
    icon: Scissors,
    description: "Corte, color y tratamiento, adaptados a cada cabello",
    items: ["Corte y peinado", "Color completo", "Mechas / balayage", "Tratamiento capilar"],
  },
  {
    key: "manospies",
    label: "Manos y pies",
    icon: Hand,
    description: "Manicura y pedicura de precisión, con nuestra pared de +100 colores",
    items: ["Manicura clásica", "Manicura semipermanente", "Pedicura spa", "Uñas esculpidas"],
  },
  {
    key: "facial",
    label: "Facial",
    icon: Sparkles,
    description: "Rituales de limpieza e hidratación para cada tipo de piel",
    items: ["Limpieza facial profunda", "Hidratación intensiva", "Radiofrecuencia facial", "Ritual anti-edad"],
  },
  {
    key: "corporal",
    label: "Corporal",
    icon: Flower2,
    description: "Masajes y tratamientos para desconectar por completo",
    items: ["Masaje relajante", "Drenaje linfático", "Exfoliación corporal"],
  },
  {
    key: "depilacion",
    label: "Depilación",
    icon: Droplets,
    description: "Depilación con cera, cuidadosa y duradera",
    items: ["Cejas y labio", "Piernas completas", "Axilas", "Cera brasileña"],
  },
];

export const TESTIMONIALS: {
  name: string;
  meta: string;
  quote: string;
  featured?: boolean;
  placeholder?: boolean;
}[] = [
  {
    name: "Clienta de Google",
    meta: "Reseña real de Google",
    quote: "La mejor peluquería y centro de estética, hace años que vengo, son buenísimas.",
    featured: true,
  },
  {
    name: "[Nombre de clienta]",
    meta: "[Pendiente de consentimiento]",
    quote: "[Reseña de muestra — reemplazar]",
    placeholder: true,
  },
  {
    name: "[Nombre de clienta]",
    meta: "[Pendiente de consentimiento]",
    quote: "[Reseña de muestra — reemplazar]",
    placeholder: true,
  },
  {
    name: "[Nombre de clienta]",
    meta: "[Pendiente de consentimiento]",
    quote: "[Reseña de muestra — reemplazar]",
    placeholder: true,
  },
];
