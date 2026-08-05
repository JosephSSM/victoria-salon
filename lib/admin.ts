import { supabase } from "@/lib/supabase";
import type { EstadoCita } from "@/lib/citas";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function last7Dates(): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return out;
}

const DIA_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export type ResumenHoy = {
  ingresosHoy: number;
  citasCompletadasHoy: number;
  citasHoy: number;
  citasPendientesHoy: number;
  clientasNuevasMes: number;
};

export async function getResumenHoy(): Promise<ResumenHoy> {
  const hoy = todayISO();
  const inicioMes = `${hoy.slice(0, 7)}-01`;

  const [citasRes, clientesRes] = await Promise.all([
    supabase.from("citas").select("estado, servicios (precio_euros)").eq("fecha", hoy),
    supabase.from("clientes").select("id", { count: "exact", head: true }).gte("fecha_registro", inicioMes),
  ]);

  if (citasRes.error) throw citasRes.error;
  if (clientesRes.error) throw clientesRes.error;

  const citas = (citasRes.data ?? []) as unknown as {
    estado: EstadoCita;
    servicios: { precio_euros: number } | null;
  }[];

  const completadas = citas.filter((c) => c.estado === "completada");
  const ingresosHoy = completadas.reduce((sum, c) => sum + Number(c.servicios?.precio_euros ?? 0), 0);

  return {
    ingresosHoy,
    citasCompletadasHoy: completadas.length,
    citasHoy: citas.filter((c) => c.estado !== "cancelada").length,
    citasPendientesHoy: citas.filter((c) => c.estado === "pendiente").length,
    clientasNuevasMes: clientesRes.count ?? 0,
  };
}

export type AgendaItem = {
  id: string;
  hora: string;
  estado: EstadoCita;
  clienteNombre: string;
  servicioNombre: string;
};

export async function getAgendaHoy(): Promise<AgendaItem[]> {
  const hoy = todayISO();
  const { data, error } = await supabase
    .from("citas")
    .select("id, hora, estado, clientes (nombre_completo), servicios (nombre)")
    .eq("fecha", hoy)
    .order("hora", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as unknown as {
    id: string;
    hora: string;
    estado: EstadoCita;
    clientes: { nombre_completo: string } | null;
    servicios: { nombre: string } | null;
  }[];

  return rows.map((row) => ({
    id: row.id,
    hora: row.hora,
    estado: row.estado,
    clienteNombre: row.clientes?.nombre_completo || "—",
    servicioNombre: row.servicios?.nombre || "—",
  }));
}

export type ClienteConVisitas = {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string | null;
  fechaRegistro: string;
  visitas: number;
  ultimaVisita: string | null;
};

export async function getClientes(): Promise<ClienteConVisitas[]> {
  const [clientesRes, citasRes] = await Promise.all([
    supabase
      .from("clientes")
      .select("id, nombre_completo, email, telefono, fecha_registro")
      .order("fecha_registro", { ascending: false }),
    supabase.from("citas").select("cliente_id, fecha").eq("estado", "completada"),
  ]);

  if (clientesRes.error) throw clientesRes.error;
  if (citasRes.error) throw citasRes.error;

  const visitasPorCliente = new Map<string, { count: number; ultima: string | null }>();
  for (const c of citasRes.data ?? []) {
    const entry = visitasPorCliente.get(c.cliente_id) ?? { count: 0, ultima: null as string | null };
    entry.count += 1;
    if (!entry.ultima || c.fecha > entry.ultima) entry.ultima = c.fecha;
    visitasPorCliente.set(c.cliente_id, entry);
  }

  return (clientesRes.data ?? []).map((c) => {
    const v = visitasPorCliente.get(c.id);
    return {
      id: c.id,
      nombreCompleto: c.nombre_completo,
      email: c.email,
      telefono: c.telefono,
      fechaRegistro: c.fecha_registro,
      visitas: v?.count ?? 0,
      ultimaVisita: v?.ultima ?? null,
    };
  });
}

export type IngresoDia = { fecha: string; dia: string; total: number };

export async function getIngresosSemana(): Promise<IngresoDia[]> {
  const dias = last7Dates();
  const { data, error } = await supabase
    .from("citas")
    .select("fecha, servicios (precio_euros)")
    .eq("estado", "completada")
    .gte("fecha", dias[0]);

  if (error) throw error;

  const rows = (data ?? []) as unknown as { fecha: string; servicios: { precio_euros: number } | null }[];

  const totales = new Map<string, number>(dias.map((d) => [d, 0]));
  for (const row of rows) {
    totales.set(row.fecha, (totales.get(row.fecha) ?? 0) + Number(row.servicios?.precio_euros ?? 0));
  }

  return dias.map((fecha) => ({
    fecha,
    dia: DIA_LABEL[new Date(`${fecha}T00:00:00`).getDay()],
    total: totales.get(fecha) ?? 0,
  }));
}

export type ServicioTop = { nombre: string; total: number };

export async function getServiciosTop(): Promise<ServicioTop[]> {
  const dias = last7Dates();
  const { data, error } = await supabase
    .from("citas")
    .select("servicios (nombre)")
    .eq("estado", "completada")
    .gte("fecha", dias[0]);

  if (error) throw error;

  const rows = (data ?? []) as unknown as { servicios: { nombre: string } | null }[];

  const counts = new Map<string, number>();
  for (const row of rows) {
    const nombre = row.servicios?.nombre;
    if (!nombre) continue;
    counts.set(nombre, (counts.get(nombre) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}
