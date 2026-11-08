// Genera supabase/schema.sql: tablas, reglas de seguridad (RLS) y datos iniciales de src/data/hostalData.ts
// Uso: npx tsx scripts/build-seed-sql.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { HOSTAL_INFO, ROOMS, SERVICES } from '../src/data/hostalData';

const services = SERVICES.map((s, i) => ({ ...s, active: true, category: 'Incluido', order: i + 1 }));
const lit = (v: unknown) => `$json$${JSON.stringify(v)}$json$::jsonb`;
const DD = '$' + '$';

const sql = `-- Hostal Aguilar · backend (Supabase)
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
as ${DD}
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
${DD};
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as ${DD}
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
${DD};

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
  ('hostal_info', ${lit(HOSTAL_INFO)}),
  ('rooms', ${lit(ROOMS)}),
  ('services', ${lit(services)})
on conflict (key) do nothing;

-- 4) Administrador del panel: REEMPLAZA tu-correo@ejemplo.com por el correo de tu usuario de Supabase Auth
insert into public.admins (email) values ('tu-correo@ejemplo.com')
on conflict (email) do nothing;
`;

mkdirSync('supabase', { recursive: true });
writeFileSync('supabase/schema.sql', sql);
console.log('supabase/schema.sql', sql.length, 'bytes');
