-- Corrección puntual: las tablas ya existen (creadas por schema.sql), pero
-- faltan los grants de tabla que Postgres exige antes de que RLS entre en
-- juego. Ejecutar una sola vez en el SQL Editor de Supabase.

grant usage on schema public to anon, authenticated;

grant select on servicios to anon, authenticated;
grant insert, update, delete on servicios to authenticated;

grant select, update, delete on clientes to authenticated;

grant select, insert, update, delete on citas to authenticated;
