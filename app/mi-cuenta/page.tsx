"use client";

import { useState } from "react";
import { Playfair_Display, Manrope } from "next/font/google";
import {
  Scissors,
  Sparkles,
  Droplets,
  Flower2,
  Hand,
  Calendar,
  Clock,
  User,
  LogOut,
  ChevronRight,
  Check,
  Phone,
  Mail,
  type LucideIcon,
} from "lucide-react";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

const T = {
  ink: "#241119",
  bordeaux: "#5C1F35",
  bordeauxDeep: "#3E1425",
  gold: "#B08D57",
  ivory: "#F7F1E8",
  card: "#FFFFFF",
  line: "#E7DED0",
  sage: "#5E8368",
};

type ServiceKey = "peluqueria" | "manospies" | "facial" | "corporal" | "depilacion";

const SERVICES: { key: ServiceKey; label: string; icon: LucideIcon; items: string[] }[] = [
  { key: "peluqueria", label: "Peluquería", icon: Scissors, items: ["Corte y peinado", "Color completo", "Mechas / balayage", "Tratamiento capilar"] },
  { key: "manospies", label: "Manos y pies", icon: Hand, items: ["Manicura clásica", "Manicura semipermanente", "Pedicura spa", "Uñas esculpidas"] },
  { key: "facial", label: "Facial", icon: Sparkles, items: ["Limpieza facial profunda", "Hidratación intensiva", "Radiofrecuencia facial", "Ritual anti-edad"] },
  { key: "corporal", label: "Corporal", icon: Flower2, items: ["Masaje relajante", "Drenaje linfático", "Exfoliación corporal"] },
  { key: "depilacion", label: "Depilación", icon: Droplets, items: ["Cejas y labio", "Piernas completas", "Axilas", "Cera brasileña"] },
];

const TIME_SLOTS = ["10:00", "10:45", "11:30", "12:15", "13:00", "16:00", "16:45", "17:30"];

const MY_APPOINTMENTS = [
  { date: "26 jul 2026", time: "11:30", service: "Corte y peinado", status: "Confirmada" },
  { date: "05 jul 2026", time: "10:00", service: "Manicura semipermanente", status: "Completada" },
  { date: "18 jun 2026", time: "17:30", service: "Limpieza facial profunda", status: "Completada" },
];

type Tab = "citas" | "reservar" | "perfil";

export default function MiCuentaPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("citas");
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [item, setItem] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!loggedIn) {
    return (
      <div
        className={`${manrope.className} min-h-screen w-full flex items-center justify-center p-6`}
        style={{ background: T.ivory, color: T.ink }}
      >
        <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: T.card, border: `1px solid ${T.line}` }}>
          <div className={`${playfairDisplay.className} text-2xl text-center mb-1`}>
            Victoria <span style={{ color: T.bordeaux }}>Salón</span>
          </div>
          <p className="text-xs text-center opacity-50 mb-6">Área de clientas</p>
          <div className="flex flex-col gap-3 mb-5">
            <input
              placeholder="Email"
              className="px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: T.ivory, border: `1px solid ${T.line}` }}
            />
            <input
              placeholder="Contraseña"
              type="password"
              className="px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: T.ivory, border: `1px solid ${T.line}` }}
            />
          </div>
          <button
            onClick={() => setLoggedIn(true)}
            className="w-full py-3 rounded-full text-sm font-semibold text-white mb-3"
            style={{ background: T.bordeaux }}
          >
            Entrar
          </button>
          <p className="text-xs text-center opacity-50">
            ¿Primera vez? <span style={{ color: T.bordeaux }} className="font-semibold">Crear cuenta</span>
          </p>
        </div>
      </div>
    );
  }

  const selectedCat = SERVICES.find((s) => s.key === service);

  return (
    <div className={`${manrope.className} min-h-screen w-full`} style={{ background: T.ivory, color: T.ink }}>
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: T.line, background: T.card }}>
        <div className={`${playfairDisplay.className} text-lg`}>
          Victoria <span style={{ color: T.bordeaux }}>Salón</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: T.gold }}>
            MR
          </div>
          <button onClick={() => setLoggedIn(false)} className="text-xs opacity-60 flex items-center gap-1">
            <LogOut size={13} /> Salir
          </button>
        </div>
      </header>

      <div className="flex gap-2 px-6 pt-5">
        {(
          [
            { key: "citas", label: "Mis citas" },
            { key: "reservar", label: "Reservar" },
            { key: "perfil", label: "Mi perfil" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              if (t.key === "reservar") {
                setStep(1);
                setConfirmed(false);
              }
            }}
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={tab === t.key ? { background: T.bordeaux, color: "white" } : { background: T.card, border: `1px solid ${T.line}` }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {tab === "citas" && (
          <>
            <h1 className={`${playfairDisplay.className} text-2xl mb-1`}>Hola, Marta</h1>
            <p className="text-sm opacity-50 mb-6">Aquí tienes tus próximas visitas</p>

            {MY_APPOINTMENTS.filter((a) => a.status === "Confirmada").map((a, i) => (
              <div key={i} className="rounded-2xl p-5 mb-4 flex items-center justify-between" style={{ background: T.bordeaux, color: "white" }}>
                <div>
                  <p className="text-xs opacity-70 mb-1 flex items-center gap-1">
                    <Calendar size={12} /> {a.date} · {a.time}
                  </p>
                  <p className={`${playfairDisplay.className} text-lg`}>{a.service}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${T.gold}33`, color: T.gold }}>
                  {a.status}
                </span>
              </div>
            ))}

            <p className="text-xs font-semibold uppercase tracking-wide opacity-50 mt-8 mb-3">Historial</p>
            {MY_APPOINTMENTS.filter((a) => a.status !== "Confirmada").map((a, i) => (
              <div key={i} className="rounded-xl p-4 mb-3 flex items-center justify-between" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                <div>
                  <p className="text-xs opacity-50 mb-0.5">
                    {a.date} · {a.time}
                  </p>
                  <p className="text-sm font-medium">{a.service}</p>
                </div>
                <Check size={16} color={T.sage} />
              </div>
            ))}
          </>
        )}

        {tab === "reservar" && !confirmed && (
          <>
            <h1 className={`${playfairDisplay.className} text-2xl mb-6`}>Reserva tu cita</h1>

            {step === 1 && (
              <>
                <p className="text-sm font-semibold mb-3">1. Elige una categoría</p>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICES.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.key}
                        onClick={() => {
                          setService(s.key);
                          setStep(2);
                        }}
                        className="rounded-xl p-4 flex flex-col items-center gap-2 text-sm font-medium"
                        style={{ background: T.card, border: `1px solid ${T.line}` }}
                      >
                        <Icon size={20} color={T.bordeaux} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 2 && selectedCat && (
              <>
                <p className="text-sm font-semibold mb-3">2. Elige el servicio</p>
                <div className="flex flex-col gap-2 mb-4">
                  {selectedCat.items.map((it) => (
                    <button
                      key={it}
                      onClick={() => {
                        setItem(it);
                        setStep(3);
                      }}
                      className="text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between"
                      style={{ background: T.card, border: `1px solid ${T.line}` }}
                    >
                      {it} <ChevronRight size={15} className="opacity-40" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="text-xs opacity-50">
                  ← Volver
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-sm font-semibold mb-3">3. Elige fecha y hora</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm mb-4 outline-none"
                  style={{ background: T.card, border: `1px solid ${T.line}` }}
                />
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className="py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                      style={time === t ? { background: T.bordeaux, color: "white" } : { background: T.card, border: `1px solid ${T.line}` }}
                    >
                      <Clock size={11} /> {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="text-xs opacity-50">
                    ← Volver
                  </button>
                  <button
                    disabled={!date || !time}
                    onClick={() => setConfirmed(true)}
                    className="ml-auto px-6 py-3 rounded-full text-sm font-semibold text-white disabled:opacity-40"
                    style={{ background: T.bordeaux }}
                  >
                    Confirmar reserva
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {tab === "reservar" && confirmed && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${T.sage}22` }}>
              <Check size={26} color={T.sage} />
            </div>
            <h2 className={`${playfairDisplay.className} text-2xl mb-2`}>¡Cita confirmada!</h2>
            <p className="text-sm opacity-60 mb-1">{item}</p>
            <p className="text-sm opacity-60">
              {date} · {time}
            </p>
            <button onClick={() => setTab("citas")} className="mt-6 px-6 py-3 rounded-full text-sm font-semibold text-white" style={{ background: T.bordeaux }}>
              Ver mis citas
            </button>
          </div>
        )}

        {tab === "perfil" && (
          <>
            <h1 className={`${playfairDisplay.className} text-2xl mb-6`}>Mi perfil</h1>
            <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: T.card, border: `1px solid ${T.line}` }}>
              <div className="flex items-center gap-2 text-sm">
                <User size={15} className="opacity-50" /> Marta Ruiz
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={15} className="opacity-50" /> marta.ruiz@email.com
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={15} className="opacity-50" /> +34 600 111 222
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
