import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { SERVICES, ROOMS, HOSTAL_INFO } from '../data/hostalData';
import { Room } from '../types';
import { supabase } from '../lib/supabase';
import {
  AdminAmenity,
  SERVICES_STORAGE_KEY,
  ROOMS_STORAGE_KEY,
  HOSTAL_INFO_STORAGE_KEY
} from './adminAuth';

/*
 * Fuente de verdad: tabla public.site_content en Supabase (claves hostal_info, rooms, services).
 * localStorage solo guarda la última copia descargada para pintar rápido la próxima visita.
 * Escribir solo es posible con sesión de administrador (reglas RLS en supabase/schema.sql).
 */

const STORE_EVENT = 'hostal_store_updated';
const SAVE_EVENT = 'hostal_store_save';

type ContentKey = 'hostal_info' | 'rooms' | 'services';
const CACHE_KEYS: Record<ContentKey, string> = {
  hostal_info: HOSTAL_INFO_STORAGE_KEY,
  rooms: ROOMS_STORAGE_KEY,
  services: SERVICES_STORAGE_KEY
};

const DEFAULT_SERVICES: AdminAmenity[] = SERVICES.map((s, idx) => ({
  ...s,
  active: true,
  category: 'Incluido',
  order: idx + 1
}));

/** Las fotos vivían en /src/assets/images (solo existe en desarrollo); ahora están en /images. */
export function fixLegacyPaths<T>(value: T): T {
  const json = JSON.stringify(value);
  return json.includes('/src/assets/images/')
    ? (JSON.parse(json.replaceAll('/src/assets/images/', '/images/')) as T)
    : value;
}

function readCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? fixLegacyPaths(JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento bloqueado: la web sigue con lo que tiene en memoria */
  }
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }));
}

export type SaveStatus = { state: 'saving' | 'saved' | 'error'; message?: string };

function emitSave(status: SaveStatus) {
  window.dispatchEvent(new CustomEvent<SaveStatus>(SAVE_EVENT, { detail: status }));
}

/** Descarga el contenido publicado y actualiza la copia local. */
export async function loadRemoteContent(): Promise<void> {
  if (!supabase) return;
  const { data, error } = await supabase.from('site_content').select('key, value');
  if (error) {
    console.error('No se pudo leer el contenido de Supabase:', error.message);
    return;
  }
  for (const row of data ?? []) {
    const cacheKey = CACHE_KEYS[row.key as ContentKey];
    if (cacheKey) writeCache(cacheKey, fixLegacyPaths(row.value));
  }
}

async function saveRemote(key: ContentKey, raw: unknown): Promise<void> {
  const value = fixLegacyPaths(raw); // al guardar, también se corrigen las rutas en Supabase
  writeCache(CACHE_KEYS[key], value); // se ve al instante en el panel
  if (!supabase) {
    emitSave({ state: 'error', message: 'Supabase no está configurado: el cambio no se publicó.' });
    return;
  }
  emitSave({ state: 'saving' });
  const { error } = await supabase.from('site_content').upsert({ key, value });
  if (error) {
    emitSave({ state: 'error', message: `No se pudo publicar el cambio: ${error.message}` });
    await loadRemoteContent(); // vuelve a lo que está realmente publicado
    return;
  }
  emitSave({ state: 'saved' });
}

// Al cargar la web, trae lo publicado.
if (typeof window !== 'undefined') {
  void loadRemoteContent();
}

/* ---------- Lecturas y escrituras ---------- */

export function getStoredServices(): AdminAmenity[] {
  return readCache<AdminAmenity[]>(SERVICES_STORAGE_KEY, DEFAULT_SERVICES);
}
export function saveStoredServices(services: AdminAmenity[]): void {
  void saveRemote('services', services);
}

export function getStoredRooms(): Room[] {
  return readCache<Room[]>(ROOMS_STORAGE_KEY, ROOMS);
}
export function saveStoredRooms(rooms: Room[]): void {
  void saveRemote('rooms', rooms);
}

export function getStoredHostalInfo(): typeof HOSTAL_INFO {
  return readCache<typeof HOSTAL_INFO>(HOSTAL_INFO_STORAGE_KEY, HOSTAL_INFO);
}
export function saveStoredHostalInfo(info: typeof HOSTAL_INFO): void {
  void saveRemote('hostal_info', info);
}

/* ---------- Hooks ---------- */

function useStored<T>(read: () => T): T {
  const [value, setValue] = useState<T>(read);
  useEffect(() => {
    const handleUpdate = () => setValue(read());
    window.addEventListener(STORE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(STORE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  return value;
}

export function useRooms(): Room[] {
  return useStored(getStoredRooms);
}

export function useHostalInfo(): typeof HOSTAL_INFO {
  return useStored(getStoredHostalInfo);
}

export function useServices() {
  const services = useStored(getStoredServices);
  return {
    services,
    activeServices: services.filter(s => s.active !== false),
    updateServices: saveStoredServices,
    resetServicesToDefaults: () => saveStoredServices(DEFAULT_SERVICES)
  };
}

/** Estado del último guardado (para mostrar "Publicado" o el error en el panel). */
export function useSaveStatus(): SaveStatus | null {
  const [status, setStatus] = useState<SaveStatus | null>(null);
  useEffect(() => {
    let timer: number | undefined;
    const onSave = (e: Event) => {
      const detail = (e as CustomEvent<SaveStatus>).detail;
      setStatus(detail);
      window.clearTimeout(timer);
      if (detail.state === 'saved') timer = window.setTimeout(() => setStatus(null), 2500);
    };
    window.addEventListener(SAVE_EVENT, onSave);
    return () => {
      window.removeEventListener(SAVE_EVENT, onSave);
      window.clearTimeout(timer);
    };
  }, []);
  return status;
}

/* ---------- Acceso de administrador (Supabase Auth) ---------- */

export interface AdminUser {
  email: string;
  name: string;
}

async function checkIsAdmin(session: Session | null): Promise<boolean> {
  if (!supabase || !session?.user.email) return false;
  const { data, error } = await supabase
    .from('admins')
    .select('email')
    .eq('email', session.user.email.toLowerCase())
    .maybeSingle();
  return !error && Boolean(data);
}

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const apply = async (s: Session | null) => {
      const ok = await checkIsAdmin(s);
      if (!active) return;
      setSession(s);
      setIsAdmin(ok);
      setLoading(false);
    };
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      // diferido para no llamar a Supabase dentro del callback de auth
      window.setTimeout(() => void apply(s), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (!supabase) return 'El panel no está conectado a Supabase.';
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (error) {
      return error.message.includes('Invalid login')
        ? 'Correo o contraseña incorrectos.'
        : `No se pudo iniciar sesión: ${error.message}`;
    }
    if (!(await checkIsAdmin(data.session))) {
      await supabase.auth.signOut();
      return 'Esta cuenta no tiene permiso de administrador.';
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  /** Verifica la contraseña actual y la cambia. Devuelve un mensaje de error o null. */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<string | null> => {
      const email = session?.user.email;
      if (!supabase || !email) return 'No hay una sesión activa.';
      const check = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (check.error) return 'La contraseña actual no es correcta.';
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return error ? `No se pudo cambiar la contraseña: ${error.message}` : null;
    },
    [session]
  );

  const admin: AdminUser = {
    email: session?.user.email ?? '',
    name: (session?.user.user_metadata?.name as string | undefined) ?? 'Administrador Hostal Aguilar'
  };

  return {
    admin,
    isAuthenticated: Boolean(session) && isAdmin,
    loading,
    login,
    logout,
    changePassword
  };
}
