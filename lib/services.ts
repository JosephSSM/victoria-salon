import { supabase } from "@/lib/supabase";
import type { ServiceKey } from "@/lib/data";

export type Servicio = {
  id: string;
  categoria: ServiceKey;
  nombre: string;
  duracion_minutos: number;
  precio_euros: number;
};

export async function getServiciosActivos(): Promise<Servicio[]> {
  const { data, error } = await supabase
    .from("servicios")
    .select("id, categoria, nombre, duracion_minutos, precio_euros")
    .eq("activo", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
