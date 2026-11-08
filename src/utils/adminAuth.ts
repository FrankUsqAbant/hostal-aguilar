import { Amenity } from '../types';

export const SERVICES_STORAGE_KEY = 'hostal_services_v1';
export const ROOMS_STORAGE_KEY = 'hostal_rooms_v1';
export const HOSTAL_INFO_STORAGE_KEY = 'hostal_info_v1';

/**
 * Valida el formulario de cambio de contraseña antes de enviarlo a Supabase.
 * (La contraseña actual la verifica Supabase, no el navegador.)
 */
export function validatePasswordChange(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): { success: boolean; error?: string } {
  if (!currentPassword) {
    return { success: false, error: 'Debe ingresar su contraseña actual.' };
  }

  if (!newPassword || newPassword.trim().length < 8) {
    return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres.' };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: 'La nueva contraseña debe ser diferente a la actual.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'La confirmación de contraseña no coincide.' };
  }

  return { success: true };
}

/**
 * Service CRUD helper functions
 */
export interface AdminAmenity extends Amenity {
  active?: boolean;
  category?: string;
  order?: number;
  highlight?: boolean;
}

export function createService(
  newService: Partial<AdminAmenity>,
  existingServices: AdminAmenity[]
): { success: boolean; services: AdminAmenity[]; error?: string } {
  if (!newService.title || !newService.title.trim()) {
    return { success: false, services: existingServices, error: 'El título del servicio es obligatorio.' };
  }

  if (!newService.description || !newService.description.trim()) {
    return { success: false, services: existingServices, error: 'La descripción del servicio es obligatoria.' };
  }

  const id = newService.id?.trim() || `srv-${Date.now()}`;
  
  if (existingServices.some(s => s.id === id)) {
    return { success: false, services: existingServices, error: 'Ya existe un servicio con este identificador.' };
  }

  const serviceToAdd: AdminAmenity = {
    id,
    title: newService.title.trim(),
    description: newService.description.trim(),
    iconName: newService.iconName || 'shield',
    active: newService.active !== false,
    category: newService.category || 'General',
    order: newService.order ?? (existingServices.length + 1),
    highlight: Boolean(newService.highlight)
  };

  return {
    success: true,
    services: [...existingServices, serviceToAdd]
  };
}

export function updateService(
  updatedService: AdminAmenity,
  existingServices: AdminAmenity[]
): { success: boolean; services: AdminAmenity[]; error?: string } {
  if (!updatedService.id) {
    return { success: false, services: existingServices, error: 'ID de servicio no válido.' };
  }

  const index = existingServices.findIndex(s => s.id === updatedService.id);
  if (index === -1) {
    return { success: false, services: existingServices, error: 'El servicio a actualizar no fue encontrado.' };
  }

  const updatedList = [...existingServices];
  updatedList[index] = {
    ...updatedList[index],
    ...updatedService,
    title: updatedService.title.trim(),
    description: updatedService.description.trim()
  };

  return {
    success: true,
    services: updatedList
  };
}

export function deleteService(
  serviceId: string,
  existingServices: AdminAmenity[]
): { success: boolean; services: AdminAmenity[]; error?: string } {
  if (!serviceId) {
    return { success: false, services: existingServices, error: 'ID de servicio no válido.' };
  }

  const filtered = existingServices.filter(s => s.id !== serviceId);
  return {
    success: true,
    services: filtered
  };
}

export function toggleServiceStatus(
  serviceId: string,
  existingServices: AdminAmenity[]
): AdminAmenity[] {
  return existingServices.map(s => {
    if (s.id === serviceId) {
      return { ...s, active: !(s.active !== false) };
    }
    return s;
  });
}
