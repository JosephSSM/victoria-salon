"use client";

import { useState } from "react";
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
  TrendingUp,
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

const REVENUE = [
  { d: "Lun", v: 420 },
  { d: "Mar", v: 380 },
  { d: "Mié", v: 510 },
  { d: "Jue", v: 460 },
  { d: "Vie", v: 690 },
  { d: "Sáb", v: 820 },
  { d: "Dom", v: 0 },
];

const TOP_SERVICES = [
  { s: "Corte y peinado", v: 34 },
  { s: "Manicura semi", v: 28 },
  { s: "Color completo", v: 21 },
  { s: "Facial hidrat.", v: 17 },
  { s: "Depilación", v: 15 },
];

const APPTS = [
  { time: "09:30", client: "Marta Ruiz", service: "Corte y peinado", pro: "Ana", status: "Confirmada" },
  { time: "10:15", client: "Laura Gómez", service: "Manicura semipermanente", pro: "Vic", status: "Confirmada" },
  { time: "11:00", client: "Carla Medina", service: "Ritual facial", pro: "Sofía", status: "Pendiente" },
  { time: "12:30", client: "Nuria Vidal", service: "Color completo", pro: "Ana", status: "Confirmada" },
  { time: "16:00", client: "Ines Ferrer", service: "Depilación piernas", pro: "Sofía", status: "Cancelada" },
  { time: "17:30", client: "Paula Soler", service: "Masaje relajante", pro: "Vic", status: "Confirmada" },
];

const CLIENTS = [
  { name: "Marta Ruiz", visits: 12, last: "12 jul 2026", tag: "VIP" },
  { name: "Laura Gómez", visits: 6, last: "18 jul 2026", tag: "Recurrente" },
  { name: "Carla Medina", visits: 2, last: "05 jul 2026", tag: "Nueva" },
  { name: "Nuria Vidal", visits: 9, last: "20 jul 2026", tag: "Recurrente" },
];

function statusColor(s: string) {
  if (s === "Confirmada") return { bg: `${T.sage}1a`, fg: T.sage };
  if (s === "Pendiente") return { bg: `${T.amber}1a`, fg: T.amber };
  return { bg: `${T.rustRed}1a`, fg: T.rustRed };
}

function tagColor(t: string) {
  if (t === "VIP") return { bg: `${T.gold}22`, fg: T.bordeauxDeep };
  if (t === "Nueva") return { bg: `${T.sage}1a`, fg: T.sage };
  return { bg: `${T.line}`, fg: T.ink };
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
          {tab === "resumen" && (
            <>
              <div className="mb-6">
                <h1 className={`${playfairDisplay.className} text-2xl`}>Buenos días, Victoria</h1>
                <p className="text-sm opacity-50">Hoy, jueves 24 de julio de 2026</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <KpiCard icon={DollarSign} label="Ingresos hoy" value="€418" sub="+12% vs. ayer" accent={T.sage} />
                <KpiCard icon={CalendarDays} label="Citas hoy" value="14" sub="2 pendientes de confirmar" accent={T.bordeaux} />
                <KpiCard icon={UserPlus} label="Clientas nuevas" value="9" sub="este mes" accent={T.gold} />
                <KpiCard icon={TrendingUp} label="Ocupación" value="82%" sub="franja 10:00–18:00" accent={T.rustRed} />
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Ingresos de la semana</h3>
                    <span className="text-xs opacity-50">Últimos 7 días</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={REVENUE}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.bordeaux} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={T.bordeaux} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                      <XAxis dataKey="d" tick={{ fontSize: 12, fill: T.ink, opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: T.ink, opacity: 0.4 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${T.line}`, fontSize: 12 }} />
                      <Area type="monotone" dataKey="v" stroke={T.bordeaux} strokeWidth={2} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                  <h3 className="text-sm font-semibold mb-4">Servicios más solicitados</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={TOP_SERVICES} layout="vertical" margin={{ left: 0 }}>
                      <XAxis type="number" hide />
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
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Agenda de hoy</h3>
                  <button className="text-xs font-semibold" style={{ color: T.bordeaux }}>
                    Ver calendario completo
                  </button>
                </div>
                <div className="flex flex-col">
                  {APPTS.map((a, i) => {
                    const sc = statusColor(a.status);
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-4 py-3 ${i !== APPTS.length - 1 ? "border-b" : ""}`}
                        style={{ borderColor: T.line }}
                      >
                        <div className={`${ibmPlexMono.className} text-sm w-14 flex items-center gap-1.5 opacity-70`}>
                          <Clock size={12} /> {a.time}
                        </div>
                        <div className="w-40 text-sm font-medium">{a.client}</div>
                        <div className="flex-1 text-sm opacity-60">{a.service}</div>
                        <div className="w-20 text-xs opacity-50">{a.pro}</div>
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1"
                          style={{ background: sc.bg, color: sc.fg }}
                        >
                          <CircleDot size={9} /> {a.status}
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
                    {CLIENTS.map((c, i) => {
                      const tc = tagColor(c.tag);
                      return (
                        <tr key={i} className={i !== CLIENTS.length - 1 ? "border-b" : ""} style={{ borderColor: T.line }}>
                          <td className="px-6 py-3.5 font-medium">{c.name}</td>
                          <td className={`px-6 py-3.5 ${ibmPlexMono.className}`}>{c.visits}</td>
                          <td className="px-6 py-3.5 opacity-60">{c.last}</td>
                          <td className="px-6 py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: tc.bg, color: tc.fg }}>
                              {c.tag}
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
