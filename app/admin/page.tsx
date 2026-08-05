"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { Playfair_Display, Manrope, IBM_Plex_Mono } from "next/font/google";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Scissors,
  UserCog,
  BarChart3,
  Package,
  Megaphone,
  Search,
  Bell,
  Plus,
  Clock,
  CircleDot,
  ShieldAlert,
  DollarSign,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/lib/supabase";
import type { EstadoCita } from "@/lib/citas";
import {
  getResumenHoy,
  getAgendaHoy,
  getClientes,
  getIngresosSemana,
  getServiciosTop,
  type ResumenHoy,
  type AgendaItem,
  type ClienteConVisitas,
  type IngresoDia,
  type ServicioTop,
} from "@/lib/admin";

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

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-ibm-plex-mono",
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
  amber: "#C99A3E",
  rustRed: "#B14B3F",
};

type NavKey =
  | "resumen"
  | "citas"
  | "clientes"
  | "servicios"
  | "personal"
  | "reportes"
  | "inventario"
  | "marketing";

const NAV: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: "resumen", label: "Resumen", icon: LayoutGrid },
  { key: "citas", label: "Citas", icon: CalendarDays },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "servicios", label: "Servicios", icon: Scissors },
  { key: "personal", label: "Personal", icon: UserCog },
  { key: "reportes", label: "Reportes", icon: BarChart3 },
  { key: "inventario", label: "Inventario", icon: Package },
  { key: "marketing", label: "Marketing", icon: Megaphone },
];

const ESTADO_LABEL: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

function statusColor(s: EstadoCita) {
  if (s === "confirmada") return { bg: `${T.sage}1a`, fg: T.sage };
  if (s === "pendiente") return { bg: `${T.amber}1a`, fg: T.amber };
  if (s === "completada") return { bg: `${T.gold}22`, fg: T.bordeauxDeep };
  return { bg: `${T.rustRed}1a`, fg: T.rustRed };
}

function clienteTag(c: ClienteConVisitas): string {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  if (new Date(c.fechaRegistro) >= inicioMes) return "Nueva";
  if (c.visitas >= 8) return "VIP";
  return "Recurrente";
}

function tagColor(t: string) {
  if (t === "VIP") return { bg: `${T.gold}22`, fg: T.bordeauxDeep };
  if (t === "Nueva") return { bg: `${T.sage}1a`, fg: T.sage };
  return { bg: `${T.line}`, fg: T.ink };
}

const eurFmt = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

function formatFechaCorta(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function saludo(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex-1 min-w-[180px]" style={{ background: T.card, border: `1px solid ${T.line}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-50">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
          <Icon size={15} color={accent} />
        </div>
      </div>
      <div className={`${ibmPlexMono.className} text-2xl font-semibold mb-1`}>{value}</div>
      <div className="text-xs opacity-50">{sub}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<NavKey>("resumen");

  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [resumen, setResumen] = useState<ResumenHoy | null>(null);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [clientes, setClientes] = useState<ClienteConVisitas[]>([]);
  const [ingresosSemana, setIngresosSemana] = useState<IngresoDia[]>([]);
  const [serviciosTop, setServiciosTop] = useState<ServicioTop[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.app_metadata?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    setDataLoading(true);
    setDataError(null);
    Promise.all([getResumenHoy(), getAgendaHoy(), getClientes(), getIngresosSemana(), getServiciosTop()])
      .then(([r, a, c, i, s]) => {
        setResumen(r);
        setAgenda(a);
        setClientes(c);
        setIngresosSemana(i);
        setServiciosTop(s);
      })
      .catch((e) => setDataError(e instanceof Error ? e.message : "No se pudieron cargar los datos del panel."))
      .finally(() => setDataLoading(false));
  }, [isAdmin]);

  const displayName =
    (session?.user?.user_metadata?.full_name as string | undefined)?.trim() || session?.user?.email || "Admin";

  if (checkingSession) {
    return (
      <div className={`${manrope.className} min-h-screen w-full flex items-center justify-center`} style={{ background: T.ivory, color: T.ink }}>
        <p className="text-sm opacity-50">Cargando…</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className={`${manrope.className} min-h-screen w-full flex items-center justify-center p-6`} style={{ background: T.ivory, color: T.ink }}>
        <div className="w-full max-w-sm rounded-2xl p-8 text-center" style={{ background: T.card, border: `1px solid ${T.line}` }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${T.rustRed}1a` }}>
            <ShieldAlert size={22} color={T.rustRed} />
          </div>
          <h1 className={`${playfairDisplay.className} text-xl mb-2`}>Acceso denegado</h1>
          <p className="text-sm opacity-60 mb-6">
            {session
              ? "Tu cuenta no tiene permisos de administración para ver este panel."
              : "Necesitas iniciar sesión con una cuenta de administración para ver este panel."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: T.bordeaux }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${manrope.className} min-h-screen w-full flex`}
      style={{ background: T.ivory, color: T.ink }}
    >
      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: T.bordeauxDeep, color: T.ivory }}>
        <div className="px-6 py-6 border-b" style={{ borderColor: "#ffffff1a" }}>
          <div className={`${playfairDisplay.className} text-lg`}>
            Victoria <span style={{ color: T.gold }}>Salón</span>
          </div>
          <div className="text-[10px] opacity-50 uppercase tracking-widest mt-1">Panel de gestión</div>
        </div>
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = tab === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
                style={
                  isActive
                    ? { background: T.gold, color: T.bordeauxDeep, fontWeight: 600 }
                    : { color: `${T.ivory}cc` }
                }
              >
                <Icon size={16} />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="px-6 py-5 border-t text-xs opacity-40" style={{ borderColor: "#ffffff1a" }}>
          v1.0 · Panel interno
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: T.line, background: T.card }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg w-72" style={{ background: T.ivory }}>
            <Search size={14} className="opacity-40" />
            <input
              placeholder="Buscar clientas, citas, servicios..."
              className="bg-transparent text-sm outline-none w-full placeholder:opacity-40"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: T.bordeaux }}
            >
              <Plus size={14} /> Nueva cita
            </button>
            <Bell size={17} className="opacity-60" />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
              style={{ background: T.gold }}
            >
              VS
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto px-8 py-7">
          {dataError && (
            <div className="mb-6 rounded-xl px-4 py-3 text-sm" style={{ background: `${T.rustRed}14`, color: T.rustRed }}>
              {dataError}
            </div>
          )}

          {tab === "resumen" && (
            <>
              <div className="mb-6">
                <h1 className={`${playfairDisplay.className} text-2xl`}>
                  {saludo()}, {displayName}
                </h1>
                <p className="text-sm opacity-50">
                  Hoy,{" "}
                  {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <KpiCard
                  icon={DollarSign}
                  label="Ingresos hoy"
                  value={dataLoading ? "…" : eurFmt.format(resumen?.ingresosHoy ?? 0)}
                  sub={dataLoading ? "" : `${resumen?.citasCompletadasHoy ?? 0} citas completadas`}
                  accent={T.sage}
                />
                <KpiCard
                  icon={CalendarDays}
                  label="Citas hoy"
                  value={dataLoading ? "…" : String(resumen?.citasHoy ?? 0)}
                  sub="programadas hoy"
                  accent={T.bordeaux}
                />
                <KpiCard
                  icon={UserPlus}
                  label="Clientas nuevas"
                  value={dataLoading ? "…" : String(resumen?.clientasNuevasMes ?? 0)}
                  sub="este mes"
                  accent={T.gold}
                />
                <KpiCard
                  icon={Clock}
                  label="Citas pendientes"
                  value={dataLoading ? "…" : String(resumen?.citasPendientesHoy ?? 0)}
                  sub="por confirmar hoy"
                  accent={T.rustRed}
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Ingresos de la semana</h3>
                    <span className="text-xs opacity-50">Últimos 7 días</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={ingresosSemana.map((d) => ({ d: d.dia, v: d.total }))}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.bordeaux} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={T.bordeaux} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                      <XAxis dataKey="d" tick={{ fontSize: 12, fill: T.ink, opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: T.ink, opacity: 0.4 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => eurFmt.format(Number(value))}
                        contentStyle={{ borderRadius: 10, border: `1px solid ${T.line}`, fontSize: 12 }}
                      />
                      <Area type="monotone" dataKey="v" stroke={T.bordeaux} strokeWidth={2} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                  <h3 className="text-sm font-semibold mb-4">Servicios más solicitados</h3>
                  {!dataLoading && serviciosTop.length === 0 ? (
                    <p className="text-xs opacity-50 py-8 text-center">Sin citas completadas en los últimos 7 días.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={serviciosTop.map((s) => ({ s: s.nombre, v: s.total }))} layout="vertical" margin={{ left: 0 }}>
                        <XAxis type="number" hide allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="s"
                          width={110}
                          tick={{ fontSize: 11, fill: T.ink, opacity: 0.7 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${T.line}`, fontSize: 12 }} />
                        <Bar dataKey="v" fill={T.gold} radius={[0, 6, 6, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Agenda de hoy</h3>
                  <button className="text-xs font-semibold" style={{ color: T.bordeaux }}>
                    Ver calendario completo
                  </button>
                </div>
                {dataLoading && <p className="text-sm opacity-50 py-6">Cargando agenda…</p>}
                {!dataLoading && agenda.length === 0 && (
                  <p className="text-sm opacity-50 py-6">No hay citas registradas para hoy.</p>
                )}
                <div className="flex flex-col">
                  {agenda.map((a, i) => {
                    const sc = statusColor(a.estado);
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-4 py-3 ${i !== agenda.length - 1 ? "border-b" : ""}`}
                        style={{ borderColor: T.line }}
                      >
                        <div className={`${ibmPlexMono.className} text-sm w-14 flex items-center gap-1.5 opacity-70`}>
                          <Clock size={12} /> {a.hora.slice(0, 5)}
                        </div>
                        <div className="w-40 text-sm font-medium">{a.clienteNombre}</div>
                        <div className="flex-1 text-sm opacity-60">{a.servicioNombre}</div>
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1"
                          style={{ background: sc.bg, color: sc.fg }}
                        >
                          <CircleDot size={9} /> {ESTADO_LABEL[a.estado]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {tab === "clientes" && (
            <>
              <div className="mb-6">
                <h1 className={`${playfairDisplay.className} text-2xl`}>Clientes</h1>
                <p className="text-sm opacity-50">Historial y fidelización</p>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase opacity-50" style={{ background: T.ivory }}>
                      <th className="px-6 py-3 font-semibold">Nombre</th>
                      <th className="px-6 py-3 font-semibold">Visitas</th>
                      <th className="px-6 py-3 font-semibold">Última visita</th>
                      <th className="px-6 py-3 font-semibold">Segmento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataLoading && (
                      <tr>
                        <td className="px-6 py-4 text-sm opacity-50" colSpan={4}>
                          Cargando clientas…
                        </td>
                      </tr>
                    )}
                    {!dataLoading && clientes.length === 0 && (
                      <tr>
                        <td className="px-6 py-4 text-sm opacity-50" colSpan={4}>
                          Aún no hay clientas registradas.
                        </td>
                      </tr>
                    )}
                    {clientes.map((c, i) => {
                      const tag = clienteTag(c);
                      const tc = tagColor(tag);
                      return (
                        <tr key={c.id} className={i !== clientes.length - 1 ? "border-b" : ""} style={{ borderColor: T.line }}>
                          <td className="px-6 py-3.5 font-medium">{c.nombreCompleto || c.email}</td>
                          <td className={`px-6 py-3.5 ${ibmPlexMono.className}`}>{c.visitas}</td>
                          <td className="px-6 py-3.5 opacity-60">
                            {c.ultimaVisita ? formatFechaCorta(c.ultimaVisita) : "—"}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: tc.bg, color: tc.fg }}>
                              {tag}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!["resumen", "clientes"].includes(tab) && (
            <div className="h-full flex flex-col items-center justify-center text-center py-24 opacity-50">
              <LayoutGrid size={28} className="mb-3" />
              <p className="text-sm">Sección &quot;{NAV.find((n) => n.key === tab)?.label}&quot; — espacio reservado en este mockup.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
