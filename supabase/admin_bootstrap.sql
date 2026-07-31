-- Ejecutar DESPUÉS de que la cuenta de staff exista en auth.users
-- (es decir, después de que Victoria/el personal se registre al menos una vez
-- vía el login normal de Supabase Auth). Repetir por cada cuenta admin.

update auth.users
set raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'admin')
where email = 'joseeph_s@hotmail.com';
