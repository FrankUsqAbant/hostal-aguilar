-- Hostal Aguilar · backend (Supabase)
-- Pegar completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez sin duplicar nada.

-- 1) Contenido editable de la web (lo lee cualquiera, lo edita solo un administrador)
create table if not exists public.site_content (
  key text primary key check (key in ('hostal_info', 'rooms', 'services')),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);

-- 2) Correos autorizados para entrar al panel
create table if not exists public.admins (
  email text primary key check (email = lower(email))
);

alter table public.site_content enable row level security;
alter table public.admins enable row level security;

-- ¿El usuario con sesión iniciada es administrador?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before insert or update on public.site_content
  for each row execute function public.touch_updated_at();

-- Reglas de acceso (RLS)
drop policy if exists "contenido visible para todos" on public.site_content;
create policy "contenido visible para todos" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "admin crea contenido" on public.site_content;
create policy "admin crea contenido" on public.site_content
  for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "admin edita contenido" on public.site_content;
create policy "admin edita contenido" on public.site_content
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admin se ve a si mismo" on public.admins;
create policy "admin se ve a si mismo" on public.admins
  for select to authenticated using (email = lower(coalesce((select auth.jwt()) ->> 'email', '')));

-- 3) Datos iniciales (los actuales de la web)
insert into public.site_content (key, value) values
  ('hostal_info', $json${"name":"Hostal Aguilar","tagline":"Cajamarca","address":"Jr. Los Andes 115 - 117, Cajamarca, Perú","shortAddress":"Jr. Los Andes 115 • Cajamarca","primaryPhone":"+51 941 824 120","secondaryPhone":"+51 976 864 915","phoneDisplay":"941 824 120 / 976 864 915","whatsappNumber":"51941824120","email":"reservas@hostalaguilar.com","businessName":"Hostal Aguilar Cajamarca S.R.L.","ruc":"20612345678","schedule":"Abierto 24 Horas","googleRating":3.9,"totalReviews":16,"facadeImage":"/assets/aistudio/Captura_de_pantalla_2026-10-31_010053_5afe7592.jpg","heroImage":"/images/natural_hotel_room_cajamarca_1793725794706.jpg"}$json$::jsonb),
  ('rooms', $json$[{"id":"simple","type":"simple","badge":"Simple / Ejecutiva","name":"Habitación Simple","subtitle":"Para viajeros individuales","description":"Espacio acogedor y tranquilo diseñado especialmente para profesionales o viajeros que buscan descanso impecable y privacidad total.","pricePerNight":50,"capacity":"1 Persona","bedType":"1 Cama individual (1.5 plazas)","image":"/images/room_simple_1793699274451.jpg","gallery":["/images/room_simple_1793699274451.jpg","/images/hero_hostal_room_1793699272432.jpg"],"amenities":["Agua Caliente 24h","Wi-Fi de Alta Velocidad","TV Cable HD","Baño Privado","Toallas y Jabón"],"ctaColor":"blue"},{"id":"doble","type":"doble","badge":"Doble","name":"Habitación Doble","subtitle":"Perfecta para amigos o compañeros","description":"Habitación amplia y luminosa equipada con dos camas individuales, ideal para amigos, colegas de trabajo o familiares que visitan Cajamarca.","pricePerNight":80,"capacity":"2 Personas","bedType":"2 Camas individuales (1.5 plazas c/u)","image":"/images/room_doble_1793699273668.jpg","gallery":["/images/room_doble_1793699273668.jpg","/images/hero_hostal_room_1793699272432.jpg"],"amenities":["Agua Caliente 24h","Wi-Fi de Alta Velocidad","TV Cable HD","Baño Privado","Ventilación Natural"],"ctaColor":"red","featured":true},{"id":"matrimonial","type":"matrimonial","badge":"Matrimonial","name":"Habitación Matrimonial","subtitle":"Ideal para parejas y descanso confortable","description":"Ambiente cálido y acogedor con cama Queen de 2 plazas, ropa de cama suave, baño privado completo y excelente iluminación.","pricePerNight":90,"capacity":"2 Personas","bedType":"1 Cama Queen / 2 plazas","image":"/images/hero_hostal_room_1793699272432.jpg","gallery":["/images/hero_hostal_room_1793699272432.jpg","/images/room_matrimonial_1793699274426.jpg"],"amenities":["Agua Caliente 24h","Wi-Fi de Alta Velocidad","TV Cable HD","Baño Privado","Toallas y Amenities"],"ctaColor":"blue"},{"id":"romantica","type":"romantica","badge":"Romántica","name":"Habitación Romántica","subtitle":"Especial para aniversarios y parejas","description":"Decoración exclusiva con arreglo de cisnes de toalla, pétalos y ambiente íntimo y cálido con cama Queen de 2 plazas.","pricePerNight":110,"capacity":"2 Personas","bedType":"1 Cama Queen con arreglo especial","image":"/images/room_matrimonial_1793699274426.jpg","gallery":["/images/room_matrimonial_1793699274426.jpg","/images/hero_hostal_room_1793699272432.jpg"],"amenities":["Agua Caliente 24h","Wi-Fi de Alta Velocidad","TV Cable HD","Baño Privado","Decoración Romántica de Cisnes"],"ctaColor":"red"}]$json$::jsonb),
  ('services', $json$[{"id":"24h","iconName":"clock","title":"Atención 24 Horas","description":"Recepción permanente con atención cordial para llegadas en buses nocturnos o check-in flexible.","active":true,"category":"Incluido","order":1},{"id":"bath","iconName":"shower","title":"Baño Privado","description":"Ducha independiente en cada habitación con agua caliente garantizada a cualquier hora.","active":true,"category":"Incluido","order":2},{"id":"tv","iconName":"tv","title":"TV por Cable","description":"Televisor con canales de noticias, deportes y películas para tus momentos de relax.","active":true,"category":"Incluido","order":3},{"id":"payment","iconName":"wallet","title":"Pago Yape, Plin y Efectivo","description":"Transferencias inmediatas sin comisiones bancarias ni recargos en tu estadía.","active":true,"category":"Incluido","order":4},{"id":"wifi","iconName":"wifi","title":"Wi-Fi de Alta Velocidad","description":"Señal óptima en todos los pisos para videollamadas, trabajo remoto o redes sociales.","active":true,"category":"Incluido","order":5},{"id":"luggage","iconName":"shield","title":"Custodia de Equipaje","description":"Servicio gratuito de guardavalijas si llegas antes o sales después de tu tour.","active":true,"category":"Incluido","order":6}]$json$::jsonb)
on conflict (key) do nothing;

-- 4) Administrador del panel: REEMPLAZA tu-correo@ejemplo.com por el correo de tu usuario de Supabase Auth
insert into public.admins (email) values ('tu-correo@ejemplo.com')
on conflict (email) do nothing;
