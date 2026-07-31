"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
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
import { supabase } from "@/lib/supabase";
import { getServiciosActivos, type Servicio } from "@/lib/services";
import { getMisCitas, crearCita, cancelarCita, citaEsFutura, type Cita, type EstadoCita } from "@/lib/citas";

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

const SERVICES: { key: ServiceKey; label: string; icon: LucideIcon }[] = [
  { key: "peluqueria", label: "Peluquería", icon: Scissors },
  { key: "manospies", label: "Manos y pies", icon: Hand },
  { key: "facial", label: "Facial", icon: Sparkles },
  { key: "corporal", label: "Corporal", icon: Flower2 },
  { key: "depilacion", label: "Depilación", icon: Droplets },
];

const TIME_SLOTS = ["10:00", "10:45", "11:30", "12:15", "13:00", "16:00", "16:45", "17:30"];

const ESTADO_LABEL: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

function formatFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Tab = "citas" | "reservar" | "perfil";
type AuthMode = "login" | "signup";

export default function MiCuentaPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>("citas");

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [citas, setCitas] = useState<Cita[]>([]);
  const [citasLoading, setCitasLoading] = useState(false);
  const [citasError, setCitasError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingSession(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    getServiciosActivos()
      .then(setServicios)
      .catch(() => setServicios([]));
  }, [user]);

  async function loadCitas(clienteId: string) {
    setCitasLoading(true);
    setCitasError(null);
    try {
      const c = await getMisCitas(clienteId);
      setCitas(c);
    } catch (e) {
      setCitasError(e instanceof Error ? e.message : "No se pudieron cargar tus citas.");
    } finally {
      setCitasLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadCitas(user.id);
  }, [user]);

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthInfo(null);
    setAuthLoading(true);

    if (authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: nombreCompleto } },
      });
      setAuthLoading(false);
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (!data.session) {
        setAuthInfo("Te enviamos un correo de confirmación. Revisa tu bandeja de entrada para activar la cuenta.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setAuthLoading(false);
      if (error) {
        setAuthError(error.message);
      }
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function handleConfirmarReserva() {
    if (!user || !selectedServicio || !date || !time) return;
    setBookingLoading(true);
    setBookingError(null);
    const { error } = await crearCita({
      clienteId: user.id,
      servicioId: selectedServicio.id,
      fecha: date,
      hora: time,
    });
    setBookingLoading(false);
    if (error) {
      setBookingError(error);
      return;
    }
    setConfirmed(true);
    loadCitas(user.id);
  }

  async function handleCancelar(citaId: string) {
    setCancelingId(citaId);
    const { error } = await cancelarCita(citaId);
    setCancelingId(null);
    if (error) {
      setCitasError(error);
      return;
    }
    if (user) loadCitas(user.id);
  }

  if (checkingSession) {
    return (
      <div
        className={`${manrope.className} min-h-screen w-full flex items-center justify-center`}
        style={{ background: T.ivory, color: T.ink }}
      >
        <p className="text-sm opacity-50">Cargando…</p>
      </div>
    );
  }

  if (!user) {
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

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3 mb-5">
            {authMode === "signup" && (
              <input
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
                className="px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: T.ivory, border: `1px solid ${T.line}` }}
              />
            )}
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: T.ivory, border: `1px solid ${T.line}` }}
            />
            <input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="px-4 py-3 rounded-lg text-sm outline-none"
              style={{ background: T.ivory, border: `1px solid ${T.line}` }}
            />

            {authError && <p className="text-xs text-center" style={{ color: "#B14B3F" }}>{authError}</p>}
            {authInfo && <p className="text-xs text-center" style={{ color: T.sage }}>{authInfo}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-full text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: T.bordeaux }}
            >
              {authLoading ? "Un momento…" : authMode === "signup" ? "Crear cuenta" : "Entrar"}
            </button>
          </form>

          <p className="text-xs text-center opacity-50">
            {authMode === "signup" ? "¿Ya tienes cuenta?" : "¿Primera vez?"}{" "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "signup" ? "login" : "signup");
                setAuthError(null);
                setAuthInfo(null);
              }}
              style={{ color: T.bordeaux }}
              className="font-semibold"
            >
              {authMode === "signup" ? "Inicia sesión" : "Crear cuenta"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  const displayName = (user.user_metadata?.full_name as string | undefined)?.trim() || user.email || "";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  const proximas = citas.filter((c) => c.estado === "pendiente" || c.estado === "confirmada");
  const historial = citas.filter((c) => c.estado === "cancelada" || c.estado === "completada");
  const serviciosCategoria = service ? servicios.filter((s) => s.categoria === service) : [];

  return (
    <div className={`${manrope.className} min-h-screen w-full`} style={{ background: T.ivory, color: T.ink }}>
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: T.line, background: T.card }}>
        <div className={`${playfairDisplay.className} text-lg`}>
          Victoria <span style={{ color: T.bordeaux }}>Salón</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: T.gold }}>
            {initials}
          </div>
          <button onClick={handleLogout} className="text-xs opacity-60 flex items-center gap-1">
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
                setService(null);
                setSelectedServicio(null);
                setDate("");
                setTime(null);
                setBookingError(null);
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
            <h1 className={`${playfairDisplay.className} text-2xl mb-1`}>Hola, {displayName}</h1>
            <p className="text-sm opacity-50 mb-6">Aquí tienes tus próximas visitas</p>

            {citasLoading && <p className="text-sm opacity-50">Cargando tus citas…</p>}
            {citasError && <p className="text-sm mb-4" style={{ color: "#B14B3F" }}>{citasError}</p>}

            {!citasLoading && (
              <>
                {proximas.length === 0 && <p className="text-sm opacity-50 mb-6">No tienes citas próximas.</p>}
                {proximas.map((c) => (
                  <div key={c.id} className="rounded-2xl p-5 mb-4 flex items-center justify-between" style={{ background: T.bordeaux, color: "white" }}>
                    <div>
                      <p className="text-xs opacity-70 mb-1 flex items-center gap-1">
                        <Calendar size={12} /> {formatFecha(c.fecha)} · {c.hora.slice(0, 5)}
                      </p>
                      <p className={`${playfairDisplay.className} text-lg`}>{c.servicio?.nombre}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${T.gold}33`, color: T.gold }}>
                        {ESTADO_LABEL[c.estado]}
                      </span>
                      {citaEsFutura(c.fecha, c.hora) && (
                        <button
                          onClick={() => handleCancelar(c.id)}
                          disabled={cancelingId === c.id}
                          className="text-xs underline opacity-80 disabled:opacity-40"
                        >
                          {cancelingId === c.id ? "Cancelando…" : "Cancelar"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <p className="text-xs font-semibold uppercase tracking-wide opacity-50 mt-8 mb-3">Historial</p>
                {historial.length === 0 && <p className="text-sm opacity-50">Aún no tienes historial.</p>}
                {historial.map((c) => (
                  <div key={c.id} className="rounded-xl p-4 mb-3 flex items-center justify-between" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                    <div>
                      <p className="text-xs opacity-50 mb-0.5">
                        {formatFecha(c.fecha)} · {c.hora.slice(0, 5)}
                      </p>
                      <p className="text-sm font-medium">{c.servicio?.nombre}</p>
                    </div>
                    {c.estado === "completada" ? (
                      <Check size={16} color={T.sage} />
                    ) : (
                      <span className="text-xs opacity-50">Cancelada</span>
                    )}
                  </div>
                ))}
              </>
            )}
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

            {step === 2 && (
              <>
                <p className="text-sm font-semibold mb-3">2. Elige el servicio</p>
                <div className="flex flex-col gap-2 mb-4">
                  {serviciosCategoria.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedServicio(s);
                        setStep(3);
                      }}
                      className="text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between"
                      style={{ background: T.card, border: `1px solid ${T.line}` }}
                    >
                      <span>
                        {s.nombre} <span className="opacity-50">· {s.duracion_minutos} min · {s.precio_euros}€</span>
                      </span>
                      <ChevronRight size={15} className="opacity-40" />
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

                {bookingError && <p className="text-xs mb-3" style={{ color: "#B14B3F" }}>{bookingError}</p>}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="text-xs opacity-50">
                    ← Volver
                  </button>
                  <button
                    disabled={!date || !time || bookingLoading}
                    onClick={handleConfirmarReserva}
                    className="ml-auto px-6 py-3 rounded-full text-sm font-semibold text-white disabled:opacity-40"
                    style={{ background: T.bordeaux }}
                  >
                    {bookingLoading ? "Reservando…" : "Confirmar reserva"}
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
            <p className="text-sm opacity-60 mb-1">{selectedServicio?.nombre}</p>
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
                <User size={15} className="opacity-50" /> {displayName}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={15} className="opacity-50" /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm opacity-50">
                <Phone size={15} /> Sin teléfono guardado
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
