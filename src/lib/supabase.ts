import { createClient } from '@supabase/supabase-js';

// Claves PÚBLICAS (publishable). La seguridad la ponen las reglas RLS de supabase/schema.sql.
// import.meta.env no existe fuera de Vite (p. ej. en las pruebas): en ese caso no hay cliente.
const url = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;

if (!supabase) {
  console.warn('Supabase no configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY): la web usa los datos por defecto.');
}
