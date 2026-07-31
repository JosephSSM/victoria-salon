import { supabase } from "@/lib/supabase";
import type { ServiceKey } from "@/lib/data";

export type EstadoCita = "pendiente" | "confirmada" | "cancelada" | "completada";

export type Cita = {
  id: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  notas: string | null;
  servicio: {
    nombre: string;
    categoria: ServiceKey;
    duracion_minutos: number;
    precio_euros: number;
  } | null;
};

type CitaRow = Omit<Cita, "servicio"> & {
  servicios: Cita["servicio"];
};

export async function getMisCitas(clienteId: string): Promise<Cita[]> {
  const { data, error } = await supabase
    .from("citas")
    .select("id, fecha, hora, estado, notas, servicios (nombre, categoria, duracion_minutos, precio_euros)")
    .eq("cliente_id", clienteId)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as CitaRow[]).map((row) => ({
    id: row.id,
    fecha: row.fecha,
    hora: row.hora,
    estado: row.estado,
    notas: row.notas,
    servicio: row.servicios,
  }));
}

export async function crearCita(params: {
  clienteId: string;
  servicioId: string;
  fecha: string;
  hora: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from("citas").insert({
    cliente_id: params.clienteId,
    servicio_id: params.servicioId,
    fecha: params.fecha,
    hora: params.hora,
    estado: "pendiente",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Esa hora ya está reservada. Elige otro horario." };
    }
    return { error: error.message };
  }

  return { error: null };
}

export async function cancelarCita(citaId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("citas").update({ estado: "cancelada" }).eq("id", citaId);
  return { error: error?.message ?? null };
}

export function citaEsFutura(fecha: string, hora: string): boolean {
  return new Date(`${fecha}T${hora}`) > new Date();
}
