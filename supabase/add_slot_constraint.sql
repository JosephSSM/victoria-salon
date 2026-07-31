-- Corrección puntual: la tabla "citas" ya existe (creada por schema.sql),
-- pero le falta el índice único que impide reservar dos veces la misma
-- fecha+hora. Ejecutar una sola vez en el SQL Editor de Supabase.

create unique index citas_fecha_hora_activa_idx on citas (fecha, hora)
  where estado in ('pendiente', 'confirmada');
