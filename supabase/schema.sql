-- Victoria Salón — schema inicial
-- Ejecutar en el SQL Editor del panel de Supabase (Project > SQL Editor).
-- Orden: tipos -> tablas -> función is_admin() -> trigger de clientes -> RLS -> seed de servicios.

-- ============================================================
-- 1. Tipos
-- ============================================================
create type categoria_servicio as enum ('peluqueria', 'manospies', 'facial', 'corporal', 'depilacion');
create type estado_cita as enum ('pendiente', 'confirmada', 'cancelada', 'completada');

-- ============================================================
-- 2. Tablas
-- ============================================================
create table servicios (
  id uuid primary key default gen_random_uuid(),
  categoria categoria_servicio not null,
  nombre text not null,
  duracion_minutos integer not null check (duracion_minutos > 0),
  precio_euros numeric(10, 2) not null check (precio_euros >= 0),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- id comparte el mismo uuid que auth.users, así cada clienta = un login real.
create table clientes (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre_completo text not null default '',
  email text not null,
  telefono text,
  fecha_registro timestamptz not null default now()
);

create table citas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete cascade,
  servicio_id uuid not null references servicios (id) on delete restrict,
  fecha date not null,
  hora time not null,
  estado estado_cita not null default 'pendiente',
  notas text,
  created_at timestamptz not null default now()
);

create index citas_cliente_id_idx on citas (cliente_id);
create index citas_servicio_id_idx on citas (servicio_id);
create index citas_fecha_idx on citas (fecha);

-- ============================================================
-- 3. Rol admin: helper leído desde app_metadata del JWT
-- ============================================================
create function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ============================================================
-- 4. Trigger: crea la fila en "clientes" cuando alguien se registra
--    vía Supabase Auth (auth.users). security definer para poder
--    escribir en public.clientes pese al RLS que se activa después.
-- ============================================================
create function public.handle_new_cliente()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.clientes (id, nombre_completo, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_cliente();

-- ============================================================
-- 5. Row Level Security
-- ============================================================
alter table servicios enable row level security;
alter table clientes enable row level security;
alter table citas enable row level security;

-- servicios: lectura pública de los activos (landing/reserva); admin ve y edita todo
create policy "servicios_select_public" on servicios
  for select
  using (activo = true or public.is_admin());

create policy "servicios_admin_write" on servicios
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- clientes: cada clienta ve/edita solo su fila; admin ve/edita/borra todas
-- (el insert lo hace el trigger de arriba, no las propias clientas)
create policy "clientes_select" on clientes
  for select
  using (id = auth.uid() or public.is_admin());

create policy "clientes_update" on clientes
  for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "clientes_admin_delete" on clientes
  for delete
  using (public.is_admin());

-- citas: cada clienta ve/crea/edita solo las suyas; solo admin puede borrar
-- (cancelar = update de "estado" a 'cancelada', no delete)
create policy "citas_select" on citas
  for select
  using (cliente_id = auth.uid() or public.is_admin());

create policy "citas_insert" on citas
  for insert
  with check (cliente_id = auth.uid() or public.is_admin());

create policy "citas_update" on citas
  for update
  using (cliente_id = auth.uid() or public.is_admin())
  with check (cliente_id = auth.uid() or public.is_admin());

create policy "citas_delete" on citas
  for delete
  using (public.is_admin());

-- ============================================================
-- 6. Seed: servicios (de components/landing/Services.tsx / lib/data.ts)
-- ============================================================
insert into servicios (categoria, nombre, duracion_minutos, precio_euros) values
  ('peluqueria', 'Corte y peinado', 45, 18.00),
  ('peluqueria', 'Color completo', 90, 45.00),
  ('peluqueria', 'Mechas / balayage', 120, 60.00),
  ('peluqueria', 'Tratamiento capilar', 40, 25.00),
  ('manospies', 'Manicura clásica', 35, 14.00),
  ('manospies', 'Manicura semipermanente', 50, 20.00),
  ('manospies', 'Pedicura spa', 50, 24.00),
  ('manospies', 'Uñas esculpidas', 75, 32.00),
  ('facial', 'Limpieza facial profunda', 50, 28.00),
  ('facial', 'Hidratación intensiva', 40, 26.00),
  ('facial', 'Radiofrecuencia facial', 45, 35.00),
  ('facial', 'Ritual anti-edad', 60, 42.00),
  ('corporal', 'Masaje relajante', 60, 32.00),
  ('corporal', 'Drenaje linfático', 50, 30.00),
  ('corporal', 'Exfoliación corporal', 45, 27.00),
  ('depilacion', 'Cejas y labio', 15, 8.00),
  ('depilacion', 'Piernas completas', 40, 18.00),
  ('depilacion', 'Axilas', 15, 9.00),
  ('depilacion', 'Cera brasileña', 30, 16.00);
